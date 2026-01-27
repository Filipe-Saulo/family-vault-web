export interface ICategory {
    categoryId: number
    description: string
    purpose: ICategoryPurpose
}

export interface ICategoryPurpose {
    categoryPurposeId: number
    name: string
}
