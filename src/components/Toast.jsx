import { useEffect } from 'react'
import './Toast.css'

// Transient status message. `toast` is { id, message } so repeated messages re-trigger the timer.
export default function Toast({ toast, onDone, duration = 3000 }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onDone, duration)
    return () => clearTimeout(timer)
  }, [toast, onDone, duration])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      )}
    </div>
  )
}
