import { useQuery } from '@tanstack/react-query'
import { Filter } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '../components/AppShell'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FilterPanel } from '../components/ui/common/FilterPainel'
import { PageHeader } from '../components/ui/common/PageHeader'
import { PageState } from '../components/ui/common/PageState'
import { Input } from '../components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { dashboardService } from '../services/dashboard/dashboard-service'
import type { IDashboardSummaryQueryRequest } from '../types/dashboard'

function Dashboard() {
    const [filters, setFilters] = useState<IDashboardSummaryQueryRequest>({})
    const [startDateInput, setStartDateInput] = useState('')
    const [endDateInput, setEndDateInput] = useState('')
    const [showFilterPanel, setShowFilterPanel] = useState(false)

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard-summary', filters],
        queryFn: () => dashboardService.getSummary(filters),
    })

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount)

    const handleApplyFilters = () => {
        setFilters({
            startDate: startDateInput || undefined,
            endDate: endDateInput || undefined,
        })
    }

    const handleClearFilters = () => {
        setStartDateInput('')
        setEndDateInput('')
        setFilters({})
    }

    const summary = data?.data
    const byCategory = summary?.byCategory || []

    return (
        <AppShell>
            <div className="bg-white rounded-lg shadow">
                <PageHeader
                    title="Dashboard"
                    description="Resumo financeiro do período"
                    actions={
                        <Button
                            variant="outline"
                            onClick={() =>
                                setShowFilterPanel(!showFilterPanel)
                            }
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    }
                />

                {showFilterPanel && (
                    <div className="border-b p-4 bg-muted/30">
                        <FilterPanel
                            title="Filtrar por período"
                            onSearch={handleApplyFilters}
                            onClear={handleClearFilters}
                            onClose={() => setShowFilterPanel(false)}
                            extraFilters={
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="date"
                                        value={startDateInput}
                                        onChange={(e) =>
                                            setStartDateInput(e.target.value)
                                        }
                                    />
                                    <Input
                                        type="date"
                                        value={endDateInput}
                                        onChange={(e) =>
                                            setEndDateInput(e.target.value)
                                        }
                                    />
                                </div>
                            }
                        />
                    </div>
                )}

                <div className="p-6">
                    <PageState
                        isLoading={isLoading}
                        isError={!!error}
                        errorAction={
                            <Button variant="outline" onClick={() => refetch()}>
                                Tentar novamente
                            </Button>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Entradas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-semibold text-green-600">
                                        {formatCurrency(
                                            summary?.totalIncome || 0,
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Saídas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-semibold text-red-600">
                                        {formatCurrency(
                                            summary?.totalExpense || 0,
                                        )}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Saldo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p
                                        className={`text-2xl font-semibold ${
                                            (summary?.balance || 0) >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {formatCurrency(summary?.balance || 0)}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <PageState
                            isLoading={false}
                            isEmpty={byCategory.length === 0}
                            emptyTitle="Nenhum gasto por categoria no período"
                        >
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead className="text-right">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {byCategory.map((entry) => (
                                            <TableRow key={entry.categoryId}>
                                                <TableCell>
                                                    {entry.categoryDescription}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(
                                                        entry.total,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </PageState>
                    </PageState>
                </div>
            </div>
        </AppShell>
    )
}

export default Dashboard
