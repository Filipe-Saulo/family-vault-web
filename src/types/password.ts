export interface IChangePasswordRequest {
    currentPassword: string
    password: string
    passwordConfirm: string
}

export interface ISetUserPasswordRequest {
    password: string
    passwordConfirm: string
}
