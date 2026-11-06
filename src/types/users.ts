export type UserRole = 'Administrator' | 'User'

export interface ICreateUserRequest {
    role: UserRole
    phoneNumber?: string
    email?: string
    password: string
    firstName: string
    lastName: string
    passwordConfirm: string
    age: number
}

export interface IUser {
    userId: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string | null
    email: string | null
    age: number
    role: UserRole | null
}

export interface IChangeUserRoleRequest {
    role: UserRole
    email?: string
    phoneNumber?: string
}

export interface IUpdateUserRequest {
    firstName: string
    lastName: string
    age: number
}

export interface IUserQueryRequest {
    pageNumber?: number
    pageSize?: number
    search?: string // OU entre nome, e-mail e telefone
    firstName?: string
    fullName?: string
    phoneNumber?: string
    email?: string
}
