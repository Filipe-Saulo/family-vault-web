import { Loader2, Trash2 } from 'lucide-react'

import type { IUser } from '../../types/users'

interface UserListProps {
    users: IUser[]
    onDeleteUser: (userId: string) => void
    isLoading?: boolean
    isDeleting?: boolean
}

export default function UserList({
    users,
    onDeleteUser,
    isLoading,
    isDeleting,
}: UserListProps) {
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
                            Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Idade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.fullName ||
                                        `${user.firstName} ${user.lastName}`}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user.firstName} {user.lastName}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {formatPhone(user.phoneNumber)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {user.email || '-'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {user.age} anos
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onDeleteUser(user.userId)}
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

            {users.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        Nenhum usuário encontrado.
                    </p>
                    <p className="text-sm text-gray-400">
                        {isLoading
                            ? 'Carregando...'
                            : 'Tente ajustar os filtros ou cadastrar um novo usuário.'}
                    </p>
                </div>
            )}
        </div>
    )
}
