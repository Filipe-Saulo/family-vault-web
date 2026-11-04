import axios from 'axios'

import type { ApiErrorBody } from '../types/base-response'

export function extractApiErrorMessage(
    error: unknown,
    fallback = 'Erro ao processar a requisição',
): string {
    if (!axios.isAxiosError<ApiErrorBody>(error)) {
        return fallback
    }

    // A API junta validação e regra de negócio em `message`
    return error.response?.data?.message || fallback
}
