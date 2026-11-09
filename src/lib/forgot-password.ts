import type { IPasswordTarget, ResetChannel } from '../types/password'

export const RESEND_SECONDS = 60

// SMS envia {phone} (só dígitos); e-mail envia {email}. Nunca os dois.
export function buildTarget(
    channel: ResetChannel,
    value: string,
): IPasswordTarget {
    return channel === 'sms'
        ? { phone: value.replace(/\D/g, '') }
        : { email: value.trim() }
}

export function resendLabel(secondsLeft: number): string {
    return secondsLeft > 0
        ? `Reenviar código em ${secondsLeft} s`
        : 'Reenviar código'
}
