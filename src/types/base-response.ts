export interface IBaseResponse<T = string | null> {    
    message: string
    data: T
}
