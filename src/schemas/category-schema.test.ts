import { describe, expect, it } from 'vitest'

import { createCategorySchema } from './category-schema'

describe('createCategorySchema', () => {
    it('aceita dados válidos e converte o id para número', () => {
        const result = createCategorySchema.safeParse({
            description: '  Mercado  ',
            categoryPurposeId: '2',
        })
        expect(result.success).toBe(true)
        expect(result.data).toEqual({
            description: 'Mercado',
            categoryPurposeId: 2,
        })
    })

    it('rejeita descrição curta', () => {
        const result = createCategorySchema.safeParse({
            description: 'ab',
            categoryPurposeId: 1,
        })
        expect(result.success).toBe(false)
    })

    it('rejeita finalidade ausente ou zero', () => {
        expect(
            createCategorySchema.safeParse({
                description: 'Mercado',
                categoryPurposeId: 0,
            }).success,
        ).toBe(false)
    })
})
