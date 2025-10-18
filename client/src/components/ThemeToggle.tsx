import { FLAVOR_META } from '@/context/themeConstants'
import { useTheme } from '@/hooks'
import { RefreshCcw } from 'lucide-react'

const ThemeToggle = () => {
  const { flavor, cycleFlavor } = useTheme()
  const accent = FLAVOR_META[flavor].accent

  return (
    <button
      onClick={cycleFlavor}
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-surface/80 text-accent shadow-pop transition-transform duration-300 hover:-translate-y-1 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      title="Shuffle Catppuccin flavor"
      aria-label="Shuffle Catppuccin flavor"
      style={{ boxShadow: `0 10px 30px -12px ${accent}55` }}
    >
      <RefreshCcw size={18} />
    </button>
  )
}

export default ThemeToggle
