import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/jwt'

interface ProtectedRouteProps {
    children: JSX.Element
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, roles } = useAuth()

    if (!user || !isAdmin(roles)) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
