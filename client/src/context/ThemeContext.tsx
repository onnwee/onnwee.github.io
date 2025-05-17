import { createContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeContextType = {
  isDark: boolean
  toggleDark: () => void
  glitchMode: boolean
  toggleGlitch: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false)
  const [glitchMode, setGlitchMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDark: () => setIsDark(prev => !prev),
        glitchMode,
        toggleGlitch: () => setGlitchMode(prev => !prev),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
