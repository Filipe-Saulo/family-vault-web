interface InfoRowProps {
    label: string
    value?: string | null
}

export function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">
                {value && value.trim() !== '' ? value : '—'}
            </p>
        </div>
    )
}
