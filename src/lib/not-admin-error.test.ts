import { describe, expect, it } from 'vitest'

import { NotAdminError } from './not-admin-error'

describe('NotAdminError', () => {
    it('é reconhecido por instanceof e continua sendo Error', () => {
        const error = new NotAdminError()
        expect(error).toBeInstanceOf(NotAdminError)
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Sem permissão')
        expect(error.name).toBe('NotAdminError')
    })

    it('um Error comum com a mesma mensagem não é NotAdminError', () => {
        expect(new Error('Sem permissão')).not.toBeInstanceOf(NotAdminError)
    })
})
