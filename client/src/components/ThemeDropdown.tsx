import { useTheme } from '@/hooks'
import { ChevronDown, Moon, Palette, PaletteIcon, Sun, Zap } from 'lucide-react'
import { useState } from 'react'

const themes = [
  { name: 'light', color: 'bg-white', icon: <Sun size={14} /> },
  { name: 'dark', color: 'bg-black', icon: <Moon size={14} /> },
  { name: 'dracula', color: 'bg-purple-800', icon: <PaletteIcon size={14} /> },
  { name: 'mocha', color: 'bg-rose-800', icon: <PaletteIcon size={14} /> },
]

const ThemeDropdown = () => {
  const { theme, setTheme, glitchMode, toggleGlitch } = useTheme()
  const [open, setOpen] = useState(false)

  const currentTheme = themes.find(t => t.name === theme)

  return (
    <div className="relative text-xs">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-800 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1">
          {currentTheme?.icon || <Palette size={16} />}
          <span className="capitalize">{theme}</span>
        </span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-neutral border border-accent text-white rounded shadow-lg z-50 p-2">
          {themes.map(t => (
            <button
              key={t.name}
              onClick={() => {
                setTheme(t.name)
                setOpen(false)
              }}
              className={`flex items-center justify-between w-full px-2 py-1 text-left rounded hover:bg-accent hover:text-black transition ${
                theme === t.name ? 'bg-accent text-black' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${t.color}`} />
                {t.icon}
                <span className="capitalize">{t.name}</span>
              </div>
            </button>
          ))}

          <hr className="my-2 border-neutral-700" />

          <label
            className="flex items-center justify-between w-full cursor-pointer px-2 text-xs hover:text-accent"
            htmlFor="glitch-toggle"
          >
            <span className="flex items-center gap-2">
              <Zap size={14} />
              Glitch Mode
            </span>
            <input
              id="glitch-toggle"
              type="checkbox"
              checked={glitchMode}
              onChange={toggleGlitch}
              className="accent-accent"
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default ThemeDropdown
