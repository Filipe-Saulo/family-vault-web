import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL as string
const BASE_PATH_NAME = import.meta.env.VITE_BASE_PATH_NAME as string

// Estendemos para suportar o _retry customizado
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

const plainAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

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
        const originalRequest = error.config as CustomAxiosRequestConfig

        const isLoginRequest = originalRequest?.url?.endsWith('/login')
        const token = localStorage.getItem('token')

        if (
            error.response?.status === 403 &&
            !originalRequest._retry &&
            !isLoginRequest &&
            token
        ) {
            originalRequest._retry = true

            try {
                const refreshResponse = await plainAxios.post<{
                    data: { token: string }
                }>('/api/refreshtoken', null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const newToken = refreshResponse.data.data.token
                localStorage.setItem('token', newToken)

                // usa a API nova do AxiosHeaders
                originalRequest.headers.set(
                    'Authorization',
                    `Bearer ${newToken}`,
                )

                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('token')
                window.location.href = BASE_PATH_NAME
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default api
export { plainAxios }
