import { type RefObject } from 'react'

export function mergeRefs<T>(...refs: (RefObject<T | null> | ((el: T | null) => void) | null)[]) {
  return (value: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref && typeof ref === 'object') {
        ;(ref as RefObject<T | null>).current = value
      }
    })
  }
}
