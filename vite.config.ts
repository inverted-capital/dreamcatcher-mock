import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import jspm from 'vite-plugin-jspm'

export default defineConfig({
  plugins: [
    react(),
    jspm({
      defaultProvider: 'esm.sh',
      integrity: true,
      inputMap: {
        imports: {
          '@artifact/client': 'https://esm.sh/jsr/@artifact/client',
          '@artifact/client/api': 'https://esm.sh/jsr/@artifact/client/api'
        }
      }
    })
  ],
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  },
  base: './'
})
