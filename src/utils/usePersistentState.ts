import { useState, useCallback, useEffect } from 'react'

/**
 * Similar to `useState`, stores the value in local storage and returns the
 * stored value if present.
 *
 * The `initialValue` is always returned on the first render because Gatsby
 * requires the initial render to be deterministic.
 *
 * Optionally, provide a 'validate' function to verify or normalize the stored
 * value.
 *
 * If the key is null, the value is not persisted but still handled like a
 * normal state hook. This is mostly to allow respecting the rules of hooks when
 * the value shouldn't always be persisted.
 */
export function usePersistentState<T>(
  key: string | null,
  initialValue: T,
  validate?: (value: T) => T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      if (key) {
        const item = window.localStorage.getItem(key)
        let value = JSON.parse(item) || initialValue

        if (typeof validate == 'function') {
          value = validate(value)
        }

        setStoredValue(value)
      }
    } catch (error) {
      // no-op, this can fail in some browsers in incognito mode
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        if (key) {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        // no-op
      }
    },
    [key]
  )

  return [storedValue, setValue]
}
