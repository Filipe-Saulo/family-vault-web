/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'https://localhost:7072'

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            // o cookie de refresh é first-party (Path=/api): a API sai pela origem do painel
            proxy: {
                '/api': {
                    target: apiProxyTarget,
                    changeOrigin: true,
                    secure: false, // certificado de dev autoassinado
                },
            },
        },
        test: {
            environment: 'jsdom',
            setupFiles: ['src/test/setup.ts'],
        },
    }
})
