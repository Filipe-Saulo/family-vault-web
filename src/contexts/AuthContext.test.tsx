import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { ROLE_CLAIM } from '../lib/jwt'
import Login from '../Pages/Login'
import ProtectedRoute from '../routes/ProtectedRoute'
import { AuthProvider } from './AuthContext'
import AuthRedirector from './AuthRedirector'

function makeToken(payload: object): string {
    const part = (obj: object) =>
        btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    return `${part({ alg: 'none' })}.${part(payload)}.sig`
}

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<AuthRedirector />} />
                    <Route path="/login" element={<div>tela-login</div>} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>tela-dashboard</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute>
                                <div>tela-transactions</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </MemoryRouter>,
    )
}

afterEach(() => localStorage.clear())

describe('sessão e rotas', () => {
    it('admin (mesmo vencido) permanece em /transactions', () => {
        localStorage.setItem(
            'token',
            makeToken({ exp: 1, [ROLE_CLAIM]: 'Administrator' }),
        )
        renderAt('/transactions')
        expect(screen.getByText('tela-transactions')).toBeInTheDocument()
    })

    it('papel em array também é admin', () => {
        localStorage.setItem(
            'token',
            makeToken({ exp: 1, [ROLE_CLAIM]: ['Administrator'] }),
        )
        renderAt('/transactions')
        expect(screen.getByText('tela-transactions')).toBeInTheDocument()
    })

    it('sem token vai para /login', () => {
        renderAt('/transactions')
        expect(screen.getByText('tela-login')).toBeInTheDocument()
    })

    it('token sem papel de admin vai para /login', () => {
        localStorage.setItem(
            'token',
            makeToken({ exp: 9999999999, [ROLE_CLAIM]: 'User' }),
        )
        renderAt('/transactions')
        expect(screen.getByText('tela-login')).toBeInTheDocument()
    })

    it('abrir / com sessão vai para /dashboard', () => {
        localStorage.setItem(
            'token',
            makeToken({ exp: 9999999999, [ROLE_CLAIM]: 'Administrator' }),
        )
        renderAt('/')
        expect(screen.getByText('tela-dashboard')).toBeInTheDocument()
    })

    it('Login redireciona quem já está logado', () => {
        localStorage.setItem(
            'token',
            makeToken({ exp: 9999999999, [ROLE_CLAIM]: 'Administrator' }),
        )
        render(
            <MemoryRouter initialEntries={['/login']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={<div>tela-dashboard</div>}
                        />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>,
        )
        expect(screen.getByText('tela-dashboard')).toBeInTheDocument()
    })
})
