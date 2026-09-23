import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { ShareSaveActions } from './TitleBar'
import useFocusTrap from '../hooks/useFocusTrap'
import useScrollLock from '../hooks/useScrollLock'
import { layoutRows } from '../lib/photoLayout'
import './PhotoTour.css'

const SECTION_OFFSET = 40 // gap between the header and a section scrolled into view

export default function PhotoTour({
  sections,
  photos,
  title,
  targetPhotoId,
  closing,
  onClose,
  onOpenPhoto,
  inertBehind,
  returnPhotoIndex,
  saved,
  onShare,
  onToggleSave,
}) {
  const dialogRef = useRef(null)
  const scrollRef = useRef(null)
  const backRef = useRef(null)
  useScrollLock()
  // Stays active while the lightbox is on top: the tour is `inert` then, so it gets no key events.
  useFocusTrap(dialogRef, { initialFocusRef: backRef })

  // Jump (no animation) to the section of the photo that opened the tour.
  useLayoutEffect(() => {
    const scroller = scrollRef.current
    if (!targetPhotoId || !scroller) return
    const sectionId = photos.find((p) => p.id === targetPhotoId)?.sectionId
    const el = sectionId && scroller.querySelector(`[data-section="${sectionId}"]`)
    if (el) scroller.scrollTop = el.offsetTop - SECTION_OFFSET
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Back from the lightbox: focus (and reveal) the photo that was last on screen.
  useEffect(() => {
    if (inertBehind || returnPhotoIndex === null) return
    const el = scrollRef.current?.querySelector(`[data-photo-index="${returnPhotoIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
    el?.focus({ preventScroll: true })
  }, [inertBehind, returnPhotoIndex])

  useEffect(() => {
    if (inertBehind) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [inertBehind, onClose])

  const scrollToSection = (sectionId) => {
    const scroller = scrollRef.current
    const el = scroller.querySelector(`[data-section="${sectionId}"]`)
    scroller.scrollTo({ top: el.offsetTop - SECTION_OFFSET, behavior: 'smooth' })
    // Move focus to the section's first photo for keyboard users (after the scroll starts).
    el.querySelector('button')?.focus({ preventScroll: true })
  }

  let flatIndex = 0
  const bySection = sections.map((section) => {
    const items = photos.filter((p) => p.sectionId === section.id).map((photo) => ({ photo, index: flatIndex++ }))
    return { section, items }
  })

  return createPortal(
    <div
      ref={dialogRef}
      className={`photo-tour${closing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      tabIndex={-1}
      inert={inertBehind || undefined}
      aria-hidden={inertBehind || undefined}
    >
      <header className="photo-tour__header">
        <button ref={backRef} type="button" className="photo-tour__icon-button" onClick={onClose} aria-label="Back">
          <Icon name="chevronLeft" size={16} strokeWidth={3} />
        </button>
        <h2 className="photo-tour__title">Photo tour</h2>
        <ShareSaveActions compact saved={saved} onShare={onShare} onToggleSave={onToggleSave} />
      </header>

      <div ref={scrollRef} className="photo-tour__scroll">
        <div className="photo-tour__content">
          <nav aria-label="Rooms">
            <ul className="photo-tour__thumbs">
              {bySection.map(({ section, items }) => (
                <li key={section.id}>
                  <button type="button" className="photo-tour__thumb" onClick={() => scrollToSection(section.id)}>
                    <span className="photo-tour__thumb-image">
                      <img src={items[0].photo.src} alt="" loading="lazy" />
                    </span>
                    <span className="photo-tour__thumb-label">{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {bySection.map(({ section, items }) => (
            <section key={section.id} className="tour-section" data-section={section.id} aria-labelledby={`tour-${section.id}`}>
              <div className="tour-section__intro">
                <h3 id={`tour-${section.id}`} className="tour-section__title">
                  {section.title}
                </h3>
                {section.amenities.length > 0 && <p className="tour-section__amenities">{section.amenities.join(' · ')}</p>}
              </div>
              <div className="tour-section__photos">
                {layoutRows(items).map((row) => (
                  <div key={row[0].photo.id} className={`tour-row tour-row--${row.length === 1 ? 'full' : 'pair'}`}>
                    {row.map(({ photo, index }) => (
                      <button
                        key={photo.id}
                        type="button"
                        className="tour-photo"
                        onClick={() => onOpenPhoto(index)}
                        aria-label={`${title} image ${index + 1}`}
                        data-photo-index={index}
                      >
                        <img src={photo.src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
