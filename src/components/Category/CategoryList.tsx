import { Loader2, Trash2 } from 'lucide-react'

import type { ICategory } from '../../types/category'
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

interface CategoryListProps {
    categories: ICategory[]
    onDeleteCategory: (categoryId: number) => void
    isDeleting?: boolean
}

export function CategoryList({
    categories,
    onDeleteCategory,
    isDeleting,
}: CategoryListProps) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('pt-BR')

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Finalidade</TableHead>
                        <TableHead>Criada em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.categoryId}>
                            <TableCell className="font-medium">
                                #{category.categoryId}
                            </TableCell>

                            <TableCell>{category.description}</TableCell>

                            <TableCell>
                                <Badge variant="secondary">
                                    {category.purpose.name}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                {formatDate(category.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                <ConfirmDialog
                                    title="Excluir categoria"
                                    description="Essa ação não pode ser desfeita."
                                    confirmLabel="Excluir"
                                    onConfirm={() =>
                                        onDeleteCategory(category.categoryId)
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
