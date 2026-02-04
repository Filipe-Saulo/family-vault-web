import axios from 'axios'

export function extractApiErrorMessage(
    error: unknown,
    fallback = 'Erro ao processar a requisição',
): string {
    if (!axios.isAxiosError(error)) {
        return fallback
    }

    const data = error.response?.data as any

    // 1️⃣ Erros de validação (ModelState / FluentValidation)
    if (data?.errors) {
        const messages = Object.values(data.errors).flat().join(', ')

        if (messages) return messages
    }

    // 2️⃣ Erros de domínio / regra de negócio
    if (data?.Message) {
        return data.Message
    }

    return fallback
}
