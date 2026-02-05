import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '../button'
import { Separator } from '../separator'

interface PageHeaderProps {
    title: string
    description?: string

    /** Exibe botão de voltar */
    onBack?: () => void
    backDisabled?: boolean

    /** Ações do lado direito (botões, filtros, etc) */
    actions?: ReactNode
}

export function PageHeader({
    title,
    description,
    onBack,
    backDisabled = false,
    actions,
}: PageHeaderProps) {
    return (
        <div className="px-6 py-5">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            disabled={backDisabled}
                            aria-label="Voltar"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {title}
                        </h2>

                        {description && (
                            <p className="text-sm text-gray-600 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-3">{actions}</div>
                )}
            </div>

            <Separator className="mt-5" />
        </div>
    )
}
