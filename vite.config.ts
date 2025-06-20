import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  optimizeDeps: { exclude: ['lucide-react'] },
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
  base: './',
  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        diagnotic: path.resolve(__dirname, 'diagnotic.html')
      }
    }
  }
})
