import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEMO_EMAIL, DEMO_PASSWORD } from '../lib/demo'
import Login from './Login'

const login = vi.fn()

vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({ login, user: null }),
}))

function renderLogin() {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>,
    )
}

describe('Login: conta demo', () => {
    beforeEach(() => {
        login.mockReset()
        login.mockResolvedValue(undefined)
    })

    it('mostra as credenciais públicas da demo', () => {
        renderLogin()

        expect(screen.getByText(DEMO_EMAIL)).toBeInTheDocument()
        expect(screen.getByText(DEMO_PASSWORD)).toBeInTheDocument()
        expect(screen.getByText(/somente leitura/i)).toBeInTheDocument()
    })

    it('"Entrar como demo" entra com as credenciais da demo', async () => {
        renderLogin()

        await userEvent.click(
            screen.getByRole('button', { name: 'Entrar como demo' }),
        )

        expect(login).toHaveBeenCalledWith(DEMO_EMAIL, DEMO_PASSWORD)
    })

    it('o formulário continua entrando com o que foi digitado', async () => {
        renderLogin()

        await userEvent.type(
            screen.getByLabelText('E-mail'),
            'admin@exemplo.com',
        )
        await userEvent.type(screen.getByLabelText('Senha'), 'Senha@123')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

        expect(login).toHaveBeenCalledWith('admin@exemplo.com', 'Senha@123')
    })
})
