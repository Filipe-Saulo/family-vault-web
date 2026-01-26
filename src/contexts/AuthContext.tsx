import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react'
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
    logout: () => Promise<void>
    message: string | null
    setMessage: React.Dispatch<React.SetStateAction<string | null>>
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
    const [message, setMessage] = useState<string | null>(null)

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

            const receivedToken: string = res.data.token
            const decoded = jwtDecode<DecodedToken>(receivedToken)

            if (
                decoded[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] !== 'Administrator'
            ) {
                setMessage(res.message)
                return
            }

            localStorage.setItem('token', receivedToken)
            dispatch({ type: 'login', payload: decoded })
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setMessage(error.response.data?.message ?? 'Não autorizado')
                } else {
                    const errorMessages = Object.values(
                        error.response?.data?.errors || {},
                    )
                        .flat()
                        .join(', ')
                    setMessage(errorMessages || 'Erro de validação')
                }
            } else {
                setMessage('Erro desconhecido')
            }
            throw error
        }
    }

    async function logout() {
        try {
            await logoutService()
        } catch (error) {
            console.error('Erro ao deslogar no backend', error)
        } finally {
            localStorage.removeItem('token')
            dispatch({ type: 'logout' })
            window.location.href = BASE_PATH_NAME
        }
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout, message, setMessage }}
        >
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
