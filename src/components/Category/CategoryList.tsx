import { Loader2, Trash2 } from 'lucide-react'

import type { ICategory } from '../../types/category'

interface CategoryListProps {
    categories: ICategory[]
    onDeleteCategory: (categoryId: number) => void
    isLoading?: boolean
    isDeleting?: boolean
}

export default function CategoryList({
    categories,
    onDeleteCategory,
    isLoading,
    isDeleting,
}: CategoryListProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    #{category.categoryId}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {category.description}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        category.purpose.name === 'Essencial'
                                            ? 'bg-green-100 text-green-800'
                                            : category.purpose.name ===
                                                'Opcional'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {category.purpose.name}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                    {formatDate(category.createdAt)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() =>
                                        onDeleteCategory(category.categoryId)
                                    }
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

            {categories.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        Nenhuma categoria encontrada.
                    </p>
                    <p className="text-sm text-gray-400">
                        {isLoading
                            ? 'Carregando...'
                            : 'Tente ajustar os filtros ou cadastrar uma nova categoria.'}
                    </p>
                </div>
            )}
        </div>
    )
}
