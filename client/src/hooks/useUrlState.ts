import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Hook to manage state synchronized with URL query parameters
 * @param key - The URL parameter key
 * @param defaultValue - Default value when parameter is not present
 * @returns [value, setValue] tuple similar to useState
 */
export function useUrlState(
  key: string,
  defaultValue: string,
  // eslint-disable-next-line no-unused-vars
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValue = useMemo(
    () => searchParams.get(key) || defaultValue,
    [searchParams, key, defaultValue],
  )

  const setValue = useCallback(
    (newValue: string) => {
      setSearchParams(
        () => {
          const next = new URLSearchParams(searchParams)
          if (newValue === defaultValue || !newValue) {
            next.delete(key)
          } else {
            next.set(key, newValue)
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams, key, defaultValue, searchParams],
  )

  return [currentValue, setValue]
}

/**
 * Hook to manage array state synchronized with URL query parameters
 * @param key - The URL parameter key
 * @returns [values, setValues] tuple for array management
 */
export function useUrlArrayState(
  key: string,
  // eslint-disable-next-line no-unused-vars
): [string[], (newValues: string[] | ((prev: string[]) => string[])) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValues = useMemo(() => {
    const param = searchParams.get(key)
    return param ? param.split(',').filter(Boolean) : []
  }, [searchParams, key])

  const setValues = useCallback(
    (newValues: string[] | ((prev: string[]) => string[])) => {
      setSearchParams(
        () => {
          const currentValues = searchParams.get(key)?.split(',').filter(Boolean) || []
          const resolvedValues =
            typeof newValues === 'function' ? newValues(currentValues) : newValues

          const next = new URLSearchParams(searchParams)
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
    [setSearchParams, key, searchParams],
  )

  return [currentValues, setValues]
}
