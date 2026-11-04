import { describe, expect, it } from 'vitest'

import { queryKeys } from './query-keys'

describe('queryKeys', () => {
    it('a key de lista começa pela key base do recurso', () => {
        const filters = { pageNumber: 2 }
        expect(queryKeys.transactions.list(filters)).toEqual([
            ...queryKeys.transactions.all,
            filters,
        ])
        expect(queryKeys.users.list(filters)).toEqual([
            ...queryKeys.users.all,
            filters,
        ])
        expect(queryKeys.categories.list(filters)).toEqual([
            ...queryKeys.categories.all,
            filters,
        ])
        expect(queryKeys.dashboard.summary(filters)).toEqual([
            ...queryKeys.dashboard.all,
            filters,
        ])
    })

    it('as keys base não colidem entre recursos', () => {
        const bases = [
            queryKeys.transactions.all,
            queryKeys.users.all,
            queryKeys.categories.all,
            queryKeys.dashboard.all,
        ].map((k) => k[0])
        expect(new Set(bases).size).toBe(bases.length)
    })
})
