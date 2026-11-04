import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { ChangePasswordDialog } from './Password/ChangePasswordDialog'
import { ThemeToggle } from './ui/theme-toggle'

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/transactions', label: 'Transações' },
    { to: '/users', label: 'Usuários' },
    { to: '/category', label: 'Categorias' },
]

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const { logout } = useAuth()

    return (
        <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-background">
            {/* Sidebar: 20% no desktop; empilhada no topo no mobile */}
            <aside className="w-full md:w-1/5 bg-sidebar text-sidebar-foreground border-sidebar-border border-b md:border-b-0 md:border-r p-4 flex flex-col">
                <h1 className="text-lg font-bold mb-3 md:mb-6">Family Vault</h1>

                <nav
                    aria-label="Navegação principal"
                    className="flex-1 flex flex-row flex-wrap gap-2 md:flex-col md:flex-nowrap"
                >
                    {NAV_ITEMS.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium ${
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : ''
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-3 md:mt-auto flex flex-col gap-2">
                    <ChangePasswordDialog />
                    <button
                        onClick={() => logout(true)}
                        className="text-sm text-red-600 hover:underline text-left"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Conteúdo principal 80% */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 bg-background border-b flex items-center justify-end px-6">
                    <ThemeToggle />
                </header>

                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
