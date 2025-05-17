import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', '@privy-io/react-auth']
  },
  build: {
    rollupOptions: {
      external: ['lucide-react', '@privy-io/react-auth']
    }
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
  }
})
