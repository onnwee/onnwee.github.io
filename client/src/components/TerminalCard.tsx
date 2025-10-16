import { NavLink } from 'react-router-dom'

interface TerminalCardProps {
  title: string
  summary?: string
  footer?: string
  href?: string
  external?: boolean
  tags?: string[]
  className?: string
  color?: 'green' | 'pink' | 'cyan' | 'yellow' // color variants
}

const TerminalCard = ({
  title,
  summary,
  footer,
  href,
  external = false, // Provide default value for clarity
  tags,
  className = '',
  color,
}: TerminalCardProps) => {
  const accentPalette: Record<NonNullable<TerminalCardProps['color']>, string> = {
    green: 'rgba(166, 227, 161, 0.8)',
    pink: 'rgba(245, 194, 231, 0.85)',
    cyan: 'rgba(148, 226, 213, 0.85)',
    yellow: 'rgba(249, 226, 175, 0.85)',
  }

  const accent = color ? accentPalette[color] : 'rgba(var(--color-accent), 0.85)'

  // Build the card content that will be reused across all scenarios
  const baseCard = (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-border/40 bg-surface/80 px-8 py-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/45 hover:shadow-pop ${
        href ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        backdropFilter: 'blur(22px)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 20% -10%, ${accent}, transparent 55%), radial-gradient(circle at 80% 0%, rgba(var(--color-highlight), 0.22), transparent 60%)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="relative flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-text-muted">
        <span className="inline-flex h-1.5 w-8 rounded-full bg-accent/60" />
        <span>Featured</span>
      </div>

      <h3 className="relative mt-5 text-2xl font-semibold text-text">{title}</h3>

      {summary && (
        <p className="relative mt-3 text-base leading-relaxed text-text-muted/90">{summary}</p>
      )}

      {tags && tags.length > 0 && (
        <ul className="relative mt-5 flex flex-wrap gap-2">
          {tags.map(tag => (
            <li
              key={tag}
              className="chip"
              style={{
                borderColor: 'rgba(var(--color-accent), 0.32)',
                color: 'rgba(var(--color-text), 0.75)',
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {footer && (
        <footer className="relative mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-text-muted/70">
          <span className="inline-flex h-1 w-5 rounded-full bg-highlight/60" />
          <span>{footer}</span>
        </footer>
      )}
    </article>
  )

  // Now we handle ALL possible scenarios and always return something

  // Case 1: External link (opens in new tab)
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {baseCard}
      </a>
    )
  }

  // Case 2: Internal link (navigates within the app using React Router)
  if (href && !external) {
    return <NavLink to={href}>{baseCard}</NavLink>
  }

  // Case 3: No link at all (just display the card)
  return baseCard
}

export default TerminalCard
