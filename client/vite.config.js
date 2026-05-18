import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://98.93.167.80:5000',
        changeOrigin: true,
      },
    },
  },
})
