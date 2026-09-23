import { useEffect, useState } from 'react'
import Icon from './Icon'
import './StickyNav.css'

const TABS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
]

const NAV_HEIGHT = 67

// Appears once the hero gallery scrolls out of view; highlights the section in view.
export default function StickyNav({ galleryRef, priceLabel, rating, reviewCount, onReserve }) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState('photos')

  useEffect(() => {
    const update = () => {
      const gallery = galleryRef.current
      if (!gallery) return
      setVisible(gallery.getBoundingClientRect().bottom <= NAV_HEIGHT)

      let current = 'photos'
      for (const tab of TABS.slice(1)) {
        const el = document.getElementById(tab.id)
        if (el && el.getBoundingClientRect().top <= NAV_HEIGHT + 1) current = tab.id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [galleryRef])

  const goTo = (id) => {
    const el = id === 'photos' ? galleryRef.current : document.getElementById(id)
    if (!el) return
    const top = id === 'photos' ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className={`sticky-nav${visible ? ' is-visible' : ''}`} aria-hidden={!visible} inert={!visible}>
      <div className="container sticky-nav__inner">
        <nav aria-label="Listing sections">
          <ul className="sticky-nav__tabs">
            {TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  type="button"
                  className={`sticky-nav__tab${active === tab.id ? ' is-active' : ''}`}
                  aria-current={active === tab.id ? 'true' : undefined}
                  onClick={() => goTo(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sticky-nav__booking">
          <div className="sticky-nav__summary">
            <div>{priceLabel}</div>
            <div className="sticky-nav__rating">
              <Icon name="star" size={10} /> {rating} · <span>{reviewCount} reviews</span>
            </div>
          </div>
          <button type="button" className="sticky-nav__reserve" onClick={onReserve}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  )
}
