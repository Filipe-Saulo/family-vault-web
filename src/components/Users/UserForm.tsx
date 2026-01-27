// src/components/users/UserForm.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import {
    type CreateUserFormData,
    createUserSchema,
} from '../../schemas/user-schema'

interface UserFormProps {
    onSubmit: (data: CreateUserFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

export default function UserForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: UserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        reset,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            phoneNumber: '',
            email: '',
            firstName: '',
            lastName: '',
            age: 18,
            password: '',
            passwordConfirm: '',
        },
        mode: 'onChange', // Validação em tempo real
    })

    const password = watch('password')
    const handleFormSubmit = (data: CreateUserFormData) => {
        // Envia exatamente como o formulário preencheu
        // phoneNumber já está correto
        onSubmit(data)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone *
                        </label>
                        <input
                            type="tel"
                            placeholder="(11) 99999-9999"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.phoneNumber
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('phoneNumber')}
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.phoneNumber.message}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Formato: (11) 99999-9999 ou 11999999999
                        </p>
                    </div>

                    {/* Idade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Idade *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="120"
                            placeholder="18"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.age
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('age')}
                        />
                        {errors.age && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.age.message}
                            </p>
                        )}
                    </div>

                    {/* Primeiro Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primeiro Nome *
                        </label>
                        <input
                            type="text"
                            placeholder="João"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.firstName
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('firstName')}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Sobrenome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sobrenome *
                        </label>
                        <input
                            type="text"
                            placeholder="Silva"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.lastName
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha *
                        </label>
                        <input
                            type="password"
                            placeholder="Digite uma senha forte"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.password
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                        {password && (
                            <div className="mt-2 text-xs text-gray-500">
                                <p className="font-medium mb-1">
                                    Requisitos da senha:
                                </p>
                                <ul className="space-y-1">
                                    <li
                                        className={`flex items-center ${password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        <span className="mr-1">
                                            {password.length >= 6 ? '✓' : '✗'}
                                        </span>
                                        Mínimo 6 caracteres
                                    </li>
                                    <li
                                        className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        <span className="mr-1">
                                            {/[A-Z]/.test(password) ? '✓' : '✗'}
                                        </span>
                                        Pelo menos uma letra maiúscula
                                    </li>
                                    <li
                                        className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        <span className="mr-1">
                                            {/[a-z]/.test(password) ? '✓' : '✗'}
                                        </span>
                                        Pelo menos uma letra minúscula
                                    </li>
                                    <li
                                        className={`flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        <span className="mr-1">
                                            {/\d/.test(password) ? '✓' : '✗'}
                                        </span>
                                        Pelo menos um número
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirmar Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Senha *
                        </label>
                        <input
                            type="password"
                            placeholder="Digite novamente a senha"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.passwordConfirm
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('passwordConfirm')}
                        />
                        {errors.passwordConfirm && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.passwordConfirm.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <Loader2 className="animate-spin" size={16} />
                        )}
                        Cadastrar Usuário
                    </button>
                </div>
            </form>
        </div>
    )
}
