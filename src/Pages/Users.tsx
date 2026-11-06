import { useQuery } from '@tanstack/react-query'
import { Filter, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '../components/AppShell'
import { SetUserPasswordDialog } from '../components/Password/SetUserPasswordDialog'
import { Button } from '../components/ui/button'
import { FilterPanel } from '../components/ui/common/FilterPanel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import { Pagination } from '../components/ui/common/Pagination'
import { ChangeUserRoleDialog } from '../components/Users/ChangeUserRoleDialog'
import UserForm from '../components/Users/UserForm'
import UserList from '../components/Users/UserList'
import { useAuth } from '../contexts/AuthContext'
import { useCrudMutations } from '../hooks/use-crud-mutations'
import { queryKeys } from '../lib/query-keys'
import type { CreateUserFormData } from '../schemas/user-schema'
import { usersService } from '../services/users/users-service'
import type { IUser, IUserQueryRequest } from '../types/users'

function Users() {
    const { userId, roles } = useAuth()
    const [passwordUser, setPasswordUser] = useState<IUser | null>(null)
    const [roleUser, setRoleUser] = useState<IUser | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingUser, setEditingUser] = useState<IUser | null>(null)
    const [filters, setFilters] = useState<IUserQueryRequest>({
        pageNumber: 1,
        pageSize: 20,
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.users.list(filters),
        queryFn: () => usersService.list(filters),
    })

    const users = data?.data?.items || []
    const pagingInfo = data?.data

    const {
        createMutation,
        updateMutation,
        deleteMutation,
        isSaving,
        deletingId,
    } = useCrudMutations({
        service: usersService,
        messages: {
            created: 'Usuário cadastrado com sucesso',
            updated: 'Usuário atualizado com sucesso',
            deleted: 'Usuário excluído com sucesso',
        },
        invalidate: [queryKeys.users.all],
        onSaved: () => handleBackToList(),
        onDeleted: () => {
            // excluiu o último item da página: volta uma
            if (users.length === 1 && (pagingInfo?.pageNumber ?? 1) > 1) {
                handlePageChange(pagingInfo!.pageNumber - 1)
            }
        },
    })

    const handleAddUser = () => setShowForm(true)
    const handleEditUser = (user: IUser) => {
        setEditingUser(user)
        setShowForm(true)
    }
    const handleBackToList = () => {
        setShowForm(false)
        setEditingUser(null)
    }
    const handleSubmit = (formData: CreateUserFormData) => {
        if (editingUser) {
            updateMutation.mutate({
                id: editingUser.userId,
                data: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    age: formData.age,
                },
            })
        } else {
            const isAdmin = formData.role === 'Administrator'
            createMutation.mutate({
                role: formData.role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                age: formData.age,
                password: formData.password,
                passwordConfirm: formData.passwordConfirm,
                ...(isAdmin
                    ? { email: formData.email }
                    : { phoneNumber: formData.phoneNumber }),
            })
        }
    }
    const handleDeleteUser = (userId: string) => deleteMutation.mutate(userId)

    const handleApplySearch = () => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: 1,
            search: searchTerm || undefined,
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
                            ? editingUser
                                ? 'Editar Usuário'
                                : 'Cadastrar Usuário'
                            : 'Usuários'
                    }
                    description={
                        showForm
                            ? editingUser
                                ? 'Atualize os dados do usuário'
                                : 'Preencha os dados do novo usuário'
                            : 'Gerencie os usuários do sistema'
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
                            initialData={editingUser ?? undefined}
                            onSubmit={handleSubmit}
                            onCancel={handleBackToList}
                            isLoading={isSaving}
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
                                onEditUser={handleEditUser}
                                onDeleteUser={handleDeleteUser}
                                onSetPassword={setPasswordUser}
                                onChangeRole={setRoleUser}
                                deletingId={deletingId}
                                currentUserId={userId}
                                roles={roles}
                            />

                            {pagingInfo && (
                                <Pagination
                                    pageNumber={pagingInfo.pageNumber}
                                    pageSize={pagingInfo.pageSize}
                                    totalCount={pagingInfo.totalCount}
                                    itemCount={users.length}
                                    itemLabel="usuários"
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </PageState>
                    )}
                </div>
            </div>

            <SetUserPasswordDialog
                user={passwordUser}
                onClose={() => setPasswordUser(null)}
            />

            <ChangeUserRoleDialog
                user={roleUser}
                onClose={() => setRoleUser(null)}
            />
        </AppShell>
    )
}

export default Users
