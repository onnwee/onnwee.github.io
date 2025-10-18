export type Flavor = 'mocha' | 'macchiato' | 'frappe' | 'latte'
export type MotionPreference = 'comfortable' | 'reduced'

export const FLAVORS: Flavor[] = ['mocha', 'macchiato', 'frappe', 'latte']

export const FLAVOR_META: Record<Flavor, { label: string; accent: string; isDark: boolean }> = {
  mocha: { label: 'Mocha', accent: '#cba6f7', isDark: true },
  macchiato: { label: 'Macchiato', accent: '#8aadf4', isDark: true },
  frappe: { label: 'Frappe', accent: '#ca9ee6', isDark: true },
  latte: { label: 'Latte', accent: '#1e66f5', isDark: false },
}
