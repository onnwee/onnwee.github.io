import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

export type ThemeContextType = {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
  isDark: boolean
  toggleDark: () => void
  glitchMode: boolean
  toggleGlitch: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [glitchMode, setGlitchMode] = useState(() => localStorage.getItem('glitch') === 'true')

  const isDark = theme === 'dark'

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.classList.toggle('dark', isDark)
    root.classList.toggle('glitch-mode', glitchMode)

    localStorage.setItem('theme', theme)
    localStorage.setItem('glitch', glitchMode.toString())
  }, [theme, glitchMode, isDark])

  const toggleDark = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  const toggleGlitch = () => setGlitchMode(prev => !prev)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggleDark,
        glitchMode,
        toggleGlitch,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
