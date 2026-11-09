import { useCallback, useEffect, useState } from 'react'

// Contagem regressiva em segundos; start() reinicia a partir de `seconds`.
export function useCountdown(seconds: number) {
    const [left, setLeft] = useState(0)

    useEffect(() => {
        if (left <= 0) return
        const id = setTimeout(() => setLeft((s) => s - 1), 1000)
        return () => clearTimeout(id)
    }, [left])

    const start = useCallback(() => setLeft(seconds), [seconds])

    return { left, start }
}
