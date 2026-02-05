export interface ICategory {
    categoryId: number
    description: string
    categoryPurposeId: number
    purpose: ICategoryPurpose
    createdAt: string
    updatedAt?: string
}

export interface ICategoryPurpose {
    categoryPurposeId: number
    name: string
}

export interface ICategoryQueryRequest {
    pageNumber?: number
    pageSize?: number
    description?: string
    categoryPurposeId?: number
}

export interface ICreateCategoryRequest {
    description: string
    categoryPurposeId: number
}
