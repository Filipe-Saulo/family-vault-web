import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '../../contexts/AuthContext'
import { extractApiErrorMessage } from '../../lib/api-error'
import {
    type ChangePasswordFormData,
    changePasswordSchema,
} from '../../schemas/password-schema'
import { passwordService } from '../../services/password/password-service'
import { FormActions } from '../ui/common/FormActions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { Form } from '../ui/form'
import { PasswordField } from './PasswordField'

const emptyValues: ChangePasswordFormData = {
    currentPassword: '',
    password: '',
    passwordConfirm: '',
}

export function ChangePasswordDialog() {
    const { logout } = useAuth()
    const [open, setOpen] = useState(false)

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: emptyValues,
        mode: 'onChange',
    })

    const mutation = useMutation({
        mutationFn: passwordService.changePassword,
        onSuccess: async () => {
            setOpen(false)
            form.reset(emptyValues)
            // a API revogou as sessões: encerra a do painel
            await logout(false)
            toast.success('Senha alterada. Entre novamente.')
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const handleOpenChange = (next: boolean) => {
        if (mutation.isPending) return
        setOpen(next)
        if (!next) form.reset(emptyValues)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className="text-sm hover:underline text-left">
                    Trocar minha senha
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Trocar minha senha</DialogTitle>
                    <DialogDescription>
                        Ao concluir, você será desconectado e precisará entrar
                        novamente.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            mutation.mutate(data),
                        )}
                        className="space-y-4"
                    >
                        <PasswordField
                            control={form.control}
                            name="currentPassword"
                            label="Senha atual"
                            autoComplete="current-password"
                        />
                        <PasswordField
                            control={form.control}
                            name="password"
                            label="Nova senha"
                            autoComplete="new-password"
                        />
                        <PasswordField
                            control={form.control}
                            name="passwordConfirm"
                            label="Confirmar nova senha"
                            autoComplete="new-password"
                        />

                        <FormActions
                            onCancel={() => handleOpenChange(false)}
                            onSubmitLabel="Trocar senha"
                            isSubmitting={mutation.isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
