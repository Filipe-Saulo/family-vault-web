import { describe, expect, it } from 'vitest'

import { isCategoryCompatibleWithTransactionType } from './transaction-compatibility'

const category = (name: string) => ({
    purpose: { categoryPurposeId: 1, name },
})

describe('isCategoryCompatibleWithTransactionType', () => {
    it('aceita quando finalidade e tipo têm o mesmo nome', () => {
        expect(
            isCategoryCompatibleWithTransactionType(category('Despesa'), {
                name: 'Despesa',
            }),
        ).toBe(true)
    })

    it('rejeita quando finalidade e tipo são diferentes', () => {
        expect(
            isCategoryCompatibleWithTransactionType(category('Despesa'), {
                name: 'Receita',
            }),
        ).toBe(false)
    })
})
