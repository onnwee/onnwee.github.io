// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff005c',
        neutral: '#1e1e1e',
        // etc
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
