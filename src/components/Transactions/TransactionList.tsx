import { Loader2, Trash2 } from 'lucide-react'

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
    onDeleteTransaction: (transactionId: number) => void
    isDeleting?: boolean
}

export default function TransactionList({
    transactions,
    onDeleteTransaction,
    isDeleting,
}: TransactionListProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('pt-BR')

    const isIncome = (transaction: ITransaction) =>
        transaction.transactionType.name === 'Income'

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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
