import type { ReactNode } from 'react'

import { useAuth } from '../contexts/AuthContext'

interface AppShellProps {
    children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const { logout } = useAuth()

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-4">
                <h1 className="text-lg font-bold mb-6">Family Vault</h1>

                <nav className="space-y-2">
                    <a
                        href="/transactions"
                        className="block px-3 py-2 rounded hover:bg-gray-100 font-medium"
                    >
                        Transactions
                    </a>
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="h-14 bg-white border-b flex items-center justify-end px-6">
                    <button
                        onClick={logout}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Logout
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
