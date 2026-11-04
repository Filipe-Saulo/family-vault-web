// src/schemas/user-schema.ts
import { z } from 'zod'

// Função para validar telefone brasileiro
const validateBrazilianPhone = (phone: string) => {
    // Remove tudo que não é número
    const cleaned = phone.replace(/\D/g, '')

    // Valida DDD (11 a 99)
    if (cleaned.length >= 2) {
        const ddd = parseInt(cleaned.substring(0, 2))
        if (ddd < 11 || ddd > 99) return false
    }

    // Para celular: 9 dígitos após DDD (total 11)
    // Para fixo: 8 dígitos após DDD (total 10)
    return cleaned.length === 11 || cleaned.length === 10
}

// campo vazio não vira 0: é recusado como obrigatório
const ageSchema = z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
        .number({ error: 'Idade é obrigatória' })
        .refine((val) => !isNaN(val), 'Idade deve ser um número')
        .min(0, 'Idade deve ser no mínimo 0')
        .max(150, 'Idade deve ser no máximo 150'),
)

// regra de senha compartilhada (criação, troca e definição de senha)
export const passwordRule = z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/\d/, 'Senha deve conter pelo menos um número')

export const createUserSchema = z
    .object({
        role: z.enum(['Administrator', 'User']),
        phoneNumber: z
            .string()
            .max(17, 'Telefone deve ter no máximo 17 caracteres')
            .refine((v) => v === '' || validateBrazilianPhone(v), {
                message: 'Telefone brasileiro inválido.',
            }),
        email: z.string().email('Email inválido').optional().or(z.literal('')),
        firstName: z
            .string()
            .min(2, 'Primeiro nome deve ter no mínimo 2 caracteres')
            .max(30, 'Primeiro nome deve ter no máximo 30 caracteres')
            .trim(),
        lastName: z
            .string()
            .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
            .max(70, 'Sobrenome deve ter no máximo 70 caracteres')
            .trim(),
        age: ageSchema,
        password: passwordRule,
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'As senhas não coincidem',
        path: ['passwordConfirm'],
    })
    .superRefine((data, ctx) => {
        if (data.role === 'Administrator' && !data.email) {
            ctx.addIssue({
                code: 'custom',
                message: 'E-mail é obrigatório para Administrador',
                path: ['email'],
            })
        }
        if (data.role === 'User' && !data.phoneNumber) {
            ctx.addIssue({
                code: 'custom',
                message: 'Telefone é obrigatório para Usuário',
                path: ['phoneNumber'],
            })
        }
    })

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
    firstName: z
        .string()
        .min(2, 'Primeiro nome deve ter no mínimo 2 caracteres')
        .max(30, 'Primeiro nome deve ter no máximo 30 caracteres')
        .trim(),
    lastName: z
        .string()
        .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
        .max(70, 'Sobrenome deve ter no máximo 70 caracteres')
        .trim(),
    age: ageSchema,
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>
