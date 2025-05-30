// vite.config.ts
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react-swc'
import matter from 'gray-matter'
import path from 'path'
import { defineConfig } from 'vite'

function frontmatterPlugin() {
  return {
    name: 'vite-plugin-mdx-frontmatter',
    transform(code: string, id: string) {
      if (!id.endsWith('.mdx')) return null
      const { content, data } = matter(code)
      const exportCode = `export const frontmatter = ${JSON.stringify(data)}`
      return {
        code: `${content}\n\n${exportCode}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [frontmatterPlugin(), mdx(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
