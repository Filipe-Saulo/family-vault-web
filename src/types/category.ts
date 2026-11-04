export interface ICategory {
    categoryId: number
    description: string
    purpose: ICategoryPurpose
    isGlobal: boolean
    createdAt: string
    updatedAt?: string
}

export interface ICategoryPurpose {
    categoryPurposeId: number
    name: string
    code: number // 1 = despesa, 2 = receita
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

export interface IUpdateCategoryRequest {
    description: string
    categoryPurposeId: number
}
