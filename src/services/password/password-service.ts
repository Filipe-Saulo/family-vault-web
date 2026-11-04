import api from '../../api'
import type { IBaseResponse } from '../../types/base-response'
import type {
    IChangePasswordRequest,
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
}
