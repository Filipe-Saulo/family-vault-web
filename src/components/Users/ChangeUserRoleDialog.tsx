import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { extractApiErrorMessage } from '../../lib/api-error'
import { queryKeys } from '../../lib/query-keys'
import {
    type ChangeUserRoleFormData,
    createChangeUserRoleSchema,
} from '../../schemas/user-schema'
import { usersService } from '../../services/users/users-service'
import type { IUser } from '../../types/users'
import { FormActions } from '../ui/common/FormActions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

const noUser = { email: null, phoneNumber: null }

interface ChangeUserRoleDialogProps {
    user: IUser | null
    onClose: () => void
}

export function ChangeUserRoleDialog({
    user,
    onClose,
}: ChangeUserRoleDialogProps) {
    const queryClient = useQueryClient()

    const form = useForm<ChangeUserRoleFormData>({
        resolver: zodResolver(createChangeUserRoleSchema(user ?? noUser)),
        defaultValues: { role: 'User', email: '', phoneNumber: '' },
        mode: 'onChange',
    })

    const { reset, trigger } = form
    const role = form.watch('role')
    const needsEmail = role === 'Administrator' && !user?.email
    const needsPhone = role === 'User' && !user?.phoneNumber

    useEffect(() => {
        if (user) {
            reset({
                role: user.role ?? 'User',
                email: '',
                phoneNumber: '',
            })
        }
    }, [user, reset])

    useEffect(() => {
        if (user) void trigger()
    }, [role, user, trigger])

    const mutation = useMutation({
        mutationFn: (data: ChangeUserRoleFormData) =>
            usersService.changeRole(user!.userId, {
                role: data.role,
                ...(needsEmail ? { email: data.email } : {}),
                ...(needsPhone ? { phoneNumber: data.phoneNumber } : {}),
            }),
        onSuccess: async (response) => {
            onClose()
            toast.success(response?.message ?? 'Papel alterado com sucesso')
            await queryClient.invalidateQueries({
                queryKey: queryKeys.users.all,
            })
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const name = user
        ? user.fullName || `${user.firstName} ${user.lastName}`
        : ''

    return (
        <Dialog
            open={!!user}
            onOpenChange={(next) => {
                if (!next && !mutation.isPending) onClose()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alterar papel</DialogTitle>
                    <DialogDescription>
                        Papel de {name}. As sessões abertas desse usuário serão
                        encerradas e ele precisará entrar de novo: administrador
                        entra por e-mail e usuário, por telefone.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            mutation.mutate(data),
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Papel *</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(next) => {
                                            field.onChange(next)
                                            // campo escondido não pode travar o envio
                                            form.setValue('email', '')
                                            form.setValue('phoneNumber', '')
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o papel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Administrator">
                                                Administrador
                                            </SelectItem>
                                            <SelectItem value="User">
                                                Usuário
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {needsEmail && (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail de login *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="nome@exemplo.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {needsPhone && (
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Telefone de login *
                                        </FormLabel>
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
                        )}

                        <FormActions
                            onCancel={onClose}
                            onSubmitLabel="Alterar papel"
                            isSubmitting={mutation.isPending}
                            submitDisabled={
                                role === user?.role || !form.formState.isValid
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
