
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Cambia a '/automated-finance-hub/' si tu app va en una subcarpeta
  server: {
    port: 8080
  }
})
