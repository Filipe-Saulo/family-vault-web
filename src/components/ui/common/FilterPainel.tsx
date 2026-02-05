import { Search, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '../button'
import { Input } from '../input'
import { Separator } from '../separator'

interface FilterPanelProps {
    title?: string

    searchValue?: string
    onSearchValueChange?: (value: string) => void

    onSearch?: () => void
    onClear?: () => void
    onClose?: () => void

    isSearching?: boolean

    /** filtros extras (select, checkbox, etc) */
    extraFilters?: ReactNode
}

export function FilterPanel({
    title = 'Filtros',
    searchValue,
    onSearchValueChange,
    onSearch,
    onClear,
    onClose,
    isSearching = false,
    extraFilters,
}: FilterPanelProps) {
    return (
        <div className="rounded-lg border bg-background p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{title}</h3>

                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {onSearchValueChange && (
                    <Input
                        placeholder="Buscar..."
                        value={searchValue}
                        onChange={(e) => onSearchValueChange(e.target.value)}
                    />
                )}

                {extraFilters}

                <Separator />

                <div className="flex justify-end gap-2">
                    {onClear && (
                        <Button
                            variant="outline"
                            onClick={onClear}
                            disabled={isSearching}
                        >
                            Limpar
                        </Button>
                    )}

                    {onSearch && (
                        <Button onClick={onSearch} disabled={isSearching}>
                            <Search className="mr-2 h-4 w-4" />
                            Aplicar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
