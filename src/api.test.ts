import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import api, { plainAxios, setOnSessionExpired } from './api'

describe('interceptor de resposta', () => {
    let apiMock: MockAdapter
    let plainMock: MockAdapter

    beforeEach(() => {
        localStorage.setItem('token', 'old')
        apiMock = new MockAdapter(api)
        plainMock = new MockAdapter(plainAxios, { delayResponse: 20 })
        apiMock.onGet(/\/(a|b)$/).reply((config) => {
            const auth = String(config.headers?.Authorization)
            return auth === 'Bearer new' ? [200, { ok: true }] : [401]
        })
    })

    afterEach(() => {
        apiMock.restore()
        plainMock.restore()
        setOnSessionExpired(null)
        localStorage.clear()
    })

    it('dois 401 simultâneos geram um refresh e repetem os dois', async () => {
        plainMock
            .onPost('/web/refreshtoken')
            .reply(200, { data: { token: 'new' } })

        const [a, b] = await Promise.all([api.get('/a'), api.get('/b')])
        expect(a.status).toBe(200)
        expect(b.status).toBe(200)
        expect(plainMock.history.post).toHaveLength(1)
        expect(plainMock.history.post[0].headers?.Authorization).toBe(
            'Bearer old',
        )
        expect(localStorage.getItem('token')).toBe('new')
    })

    it.each(['/password/forgot', '/password/reset'])(
        '401 em %s não renova',
        async (url) => {
            apiMock.onPost(url).reply(401)

            await expect(api.post(url, {})).rejects.toMatchObject({
                response: { status: 401 },
            })
            expect(plainMock.history.post).toHaveLength(0)
        },
    )

    it('403 não dispara refresh', async () => {
        apiMock.onGet('/forbidden').reply(403)

        await expect(api.get('/forbidden')).rejects.toMatchObject({
            response: { status: 403 },
        })
        expect(plainMock.history.post).toHaveLength(0)
    })

    it('falha do refresh rejeita os dois e encerra a sessão uma vez', async () => {
        const expired = vi.fn()
        setOnSessionExpired(expired)
        plainMock.onPost('/web/refreshtoken').reply(401)

        const results = await Promise.allSettled([api.get('/a'), api.get('/b')])

        expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected'])
        expect(plainMock.history.post).toHaveLength(1)
        expect(expired).toHaveBeenCalledTimes(1)
    })

    it('401 em /web/login não renova', async () => {
        apiMock.onPost('/web/login').reply(401, { message: 'inválidos' })

        await expect(api.post('/web/login', {})).rejects.toBeDefined()
        expect(plainMock.history.post).toHaveLength(0)
    })
})

describe('refresh: rede, 5xx e entre abas', () => {
    let apiMock: MockAdapter
    let plainMock: MockAdapter

    beforeEach(() => {
        localStorage.setItem('token', 'old')
        apiMock = new MockAdapter(api)
        plainMock = new MockAdapter(plainAxios, { delayResponse: 20 })
        apiMock.onGet(/\/(a|b)$/).reply((config) => {
            const auth = String(config.headers?.Authorization)
            return auth === 'Bearer new' ? [200, { ok: true }] : [401]
        })
    })

    afterEach(() => {
        apiMock.restore()
        plainMock.restore()
        setOnSessionExpired(null)
        localStorage.clear()
        vi.unstubAllGlobals()
    })

    it.each([
        ['5xx', 500],
        ['503', 503],
    ])('%s no refresh rejeita sem encerrar a sessão', async (_n, status) => {
        const expired = vi.fn()
        setOnSessionExpired(expired)
        plainMock.onPost('/web/refreshtoken').reply(status)

        const results = await Promise.allSettled([api.get('/a'), api.get('/b')])

        expect(results.map((r) => r.status)).toEqual(['rejected', 'rejected'])
        expect(plainMock.history.post).toHaveLength(1)
        expect(expired).not.toHaveBeenCalled()
    })

    it('erro de rede no refresh não encerra a sessão', async () => {
        const expired = vi.fn()
        setOnSessionExpired(expired)
        plainMock.onPost('/web/refreshtoken').networkError()

        await expect(api.get('/a')).rejects.toBeDefined()
        expect(expired).not.toHaveBeenCalled()
    })

    it('timeout no refresh não encerra a sessão', async () => {
        const expired = vi.fn()
        setOnSessionExpired(expired)
        plainMock.onPost('/web/refreshtoken').timeout()

        await expect(api.get('/a')).rejects.toBeDefined()
        expect(expired).not.toHaveBeenCalled()
    })

    it.each([400, 401, 403])(
        '%i no refresh encerra a sessão',
        async (status) => {
            const expired = vi.fn()
            setOnSessionExpired(expired)
            plainMock.onPost('/web/refreshtoken').reply(status)

            await expect(api.get('/a')).rejects.toBeDefined()
            expect(expired).toHaveBeenCalledTimes(1)
        },
    )

    it('usa navigator.locks com o nome family-vault-refresh', async () => {
        const request = vi.fn((_name: string, cb: () => Promise<unknown>) =>
            cb(),
        )
        vi.stubGlobal('navigator', { locks: { request } })
        plainMock
            .onPost('/web/refreshtoken')
            .reply(200, { data: { token: 'new' } })

        await api.get('/a')
        expect(request).toHaveBeenCalledWith(
            'family-vault-refresh',
            expect.any(Function),
        )
    })

    it('token já renovado por outra aba: não chama o refresh', async () => {
        // o lock só libera depois que a outra aba gravou o token novo
        const request = vi.fn(
            async (_n: string, cb: () => Promise<unknown>) => {
                localStorage.setItem('token', 'new')
                return cb()
            },
        )
        vi.stubGlobal('navigator', { locks: { request } })

        const res = await api.get('/a')

        expect(res.status).toBe(200)
        expect(plainMock.history.post).toHaveLength(0)
    })

    it('duas abas com 401 juntas geram um refresh só', async () => {
        // mutex simples no lugar do navigator.locks, compartilhado pelas abas
        let tail: Promise<unknown> = Promise.resolve()
        const request = <T>(_name: string, cb: () => Promise<T>) => {
            const run = tail.then(cb, cb)
            tail = run.catch(() => undefined)
            return run
        }
        vi.stubGlobal('navigator', { locks: { request } })

        vi.resetModules()
        const tabB = await import('./api')
        const plainMockB = new MockAdapter(tabB.plainAxios, {
            delayResponse: 20,
        })
        const apiMockB = new MockAdapter(tabB.default)
        apiMockB.onGet('/b').reply((config) => {
            const auth = String(config.headers?.Authorization)
            return auth === 'Bearer new' ? [200, { ok: true }] : [401]
        })
        const reply = (): [number, unknown] => [200, { data: { token: 'new' } }]
        plainMock.onPost('/web/refreshtoken').reply(reply)
        plainMockB.onPost('/web/refreshtoken').reply(reply)

        const [a, b] = await Promise.all([
            api.get('/a'),
            tabB.default.get('/b'),
        ])

        expect(a.status).toBe(200)
        expect(b.status).toBe(200)
        expect(
            plainMock.history.post.length + plainMockB.history.post.length,
        ).toBe(1)
    })
})
