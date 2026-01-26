import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { queryClient } from './lib/react-query-client.ts'

const BASE_PATH_NAME = import.meta.env.VITE_BASE_PATH_NAME

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={BASE_PATH_NAME}>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
