import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Filter, Loader2, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { AppShell } from '../components/AppShell'
import CategoryForm from '../components/Category/CategoryForm'
import CategoryList from '../components/Category/CategoryList'
import { extractApiErrorMessage } from '../lib/api-error'
import type { CreateCategoryFormData } from '../schemas/category-schema'
import { categoriesService } from '../services/category/category-service'
import type { ICategoryQueryRequest } from '../types/category'

function Category() {
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState<ICategoryQueryRequest>({
        pageNumber: 1,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const queryClient = useQueryClient()

    // Query para listar categorias
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['categories', filters],
        queryFn: () => categoriesService.list(filters),
    })

    // Mutation para criar categoria
    const createMutation = useMutation({
        mutationFn: categoriesService.create,
        onSuccess: (response) => {
            toast.success(response?.message ?? 'Categoria criada com sucesso')

            queryClient.invalidateQueries({
                queryKey: ['categories'],
                exact: false,
            })

            handleBackToList()
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    // Mutation para deletar categoria
    const deleteMutation = useMutation({
        mutationFn: categoriesService.delete,
        onSuccess: (response) => {
            toast.success(response?.message ?? 'Categoria excluída com sucesso')

            queryClient.invalidateQueries({
                queryKey: ['categories'],
                exact: false,
            })
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const handleAddCategory = () => {
        setShowForm(true)
    }

    const handleBackToList = () => {
        setShowForm(false)
    }

    const handleSubmit = (formData: CreateCategoryFormData) => {
        createMutation.mutate(formData)
    }

    const handleDeleteCategory = (categoryId: number) => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            deleteMutation.mutate(categoryId)
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
        })
    }

    const handlePageChange = (pageNumber: number) => {
        setFilters((prev) => ({
            ...prev,
            pageNumber,
        }))
    }

    const categories = data?.data?.items || []
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
                                {showForm ? 'Nova Categoria' : 'Categorias'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {showForm
                                    ? 'Cadastre uma nova categoria'
                                    : 'Gerencie todas as categorias do sistema'}
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
                                onClick={handleAddCategory}
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
                                Nova Categoria
                            </button>
                        </div>
                    )}
                </div>

                {/* Painel de filtros */}
                {!showForm && showFilterPanel && (
                    <div className="border-b bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-700">
                                Filtrar categorias
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
                            Erro ao carregar categorias.
                            <button
                                onClick={() => refetch()}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : showForm ? (
                        <CategoryForm
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={createMutation.isPending}
                        />
                    ) : (
                        <>
                            <CategoryList
                                categories={categories}
                                onDeleteCategory={handleDeleteCategory}
                                isLoading={isLoading}
                                isDeleting={deleteMutation.isPending}
                            />

                            {pagingInfo && pagingInfo.totalCount > 0 && (
                                <div className="mt-6 flex items-center justify-between border-t pt-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {categories.length} de{' '}
                                        {pagingInfo.totalCount} categorias
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

export default Category
