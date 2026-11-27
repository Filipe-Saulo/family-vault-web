import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../lib/demo'

function Login() {
    const { login, user } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    if (user) return <Navigate to="/dashboard" replace />

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        await enter(email, password)
    }

    async function enter(loginEmail: string, loginPassword: string) {
        setLoading(true)
        try {
            await login(loginEmail, loginPassword)
            navigate('/dashboard')
        } catch {
            // erro já reportado via toast dentro de login()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md relative">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Family Vault
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground"
                            >
                                E-mail
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground"
                            >
                                Senha
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>

                        <div className="text-center">
                            <Link
                                to="/esqueci-senha"
                                className="text-sm hover:underline"
                            >
                                Esqueci minha senha
                            </Link>
                        </div>
                    </form>

                    <section
                        aria-labelledby="demo-title"
                        className="mt-6 rounded-md border bg-muted/50 p-4 text-sm"
                    >
                        <h2
                            id="demo-title"
                            className="font-medium text-foreground"
                        >
                            Conhecer sem cadastro
                        </h2>
                        <p className="mt-1 text-muted-foreground">
                            Conta demo com dados fictícios, somente leitura.
                        </p>
                        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 text-muted-foreground">
                            <dt>E-mail:</dt>
                            <dd className="break-all font-mono">
                                {DEMO_EMAIL}
                            </dd>
                            <dt>Senha:</dt>
                            <dd className="font-mono">{DEMO_PASSWORD}</dd>
                        </dl>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            className="mt-3 w-full"
                            onClick={() => enter(DEMO_EMAIL, DEMO_PASSWORD)}
                        >
                            Entrar como demo
                        </Button>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login
