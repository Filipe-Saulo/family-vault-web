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
    // Só presente quando vem do endpoint /categorypurpose (lista completa);
    // ausente no objeto aninhado ICategory.purpose.
    code?: number
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
