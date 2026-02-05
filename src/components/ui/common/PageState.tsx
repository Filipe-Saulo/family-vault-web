import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { EmptyState } from './EmptyState'

interface PageStateProps {
    isLoading: boolean
    isError?: boolean
    isEmpty?: boolean

    emptyTitle?: string
    emptyDescription?: string
    emptyAction?: ReactNode

    errorAction?: ReactNode

    children: ReactNode
}

export function PageState({
    isLoading,
    isError = false,
    isEmpty = false,
    emptyTitle = 'Nenhum registro encontrado',
    emptyDescription,
    emptyAction,
    errorAction,
    children,
}: PageStateProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (isError) {
        return (
            <EmptyState
                title="Erro ao carregar dados"
                description="Tente novamente."
                action={errorAction}
            />
        )
    }

    if (isEmpty) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction}
            />
        )
    }

    return <>{children}</>
}
