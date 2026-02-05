import { Loader2, Trash2 } from 'lucide-react'

import type { ICategory } from '../../types/category'
import { Button } from '../ui/button'
import { ConfirmDialog } from '../ui/common/ConfirmDialog'

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
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Finalidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Criada em
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                        <tr
                            key={category.categoryId}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{category.categoryId}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-900">
                                {category.description}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {category.purpose.name}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(category.createdAt)}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
