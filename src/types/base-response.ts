export interface IBaseResponse<T = string | null> {
    message: string
    data: T
}

export interface IPagedResult<T> {
    totalCount: number
    pageNumber: number
    pageSize: number
    items: T[]
}
