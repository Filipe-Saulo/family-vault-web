import { describe, expect, it } from 'vitest'

import {
    createChangeUserRoleSchema,
    createUserSchema,
    updateUserSchema,
} from './user-schema'

describe('createChangeUserRoleSchema', () => {
    const adminOnlyEmail = { email: 'admin@exemplo.com', phoneNumber: null }
    const userOnlyPhone = { email: null, phoneNumber: '+5511987654321' }

    it('exige telefone ao rebaixar conta sem telefone', () => {
        const schema = createChangeUserRoleSchema(adminOnlyEmail)

        expect(schema.safeParse({ role: 'User' }).success).toBe(false)
        expect(
            schema.safeParse({ role: 'User', phoneNumber: '11987654321' })
                .success,
        ).toBe(true)
    })

    it('exige e-mail ao promover conta sem e-mail', () => {
        const schema = createChangeUserRoleSchema(userOnlyPhone)

        expect(schema.safeParse({ role: 'Administrator' }).success).toBe(false)
        expect(
            schema.safeParse({
                role: 'Administrator',
                email: 'ana@exemplo.com',
            }).success,
        ).toBe(true)
    })

    it('não pede dado que a conta já tem', () => {
        const both = { email: 'ana@exemplo.com', phoneNumber: '+5511987654321' }

        expect(
            createChangeUserRoleSchema(both).safeParse({ role: 'User' })
                .success,
        ).toBe(true)
        expect(
            createChangeUserRoleSchema(both).safeParse({
                role: 'Administrator',
            }).success,
        ).toBe(true)
    })

    it('recusa telefone inválido', () => {
        expect(
            createChangeUserRoleSchema(adminOnlyEmail).safeParse({
                role: 'User',
                phoneNumber: '123',
            }).success,
        ).toBe(false)
    })
})

const valid = {
    role: 'User',
    phoneNumber: '11987654321',
    email: '',
    firstName: 'Maria',
    lastName: 'Silva',
    age: '30',
    password: 'Senha1',
    passwordConfirm: 'Senha1',
}

const validAdmin = {
    ...valid,
    role: 'Administrator',
    phoneNumber: '',
    email: 'admin@exemplo.com',
}

describe('createUserSchema', () => {
    it('aceita um usuário válido', () => {
        expect(createUserSchema.safeParse(valid).success).toBe(true)
    })

    it('aceita telefone com máscara', () => {
        expect(
            createUserSchema.safeParse({
                ...valid,
                phoneNumber: '(11) 98765-4321',
            }).success,
        ).toBe(true)
    })

    it('aceita administrador com e-mail e sem telefone', () => {
        expect(createUserSchema.safeParse(validAdmin).success).toBe(true)
    })

    it('exige e-mail para administrador', () => {
        const result = createUserSchema.safeParse({ ...validAdmin, email: '' })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].path).toEqual(['email'])
    })

    it('exige telefone para usuário', () => {
        const result = createUserSchema.safeParse({
            ...valid,
            phoneNumber: '',
        })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].path).toEqual(['phoneNumber'])
    })

    it('rejeita papel desconhecido', () => {
        expect(
            createUserSchema.safeParse({ ...valid, role: 'Root' }).success,
        ).toBe(false)
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

    it('aceita idade de 0 a 150 e rejeita fora disso', () => {
        const ok = (age: string) =>
            createUserSchema.safeParse({ ...valid, age }).success
        expect(ok('0')).toBe(true)
        expect(ok('150')).toBe(true)
        expect(ok('151')).toBe(false)
        expect(ok('-1')).toBe(false)
    })

    it('recusa idade vazia com mensagem de obrigatória', () => {
        const result = createUserSchema.safeParse({ ...valid, age: '' })
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].path).toEqual(['age'])
        expect(result.error?.issues[0].message).toBe('Idade é obrigatória')
    })

    it('limita o telefone a 17 caracteres', () => {
        const ok = (phoneNumber: string) =>
            createUserSchema.safeParse({ ...valid, phoneNumber }).success
        expect(ok('(11) 98765-4321')).toBe(true)
        expect(ok('(11) 98765-4321   ')).toBe(false)
    })
})

describe('updateUserSchema', () => {
    it('aceita idade 0 e 150', () => {
        const base = { firstName: 'Ana', lastName: 'Lima' }
        expect(updateUserSchema.safeParse({ ...base, age: 0 }).success).toBe(
            true,
        )
        expect(updateUserSchema.safeParse({ ...base, age: 151 }).success).toBe(
            false,
        )
    })

    it('recusa idade vazia e aceita 0 digitado', () => {
        const base = { firstName: 'Ana', lastName: 'Lima' }
        expect(updateUserSchema.safeParse({ ...base, age: '' }).success).toBe(
            false,
        )
        expect(updateUserSchema.safeParse({ ...base, age: '0' }).success).toBe(
            true,
        )
    })
})
