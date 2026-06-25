import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    type CreateCategoryFormData,
    createCategorySchema,
} from '../../schemas/category-schema'
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
    onSubmit: (data: CreateCategoryFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

// mock — depois vira service
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
    const form = useForm<CreateCategoryFormData>({
        resolver: zodResolver(createCategorySchema),
        mode: 'onChange',
        defaultValues: {
            description: '',
            categoryPurposeId: 1,
        },
    })

    const description = form.watch('description')
    const categoryPurposeId = form.watch('categoryPurposeId')
    const selectedPurpose = categoryPurposes.find(
        (p) => p.id === categoryPurposeId,
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
                                        value={String(field.value)}
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a finalidade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoryPurposes.map((purpose) => (
                                                <SelectItem
                                                    key={purpose.id}
                                                    value={String(purpose.id)}
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
                        onSubmitLabel="Salvar Categoria"
                        isSubmitting={isLoading}
                        submitDisabled={!form.formState.isValid}
                    />
                </form>
            </Form>
        </div>
    )
}
