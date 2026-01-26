import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // tenta 1x antes de falhar
            refetchOnWindowFocus: false, // não refaz request ao focar no app
        },
        mutations: {
            retry: 0, // por padrão, mutações não fazem retry
        },
    },
})
