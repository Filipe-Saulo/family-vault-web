export interface IDashboardCategoryTotal {
    categoryId: number
    categoryDescription: string
    total: number
}

export interface IDashboardSummary {
    totalIncome: number
    totalExpense: number
    balance: number
    byCategory: IDashboardCategoryTotal[]
}

export interface IDashboardSummaryQueryRequest {
    startDate?: string
    endDate?: string
}
