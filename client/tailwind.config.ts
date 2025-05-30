/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/styles/**/*.css'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        neutral: 'var(--color-neutral)',
        offwhite: 'var(--color-offwhite)',
        glitchGreen: 'var(--color-glitch-green)',
        glitchBlue: 'var(--color-glitch-blue)',
        glitchRed: 'var(--color-glitch-red)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        handwritten: ['var(--font-handwritten)', 'cursive'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        neon: 'var(--shadow-neon)',
        glow: 'var(--shadow-glow)',
      },
      animation: {
        glitch: 'glitch 0.8s infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        fadeUp: 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography],
  darkMode: 'class',
}
