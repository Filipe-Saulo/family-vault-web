
import type { ILoginRequest, ILoginResponse } from '../../types/login'
import type { IBaseResponse } from '../../types/base-response'
import api from '../../api'


export const loginService = async (
    userData: ILoginRequest,
): Promise<IBaseResponse<ILoginResponse>> => {
    const response = await api.post<IBaseResponse<ILoginResponse>>(
        '/login',
        userData,
    )
    return response.data
}
