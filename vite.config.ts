import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Замените на адрес вашего бэкенда
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
