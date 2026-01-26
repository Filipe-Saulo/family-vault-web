// services/logoutService.ts

import { plainAxios } from '../../api'
import type { IBaseResponse } from '../../types/base-response'

export const logoutService = async (): Promise<IBaseResponse> => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token')

    const response = await plainAxios.post<IBaseResponse>(
        '/logout',
        { token },
        {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        },
    )

    return { ...response.data }
}
