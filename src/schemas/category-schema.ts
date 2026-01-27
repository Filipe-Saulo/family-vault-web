import { z } from 'zod'

export const createCategorySchema = z.object({
    description: z
        .string()
        .min(3, 'Descrição deve ter no mínimo 3 caracteres')
        .max(100, 'Descrição deve ter no máximo 100 caracteres')
        .trim(),
    categoryPurposeId: z.coerce
        .number()
        .positive('Finalidade da categoria é obrigatória'),
})

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
