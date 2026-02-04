import { Route, Routes } from 'react-router-dom'

import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import AuthRedirector from './contexts/AuthRedirector'
import PageNotFound from './contexts/PageNotFound'
import Category from './Pages/Category'
import Login from './Pages/Login'
import Transactions from './Pages/Transactions'
import Users from './Pages/Users'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
    return (
        <>
            <Toaster position="top-center" closeButton duration={4000} />
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
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <Users />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/category"
                        element={
                            <ProtectedRoute>
                                <Category />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </>
    )
}

export default App
