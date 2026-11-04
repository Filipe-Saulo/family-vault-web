import { describe, expect, it } from 'vitest'

import { formatDateOnly, formatDateTime, todayLocalISO } from './date'

describe('todayLocalISO', () => {
    it('usa o dia local, com zeros à esquerda', () => {
        expect(todayLocalISO(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    })

    it('não vira o dia por causa do UTC', () => {
        expect(todayLocalISO(new Date(2026, 10, 3, 0, 1))).toBe('2026-11-03')
    })
})

describe('formatDateOnly', () => {
    it('formata data pura sem deslocar o dia', () => {
        expect(formatDateOnly('2026-11-03')).toBe('03/11/2026')
    })

    it('ignora a parte de hora quando existir', () => {
        expect(formatDateOnly('2026-11-03T00:00:00')).toBe('03/11/2026')
    })

    it('devolve o valor original se não for uma data', () => {
        expect(formatDateOnly('abc')).toBe('abc')
    })
})

describe('formatDateTime', () => {
    it('inclui data e hora', () => {
        expect(formatDateTime('2026-11-03T12:30:00')).toMatch(
            /03\/11\/2026.*12:30/,
        )
    })
})
