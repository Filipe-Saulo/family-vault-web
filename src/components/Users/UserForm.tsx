import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    type CreateUserFormData,
    createUserSchema,
} from '../../schemas/user-schema'
import { FormActions } from '../ui/common/FormActions'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

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
    const form = useForm<CreateUserFormData>({
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
        mode: 'onChange',
    })

    const password = form.watch('password')

    return (
        <div className="max-w-2xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="(11) 99999-9999"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Idade *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="120"
                                            placeholder="18"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primeiro Nome *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="João" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sobrenome *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Silva" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Digite uma senha forte"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
                                                        {password.length >= 6
                                                            ? '✓'
                                                            : '✗'}
                                                    </span>
                                                    Mínimo 6 caracteres
                                                </li>
                                                <li
                                                    className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    <span className="mr-1">
                                                        {/[A-Z]/.test(password)
                                                            ? '✓'
                                                            : '✗'}
                                                    </span>
                                                    Pelo menos uma letra
                                                    maiúscula
                                                </li>
                                                <li
                                                    className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    <span className="mr-1">
                                                        {/[a-z]/.test(password)
                                                            ? '✓'
                                                            : '✗'}
                                                    </span>
                                                    Pelo menos uma letra
                                                    minúscula
                                                </li>
                                                <li
                                                    className={`flex items-center ${/\d/.test(password) ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    <span className="mr-1">
                                                        {/\d/.test(password)
                                                            ? '✓'
                                                            : '✗'}
                                                    </span>
                                                    Pelo menos um número
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="passwordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Senha *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Digite novamente a senha"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormActions
                        onCancel={onCancel}
                        onSubmitLabel="Cadastrar Usuário"
                        isSubmitting={isLoading}
                        submitDisabled={!form.formState.isValid}
                    />
                </form>
            </Form>
        </div>
    )
}
