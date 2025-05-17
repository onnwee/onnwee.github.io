import { useTheme } from '@/hooks'
import { Moon, Sun, Zap } from 'lucide-react'

const ThemeToggle = () => {
  const { isDark, toggleDark, glitchMode, toggleGlitch } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={toggleDark}
        className="btn-primary flex items-center justify-center gap-1 rounded-full p-2 backdrop-blur-sm hover:scale-105 transition"
        title="Toggle Dark Mode"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button
        onClick={toggleGlitch}
        className={`btn-primary flex items-center justify-center gap-1 rounded-full p-2 backdrop-blur-sm hover:scale-105 transition ${
          glitchMode ? 'glitch-toggle' : ''
        }`}
        title="Toggle Glitch Mode"
      >
        <Zap size={18} />
      </button>
    </div>
  )
}

export default ThemeToggle
