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

export const createUserSchema = z
    .object({
        phoneNumber: z
            .string()
            .min(10, 'Telefone deve ter no mínimo 10 dígitos')
            .max(15, 'Telefone deve ter no máximo 15 dígitos')
            .refine(validateBrazilianPhone, {
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
        age: z.coerce
            .number()
            .refine((val) => !isNaN(val), 'Idade deve ser um número')
            .min(1, 'Idade deve ser maior que 0')
            .max(120, 'Idade deve ser menor que 120'),
        password: z
            .string()
            .min(6, 'Senha deve ter no mínimo 6 caracteres')
            .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
            .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
            .regex(/\d/, 'Senha deve conter pelo menos um número'),
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'As senhas não coincidem',
        path: ['passwordConfirm'],
    })

export type CreateUserFormData = z.infer<typeof createUserSchema>
