import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { type Resolver, useForm } from 'react-hook-form'

import {
    type TransactionFormData,
    transactionSchema,
} from '../../schemas/transaction-schema'
import { categoriesService } from '../../services/category/category-service'
import { transactionTypesService } from '../../services/transaction-type/transaction-type-service'
import type { ITransaction } from '../../types/transaction'
import { FormActions } from '../ui/common/FormActions'
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

interface TransactionFormProps {
    initialData?: ITransaction
    onSubmit: (data: TransactionFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

export default function TransactionForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: TransactionFormProps) {
    const isEdit = Boolean(initialData)

    const form = useForm<TransactionFormData>({
        // cast works around a zod v4 / @hookform/resolvers v5 generic
        // inference mismatch on z.coerce fields
        resolver: zodResolver(
            transactionSchema,
        ) as Resolver<TransactionFormData>,
        defaultValues: {
            description: '',
            amount: 0,
            transactionDate: new Date().toISOString().split('T')[0],
            categoryId: 0,
            transactionTypeId: 0,
        },
        mode: 'onChange',
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                description: initialData.description,
                amount: initialData.amount,
                transactionDate: initialData.transactionDate.split('T')[0],
                categoryId: initialData.category.categoryId,
                transactionTypeId:
                    initialData.transactionType.transactionTypeId,
            })
        }
    }, [initialData])

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories', { pageNumber: 1, pageSize: 1000 }],
        queryFn: () =>
            categoriesService.list({ pageNumber: 1, pageSize: 1000 }),
    })

    const { data: typesData, isLoading: typesLoading } = useQuery({
        queryKey: ['transaction-types', { isActive: true }],
        queryFn: () => transactionTypesService.list({ isActive: true }),
    })

    const categories = categoriesData?.data?.items || []
    const transactionTypes = typesData?.data || []

    const handleFormSubmit = (data: TransactionFormData) => {
        onSubmit({
            ...data,
            transactionDate: new Date(data.transactionDate).toISOString(),
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tipo */}
                        <FormField
                            control={form.control}
                            name="transactionTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo *</FormLabel>
                                    <Select
                                        value={String(field.value)}
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        disabled={typesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {transactionTypes.map((type) => (
                                                <SelectItem
                                                    key={type.transactionTypeId}
                                                    value={String(
                                                        type.transactionTypeId,
                                                    )}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Descrição */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Descrição *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Supermercado, Conta de luz..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Valor */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor (R$) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0,00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Data */}
                        <FormField
                            control={form.control}
                            name="transactionDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Categoria */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria *</FormLabel>
                                    <Select
                                        value={String(field.value)}
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                        disabled={categoriesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.categoryId}
                                                    value={String(
                                                        category.categoryId,
                                                    )}
                                                >
                                                    {category.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormActions
                        onCancel={onCancel}
                        onSubmitLabel={
                            isEdit ? 'Salvar Alterações' : 'Salvar Transação'
                        }
                        isSubmitting={isLoading}
                        submitDisabled={!form.formState.isValid}
                    />
                </form>
            </Form>
        </div>
    )
}
