import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { ThemeToggle } from './ui/theme-toggle'

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const { logout } = useAuth()

    return (
        <div className="h-screen flex bg-background">
            {/* Sidebar 20% */}
            <aside className="w-1/5 bg-sidebar text-sidebar-foreground border-sidebar-border border-r p-4 flex flex-col">
                <h1 className="text-lg font-bold mb-6">Family Vault</h1>

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/dashboard"
                        className="block px-3 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/transactions"
                        className="block px-3 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    >
                        Transações
                    </Link>
                    <Link
                        to="/users"
                        className="block px-3 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    >
                        Usuários
                    </Link>
                    <Link
                        to="/category"
                        className="block px-3 py-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    >
                        Categorias
                    </Link>
                </nav>

                <button
                    onClick={() => logout(true)}
                    className="mt-auto text-sm text-red-600 hover:underline"
                >
                    Logout
                </button>
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
