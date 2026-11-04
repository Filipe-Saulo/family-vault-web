// Fábrica única das query keys. Listas usam a key base como prefixo, então
// invalidar `all` pega todas as variações de filtro.
export const queryKeys = {
    transactions: {
        all: ['transactions'] as const,
        list: (filters: unknown) => ['transactions', filters] as const,
    },
    users: {
        all: ['users'] as const,
        list: (filters: unknown) => ['users', filters] as const,
    },
    categories: {
        all: ['categories'] as const,
        list: (filters: unknown) => ['categories', filters] as const,
    },
    dashboard: {
        all: ['dashboard-summary'] as const,
        summary: (filters: unknown) => ['dashboard-summary', filters] as const,
    },
}
