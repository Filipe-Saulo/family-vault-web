import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Filter, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { AppShell } from '../components/AppShell'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import { Button } from '../components/ui/button'
import { FilterPanel } from '../components/ui/common/FilterPainel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import { extractApiErrorMessage } from '../lib/api-error'
import type { CreateTransactionFormData } from '../schemas/transaction-schema'
import { transactionsService } from '../services/transactions/transactions-service'
import type { ITransactionQueryRequest } from '../types/transaction'

function Transactions() {
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState<ITransactionQueryRequest>({
        pageNumber: 1,
        pageSize: 20,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const queryClient = useQueryClient()

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => transactionsService.list(filters),
    })

    const createMutation = useMutation({
        mutationFn: transactionsService.create,
        onSuccess: (response) => {
            toast.success(response.message ?? 'Transação criada com sucesso')
            queryClient.invalidateQueries({
                queryKey: ['transactions'],
                exact: false,
            })
            handleBackToList()
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: transactionsService.delete,
        onSuccess: (response) => {
            toast.success(response.message ?? 'Transação excluída')
            queryClient.invalidateQueries({
                queryKey: ['transactions'],
                exact: false,
            })
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const handleAddTransaction = () => setShowForm(true)
    const handleBackToList = () => setShowForm(false)
    const handleSubmit = (formData: CreateTransactionFormData) =>
        createMutation.mutate(formData)
    const handleDeleteTransaction = (transactionId: number) =>
        deleteMutation.mutate(transactionId)

    const handleApplySearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: 1,
            description: searchTerm || undefined,
        }))
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setFilters({ pageNumber: 1, pageSize: 20 })
    }

    const handlePageChange = (pageNumber: number) => {
        setFilters((prev) => ({ ...prev, pageNumber }))
    }

    const transactions = data?.data?.items || []
    const pagingInfo = data?.data

    return (
        <AppShell>
            <div className="bg-white rounded-lg shadow">
                <PageHeader
                    title={showForm ? 'Nova Transação' : 'Transações'}
                    description={
                        showForm
                            ? 'Registre uma nova transação'
                            : 'Gerencie todas as transações financeiras'
                    }
                    onBack={showForm ? handleBackToList : undefined}
                    backDisabled={createMutation.isPending}
                    actions={
                        !showForm && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setShowFilterPanel(!showFilterPanel)
                                    }
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtros
                                </Button>

                                <Button
                                    onClick={handleAddTransaction}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    Nova Transação
                                </Button>
                            </>
                        )
                    }
                />

                {!showForm && showFilterPanel && (
                    <div className="border-b p-4 bg-muted/30">
                        <FilterPanel
                            title="Filtrar transações"
                            searchValue={searchTerm}
                            onSearchValueChange={setSearchTerm}
                            onSearch={handleApplySearch}
                            onClear={handleClearFilters}
                            onClose={() => setShowFilterPanel(false)}
                        />
                    </div>
                )}

                <div className="p-6">
                    {showForm ? (
                        <TransactionForm
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={createMutation.isPending}
                        />
                    ) : (
                        <PageState
                            isLoading={isLoading}
                            isError={!!error}
                            isEmpty={transactions.length === 0}
                            emptyTitle="Nenhuma transação encontrada"
                            emptyDescription="Tente ajustar os filtros ou registrar uma nova transação."
                            emptyAction={
                                <Button onClick={handleAddTransaction}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Transação
                                </Button>
                            }
                            errorAction={
                                <Button
                                    variant="outline"
                                    onClick={() => refetch()}
                                >
                                    Tentar novamente
                                </Button>
                            }
                        >
                            <TransactionList
                                transactions={transactions}
                                onDeleteTransaction={handleDeleteTransaction}
                                isDeleting={deleteMutation.isPending}
                            />

                            {pagingInfo && pagingInfo.totalCount > 0 && (
                                <div className="mt-6 flex items-center justify-between border-t pt-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {transactions.length} de{' '}
                                        {pagingInfo.totalCount} transações
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagingInfo.pageNumber - 1,
                                                )
                                            }
                                            disabled={
                                                pagingInfo.pageNumber <= 1
                                            }
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Anterior
                                        </button>

                                        <span className="text-sm text-gray-700">
                                            Página {pagingInfo.pageNumber} de{' '}
                                            {Math.ceil(
                                                pagingInfo.totalCount /
                                                    pagingInfo.pageSize,
                                            )}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagingInfo.pageNumber + 1,
                                                )
                                            }
                                            disabled={
                                                pagingInfo.pageNumber >=
                                                Math.ceil(
                                                    pagingInfo.totalCount /
                                                        pagingInfo.pageSize,
                                                )
                                            }
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                </div>
                            )}
                        </PageState>
                    )}
                </div>
            </div>
        </AppShell>
    )
}

export default Transactions
