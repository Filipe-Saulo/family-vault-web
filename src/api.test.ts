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
