import { jwtDecode } from 'jwt-decode'

export const ROLE_CLAIM =
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
export const PERMISSION_CLAIM = 'permission'
export const ADMIN_ROLE = 'Administrator'

export interface DecodedToken {
    exp: number
    uid?: string
    [key: string]: unknown
}

export function toStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((v): v is string => typeof v === 'string')
    }
    if (typeof value === 'string') return [value]
    return []
}

export function isAdmin(roles: string[]): boolean {
    return roles.includes(ADMIN_ROLE)
}

// jwt-decode já trata base64url; devolve null se o token for ilegível
export function decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null
    try {
        return jwtDecode<DecodedToken>(token)
    } catch {
        return null
    }
}

// Decodifica o token salvo e só o devolve se for de Administrator.
// Não verifica expiração: a primeira chamada com 401 renova ou encerra.
export function readAdminSession(token: string | null): DecodedToken | null {
    const decoded = decodeToken(token)
    if (!decoded) return null
    return isAdmin(toStringArray(decoded[ROLE_CLAIM])) ? decoded : null
}
