import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FilterPanel } from './FilterPanel'

function renderPanel(isSearching = false) {
    const onSearch = vi.fn()
    const onClear = vi.fn()
    const onClose = vi.fn()
    render(
        <FilterPanel
            searchValue=""
            onSearchValueChange={() => {}}
            onSearch={onSearch}
            onClear={onClear}
            onClose={onClose}
            isSearching={isSearching}
            extraFilters={<input aria-label="Data inicial" type="date" />}
        />,
    )
    return { onSearch, onClear, onClose }
}

describe('FilterPanel', () => {
    it('Enter na busca aplica os filtros', async () => {
        const { onSearch } = renderPanel()

        await userEvent.type(screen.getByLabelText('Buscar'), 'mercado{Enter}')

        expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('Enter num filtro extra também aplica', async () => {
        const { onSearch } = renderPanel()

        await userEvent.type(screen.getByLabelText('Data inicial'), '{Enter}')

        expect(onSearch).toHaveBeenCalledTimes(1)
    })

    it('Limpar e fechar não aplicam os filtros', async () => {
        const { onSearch, onClear, onClose } = renderPanel()

        await userEvent.click(screen.getByRole('button', { name: 'Limpar' }))
        await userEvent.click(
            screen.getByRole('button', { name: 'Fechar filtros' }),
        )

        expect(onClear).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onSearch).not.toHaveBeenCalled()
    })

    it('Enter não aplica enquanto a busca anterior roda', async () => {
        const { onSearch } = renderPanel(true)

        await userEvent.type(screen.getByLabelText('Buscar'), '{Enter}')

        expect(onSearch).not.toHaveBeenCalled()
    })
})
