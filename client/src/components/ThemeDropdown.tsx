import { FLAVOR_META } from '@/context/ThemeContext'
import { useTheme } from '@/hooks'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const ThemeDropdown = () => {
  const { flavor, setFlavor, cycleFlavor, flavors, motion: motionPref, toggleMotion } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const accent = FLAVOR_META[flavor].accent

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div ref={containerRef} className="relative text-sm">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="group flex items-center gap-2 rounded-full border border-border/50 bg-surface/70 px-3 py-1.5 font-semibold uppercase tracking-[0.2em] text-xs text-text shadow-soft transition-all duration-300 hover:border-accent/60 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, var(--color-accent) 100%)`,
          }}
        >
          <Sparkles size={12} className="text-crust drop-shadow" />
        </span>
        <span className="capitalize text-foreground/80">{FLAVOR_META[flavor].label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${open ? '-rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="animate-pop-in absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-border/40 bg-surface-elevated/95 backdrop-blur-xl shadow-soft">
          <div className="flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-text-muted/80">
            <span>Catppuccin</span>
            <button
              onClick={() => {
                cycleFlavor()
                setOpen(false)
              }}
              className="rounded-full border border-border/50 px-2 py-1 font-medium uppercase tracking-[0.2em] text-[10px] text-text-muted transition hover:border-accent/50 hover:text-accent"
            >
              Shuffle
            </button>
          </div>

          <ul className="flex flex-col gap-1 px-2 pb-2" role="listbox">
            {flavors.map(option => {
              const meta = FLAVOR_META[option]
              const isActive = option === flavor
              return (
                <li key={option}>
                  <button
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-text-muted hover:bg-surface/90 hover:text-text'
                    }`}
                    onClick={() => {
                      setFlavor(option)
                      setOpen(false)
                    }}
                    role="option"
                    aria-selected={isActive}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full shadow-inner"
                        style={{
                          background: `linear-gradient(135deg, ${meta.accent} 0%, var(--color-highlight) 100%)`,
                        }}
                      />
                      <span className="capitalize font-medium">{meta.label}</span>
                    </span>
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-[0.3em]">Now</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-border/40 bg-surface/70 px-4 py-3 text-xs text-text-muted">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-medium uppercase tracking-[0.25em]">Reduce Motion</span>
              <button
                onClick={toggleMotion}
                className={`relative h-6 w-11 rounded-full border border-border/60 transition-all duration-300 ${
                  motionPref === 'reduced' ? 'bg-accent/30 border-accent/40' : 'bg-surface-strong'
                }`}
                aria-pressed={motionPref === 'reduced'}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-elevated shadow-soft transition-all duration-300 ${
                    motionPref === 'reduced' ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
                <span className="sr-only">Toggle reduced motion</span>
              </button>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeDropdown
