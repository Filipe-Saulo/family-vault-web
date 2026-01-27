import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import {
    type CreateTransactionFormData,
    createTransactionSchema,
} from '../../schemas/transaction-schema'
import { usersService } from '../../services/users/users-service'

interface TransactionFormProps {
    onSubmit: (data: CreateTransactionFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

export default function TransactionForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            userId: '',
            description: '',
            amount: 0,
            transactionDate: new Date().toISOString().split('T')[0],
            categoryId: 1,
            transactionTypeId: 2,
        },
        mode: 'onChange',
    })

    // Buscar usuários
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['users', { pageNumber: 1, pageSize: 1000 }],
        queryFn: () => usersService.list({ pageNumber: 1, pageSize: 1000 }),
    })

    const users = usersData?.data?.items || []

    const transactionTypeId = watch('transactionTypeId')

    const handleFormSubmit = (data: CreateTransactionFormData) => {
        onSubmit({
            ...data,
            transactionDate: new Date(data.transactionDate).toISOString(),
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Usuário */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuário *
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.userId
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('userId')}
                            disabled={usersLoading}
                        >
                            <option value="">Selecione um usuário</option>
                            {users.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                    {user.fullName}
                                </option>
                            ))}
                        </select>
                        {errors.userId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.userId.message}
                            </p>
                        )}
                    </div>

                    {/* Descrição */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Supermercado, Conta de luz..."
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.description
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor (R$) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">
                                R$
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0,00"
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    errors.amount
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                                {...register('amount')}
                            />
                        </div>
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data *
                        </label>
                        <div className="relative">
                            <Calendar
                                className="absolute left-3 top-2.5 text-gray-400"
                                size={18}
                            />
                            <input
                                type="date"
                                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    errors.transactionDate
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                }`}
                                {...register('transactionDate')}
                            />
                        </div>
                        {errors.transactionDate && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.transactionDate.message}
                            </p>
                        )}
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria *
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.categoryId
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('categoryId')}
                        >
                            <option value={1}>Alimentação</option>
                            <option value={2}>Transporte</option>
                            <option value={3}>Lazer</option>
                        </select>
                        {errors.categoryId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.categoryId.message}
                            </p>
                        )}
                    </div>

                    {/* Tipo de Transação */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo *
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.transactionTypeId
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('transactionTypeId')}
                        >
                            <option value={1}>Entrada</option>
                            <option value={2}>Saída</option>
                        </select>
                        {errors.transactionTypeId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.transactionTypeId.message}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {transactionTypeId === 1
                                ? 'Dinheiro entrando'
                                : 'Dinheiro saindo'}
                        </p>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && (
                            <Loader2 className="animate-spin" size={16} />
                        )}
                        Salvar Transação
                    </button>
                </div>
            </form>
        </div>
    )
}
