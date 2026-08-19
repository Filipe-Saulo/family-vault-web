import api from '../../api'
import type { IBaseResponse } from '../../types/base-response'
import type { ITransactionType } from '../../types/transaction-type'

export const transactionTypesService = {
    list: async (query?: {
        isActive?: boolean
    }): Promise<IBaseResponse<ITransactionType[]>> => {
        const response = await api.get<IBaseResponse<ITransactionType[]>>(
            '/transactiontype',
            { params: query },
        )
        return response.data
    },
}
