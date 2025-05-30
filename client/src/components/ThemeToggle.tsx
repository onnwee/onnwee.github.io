import { useTheme } from '@/hooks'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const {
    // theme, // 'dark', 'light', 'dracula', etc.
    // setTheme, // use to manually set theme
    isDark, // true if theme === 'dark'
    toggleDark, // toggles between dark/light
    // glitchMode,
    // toggleGlitch,
  } = useTheme()
  // const themes = ['dark', 'light', 'dracula', 'mocha']
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={toggleDark}
        className="btn-primary flex items-center justify-center gap-1 rounded-full p-2 backdrop-blur-sm hover:scale-105 transition"
        title="Toggle Dark Mode"
        role="button"
        aria-label="Toggle dark mode"
        aria-pressed={isDark}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* <button
        onClick={toggleGlitch}
        className={`btn-primary flex items-center justify-center gap-1 rounded-full p-2 backdrop-blur-sm hover:scale-105 transition ${
          glitchMode ? 'glitch-toggle' : ''
        }`}
        title="Toggle Glitch Mode"
        role="button"
        aria-label="Toggle glitch mode"
        aria-pressed={glitchMode}
      >
        <Zap size={18} />
      </button>
      {themes.map(t => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`btn-primary ${theme === t ? 'ring-2 ring-accent' : ''}`}
        >
          {t}
        </button>
      ))} */}
    </div>
  )
}

export default ThemeToggle
