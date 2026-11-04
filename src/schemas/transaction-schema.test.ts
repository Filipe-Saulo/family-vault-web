import { describe, expect, it } from 'vitest'

import { transactionBaseSchema } from './transaction-schema'

const valid = {
    description: 'Mercado',
    amount: '10.50',
    transactionDate: '2020-01-01',
    categoryId: '1',
    transactionTypeId: '1',
}

describe('transactionBaseSchema', () => {
    it('aceita valor maior que zero', () => {
        expect(transactionBaseSchema.safeParse(valid).success).toBe(true)
    })

    it.each(['0', '-5'])('rejeita valor %s com mensagem em português', (v) => {
        const result = transactionBaseSchema.safeParse({ ...valid, amount: v })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe(
            'Valor deve ser maior que zero',
        )
    })
})
