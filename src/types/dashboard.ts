export interface IDashboardCategoryTotal {
    categoryId: number
    categoryDescription: string
    total: number
    transactionTypeId: number
    transactionTypeCode: number
    transactionTypeName: string
}

export interface IDashboardSummary {
    totalIncome: number
    totalExpense: number
    balance: number
    byCategory: IDashboardCategoryTotal[]
}

export interface IDashboardSummaryQueryRequest {
    startDate?: string // YYYY-MM-DD
    endDate?: string // YYYY-MM-DD, inclui o dia inteiro
}
