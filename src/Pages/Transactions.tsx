import { useQuery } from '@tanstack/react-query'
import { Filter, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '../components/AppShell'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import { Button } from '../components/ui/button'
import { FilterPanel } from '../components/ui/common/FilterPanel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import { Pagination } from '../components/ui/common/Pagination'
import { useAuth } from '../contexts/AuthContext'
import { useCrudMutations } from '../hooks/use-crud-mutations'
import { queryKeys } from '../lib/query-keys'
import type { TransactionFormData } from '../schemas/transaction-schema'
import { transactionsService } from '../services/transactions/transactions-service'
import type {
    ITransaction,
    ITransactionQueryRequest,
} from '../types/transaction'

function Transactions() {
    const { userId, roles, permissions } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [editingTransaction, setEditingTransaction] =
        useState<ITransaction | null>(null)
    const [filters, setFilters] = useState<ITransactionQueryRequest>({
        pageNumber: 1,
        pageSize: 20,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.transactions.list(filters),
        queryFn: () => transactionsService.list(filters),
    })

    const transactions = data?.data?.items || []
    const pagingInfo = data?.data

    const {
        createMutation,
        updateMutation,
        deleteMutation,
        isSaving,
        deletingId,
    } = useCrudMutations({
        service: transactionsService,
        messages: {
            created: 'Transação criada com sucesso',
            updated: 'Transação atualizada',
            deleted: 'Transação excluída',
        },
        invalidate: [queryKeys.transactions.all, queryKeys.dashboard.all],
        onSaved: () => handleBackToList(),
        onDeleted: () => {
            // excluiu o último item da página: volta uma
            if (
                transactions.length === 1 &&
                (pagingInfo?.pageNumber ?? 1) > 1
            ) {
                handlePageChange(pagingInfo!.pageNumber - 1)
            }
        },
    })

    const handleAddTransaction = () => setShowForm(true)
    const handleEditTransaction = (transaction: ITransaction) => {
        setEditingTransaction(transaction)
        setShowForm(true)
    }
    const handleBackToList = () => {
        setShowForm(false)
        setEditingTransaction(null)
    }
    const handleSubmit = (formData: TransactionFormData) => {
        if (editingTransaction) {
            updateMutation.mutate({
                id: editingTransaction.transactionId,
                data: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }
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

    return (
        <AppShell>
            <div className="bg-card rounded-lg shadow">
                <PageHeader
                    title={
                        showForm
                            ? editingTransaction
                                ? 'Editar Transação'
                                : 'Nova Transação'
                            : 'Transações'
                    }
                    description={
                        showForm
                            ? editingTransaction
                                ? 'Atualize os dados da transação'
                                : 'Registre uma nova transação'
                            : 'Gerencie todas as transações financeiras'
                    }
                    onBack={showForm ? handleBackToList : undefined}
                    backDisabled={isSaving}
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
                            initialData={editingTransaction ?? undefined}
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={isSaving}
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
                                onEditTransaction={handleEditTransaction}
                                onDeleteTransaction={handleDeleteTransaction}
                                deletingId={deletingId}
                                currentUserId={userId}
                                roles={roles}
                                permissions={permissions}
                            />

                            {pagingInfo && (
                                <Pagination
                                    pageNumber={pagingInfo.pageNumber}
                                    pageSize={pagingInfo.pageSize}
                                    totalCount={pagingInfo.totalCount}
                                    itemCount={transactions.length}
                                    itemLabel="transações"
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </PageState>
                    )}
                </div>
            </div>
        </AppShell>
    )
}

export default Transactions
