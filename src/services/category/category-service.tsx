// src/api/categories.ts

import api from '../../api'
import type { IBaseResponse, IPagedResult } from '../../types/base-response'
import type {
    ICategory,
    ICategoryQueryRequest,
    ICreateCategoryRequest,
} from '../../types/category'

export const categoriesService = {
    create: async (
        categoryData: ICreateCategoryRequest,
    ): Promise<IBaseResponse<ICategory>> => {
        const response = await api.post<IBaseResponse<ICategory>>(
            '/category',
            categoryData,
        )
        return response.data
    },

    list: async (
        query?: ICategoryQueryRequest,
    ): Promise<IBaseResponse<IPagedResult<ICategory>>> => {
        const response = await api.get<IBaseResponse<IPagedResult<ICategory>>>(
            '/category',
            { params: query },
        )
        return response.data
    },

    delete: async (id: number): Promise<IBaseResponse<{ message: string }>> => {
        const response = await api.delete<IBaseResponse<{ message: string }>>(
            `/category/${id}`,
        )
        return response.data
    },
}
