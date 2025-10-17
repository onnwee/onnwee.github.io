// vite.config.ts
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// Blog and MDX processing are temporarily disabled to improve dev startup time.
// To re-enable later: reinstall/add the MDX + frontmatter plugin and wire routes back in.

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
