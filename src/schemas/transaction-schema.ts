import { z } from 'zod'

export const transactionSchema = z.object({
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

export type TransactionFormData = z.infer<typeof transactionSchema>
