import { useState, useEffect } from 'react'

/**
 * This hook always returns `false` on the first render if `defer` is true
 * avoid SSR issues.
 */
export const useIsTouchDevice = (defer = true) => {
  const [isTouchDevice, setIsTouchDevice] = useState(
    defer ? false : window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  return isTouchDevice
}
