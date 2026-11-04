import type { ICategory } from './category'
import type { ITransactionType } from './transaction-type'

export interface ICreateTransactionRequest {
    description: string
    amount: number
    transactionDate: string // YYYY-MM-DD
    categoryId: number
    transactionTypeId: number
}

export interface IUpdateTransactionRequest {
    description: string
    amount: number
    transactionDate: string // YYYY-MM-DD
    categoryId: number
    transactionTypeId: number
}

export interface ITransaction {
    transactionId: number
    description: string
    amount: number
    transactionDate: string
    userId: string
    category: ICategory
    transactionType: ITransactionType
    createdAt: string
    updatedAt?: string
}
export interface ITransactionQueryRequest {
    pageNumber?: number
    pageSize?: number
    userId?: string
    categoryId?: number
    transactionTypeId?: number
    description?: string // contém
    startDate?: string // YYYY-MM-DD
    endDate?: string // YYYY-MM-DD, inclui o dia inteiro
    minAmount?: number
    maxAmount?: number
}
