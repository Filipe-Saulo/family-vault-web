import api from '../../api'
import type { IBaseResponse } from '../../types/base-response'
import type {
    IDashboardSummary,
    IDashboardSummaryQueryRequest,
} from '../../types/dashboard'

export const dashboardService = {
    getSummary: async (
        query?: IDashboardSummaryQueryRequest,
    ): Promise<IBaseResponse<IDashboardSummary>> => {
        const response = await api.get<IBaseResponse<IDashboardSummary>>(
            '/dashboard/summary',
            { params: query },
        )
        return response.data
    },
}
