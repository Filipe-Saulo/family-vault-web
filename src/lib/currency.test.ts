import { describe, expect, it } from 'vitest'

import { formatCurrency, parseCurrencyInput } from './currency'

describe('parseCurrencyInput', () => {
    it('trata os dígitos como centavos', () => {
        expect(parseCurrencyInput('12345')).toBe(123.45)
    })

    it('ignora o que não é dígito, inclusive o texto já formatado', () => {
        expect(parseCurrencyInput(formatCurrency(123.45) + '6')).toBe(1234.56)
    })

    it('apagar tudo volta 0', () => {
        expect(parseCurrencyInput('R$ ')).toBe(0)
    })
})
