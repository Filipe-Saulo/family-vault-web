import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Filter, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { AppShell } from '../components/AppShell'
import CategoryForm from '../components/Category/CategoryForm'
import { CategoryList } from '../components/Category/CategoryList'
import { Button } from '../components/ui/button'
import { FilterPanel } from '../components/ui/common/FilterPainel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import { extractApiErrorMessage } from '../lib/api-error'
import type { CreateCategoryFormData } from '../schemas/category-schema'
import { categoriesService } from '../services/category/category-service'
import type { ICategoryQueryRequest } from '../types/category'

function Category() {
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState<ICategoryQueryRequest>({
        pageNumber: 1,
        pageSize: 20,
        description: undefined,
        categoryPurposeId: undefined,
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

    const handleDeleteCategory = (categoryId: number) => {
        deleteMutation.mutate(categoryId)
    }

    const categories = data?.data?.items || []
    const pagingInfo = data?.data

    return (
        <AppShell>
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <PageHeader
                    title={showForm ? 'Nova Categoria' : 'Categorias'}
                    description={
                        showForm
                            ? 'Cadastre uma nova categoria'
                            : 'Gerencie todas as categorias do sistema'
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
                                    onClick={handleAddCategory}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    Nova Categoria
                                </Button>
                            </>
                        )
                    }
                />

                {/* Painel de filtros */}
                {!showForm && showFilterPanel && (
                    <div className="border-b p-4 bg-muted/30">
                        <FilterPanel
                            title="Filtrar categorias"
                            searchValue={filters.description ?? ''}
                            onSearchValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    description: value || undefined,
                                    pageNumber: 1,
                                }))
                            }
                            onSearch={refetch}
                            onClear={() =>
                                setFilters({
                                    pageNumber: 1,
                                    pageSize: 20,
                                })
                            }
                            onClose={() => setShowFilterPanel(false)}
                        />
                    </div>
                )}

                {/* Conteúdo */}
                <div className="p-6">
                    {showForm ? (
                        <CategoryForm
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={createMutation.isPending}
                        />
                    ) : (
                        <PageState
                            isLoading={isLoading}
                            isError={!!error}
                            isEmpty={categories.length === 0}
                            emptyTitle="Nenhuma categoria encontrada"
                            emptyDescription="Tente ajustar os filtros ou cadastrar uma nova categoria."
                            emptyAction={
                                <Button onClick={handleAddCategory}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Categoria
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
                            <CategoryList
                                categories={categories}
                                onDeleteCategory={handleDeleteCategory}
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
                                        >
                                            Anterior
                                        </button>

                                        <span>
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

export default Category
