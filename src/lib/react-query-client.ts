import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Não repete erros 4xx (a resposta seria a mesma); no resto, 1 tentativa
function shouldRetry(failureCount: number, error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status !== undefined && status >= 400 && status <= 499) {
            return false
        }
    }
    return failureCount < 1
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: shouldRetry,
            refetchOnWindowFocus: false, // não refaz request ao focar no app
        },
        mutations: {
            retry: 0, // por padrão, mutações não fazem retry
        },
    },
})
