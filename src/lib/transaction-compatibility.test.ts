import { describe, expect, it } from 'vitest'

import { TRANSACTION_CODE } from './transaction-code'
import { isCategoryCompatibleWithTransactionType } from './transaction-compatibility'

const category = (code: number) => ({ purpose: { code } })

describe('isCategoryCompatibleWithTransactionType', () => {
    it('aceita quando finalidade e tipo têm o mesmo code', () => {
        expect(
            isCategoryCompatibleWithTransactionType(
                category(TRANSACTION_CODE.Expense),
                { code: TRANSACTION_CODE.Expense },
            ),
        ).toBe(true)
    })

    it('rejeita quando finalidade e tipo têm codes diferentes', () => {
        expect(
            isCategoryCompatibleWithTransactionType(
                category(TRANSACTION_CODE.Expense),
                { code: TRANSACTION_CODE.Income },
            ),
        ).toBe(false)
    })
})
