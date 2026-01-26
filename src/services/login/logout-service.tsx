// services/logoutService.ts

import { plainAxios } from '../../api'
import type { IBaseResponse } from '../../types/base-response'

export const logoutService = async (): Promise<IBaseResponse> => {
    const response = await plainAxios.post<IBaseResponse>('/logout')
    return { ...response.data }
}
