import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL as string

// Estendemos para suportar o _retry customizado
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

// timeout: the refresh runs inside a cross-tab lock, so a hung request must not hold it forever
const plainAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 15000,
})

// Callback registrado pelo AuthProvider para encerrar a sessão
let onSessionExpired: (() => void) | null = null

function setOnSessionExpired(fn: (() => void) | null) {
    onSessionExpired = fn
}

// URLs que nunca disparam renovação (credenciais, o próprio refresh e logout)
const NO_REFRESH_SUFFIXES = ['/web/login', '/web/refreshtoken', '/logout']

// Única renovação em voo na aba: o servidor revoga as sessões se receber um
// refresh já usado, então 401 simultâneos compartilham a mesma promise.
let refreshPromise: Promise<string> | null = null

const REFRESH_LOCK = 'family-vault-refresh'

// Entre abas, o lock do navegador serializa a renovação. Sem suporte, vale só
// a promise da aba.
function withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
    if (typeof navigator !== 'undefined' && navigator.locks) {
        return navigator.locks.request(REFRESH_LOCK, fn) as Promise<T>
    }
    return fn()
}

// Só uma resposta 4xx (refresh recusado) encerra a sessão; rede, timeout e 5xx
// apenas rejeitam os pedidos.
function isRefreshRejected(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false
    const status = error.response?.status
    return status !== undefined && status >= 400 && status < 500
}

function refreshAccessToken(expiredToken: string): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = withRefreshLock(async () => {
            // outra aba pode ter renovado enquanto esperávamos o lock
            const current = localStorage.getItem('token')
            if (current && current !== expiredToken) return current

            const res = await plainAxios.post<{ data: { token: string } }>(
                '/web/refreshtoken',
                null,
                { headers: { Authorization: `Bearer ${expiredToken}` } },
            )
            const newToken = res.data.data.token
            localStorage.setItem('token', newToken)
            return newToken
        })
            .catch((refreshError: unknown) => {
                // uma única vez, mesmo com vários pedidos esperando
                if (isRefreshRejected(refreshError)) onSessionExpired?.()
                throw refreshError
            })
            .finally(() => {
                refreshPromise = null
            })
    }
    return refreshPromise
}

// 🔹 Interceptor de requisições
api.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
            // headers em Axios 1.x são sempre `AxiosHeaders`, nunca `undefined`
            config.headers.set('Authorization', `Bearer ${token}`)
        }
        return config
    },
    (error: AxiosError) => Promise.reject(error),
)

// 🔹 Interceptor de respostas
api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | CustomAxiosRequestConfig
            | undefined
        const token = localStorage.getItem('token')
        const url = originalRequest?.url ?? ''

        // 401 = token vencido; 403 = sem permissão (não renova)
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !NO_REFRESH_SUFFIXES.some((suffix) => url.endsWith(suffix)) &&
            token
        ) {
            originalRequest._retry = true

            // se outro pedido já renovou depois que este saiu, só repete
            const sentWith = String(
                originalRequest.headers.get('Authorization') ?? '',
            )
            const newToken =
                sentWith && sentWith !== `Bearer ${token}`
                    ? token
                    : await refreshAccessToken(token)
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`)
            return api(originalRequest)
        }

        return Promise.reject(error)
    },
)

export default api
export { plainAxios, setOnSessionExpired }
