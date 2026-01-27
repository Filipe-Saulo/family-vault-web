import type { ICategory } from './category'
import type { ITransactionType } from './transaction-type'

export interface ICreateTransactionRequest {
    description: string
    amount: number
    transactionDate: string // ISO string
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
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
}
