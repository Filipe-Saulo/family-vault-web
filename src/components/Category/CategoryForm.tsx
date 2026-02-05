import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    type CreateCategoryFormData,
    createCategorySchema,
} from '../../schemas/category-schema'
import { FormActions } from '../ui/common/FormActions'

interface CategoryFormProps {
    onSubmit: (data: CreateCategoryFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

// Mock data - você vai substituir por chamadas à API
// Precisará criar um serviço para buscar categoryPurposes
const categoryPurposes = [
    { id: 1, name: 'Essencial' },
    { id: 2, name: 'Opcional' },
    { id: 3, name: 'Investimento' },
]

export default function CategoryForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: CategoryFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<CreateCategoryFormData>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            description: '',
            categoryPurposeId: 1,
        },
        mode: 'onChange',
    })

    const categoryPurposeId = watch('categoryPurposeId')
    const selectedPurpose = categoryPurposes.find(
        (p) => p.id === categoryPurposeId,
    )

    const handleFormSubmit = (data: CreateCategoryFormData) => {
        onSubmit(data)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 gap-6">
                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Alimentação, Transporte, Lazer..."
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.description
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Finalidade da Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Finalidade *
                        </label>
                        <select
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.categoryPurposeId
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('categoryPurposeId')}
                        >
                            {categoryPurposes.map((purpose) => (
                                <option key={purpose.id} value={purpose.id}>
                                    {purpose.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryPurposeId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.categoryPurposeId.message}
                            </p>
                        )}
                        {selectedPurpose && (
                            <p className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">
                                    Finalidade selecionada:
                                </span>{' '}
                                {selectedPurpose.name}
                            </p>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-medium text-gray-700 mb-2">
                            Informações da Categoria
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Descrição
                                </p>
                                <p className="font-medium text-gray-900">
                                    {watch('description') || 'Não informada'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Finalidade
                                </p>
                                <p className="font-medium text-gray-900">
                                    {selectedPurpose?.name || 'Não selecionada'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Criada por
                                </p>
                                <p className="font-medium text-gray-900">
                                    Sistema (usuário atual)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <FormActions
                    onCancel={onCancel}
                    onSubmitLabel="Salvar Categoria"
                    isSubmitting={isLoading}
                    submitDisabled={!isValid}
                />
            </form>
        </div>
    )
}
