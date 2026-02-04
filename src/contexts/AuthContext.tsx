import { jwtDecode } from 'jwt-decode'
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react'
import { toast } from 'sonner'

import { extractApiErrorMessage } from '../lib/api-error'
import { loginService } from '../services/login/login-service'
import { logoutService } from '../services/login/logout-service'

const BASE_PATH_NAME = import.meta.env.VITE_BASE_PATH_NAME as string

interface DecodedToken {
    exp: number
    role?: string
    [key: string]: unknown
}

interface AuthState {
    user: DecodedToken | null
}

type AuthAction = { type: 'login'; payload: DecodedToken } | { type: 'logout' }

interface AuthContextType {
    user: DecodedToken | null
    login: (email: string, password: string) => Promise<void>
    logout: (showToast?: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const initialState: AuthState = {
    user: null,
}

function reducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'login':
            return { ...state, user: action.payload }
        case 'logout':
            return { ...state, user: null }
        default:
            throw new Error('Ação desconhecida')
    }
}

function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        function isTokenValid(token: string) {
            try {
                const decoded = jwtDecode<DecodedToken>(token)
                const now = Date.now() / 1000
                const extraTime = 300
                return decoded.exp + extraTime > now
            } catch {
                return false
            }
        }

        async function checkAuth() {
            const token = localStorage.getItem('token')
            if (token && isTokenValid(token)) {
                const decoded = jwtDecode<DecodedToken>(token)
                if (
                    decoded[
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                    ] === 'Administrator'
                ) {
                    dispatch({ type: 'login', payload: decoded })
                    return
                }
            }
            // Token inválido ou ausente
            localStorage.removeItem('token')
            dispatch({ type: 'logout' })
        }

        checkAuth()
    }, [])

    async function login(email: string, password: string) {
        try {
            const res = await loginService({
                email,
                password,
            })
            console.log('resposta no authcontext')
            console.log(res)
            const receivedToken: string = res.data.token
            const decoded = jwtDecode<DecodedToken>(receivedToken)

            if (
                decoded[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] !== 'Administrator'
            ) {
                toast.error(res.message ?? 'Sem permissão')
                return
            }

            localStorage.setItem('token', receivedToken)
            dispatch({ type: 'login', payload: decoded })

            toast.success(res.message)
        } catch (error: unknown) {
            toast.error(extractApiErrorMessage(error))
            throw error
        }
    }

    async function logout(showToast = false) {
        try {
            await logoutService()
        } catch (error) {
            console.error('Erro ao deslogar no backend', error)
        } finally {
            localStorage.removeItem('token')
            dispatch({ type: 'logout' })

            if (showToast) {
                toast.success('Logout realizado com sucesso')
            }

            window.location.href = BASE_PATH_NAME
        }
    }

    return (
        <AuthContext.Provider value={{ user: state.user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined)
        throw new Error('AuthContext foi usado fora do AuthProvider')
    return context
}

export { AuthProvider, useAuth }
