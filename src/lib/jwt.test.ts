import { describe, expect, it } from 'vitest'

import {
    decodeToken,
    isAdmin,
    readAdminSession,
    ROLE_CLAIM,
    toStringArray,
} from './jwt'

function makeToken(payload: object): string {
    const b64url = (obj: object) =>
        btoa(
            String.fromCharCode(
                ...new TextEncoder().encode(JSON.stringify(obj)),
            ),
        )
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.sig`
}

describe('jwt helpers', () => {
    it('decodifica base64url com caracteres fora do ASCII', () => {
        // "ã" e "?>" geram - e _ em base64url
        const token = makeToken({ exp: 1, name: 'João??>>' })
        expect(decodeToken(token)?.name).toBe('João??>>')
    })

    it('devolve null para token ilegível ou ausente', () => {
        expect(decodeToken('lixo')).toBeNull()
        expect(decodeToken(null)).toBeNull()
    })

    it('aceita papel como string ou array', () => {
        expect(toStringArray('Administrator')).toEqual(['Administrator'])
        expect(toStringArray(['A', 'Administrator'])).toEqual([
            'A',
            'Administrator',
        ])
        expect(toStringArray(undefined)).toEqual([])
        expect(isAdmin(toStringArray(['User', 'Administrator']))).toBe(true)
        expect(isAdmin(['User'])).toBe(false)
    })

    it('readAdminSession aceita admin (inclusive vencido) e recusa os demais', () => {
        const expired = makeToken({ exp: 1, [ROLE_CLAIM]: ['Administrator'] })
        expect(readAdminSession(expired)).not.toBeNull()
        const user = makeToken({ exp: 1, [ROLE_CLAIM]: 'User' })
        expect(readAdminSession(user)).toBeNull()
        expect(readAdminSession(null)).toBeNull()
    })
})
