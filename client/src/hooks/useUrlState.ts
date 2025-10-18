import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'

// Narrow SetStateAction<T> to updater function when applicable
// eslint-disable-next-line no-unused-vars
function isUpdater<T>(val: unknown): val is (_prev: T) => T {
  return typeof val === 'function'
}

/**
 * Hook to manage state synchronized with URL query parameters
 * @param key - The URL parameter key
 * @param defaultValue - Default value when parameter is not present
 * @returns [value, setValue] tuple similar to useState
 */
export function useUrlState(
  key: string,
  defaultValue: string,
): [string, Dispatch<SetStateAction<string>>] {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValue = useMemo(
    () => searchParams.get(key) || defaultValue,
    [searchParams, key, defaultValue],
  )

  const setValue = useCallback(
    (newValue: SetStateAction<string>) => {
      setSearchParams(
        prev => {
          const current = prev.get(key) ?? defaultValue
          const resolved = isUpdater<string>(newValue) ? newValue(current) : newValue

          const next = new URLSearchParams(prev)
          if (resolved === defaultValue || !resolved) {
            next.delete(key)
          } else {
            next.set(key, resolved)
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams, key, defaultValue],
  )

  return [currentValue, setValue]
}

/**
 * Hook to manage array state synchronized with URL query parameters
 * @param key - The URL parameter key
 * @returns [values, setValues] tuple for array management
 */
export function useUrlArrayState(key: string): [string[], Dispatch<SetStateAction<string[]>>] {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValues = useMemo(() => {
    const param = searchParams.get(key)
    return param ? param.split(',').filter(Boolean) : []
  }, [searchParams, key])

  const setValues = useCallback(
    (newValues: SetStateAction<string[]>) => {
      setSearchParams(
        prev => {
          const currentValues = prev.get(key)?.split(',').filter(Boolean) || []
          const resolvedValues = isUpdater<string[]>(newValues)
            ? newValues(currentValues)
            : newValues

          const next = new URLSearchParams(prev)
          if (resolvedValues.length === 0) {
            next.delete(key)
          } else {
            next.set(key, resolvedValues.join(','))
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams, key],
  )

  return [currentValues, setValues]
}
