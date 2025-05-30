import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export default function useOnScreen<T extends Element>(
  rootMargin: string = '0px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    // Validate rootMargin to avoid crashing
    const safeRootMargin =
      typeof rootMargin === 'string' && /^-?\d+(px|%)?$/.test(rootMargin) ? rootMargin : '0px'

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { rootMargin: safeRootMargin },
    )

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
      observer.disconnect()
    }
  }, [rootMargin])

  return [ref, isIntersecting]
}
