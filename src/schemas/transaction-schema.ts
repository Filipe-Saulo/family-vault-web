import { z } from 'zod'

import { isCategoryCompatibleWithTransactionType } from '../lib/transaction-compatibility'
import type { ICategory } from '../types/category'
import type { ITransactionType } from '../types/transaction-type'

export const transactionBaseSchema = z.object({
    description: z
        .string()
        .min(3, 'Descrição deve ter no mínimo 3 caracteres')
        .max(200, 'Descrição deve ter no máximo 200 caracteres')
        .trim(),
    amount: z.coerce
        .number()
        .positive('Valor deve ser maior que zero')
        .max(9999999.99, 'Valor muito alto'),
    transactionDate: z
        .string()
        .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
            message: 'Data inválida. Use o formato YYYY-MM-DD',
        })
        .refine((date) => new Date(date) <= new Date(), {
            message: 'Data não pode ser futura',
        }),
    categoryId: z.coerce.number().positive('Categoria é obrigatória'),
    transactionTypeId: z.coerce
        .number()
        .positive('Tipo de transação é obrigatório'),
})

export type TransactionFormData = z.infer<typeof transactionBaseSchema>

export function buildTransactionSchema(
    categories: ICategory[],
    transactionTypes: ITransactionType[],
) {
    return transactionBaseSchema.superRefine((data, ctx) => {
        if (categories.length === 0 || transactionTypes.length === 0) return
        if (!data.categoryId || !data.transactionTypeId) return

        const category = categories.find(
            (c) => c.categoryId === data.categoryId,
        )
        const transactionType = transactionTypes.find(
            (t) => t.transactionTypeId === data.transactionTypeId,
        )
        if (!category || !transactionType) return

        if (
            !isCategoryCompatibleWithTransactionType(category, transactionType)
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'O tipo de transação selecionado não é compatível com o propósito da categoria.',
                path: ['categoryId'],
            })
        }
    })
}
