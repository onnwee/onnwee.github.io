import type { ReactNode } from 'react'

type CalloutProps = {
  title?: string
  children: ReactNode
  tone?: 'info' | 'warning' | 'success' | 'error'
}

const toneStyles = {
  info: 'border-blue-400 bg-blue-900 text-blue-100',
  warning: 'border-yellow-400 bg-yellow-900 text-yellow-100',
  success: 'border-green-400 bg-green-900 text-green-100',
  error: 'border-red-400 bg-red-900 text-red-100',
}

const Callout = ({ title = 'Note', children, tone = 'info' }: CalloutProps) => (
  <div className={`border-l-4 p-4 rounded-md mb-4 ${toneStyles[tone]}`}>
    <strong className="block mb-1 font-bold uppercase text-xs tracking-wide">{title}</strong>
    <div className="text-sm leading-relaxed">{children}</div>
  </div>
)

export default Callout
