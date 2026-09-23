import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import useFocusTrap from '../hooks/useFocusTrap'
import useScrollLock from '../hooks/useScrollLock'
import './Modal.css'

const CLOSE_MS = 250 // reference: opacity 200ms ease + translateY(25px) 250ms

// Centred dialog used for "Show more" / "Show all …" content. Opens instantly, animates out.
export default function Modal({ title, onClose, children, width = 780 }) {
  const ref = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()
  const [closing, setClosing] = useState(false)
  useScrollLock()
  useFocusTrap(ref, { initialFocusRef: closeRef })

  const requestClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, CLOSE_MS)
  }, [closing, onClose])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        requestClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [requestClose])

  return createPortal(
    <div className={`modal-backdrop${closing ? ' is-closing' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={{ maxWidth: width }}>
        <div className="modal__bar">
          <button ref={closeRef} type="button" className="modal__close" onClick={requestClose} aria-label="Close">
            <Icon name="close" size={18} strokeWidth={2.2} />
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
