import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import useFocusTrap from '../hooks/useFocusTrap'
import useScrollLock from '../hooks/useScrollLock'
import './Modal.css'

// Centred dialog used for "Show more" / "Show all …" content.
export default function Modal({ title, onClose, children, width = 780 }) {
  const ref = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()
  useScrollLock()
  useFocusTrap(ref, { initialFocusRef: closeRef })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={{ maxWidth: width }}>
        <div className="modal__bar">
          <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} strokeWidth={3} />
          </button>
        </div>
        <div className="modal__body">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
