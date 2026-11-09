import { describe, expect, it } from 'vitest'

import {
    changePasswordSchema,
    resetPasswordSchema,
    setUserPasswordSchema,
} from './password-schema'

const validChange = {
    currentPassword: 'Antiga1',
    password: 'Senha1',
    passwordConfirm: 'Senha1',
}

const weak = ['Ab1', 'senha123', 'SENHA123', 'SenhaSemNumero']

describe('changePasswordSchema', () => {
    it('aceita dados válidos', () => {
        expect(changePasswordSchema.safeParse(validChange).success).toBe(true)
    })

    it('exige a senha atual', () => {
        expect(
            changePasswordSchema.safeParse({
                ...validChange,
                currentPassword: '',
            }).success,
        ).toBe(false)
    })

    it.each(weak)('recusa a nova senha fraca %s', (password) => {
        expect(
            changePasswordSchema.safeParse({
                ...validChange,
                password,
                passwordConfirm: password,
            }).success,
        ).toBe(false)
    })

    it('recusa confirmação diferente', () => {
        const result = changePasswordSchema.safeParse({
            ...validChange,
            passwordConfirm: 'Outra1x',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].path).toEqual(['passwordConfirm'])
        }
    })
})

describe('setUserPasswordSchema', () => {
    it('aceita senha válida', () => {
        expect(
            setUserPasswordSchema.safeParse({
                password: 'Senha1',
                passwordConfirm: 'Senha1',
            }).success,
        ).toBe(true)
    })

    it.each(weak)('recusa senha fraca %s', (password) => {
        expect(
            setUserPasswordSchema.safeParse({
                password,
                passwordConfirm: password,
            }).success,
        ).toBe(false)
    })

    it('recusa confirmação diferente', () => {
        expect(
            setUserPasswordSchema.safeParse({
                password: 'Senha1',
                passwordConfirm: 'Senha2',
            }).success,
        ).toBe(false)
    })
})

describe('resetPasswordSchema', () => {
    const valid = {
        code: '123456',
        password: 'Senha1',
        passwordConfirm: 'Senha1',
    }

    it('aceita dados válidos', () => {
        expect(resetPasswordSchema.safeParse(valid).success).toBe(true)
    })

    it('exige o código', () => {
        expect(
            resetPasswordSchema.safeParse({ ...valid, code: ' ' }).success,
        ).toBe(false)
    })

    it('recusa confirmação diferente', () => {
        expect(
            resetPasswordSchema.safeParse({ ...valid, passwordConfirm: 'x' })
                .success,
        ).toBe(false)
    })
})
