import { Route, Routes } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import AuthRedirector from './contexts/AuthRedirector'
import PageNotFound from './contexts/PageNotFound'
import Login from './Pages/Login'
import Transactions from './Pages/Transactions'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<AuthRedirector />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
