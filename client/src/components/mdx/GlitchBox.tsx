import type { ReactNode } from 'react'

type GlitchBoxProps = {
  children: ReactNode
  className?: string
}

const GlitchBox = ({ children, className = '' }: GlitchBoxProps) => (
  <div className={`glitch-box p-4 rounded-md font-mono ${className}`}>{children}</div>
)

export default GlitchBox
