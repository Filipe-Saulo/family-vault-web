// Códigos estáveis devolvidos pela API em transactionType.code e purpose.code.
export const TRANSACTION_CODE = { Expense: 1, Income: 2 } as const

export type TransactionCode =
    (typeof TRANSACTION_CODE)[keyof typeof TRANSACTION_CODE]
