import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

export type Flavor = 'mocha' | 'macchiato' | 'frappe' | 'latte'
export type MotionPreference = 'comfortable' | 'reduced'

type ThemeContextType = {
  flavor: Flavor
  setFlavor: Dispatch<SetStateAction<Flavor>>
  cycleFlavor: () => void
  flavors: Flavor[]
  isDark: boolean
  motion: MotionPreference
  setMotion: Dispatch<SetStateAction<MotionPreference>>
  toggleMotion: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const FLAVORS: Flavor[] = ['mocha', 'macchiato', 'frappe', 'latte']

export const FLAVOR_META: Record<Flavor, { label: string; accent: string; isDark: boolean }> = {
  mocha: { label: 'Mocha', accent: '#cba6f7', isDark: true },
  macchiato: { label: 'Macchiato', accent: '#8aadf4', isDark: true },
  frappe: { label: 'Frappe', accent: '#ca9ee6', isDark: true },
  latte: { label: 'Latte', accent: '#1e66f5', isDark: false },
}

const getStoredFlavor = (): Flavor => {
  if (typeof window === 'undefined') return 'mocha'
  const stored = window.localStorage.getItem('theme/flavor') as Flavor | null
  return stored && FLAVORS.includes(stored) ? stored : 'mocha'
}

const getStoredMotion = (): MotionPreference => {
  if (typeof window === 'undefined') return 'comfortable'
  const stored = window.localStorage.getItem('theme/motion') as MotionPreference | null
  if (stored === 'comfortable' || stored === 'reduced') return stored
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return prefersReduced ? 'reduced' : 'comfortable'
}

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [flavor, setFlavor] = useState<Flavor>(() => getStoredFlavor())
  const [motion, setMotion] = useState<MotionPreference>(() => getStoredMotion())

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-flavor', flavor)
    root.classList.toggle('dark', FLAVOR_META[flavor].isDark)
    window.localStorage.setItem('theme/flavor', flavor)
  }, [flavor])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-motion', motion)
    root.classList.toggle('motion-reduced', motion === 'reduced')
    window.localStorage.setItem('theme/motion', motion)
  }, [motion])

  const cycleFlavor = () => {
    setFlavor(current => {
      const index = FLAVORS.indexOf(current)
      const nextIndex = (index + 1) % FLAVORS.length
      return FLAVORS[nextIndex]
    })
  }

  const toggleMotion = () => {
    setMotion(current => (current === 'comfortable' ? 'reduced' : 'comfortable'))
  }

  const value = useMemo<ThemeContextType>(
    () => ({
      flavor,
      setFlavor,
      cycleFlavor,
      flavors: FLAVORS,
      isDark: FLAVOR_META[flavor].isDark,
      motion,
      setMotion,
      toggleMotion,
    }),
    [flavor, motion],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
