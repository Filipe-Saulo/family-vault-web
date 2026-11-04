const PURE_DATE = /^(\d{4})-(\d{2})-(\d{2})/

function pad(value: number): string {
    return String(value).padStart(2, '0')
}

// Data de hoje (YYYY-MM-DD) no fuso local, sem passar por toISOString (UTC).
export function todayLocalISO(now: Date = new Date()): string {
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// Formata uma data pura (YYYY-MM-DD, aceita sufixo "T...") como dd/MM/yyyy
// sem criar um Date, para não deslocar o dia conforme o fuso.
export function formatDateOnly(value: string): string {
    const match = PURE_DATE.exec(value)
    if (!match) return value
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
}

// Para campos de data e hora (ex.: createdAt), que são instantes reais.
export function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('pt-BR')
}
