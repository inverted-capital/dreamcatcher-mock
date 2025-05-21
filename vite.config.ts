import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const cdnImports: Record<string, string> = {
  'lucide-react': 'https://esm.sh/lucide-react?external=react',
  '@open-iframe-resizer/core': 'https://esm.sh/@open-iframe-resizer/core',
  '@open-iframe-resizer/react':
    'https://esm.sh/@open-iframe-resizer/react?external=react',
  '@privy-io/react-auth':
    'https://esm.sh/@privy-io/react-auth?external=react,react-dom',
  '@artifact/client': 'https://esm.sh/jsr/@artifact/client?external=react',
  '@artifact/client/api':
    'https://esm.sh/jsr/@artifact/client@0.0.57/api?external=react',
  react: 'https://esm.sh/react',
  'react-dom': 'https://esm.sh/react-dom',
  'react-dom/client': 'https://esm.sh/react-dom/client',
  'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime'
}

const externalPackages = Object.keys(cdnImports)

function esmImportMapPlugin(): Plugin {
  return {
    name: 'esm-import-map',
    enforce: 'pre',
    resolveId(id: string) {
      const url = cdnImports[id]
      if (url) {
        return { id: url, external: true }
      }
      return null
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), esmImportMapPlugin()],
  optimizeDeps: {
    exclude: externalPackages
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: externalPackages
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...cdnImports
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none'
    }
  },
  base: './'
})
