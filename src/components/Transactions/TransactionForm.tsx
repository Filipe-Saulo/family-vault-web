import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { type Resolver, useForm } from 'react-hook-form'

import { formatCurrency, parseCurrencyInput } from '../../lib/currency'
import { todayLocalISO } from '../../lib/date'
import { withCurrentCategory } from '../../lib/transaction-categories'
import { isCategoryCompatibleWithTransactionType } from '../../lib/transaction-compatibility'
import {
    buildTransactionSchema,
    type TransactionFormData,
} from '../../schemas/transaction-schema'
import { categoriesService } from '../../services/category/category-service'
import { transactionTypesService } from '../../services/transaction-type/transaction-type-service'
import { usersService } from '../../services/users/users-service'
import type { ICategory } from '../../types/category'
import type { ITransaction } from '../../types/transaction'
import type { ITransactionType } from '../../types/transaction-type'
import type { IUser } from '../../types/users'
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

const EMPTY_CATEGORIES: ICategory[] = []
const EMPTY_TRANSACTION_TYPES: ITransactionType[] = []
const EMPTY_USERS: IUser[] = []

export default function TransactionForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: TransactionFormProps) {
    const isEdit = Boolean(initialData)

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories', 'lookup'],
        queryFn: () => categoriesService.lookup(),
    })

    const { data: typesData, isLoading: typesLoading } = useQuery({
        queryKey: ['transaction-types', { isActive: true }],
        queryFn: () => transactionTypesService.list({ isActive: true }),
    })

    // a API exige o dono quando quem cria é o admin; a edição mantém o dono.
    // 100 é o máximo por página da API
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['users', 'lookup'],
        queryFn: () => usersService.list({ pageSize: 100 }),
        enabled: !isEdit,
    })
    const users = usersData?.data?.items ?? EMPTY_USERS

    const lookupCategories = categoriesData?.data ?? EMPTY_CATEGORIES
    // o lookup do admin traz só as globais; a categoria pessoal do dono da
    // transação editada precisa continuar selecionável
    const categories = useMemo(
        () => withCurrentCategory(lookupCategories, initialData?.category),
        [lookupCategories, initialData?.category],
    )
    const transactionTypes = typesData?.data ?? EMPTY_TRANSACTION_TYPES

    const resolver = useMemo(
        () =>
            zodResolver(
                buildTransactionSchema(categories, transactionTypes, {
                    requireUser: !isEdit,
                }),
            ) as Resolver<TransactionFormData>,
        [categories, transactionTypes, isEdit],
    )

    const form = useForm<TransactionFormData>({
        // cast works around a zod v4 / @hookform/resolvers v5 generic
        // inference mismatch on z.coerce fields
        resolver,
        defaultValues: {
            description: '',
            amount: 0,
            transactionDate: todayLocalISO(),
            categoryId: 0,
            transactionTypeId: 0,
            userId: '',
        },
        mode: 'onChange',
    })

    const { reset } = form

    useEffect(() => {
        if (initialData) {
            reset({
                description: initialData.description,
                amount: initialData.amount,
                transactionDate: initialData.transactionDate.split('T')[0],
                categoryId: initialData.category.categoryId,
                transactionTypeId:
                    initialData.transactionType.transactionTypeId,
            })
        }
    }, [initialData, reset])

    const selectedTransactionTypeId = form.watch('transactionTypeId')
    const selectedCategoryId = form.watch('categoryId')

    const selectedTransactionType = transactionTypes.find(
        (t) => t.transactionTypeId === selectedTransactionTypeId,
    )

    const visibleCategories = useMemo(() => {
        if (!selectedTransactionType) return categories

        const compatible = categories.filter((c) =>
            isCategoryCompatibleWithTransactionType(c, selectedTransactionType),
        )
        const current = categories.find(
            (c) => c.categoryId === selectedCategoryId,
        )
        if (
            current &&
            !compatible.some((c) => c.categoryId === current.categoryId)
        ) {
            return [...compatible, current]
        }
        return compatible
    }, [categories, selectedTransactionType, selectedCategoryId])

    const handleFormSubmit = (data: TransactionFormData) => {
        onSubmit(data)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Usuário (só na criação) */}
                        {!isEdit && (
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usuário *</FormLabel>
                                        <Select
                                            value={field.value ?? ''}
                                            onValueChange={field.onChange}
                                            disabled={usersLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o usuário" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem
                                                        key={user.userId}
                                                        value={user.userId}
                                                    >
                                                        {user.fullName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Tipo */}
                        <FormField
                            control={form.control}
                            name="transactionTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo *</FormLabel>
                                    <Select
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : ''
                                        }
                                        onValueChange={(value) => {
                                            const newTypeId = Number(value)
                                            field.onChange(newTypeId)

                                            const newType =
                                                transactionTypes.find(
                                                    (t) =>
                                                        t.transactionTypeId ===
                                                        newTypeId,
                                                )
                                            const currentCategory =
                                                categories.find(
                                                    (c) =>
                                                        c.categoryId ===
                                                        form.getValues(
                                                            'categoryId',
                                                        ),
                                                )
                                            if (
                                                newType &&
                                                currentCategory &&
                                                !isCategoryCompatibleWithTransactionType(
                                                    currentCategory,
                                                    newType,
                                                )
                                            ) {
                                                form.setValue('categoryId', 0, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                })
                                            }
                                        }}
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
                                            inputMode="numeric"
                                            placeholder="R$ 0,00"
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={
                                                field.value
                                                    ? formatCurrency(
                                                          Number(field.value),
                                                      )
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseCurrencyInput(
                                                        e.target.value,
                                                    ),
                                                )
                                            }
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
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : ''
                                        }
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
                                            {visibleCategories.map(
                                                (category) => (
                                                    <SelectItem
                                                        key={
                                                            category.categoryId
                                                        }
                                                        value={String(
                                                            category.categoryId,
                                                        )}
                                                    >
                                                        {category.description}
                                                    </SelectItem>
                                                ),
                                            )}
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
