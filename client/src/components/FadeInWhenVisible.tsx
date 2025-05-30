import { useOnScreen } from '@/hooks'
import React from 'react'

type Props = {
  children: React.ReactNode
  delay?: number
}

const FadeInWhenVisible = ({ children, delay = 0 }: Props) => {
  const [ref, isVisible] = useOnScreen<HTMLDivElement>('0px')

  return (
    <div
      ref={ref}
      className={`fade-up-once ${isVisible ? '' : 'opacity-0'}`}
      style={{ '--animation-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default FadeInWhenVisible
