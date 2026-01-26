export interface ILoginRequest {
    email: string
    password: string    
}

export interface ILoginResponse {
    userId: string
    token: string
}
