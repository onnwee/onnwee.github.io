import { ThemeDropdown } from '@/components'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  // { to: '/blog', label: 'Blog' }, // temporarily disabled
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },
]

const Nav = () => {
  return (
    <header className="sticky top-0 z-40 w-full pt-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-border/40 bg-surface/70 px-6 py-3 text-xs uppercase tracking-[0.28em] backdrop-blur-2xl shadow-soft">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-text hover:text-accent transition"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-accent/20">
            <span className="absolute inset-0 animate-float bg-accent/20 blur-xl" />
            <span className="relative text-sm font-medium">on</span>
          </span>
          <span className="hidden sm:inline">onnwee.dev</span>
        </NavLink>

        <nav className="hidden gap-8 md:flex">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group relative text-[11px] font-semibold tracking-[0.35em] transition-colors duration-300 ${
                  isActive ? 'text-accent' : 'text-text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {link.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeDropdown />
          <a
            href="mailto:hey@onnwee.dev"
            className="hidden items-center rounded-full bg-accent/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-accent transition hover:bg-accent/25 md:inline-flex"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}

export default Nav
