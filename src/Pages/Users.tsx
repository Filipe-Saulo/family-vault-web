import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Filter, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { AppShell } from '../components/AppShell'
import { Button } from '../components/ui/button'
import { FilterPanel } from '../components/ui/common/FilterPainel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import UserForm from '../components/Users/UserForm'
import UserList from '../components/Users/UserList'
import { extractApiErrorMessage } from '../lib/api-error'
import type { CreateUserFormData } from '../schemas/user-schema'
import { usersService } from '../services/users/users-service'
import type { IUserQueryRequest } from '../types/users'

function Users() {
    const [showForm, setShowForm] = useState(false)
    const [filters, setFilters] = useState<IUserQueryRequest>({
        pageNumber: 1,
        pageSize: 20,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const queryClient = useQueryClient()

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['users', filters],
        queryFn: () => usersService.list(filters),
    })

    const createMutation = useMutation({
        mutationFn: usersService.create,
        onSuccess: (response) => {
            toast.success(response?.message ?? 'Usuário cadastrado com sucesso')
            queryClient.invalidateQueries({
                queryKey: ['users'],
                exact: false,
            })
            handleBackToList()
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: usersService.delete,
        onSuccess: (response) => {
            toast.success(response?.message ?? 'Usuário excluído com sucesso')
            queryClient.invalidateQueries({
                queryKey: ['users'],
                exact: false,
            })
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error))
        },
    })

    const handleAddUser = () => setShowForm(true)
    const handleBackToList = () => setShowForm(false)
    const handleSubmit = (formData: CreateUserFormData) =>
        createMutation.mutate(formData)
    const handleDeleteUser = (userId: string) => deleteMutation.mutate(userId)

    const handleApplySearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: 1,
            firstName: searchTerm || undefined,
            fullName: searchTerm || undefined,
            phoneNumber: searchTerm || undefined,
            email: searchTerm || undefined,
        }))
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setFilters({ pageNumber: 1, pageSize: 20 })
    }

    const handlePageChange = (pageNumber: number) => {
        setFilters((prev) => ({ ...prev, pageNumber }))
    }

    const users = data?.data?.items || []
    const pagingInfo = data?.data

    return (
        <AppShell>
            <div className="bg-white rounded-lg shadow">
                <PageHeader
                    title={showForm ? 'Cadastrar Usuário' : 'Usuários'}
                    description={
                        showForm
                            ? 'Preencha os dados do novo usuário'
                            : 'Gerencie os usuários do sistema'
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
                                    onClick={handleAddUser}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    Adicionar Usuário
                                </Button>
                            </>
                        )
                    }
                />

                {!showForm && showFilterPanel && (
                    <div className="border-b p-4 bg-muted/30">
                        <FilterPanel
                            title="Filtrar usuários"
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
                        <UserForm
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={createMutation.isPending}
                        />
                    ) : (
                        <PageState
                            isLoading={isLoading}
                            isError={!!error}
                            isEmpty={users.length === 0}
                            emptyTitle="Nenhum usuário encontrado"
                            emptyDescription="Tente ajustar os filtros ou cadastrar um novo usuário."
                            emptyAction={
                                <Button onClick={handleAddUser}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Usuário
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
                            <UserList
                                users={users}
                                onDeleteUser={handleDeleteUser}
                                isDeleting={deleteMutation.isPending}
                            />

                            {pagingInfo && pagingInfo.totalCount > 0 && (
                                <div className="mt-6 flex items-center justify-between border-t pt-6">
                                    <div className="text-sm text-gray-600">
                                        Mostrando {users.length} de{' '}
                                        {pagingInfo.totalCount} usuários
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

export default Users
