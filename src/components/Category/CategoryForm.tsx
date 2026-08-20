import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { type Resolver, useForm } from 'react-hook-form'

import {
    type CreateCategoryFormData,
    createCategorySchema,
} from '../../schemas/category-schema'
import { categoryPurposesService } from '../../services/category-purpose/category-purpose-service'
import type { ICategory } from '../../types/category'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { FormActions } from '../ui/common/FormActions'
import { InfoRow } from '../ui/common/InfoRow'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

interface CategoryFormProps {
    initialData?: ICategory
    onSubmit: (data: CreateCategoryFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

export default function CategoryForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: CategoryFormProps) {
    const isEdit = Boolean(initialData)

    const form = useForm<CreateCategoryFormData>({
        // cast works around a zod v4 / @hookform/resolvers v5 generic
        // inference mismatch on z.coerce fields
        resolver: zodResolver(
            createCategorySchema,
        ) as Resolver<CreateCategoryFormData>,
        mode: 'onChange',
        defaultValues: {
            description: '',
            categoryPurposeId: 0,
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                description: initialData.description,
                categoryPurposeId: initialData.categoryPurposeId,
            })
        }
    }, [initialData])

    const { data: purposesData, isLoading: purposesLoading } = useQuery({
        queryKey: ['category-purposes', { isActive: true }],
        queryFn: () => categoryPurposesService.list({ isActive: true }),
    })

    const categoryPurposes = purposesData?.data || []

    const description = form.watch('description')
    const categoryPurposeId = form.watch('categoryPurposeId')
    const selectedPurpose = categoryPurposes.find(
        (p) => p.categoryPurposeId === categoryPurposeId,
    )

    return (
        <div className="max-w-2xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Campos */}
                    <div className="grid gap-6">
                        {/* Descrição */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Alimentação, Transporte, Lazer..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Finalidade */}
                        <FormField
                            control={form.control}
                            name="categoryPurposeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Finalidade *</FormLabel>
                                    <Select
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : ''
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        disabled={purposesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a finalidade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoryPurposes.map((purpose) => (
                                                <SelectItem
                                                    key={
                                                        purpose.categoryPurposeId
                                                    }
                                                    value={String(
                                                        purpose.categoryPurposeId,
                                                    )}
                                                >
                                                    {purpose.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Preview / Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Categoria</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InfoRow
                                label="Descrição"
                                value={description || 'Não informada'}
                            />
                            <InfoRow
                                label="Finalidade"
                                value={
                                    selectedPurpose?.name || 'Não selecionada'
                                }
                            />
                            <InfoRow
                                label="Criada por"
                                value="Sistema (usuário atual)"
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <FormActions
                        onCancel={onCancel}
                        onSubmitLabel={
                            isEdit ? 'Salvar Alterações' : 'Salvar Categoria'
                        }
                        isSubmitting={isLoading}
                        submitDisabled={!form.formState.isValid}
                    />
                </form>
            </Form>
        </div>
    )
}
