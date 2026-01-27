import { Loader2, Trash2 } from 'lucide-react'

import type { ITransaction } from '../../types/transaction'

interface TransactionListProps {
    transactions: ITransaction[]
    onDeleteTransaction: (transactionId: number) => void
    isLoading?: boolean
    isDeleting?: boolean
}

export default function TransactionList({
    transactions,
    onDeleteTransaction,
    isLoading,
    isDeleting,
}: TransactionListProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Criado em
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <tr
                            key={transaction.transactionId}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {formatDate(transaction.transactionDate)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {transaction.description}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {transaction.category.description}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {transaction.category.purpose.name}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        transaction.transactionType.name ===
                                        'Income'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {transaction.transactionType.name ===
                                    'Income'
                                        ? 'Entrada'
                                        : 'Saída'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div
                                    className={`text-sm font-medium ${
                                        transaction.transactionType.name ===
                                        'Income'
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {formatCurrency(transaction.amount)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    {formatDate(transaction.createdAt)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() =>
                                        onDeleteTransaction(
                                            transaction.transactionId,
                                        )
                                    }
                                    disabled={isDeleting}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-1.5 hover:bg-red-50 rounded-md border border-red-200 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={14}
                                        />
                                    ) : (
                                        <Trash2 size={14} />
                                    )}
                                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {transactions.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        Nenhuma transação encontrada.
                    </p>
                    <p className="text-sm text-gray-400">
                        {isLoading
                            ? 'Carregando...'
                            : 'Tente ajustar os filtros ou registrar uma nova transação.'}
                    </p>
                </div>
            )}
        </div>
    )
}
