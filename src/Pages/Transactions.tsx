import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Filter, Loader2, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '../components/AppShell'
import TransactionForm from '../components/Transactions/TransactionForm'
import TransactionList from '../components/Transactions/TransactionList'
import type { CreateTransactionFormData } from '../schemas/transaction-schema'
import { transactionsService } from '../services/transactions/transactions'
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

    // Query para listar transações
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => transactionsService.list(filters),
    })

    // Mutation para criar transação
    const createMutation = useMutation({
        mutationFn: transactionsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['transactions'],
                exact: false,
            })
            handleBackToList()
        },
    })

    // Mutation para deletar transação
    const deleteMutation = useMutation({
        mutationFn: transactionsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['transactions'],
                exact: false,
            })
        },
    })

    const handleAddTransaction = () => {
        setShowForm(true)
    }

    const handleBackToList = () => {
        setShowForm(false)
    }

    const handleSubmit = (formData: CreateTransactionFormData) => {
        createMutation.mutate(formData)
    }

    const handleDeleteTransaction = (transactionId: number) => {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            deleteMutation.mutate(transactionId)
        }
    }

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: 1,
            description: searchTerm || undefined,
        }))
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setFilters({
            pageNumber: 1,
            pageSize: 20,
        })
    }

    const handlePageChange = (pageNumber: number) => {
        setFilters((prev) => ({
            ...prev,
            pageNumber,
        }))
    }

    const transactions = data?.data?.items || []
    const pagingInfo = data?.data

    return (
        <AppShell>
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="border-b p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {showForm && (
                            <button
                                onClick={handleBackToList}
                                disabled={createMutation.isPending}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                title="Voltar"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {showForm ? 'Nova Transação' : 'Transações'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {showForm
                                    ? 'Registre uma nova transação'
                                    : 'Gerencie todas as transações financeiras'}
                            </p>
                        </div>
                    </div>

                    {!showForm && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setShowFilterPanel(!showFilterPanel)
                                }
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Filter size={18} />
                                Filtros
                            </button>

                            <button
                                onClick={handleAddTransaction}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <Plus size={20} />
                                )}
                                Nova Transação
                            </button>
                        </div>
                    )}
                </div>

                {/* Painel de filtros */}
                {!showForm && showFilterPanel && (
                    <div className="border-b bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-700">
                                Filtrar transações
                            </h3>
                            <button
                                onClick={() => setShowFilterPanel(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por descrição..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleSearch()
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search
                                        className="absolute left-3 top-2.5 text-gray-400"
                                        size={18}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Buscar
                            </button>

                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Limpar
                            </button>
                        </div>

                        {searchTerm && (
                            <div className="mt-3 text-sm text-gray-600">
                                Buscando por: "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}

                {/* Conteúdo */}
                <div className="p-6">
                    {isLoading && !showForm ? (
                        <div className="flex justify-center py-12">
                            <Loader2
                                className="animate-spin text-blue-600"
                                size={32}
                            />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            Erro ao carregar transações.
                            <button
                                onClick={() => refetch()}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : showForm ? (
                        <TransactionForm
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={createMutation.isPending}
                        />
                    ) : (
                        <>
                            <TransactionList
                                transactions={transactions}
                                onDeleteTransaction={handleDeleteTransaction}
                                isLoading={isLoading}
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
                        </>
                    )}
                </div>
            </div>
        </AppShell>
    )
}

export default Transactions
