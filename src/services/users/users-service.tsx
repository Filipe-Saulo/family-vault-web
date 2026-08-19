// src/api/users.ts

import api from '../../api'
import type { IBaseResponse, IPagedResult } from '../../types/base-response'
import type {
    ICreateUserRequest,
    IUpdateUserRequest,
    IUser,
    IUserQueryRequest,
} from '../../types/users'

export const usersService = {
    create: async (
        userData: ICreateUserRequest,
    ): Promise<IBaseResponse<IUser>> => {
        const response = await api.post<IBaseResponse<IUser>>(
            '/register',
            userData,
        )
        return response.data
    },

    list: async (
        query?: IUserQueryRequest,
    ): Promise<IBaseResponse<IPagedResult<IUser>>> => {
        const response = await api.get<IBaseResponse<IPagedResult<IUser>>>(
            '/user',
            { params: query },
        )
        return response.data
    },

    update: async (
        id: string,
        userData: IUpdateUserRequest,
    ): Promise<IBaseResponse<IUser>> => {
        const response = await api.put<IBaseResponse<IUser>>(
            `/user/${id}`,
            userData,
        )
        return response.data
    },

    delete: async (id: string): Promise<IBaseResponse<{ message: string }>> => {
        const response = await api.delete<IBaseResponse<{ message: string }>>(
            `/user/${id}`,
        )
        return response.data
    },
}
