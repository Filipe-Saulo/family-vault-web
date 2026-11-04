interface PaginationProps {
    pageNumber: number
    pageSize: number
    totalCount: number
    /** itens exibidos na página atual */
    itemCount: number
    /** nome do recurso no plural, ex.: "transações" */
    itemLabel: string
    onPageChange: (pageNumber: number) => void
}

export function Pagination({
    pageNumber,
    pageSize,
    totalCount,
    itemCount,
    itemLabel,
    onPageChange,
}: PaginationProps) {
    if (totalCount <= 0) return null

    const totalPages = Math.ceil(totalCount / pageSize)

    return (
        <nav
            aria-label={`Paginação de ${itemLabel}`}
            className="mt-6 flex items-center justify-between border-t pt-6"
        >
            <div className="text-sm text-muted-foreground">
                Mostrando {itemCount} de {totalCount} {itemLabel}
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                    aria-label="Página anterior"
                    onClick={() => onPageChange(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                >
                    Anterior
                </button>

                <span className="text-sm text-muted-foreground">
                    Página {pageNumber} de {totalPages}
                </span>

                <button
                    type="button"
                    className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                    aria-label="Próxima página"
                    onClick={() => onPageChange(pageNumber + 1)}
                    disabled={pageNumber >= totalPages}
                >
                    Próxima
                </button>
            </div>
        </nav>
    )
}
