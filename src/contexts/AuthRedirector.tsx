import { Navigate } from 'react-router-dom'

import { useAuth } from './AuthContext'

export default function AuthRedirector() {
    const { user } = useAuth()
    return <Navigate to={user ? '/dashboard' : '/login'} replace />
}
