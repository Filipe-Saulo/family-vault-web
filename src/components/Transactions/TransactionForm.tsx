import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import {
    type CreateTransactionFormData,
    createTransactionSchema,
} from '../../schemas/transaction-schema'
import { usersService } from '../../services/users/users-service'
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
    onSubmit: (data: CreateTransactionFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

const mockCategories = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Lazer' },
]

const transactionTypes = [
    { id: 1, name: 'Entrada', hint: 'Dinheiro entrando' },
    { id: 2, name: 'Saída', hint: 'Dinheiro saindo' },
]

export default function TransactionForm({
    onSubmit,
    onCancel,
    isLoading = false,
}: TransactionFormProps) {
    const form = useForm<CreateTransactionFormData>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            userId: '',
            description: '',
            amount: 0,
            transactionDate: new Date().toISOString().split('T')[0],
            categoryId: 1,
            transactionTypeId: 2,
        },
        mode: 'onChange',
    })

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['users', { pageNumber: 1, pageSize: 1000 }],
        queryFn: () => usersService.list({ pageNumber: 1, pageSize: 1000 }),
    })

    const users = usersData?.data?.items || []
    const transactionTypeId = form.watch('transactionTypeId')
    const selectedType = transactionTypes.find(
        (t) => t.id === transactionTypeId,
    )

    const handleFormSubmit = (data: CreateTransactionFormData) => {
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
                        {/* Usuário */}
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuário *</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={usersLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um usuário" />
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
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {transactionTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={String(type.id)}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {selectedType && (
                                        <p className="text-xs text-muted-foreground">
                                            {selectedType.hint}
                                        </p>
                                    )}
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
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockCategories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
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
                        onSubmitLabel="Salvar Transação"
                        isSubmitting={isLoading}
                        submitDisabled={!form.formState.isValid}
                    />
                </form>
            </Form>
        </div>
    )
}
