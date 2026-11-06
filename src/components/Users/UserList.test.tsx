import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { IUser } from '../../types/users'
import UserList from './UserList'

const baseUser: IUser = {
    userId: '1',
    firstName: 'Ana',
    lastName: 'Ribeiro',
    fullName: 'Ana Ribeiro',
    phoneNumber: '41990000001',
    email: 'ana@example.com',
    age: 34,
    role: 'User',
}

function renderList(users: IUser[]) {
    render(
        <UserList
            users={users}
            onEditUser={vi.fn()}
            onDeleteUser={vi.fn()}
            onSetPassword={vi.fn()}
            onChangeRole={vi.fn()}
            currentUserId="1"
            roles={['Administrator']}
        />,
    )
}

describe('UserList', () => {
    it('mostra a linha do admin sem telefone, que a API devolve como null', () => {
        renderList([{ ...baseUser, fullName: 'Admin', phoneNumber: null }])

        expect(screen.getByText('Admin')).toBeInTheDocument()
        expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('mostra a linha do usuário sem e-mail, que a API devolve como null', () => {
        renderList([{ ...baseUser, email: null }])

        expect(screen.getByText('(41) 99000-0001')).toBeInTheDocument()
        expect(screen.getByText('-')).toBeInTheDocument()
    })

    it('mostra o papel de cada usuário', () => {
        renderList([
            baseUser,
            { ...baseUser, userId: '2', role: 'Administrator' },
        ])

        expect(screen.getByText('Usuário')).toBeInTheDocument()
        expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('não oferece alterar o papel do próprio admin', () => {
        renderList([
            baseUser,
            { ...baseUser, userId: '2', fullName: 'Bruno Lima' },
        ])

        expect(
            screen.getAllByRole('button', { name: 'Alterar papel' }),
        ).toHaveLength(1)
    })
})
