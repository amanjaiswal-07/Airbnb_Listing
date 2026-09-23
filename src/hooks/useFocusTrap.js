import { useEffect } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab / Shift+Tab inside `ref` while `active`, moves focus in on activation
 * (to `initialFocusRef` or the container) and restores it to the previously
 * focused element on deactivation.
 */
export default function useFocusTrap(ref, { active = true, initialFocusRef } = {}) {
  useEffect(() => {
    if (!active) return undefined
    const container = ref.current
    if (!container) return undefined
    const previouslyFocused = document.activeElement

    const target = initialFocusRef?.current ?? container
    target.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
