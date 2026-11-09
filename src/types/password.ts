export interface IChangePasswordRequest {
    currentPassword: string
    password: string
    passwordConfirm: string
}

export interface ISetUserPasswordRequest {
    password: string
    passwordConfirm: string
}

export type ResetChannel = 'sms' | 'email'

// destino do código: telefone ou e-mail, nunca os dois
export type IPasswordTarget = { phone: string } | { email: string }

export type IForgotPasswordRequest = IPasswordTarget

export type IResetPasswordRequest = IPasswordTarget & {
    code: string
    password: string
    passwordConfirm: string
}
