import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from './AuthContext'

export default function AuthRedirector() {
    const navigate = useNavigate()

    const { user } = useAuth()
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        } else {
            navigate('/login')
        }
    }, [user, navigate])
    return null
}
