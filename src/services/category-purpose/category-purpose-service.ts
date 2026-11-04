import api from '../../api'
import type { IBaseResponse } from '../../types/base-response'
import type { ICategoryPurpose } from '../../types/category'

export const categoryPurposesService = {
    list: async (query?: {
        isActive?: boolean
    }): Promise<IBaseResponse<ICategoryPurpose[]>> => {
        const response = await api.get<IBaseResponse<ICategoryPurpose[]>>(
            '/categorypurpose',
            { params: query },
        )
        return response.data
    },
}
