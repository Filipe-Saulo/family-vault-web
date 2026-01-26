import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const { logout } = useAuth()

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar 20% */}
            <aside className="w-1/5 bg-white border-r p-4 flex flex-col">
                <h1 className="text-lg font-bold mb-6">Family Vault</h1>

                <nav className="flex-1 space-y-2">
                    <Link
                        to="/transactions"
                        className="block px-3 py-2 rounded hover:bg-gray-100 font-medium"
                    >
                        Transactions
                    </Link>
                    <Link
                        to="/users"
                        className="block px-3 py-2 rounded hover:bg-gray-100 font-medium"
                    >
                        Users
                    </Link>
                    {/* Adicione outros links aqui */}
                </nav>

                <button
                    onClick={logout}
                    className="mt-auto text-sm text-red-600 hover:underline"
                >
                    Logout
                </button>
            </aside>

            {/* Conteúdo principal 80% */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 bg-white border-b flex items-center justify-between px-6">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </header>

                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
