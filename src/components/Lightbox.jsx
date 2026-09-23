import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import useFocusTrap from '../hooks/useFocusTrap'
import './Lightbox.css'

// Single-photo viewer. Navigation does not wrap: prev/next disable at the ends (as on the reference).
export default function Lightbox({ photos, index, onIndexChange, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1
  useFocusTrap(dialogRef, { initialFocusRef: closeRef })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault()
        onIndexChange(index - 1)
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault()
        onIndexChange(index + 1)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, hasPrev, hasNext, onIndexChange, onClose])

  // A nav button that becomes disabled drops focus; hand it to the opposite arrow instead.
  useEffect(() => {
    if (!hasNext && document.activeElement !== nextRef.current && !dialogRef.current.contains(document.activeElement)) prevRef.current?.focus()
    if (!hasPrev && document.activeElement !== prevRef.current && !dialogRef.current.contains(document.activeElement)) nextRef.current?.focus()
  }, [hasPrev, hasNext])

  // Warm the cache for the neighbours so arrow navigation swaps instantly.
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      if (photos[i]) new Image().src = photos[i].src
    }
  }, [index, photos])

  return createPortal(
    <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" tabIndex={-1}>
      <header className="lightbox__bar">
        <button type="button" className="lightbox__icon-button" onClick={onClose} aria-label="Show all photos">
          <Icon name="gridDots" size={18} />
        </button>
        <h2 className="lightbox__caption">{photo.caption}</h2>
        <div className="lightbox__right">
          <span className="lightbox__counter" aria-live="polite" aria-atomic="true">
            {index + 1} of {photos.length}
          </span>
          <button ref={closeRef} type="button" className="lightbox__icon-button" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <div className="lightbox__stage">
        <img key={photo.id} className="lightbox__image" src={photo.src} alt={`${photo.caption}, photo ${index + 1} of ${photos.length}`} />
      </div>

      <button
        ref={prevRef}
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={() => onIndexChange(index - 1)}
        disabled={!hasPrev}
        aria-label="Previous"
      >
        <Icon name="chevronLeft" size={16} strokeWidth={3} />
      </button>
      <button
        ref={nextRef}
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={() => onIndexChange(index + 1)}
        disabled={!hasNext}
        aria-label="Next"
      >
        <Icon name="chevronRight" size={16} strokeWidth={3} />
      </button>
    </div>,
    document.body,
  )
}
