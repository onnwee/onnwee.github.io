import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
