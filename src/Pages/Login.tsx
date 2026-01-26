import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

function Login() {
    const { login, message, setMessage } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setMessage(null)
        setLoading(true)
        try {
            await login(email, password)
            navigate('/transactions')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Family Vault
                </h2>

                {message && (
                    <p className="mb-4 text-red-500 text-sm text-center">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
