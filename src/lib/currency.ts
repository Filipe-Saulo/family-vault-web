const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export function formatCurrency(value: number): string {
    return currencyFormatter.format(value)
}

// máscara de moeda igual à do app: os dígitos digitados são centavos
// ("12345" → 123,45); sem dígitos, volta 0
export function parseCurrencyInput(text: string): number {
    const digits = text.replace(/\D/g, '')
    return digits ? Number(digits) / 100 : 0
}
