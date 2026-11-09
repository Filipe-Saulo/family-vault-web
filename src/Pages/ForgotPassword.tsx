import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { PasswordField } from '../components/Password/PasswordField'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../components/ui/form'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { useCountdown } from '../hooks/use-countdown'
import { extractApiErrorMessage } from '../lib/api-error'
import {
    buildTarget,
    RESEND_SECONDS,
    resendLabel,
} from '../lib/forgot-password'
import {
    type ResetPasswordFormData,
    resetPasswordSchema,
} from '../schemas/password-schema'
import { passwordService } from '../services/password/password-service'
import type { ResetChannel } from '../types/password'

const emptyValues: ResetPasswordFormData = {
    code: '',
    password: '',
    passwordConfirm: '',
}

const SENT_MESSAGE = 'Se os dados estiverem corretos, você receberá um código.'

function ForgotPassword() {
    const navigate = useNavigate()
    const [channel, setChannel] = useState<ResetChannel>('email')
    const [value, setValue] = useState('')
    const [step, setStep] = useState<1 | 2>(1)
    const { left, start } = useCountdown(RESEND_SECONDS)

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: emptyValues,
        mode: 'onChange',
    })

    const forgot = useMutation({
        mutationFn: passwordService.forgotPassword,
        onSuccess: () => {
            start()
            setStep(2)
            toast.success(SENT_MESSAGE)
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const reset = useMutation({
        mutationFn: passwordService.resetPassword,
        onSuccess: () => {
            toast.success('Senha redefinida. Entre com a nova senha.')
            navigate('/login')
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    function changeChannel(next: ResetChannel) {
        if (next === channel) return
        setChannel(next)
        setValue('')
    }

    function sendCode(e?: FormEvent) {
        e?.preventDefault()
        forgot.mutate(buildTarget(channel, value))
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md relative">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Esqueci minha senha
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {step === 1 ? (
                        <form onSubmit={sendCode} className="space-y-4">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={
                                        channel === 'sms'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="flex-1"
                                    onClick={() => changeChannel('sms')}
                                >
                                    SMS
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        channel === 'email'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="flex-1"
                                    onClick={() => changeChannel('email')}
                                >
                                    E-mail
                                </Button>
                            </div>

                            <div>
                                <label
                                    htmlFor="target"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    {channel === 'sms' ? 'Telefone' : 'E-mail'}
                                </label>
                                <Input
                                    id="target"
                                    type={channel === 'sms' ? 'tel' : 'email'}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={forgot.isPending}
                                className="w-full"
                            >
                                {forgot.isPending
                                    ? 'Enviando...'
                                    : 'Enviar código'}
                            </Button>
                        </form>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit((data) =>
                                    reset.mutate({
                                        ...buildTarget(channel, value),
                                        ...data,
                                    }),
                                )}
                                className="space-y-4"
                            >
                                <p className="text-sm text-muted-foreground">
                                    {SENT_MESSAGE}
                                </p>

                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código</FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoComplete="one-time-code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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

                                <Button
                                    type="submit"
                                    disabled={reset.isPending}
                                    className="w-full"
                                >
                                    {reset.isPending
                                        ? 'Salvando...'
                                        : 'Redefinir senha'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={left > 0 || forgot.isPending}
                                    onClick={() => sendCode()}
                                >
                                    {resendLabel(left)}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setStep(1)}
                                >
                                    Trocar SMS/e-mail
                                </Button>
                            </form>
                        </Form>
                    )}

                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-sm hover:underline">
                            Voltar ao login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword
