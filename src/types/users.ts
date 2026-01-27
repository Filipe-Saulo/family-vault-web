export interface ICreateUserRequest {
    phoneNumber: string
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
    phoneNumber: string
    email: string
    age: number
}

export interface IUserQueryRequest {
    pageNumber?: number
    pageSize?: number
    firstName?: string
    fullName?: string
    phoneNumber?: string
    email?: string
}
