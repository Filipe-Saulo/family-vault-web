import { describe, expect, it } from 'vitest'

import { createUserSchema } from './user-schema'

const valid = {
    phoneNumber: '11987654321',
    email: '',
    firstName: 'Maria',
    lastName: 'Silva',
    age: '30',
    password: 'Senha1',
    passwordConfirm: 'Senha1',
}

describe('createUserSchema', () => {
    it('aceita um usuário válido', () => {
        expect(createUserSchema.safeParse(valid).success).toBe(true)
    })

    it('rejeita senhas diferentes apontando passwordConfirm', () => {
        const result = createUserSchema.safeParse({
            ...valid,
            passwordConfirm: 'Outra1',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].path).toEqual(['passwordConfirm'])
    })

    it('rejeita senha sem maiúscula', () => {
        expect(
            createUserSchema.safeParse({
                ...valid,
                password: 'senha12',
                passwordConfirm: 'senha12',
            }).success,
        ).toBe(false)
    })

    it('rejeita telefone com DDD inválido', () => {
        expect(
            createUserSchema.safeParse({ ...valid, phoneNumber: '0587654321' })
                .success,
        ).toBe(false)
    })
})
