import { act, fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import UserForm from './UserForm'

const PHONE_ERROR = 'Telefone é obrigatório para Usuário'

function renderForm() {
    render(
        <StrictMode>
            <UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />
        </StrictMode>,
    )
}

describe('UserForm (cadastro)', () => {
    it('abre sem erro de telefone na tela', async () => {
        renderForm()
        // deixa o efeito do papel e a validação assíncrona terminarem
        await act(async () => {})
        expect(screen.queryByText(PHONE_ERROR)).toBeNull()
    })

    it('mostra o erro de telefone depois de tocar no campo', async () => {
        renderForm()
        const phone = screen.getByPlaceholderText(/telefone|\(\d/i)
        fireEvent.focus(phone)
        fireEvent.blur(phone)
        expect(await screen.findByText(PHONE_ERROR)).toBeTruthy()
    })
})
