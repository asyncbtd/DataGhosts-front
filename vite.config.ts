import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.249.52:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws-chat': {
        target: 'http://192.168.249.52:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    global: 'globalThis',
  },
})
