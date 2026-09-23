import { useEffect } from 'react'

let locks = 0

// Locks page scroll while any overlay is mounted; nested overlays share one lock.
export default function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined
    if (locks === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.paddingRight = `${scrollbar}px`
    }
    locks += 1
    return () => {
      locks -= 1
      if (locks === 0) {
        document.documentElement.style.overflow = ''
        document.documentElement.style.paddingRight = ''
      }
    }
  }, [active])
}
