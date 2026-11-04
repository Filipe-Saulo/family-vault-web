import { describe, expect, it } from 'vitest'

import type { ICategory } from '../types/category'
import { withCurrentCategory } from './transaction-categories'

const make = (categoryId: number): ICategory => ({
    categoryId,
    description: `Categoria ${categoryId}`,
    purpose: { categoryPurposeId: 1, name: 'Despesa', code: 1 },
    isGlobal: false,
    createdAt: '2026-01-01',
})

describe('withCurrentCategory', () => {
    it('inclui a categoria atual quando ausente do lookup', () => {
        const result = withCurrentCategory([make(1)], make(9))
        expect(result.map((c) => c.categoryId)).toEqual([1, 9])
    })

    it('não duplica quando já está no lookup', () => {
        const list = [make(1), make(9)]
        expect(withCurrentCategory(list, make(9))).toBe(list)
    })

    it('mantém a lista sem categoria atual', () => {
        const list = [make(1)]
        expect(withCurrentCategory(list)).toBe(list)
    })
})
