import { Loader2 } from 'lucide-react'

import { Button } from '../button'
import { Separator } from '../separator'

interface FormActionsProps {
    onCancel: () => void
    onSubmitLabel?: string

    isSubmitting?: boolean
    submitDisabled?: boolean
}

export function FormActions({
    onCancel,
    onSubmitLabel = 'Salvar',
    isSubmitting = false,
    submitDisabled = false,
}: FormActionsProps) {
    return (
        <>
            <Separator className="my-6" />

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>

                <Button type="submit" disabled={submitDisabled || isSubmitting}>
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {onSubmitLabel}
                </Button>
            </div>
        </>
    )
}
