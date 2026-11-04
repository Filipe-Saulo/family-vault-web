import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { setOnSessionExpired } from '../api'
import { extractApiErrorMessage } from '../lib/api-error'
import {
    type DecodedToken,
    decodeToken,
    isAdmin,
    PERMISSION_CLAIM,
    readAdminSession,
    ROLE_CLAIM,
    toStringArray,
} from '../lib/jwt'
import { queryClient } from '../lib/react-query-client'
import { loginService } from '../services/login/login-service'
import { logoutService } from '../services/login/logout-service'

interface AuthState {
    user: DecodedToken | null
}

type AuthAction = { type: 'login'; payload: DecodedToken } | { type: 'logout' }

interface AuthContextType {
    user: DecodedToken | null
    userId: string | null
    roles: string[]
    permissions: string[]
    login: (email: string, password: string) => Promise<void>
    logout: (showToast?: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Lê o token salvo de forma síncrona, para o primeiro render já estar certo.
// Token de admin conta como logado mesmo vencido: a primeira chamada com 401
// renova e, se falhar, encerra a sessão.
function init(): AuthState {
    return { user: readAdminSession(localStorage.getItem('token')) }
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
    const [state, dispatch] = useReducer(reducer, undefined, init)
    const navigate = useNavigate()

    // Encerramento único: logout, falha de refresh e login sem permissão
    const endSession = useCallback(
        async (message?: string) => {
            try {
                await logoutService()
            } catch (error) {
                console.error('Erro ao deslogar no backend', error)
            } finally {
                localStorage.removeItem('token')
                queryClient.clear()
                dispatch({ type: 'logout' })
                navigate('/login', { replace: true })
                if (message) toast.success(message)
            }
        },
        [navigate],
    )

    useEffect(() => {
        setOnSessionExpired(() => {
            void endSession()
            toast.error('Sessão expirada. Faça login novamente.')
        })
        return () => setOnSessionExpired(null)
    }, [endSession])

    const userId = (state.user?.uid as string | undefined) ?? null
    const roles = useMemo(
        () => toStringArray(state.user?.[ROLE_CLAIM]),
        [state.user],
    )
    const permissions = useMemo(
        () => toStringArray(state.user?.[PERMISSION_CLAIM]),
        [state.user],
    )

    async function login(email: string, password: string) {
        try {
            const res = await loginService({
                email,
                password,
            })
            const receivedToken: string = res.data.token
            const decoded = decodeToken(receivedToken)

            if (!decoded || !isAdmin(toStringArray(decoded[ROLE_CLAIM]))) {
                // o cookie de refresh já foi emitido: encerra no backend
                localStorage.setItem('token', receivedToken)
                await endSession()
                toast.error(res.message ?? 'Sem permissão')
                throw new Error('Sem permissão')
            }

            localStorage.setItem('token', receivedToken)
            dispatch({ type: 'login', payload: decoded })

            toast.success(res.message)
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'Sem permissão') {
                throw error
            }
            toast.error(extractApiErrorMessage(error))
            throw error
        }
    }

    async function logout(showToast = false) {
        await endSession(showToast ? 'Logout realizado com sucesso' : undefined)
    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                userId,
                roles,
                permissions,
                login,
                logout,
            }}
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
