export interface IBaseResponse<T = string | null> {
    message: string
    data: T
    traceId?: string
}

/** Corpo de erro da API: a mensagem já vem com todos os detalhes juntos. */
export interface ApiErrorBody {
    message?: string
    traceId?: string
}

export interface IPagedResult<T> {
    totalCount: number
    pageNumber: number
    pageSize: number
    items: T[]
}
