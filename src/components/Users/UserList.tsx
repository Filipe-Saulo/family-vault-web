import { Loader2, Pencil, Trash2 } from 'lucide-react'

import { hasRole } from '../../lib/permissions'
import type { IUser } from '../../types/users'
import { Button } from '../ui/button'
import { ConfirmDialog } from '../ui/common/ConfirmDialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'

interface UserListProps {
    users: IUser[]
    onEditUser: (user: IUser) => void
    onDeleteUser: (userId: string) => void
    isDeleting?: boolean
    currentUserId: string | null
    roles: string[]
}

export default function UserList({
    users,
    onEditUser,
    onDeleteUser,
    isDeleting,
    currentUserId,
    roles,
}: UserListProps) {
    const canModify = (user: IUser) =>
        hasRole(roles, 'Administrator') || user.userId === currentUserId

    const formatPhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        }
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        }
        return phone
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell className="font-medium">
                                {user.fullName ||
                                    `${user.firstName} ${user.lastName}`}
                            </TableCell>

                            <TableCell>
                                {formatPhone(user.phoneNumber)}
                            </TableCell>

                            <TableCell>{user.email || '-'}</TableCell>

                            <TableCell>{user.age} anos</TableCell>

                            <TableCell className="text-right">
                                {canModify(user) && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditUser(user)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>

                                        <ConfirmDialog
                                            title="Excluir usuário"
                                            description="Essa ação não pode ser desfeita."
                                            confirmLabel="Excluir"
                                            onConfirm={() =>
                                                onDeleteUser(user.userId)
                                            }
                                            trigger={
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                    )}
                                                    Excluir
                                                </Button>
                                            }
                                        />
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
