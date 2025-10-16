/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/styles/**/*.css'],
  theme: {
    extend: {
      colors: {
        background: withAlpha('--color-background'),
        surface: withAlpha('--color-surface'),
        'surface-strong': withAlpha('--color-surface-strong'),
        'surface-elevated': withAlpha('--color-surface-elevated'),
        border: withAlpha('--color-border'),
        text: withAlpha('--color-text'),
        'text-muted': withAlpha('--color-text-muted'),
        accent: withAlpha('--color-accent'),
        highlight: withAlpha('--color-highlight'),
        crust: withAlpha('--color-crust'),
        glow: withAlpha('--color-glow'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        pop: 'var(--shadow-pop)',
        glow: 'var(--shadow-glow)',
        ring: 'var(--ring-glow)',
      },
      borderRadius: {
        xl: 'var(--radius-lg)',
        lg: 'var(--radius-md)',
        md: 'var(--radius-sm)',
      },
      backdropBlur: {
        30: '30px',
      },
      transitionTimingFunction: {
        'soft-spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'hero-mesh': 'var(--gradient-hero)',
        'accent-gradient': 'var(--gradient-accent)',
      },
    },
  },
  plugins: [typography],
  darkMode: 'class',
}
