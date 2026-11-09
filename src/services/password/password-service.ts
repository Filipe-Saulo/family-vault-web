import api from '../../api'
import type { IBaseResponse } from '../../types/base-response'
import type {
    IChangePasswordRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
    ISetUserPasswordRequest,
} from '../../types/password'

export const passwordService = {
    changePassword: async (
        data: IChangePasswordRequest,
    ): Promise<IBaseResponse<unknown>> => {
        const response = await api.post<IBaseResponse<unknown>>(
            '/password/change',
            data,
        )
        return response.data
    },

    setUserPassword: async (
        id: string,
        data: ISetUserPasswordRequest,
    ): Promise<IBaseResponse<unknown>> => {
        const response = await api.post<IBaseResponse<unknown>>(
            `/user/${id}/password`,
            data,
        )
        return response.data
    },

    forgotPassword: async (data: IForgotPasswordRequest): Promise<void> => {
        await api.post('/password/forgot', data)
    },

    resetPassword: async (data: IResetPasswordRequest): Promise<void> => {
        await api.post('/password/reset', data)
    },
}
