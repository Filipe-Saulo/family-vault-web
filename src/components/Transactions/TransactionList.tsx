import { Loader2, Pencil, Trash2 } from 'lucide-react'

import { hasPermission, hasRole } from '../../lib/permissions'
import type { ITransaction } from '../../types/transaction'
import { Badge } from '../ui/badge'
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

interface TransactionListProps {
    transactions: ITransaction[]
    onEditTransaction: (transaction: ITransaction) => void
    onDeleteTransaction: (transactionId: number) => void
    isDeleting?: boolean
    currentUserId: string | null
    roles: string[]
    permissions: string[]
}

export default function TransactionList({
    transactions,
    onEditTransaction,
    onDeleteTransaction,
    isDeleting,
    currentUserId,
    roles,
    permissions,
}: TransactionListProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('pt-BR')

    const isIncome = (transaction: ITransaction) =>
        transaction.transactionType.name === 'Receita'

    const canModify = (transaction: ITransaction) =>
        hasRole(roles, 'Administrator') ||
        hasPermission(permissions, 'ManageTransactions') ||
        transaction.userId === currentUserId

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.transactionId}>
                            <TableCell className="font-medium">
                                {formatDate(transaction.transactionDate)}
                            </TableCell>

                            <TableCell>{transaction.description}</TableCell>

                            <TableCell>
                                <div>{transaction.category.description}</div>
                                <div className="text-xs text-muted-foreground">
                                    {transaction.category.purpose.name}
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant={
                                        isIncome(transaction)
                                            ? 'secondary'
                                            : 'destructive'
                                    }
                                >
                                    {isIncome(transaction)
                                        ? 'Entrada'
                                        : 'Saída'}
                                </Badge>
                            </TableCell>

                            <TableCell
                                className={
                                    isIncome(transaction)
                                        ? 'text-green-600 font-medium'
                                        : 'text-red-600 font-medium'
                                }
                            >
                                {formatCurrency(transaction.amount)}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDate(transaction.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                {canModify(transaction) && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onEditTransaction(transaction)
                                            }
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>

                                        <ConfirmDialog
                                            title="Excluir transação"
                                            description="Essa ação não pode ser desfeita."
                                            confirmLabel="Excluir"
                                            onConfirm={() =>
                                                onDeleteTransaction(
                                                    transaction.transactionId,
                                                )
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
