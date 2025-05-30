import { NavLink } from 'react-router-dom'
import { useTheme } from '@/hooks'

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
}: TerminalCardProps) => {
  const { glitchMode } = useTheme()

  // Build the card content that will be reused across all scenarios
  const baseCard = (
    <div
      className={`relative border border-green-400 bg-neutral p-4 font-mono text-green-300 shadow-md transition-all duration-200
        ${glitchMode ? 'animate-glitch shadow-neon border-glitchRed' : ''}
        ${href ? 'hover:scale-[1.015] hover:shadow-glow hover:border-accent cursor-pointer' : ''}
        ${className}`}
    >
      <div className="mb-2 text-sm text-green-500">[onnwee@localhost ~]$ {title}</div>
      {summary && <p className="pl-2 text-base mb-2">{summary}</p>}
      {tags && (
        <div className="pl-2 mb-2 text-xs flex gap-2 flex-wrap text-glitchGreen">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded text-xs border ${
                glitchMode
                  ? 'border-glitchGreen text-glitchGreen shadow-neon'
                  : 'border-neutral text-green-300'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {footer && <div className="mt-4 text-xs text-green-400 opacity-60"># {footer}</div>}
    </div>
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
