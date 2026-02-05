import type { ReactNode } from 'react'

interface EmptyStateProps {
    title: string
    description?: string
    action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>

            {description && (
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                    {description}
                </p>
            )}

            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}
