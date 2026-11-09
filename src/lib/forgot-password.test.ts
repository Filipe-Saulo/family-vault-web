import { describe, expect, it } from 'vitest'

import { buildTarget, resendLabel } from './forgot-password'

describe('buildTarget', () => {
    it('SMS envia só phone, com dígitos', () => {
        expect(buildTarget('sms', '(11) 91234-5678')).toEqual({
            phone: '11912345678',
        })
    })

    it('e-mail envia só email', () => {
        expect(buildTarget('email', ' a@b.com ')).toEqual({ email: 'a@b.com' })
    })
})

describe('resendLabel', () => {
    it('mostra a contagem enquanto houver segundos', () => {
        expect(resendLabel(45)).toBe('Reenviar código em 45 s')
    })

    it('libera o texto normal em zero', () => {
        expect(resendLabel(0)).toBe('Reenviar código')
    })
})
