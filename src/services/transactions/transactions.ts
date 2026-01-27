import api from '../../api'
import type { IBaseResponse, IPagedResult } from '../../types/base-response'
import type {
    ICreateTransactionRequest,
    ITransaction,
    ITransactionQueryRequest,
} from '../../types/transaction'

export const transactionsService = {
    create: async (
        transactionData: ICreateTransactionRequest,
    ): Promise<IBaseResponse<ITransaction>> => {
        const response = await api.post<IBaseResponse<ITransaction>>(
            '/transaction',
            transactionData,
        )
        return response.data
    },

    list: async (
        query?: ITransactionQueryRequest,
    ): Promise<IBaseResponse<IPagedResult<ITransaction>>> => {
        const response = await api.get<
            IBaseResponse<IPagedResult<ITransaction>>
        >('/transaction', { params: query })
        return response.data
    },

    delete: async (id: number): Promise<IBaseResponse<{ message: string }>> => {
        const response = await api.delete<IBaseResponse<{ message: string }>>(
            `/transaction/${id}`,
        )
        return response.data
    },
}
