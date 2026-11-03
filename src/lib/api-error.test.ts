import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { extractApiErrorMessage } from './api-error'

const axiosError = (data: unknown) =>
    new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
        data,
        status: 400,
    } as AxiosResponse)

describe('extractApiErrorMessage', () => {
    it('devolve o fallback para erro que não é do Axios', () => {
        expect(extractApiErrorMessage(new Error('x'))).toBe(
            'Erro ao processar a requisição',
        )
        expect(extractApiErrorMessage('x', 'custom')).toBe('custom')
    })

    it('junta as mensagens de validação em errors', () => {
        const error = axiosError({
            errors: { A: ['um', 'dois'], B: ['três'] },
        })
        expect(extractApiErrorMessage(error)).toBe('um, dois, três')
    })

    it('usa message quando não há errors', () => {
        expect(extractApiErrorMessage(axiosError({ message: 'Regra' }))).toBe(
            'Regra',
        )
    })

    it('usa o fallback quando a resposta não tem dados úteis', () => {
        expect(extractApiErrorMessage(axiosError({}), 'padrão')).toBe('padrão')
        expect(extractApiErrorMessage(axiosError({ errors: {} }), 'p')).toBe(
            'p',
        )
    })
})
