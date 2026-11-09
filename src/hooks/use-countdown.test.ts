import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCountdown } from './use-countdown'

function pass(seconds: number) {
    for (let i = 0; i < seconds; i++) {
        act(() => {
            vi.advanceTimersByTime(1000)
        })
    }
}

describe('useCountdown', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('começa em 0, conta 60 s e para em 0', () => {
        const { result } = renderHook(() => useCountdown(60))
        expect(result.current.left).toBe(0)

        act(() => result.current.start())
        expect(result.current.left).toBe(60)

        pass(15)
        expect(result.current.left).toBe(45)

        pass(60)
        expect(result.current.left).toBe(0)
    })
})
