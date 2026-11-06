import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usersService } from '../../services/users/users-service'
import type { IUser } from '../../types/users'
import { ChangeUserRoleDialog } from './ChangeUserRoleDialog'

vi.mock('../../services/users/users-service', () => ({
    usersService: { changeRole: vi.fn() },
}))

// conta sem papel: o select começa em Usuário e dá para enviar sem abrir o Radix Select
const accountWithoutPhone: IUser = {
    userId: '2',
    firstName: 'Ana',
    lastName: 'Ribeiro',
    fullName: 'Ana Ribeiro',
    phoneNumber: null,
    email: 'ana@example.com',
    age: 34,
    role: null,
}

function renderDialog(user: IUser, onClose = vi.fn()) {
    render(
        <QueryClientProvider client={new QueryClient()}>
            <ChangeUserRoleDialog user={user} onClose={onClose} />
        </QueryClientProvider>,
    )
    return onClose
}

const submitButton = () => screen.getByRole('button', { name: 'Alterar papel' })

describe('ChangeUserRoleDialog', () => {
    beforeEach(() => {
        vi.mocked(usersService.changeRole).mockReset()
    })

    it('avisa que a pessoa precisará entrar de novo', () => {
        renderDialog(accountWithoutPhone)

        expect(screen.getByText(/precisará entrar de novo/)).toBeInTheDocument()
    })

    it('pede o telefone que falta e o envia junto com o papel', async () => {
        vi.mocked(usersService.changeRole).mockResolvedValue({
            message: 'Papel alterado com sucesso',
        } as never)
        const onClose = renderDialog(accountWithoutPhone)

        await waitFor(() => expect(submitButton()).toBeDisabled())

        fireEvent.change(screen.getByLabelText('Telefone de login *'), {
            target: { value: '11987654321' },
        })
        await waitFor(() => expect(submitButton()).toBeEnabled())
        fireEvent.click(submitButton())

        await waitFor(() =>
            expect(usersService.changeRole).toHaveBeenCalledWith('2', {
                role: 'User',
                phoneNumber: '11987654321',
            }),
        )
        await waitFor(() => expect(onClose).toHaveBeenCalled())
    })

    it('não pede dado de login quando a conta já tem', () => {
        renderDialog({ ...accountWithoutPhone, phoneNumber: '+5511987654321' })

        expect(screen.queryByLabelText('Telefone de login *')).toBeNull()
    })

    it('não deixa enviar o papel que a conta já tem', async () => {
        renderDialog({
            ...accountWithoutPhone,
            phoneNumber: '+5511987654321',
            role: 'User',
        })

        await waitFor(() => expect(submitButton()).toBeDisabled())
    })
})
