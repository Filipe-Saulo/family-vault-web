import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '../../contexts/AuthContext'
import { extractApiErrorMessage } from '../../lib/api-error'
import {
    type SetUserPasswordFormData,
    setUserPasswordSchema,
} from '../../schemas/password-schema'
import { passwordService } from '../../services/password/password-service'
import type { IUser } from '../../types/users'
import { FormActions } from '../ui/common/FormActions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Form } from '../ui/form'
import { PasswordField } from './PasswordField'

const emptyValues: SetUserPasswordFormData = {
    password: '',
    passwordConfirm: '',
}

interface SetUserPasswordDialogProps {
    user: IUser | null
    onClose: () => void
}

export function SetUserPasswordDialog({
    user,
    onClose,
}: SetUserPasswordDialogProps) {
    const { userId, logout } = useAuth()

    const form = useForm<SetUserPasswordFormData>({
        resolver: zodResolver(setUserPasswordSchema),
        defaultValues: emptyValues,
        mode: 'onChange',
    })

    const close = () => {
        form.reset(emptyValues)
        onClose()
    }

    const mutation = useMutation({
        mutationFn: (data: SetUserPasswordFormData) =>
            passwordService.setUserPassword(user!.userId, data),
        onSuccess: async (response) => {
            const ownPassword = user?.userId === userId
            close()
            if (ownPassword) {
                // a API revogou as sessões deste usuário, inclusive a do painel
                await logout(false)
                toast.success('Senha alterada. Entre novamente.')
                return
            }
            toast.success(response?.message ?? 'Senha definida com sucesso')
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
                if (!next && !mutation.isPending) close()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Definir senha</DialogTitle>
                    <DialogDescription>
                        Nova senha de {name}. As sessões abertas desse usuário
                        serão encerradas.
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
                            onCancel={close}
                            onSubmitLabel="Definir senha"
                            isSubmitting={mutation.isPending}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
