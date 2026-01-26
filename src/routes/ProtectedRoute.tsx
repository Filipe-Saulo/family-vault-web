import { type JSX, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children: JSX.Element
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!user || !token) {
            navigate('/')
            return
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]))
            if (
                decoded[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] !== 'Administrator'
            ) {
                navigate('/')
            }
        } catch {
            navigate('/')
        }
    }, [user, navigate])

    return user ? children : null
}

export default ProtectedRoute
