import { z } from 'zod'

import { passwordRule } from './user-schema'

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
        password: passwordRule,
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'As senhas não coincidem',
        path: ['passwordConfirm'],
    })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const setUserPasswordSchema = z
    .object({
        password: passwordRule,
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'As senhas não coincidem',
        path: ['passwordConfirm'],
    })

export type SetUserPasswordFormData = z.infer<typeof setUserPasswordSchema>

export const resetPasswordSchema = z
    .object({
        code: z.string().trim().min(1, 'Informe o código'),
        password: passwordRule,
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'As senhas não coincidem',
        path: ['passwordConfirm'],
    })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
