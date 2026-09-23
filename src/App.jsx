import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import StickyNav from './components/StickyNav'
import TitleBar from './components/TitleBar'
import HeroGallery from './components/HeroGallery'
import Overview from './components/Overview'
import Calendar from './components/Calendar'
import BookingPanel from './components/BookingPanel'
import Reviews from './components/Reviews'
import Location from './components/Location'
import HostSection from './components/HostSection'
import ThingsToKnow from './components/ThingsToKnow'
import MoreStays from './components/MoreStays'
import PhotoTour from './components/PhotoTour'
import Lightbox from './components/Lightbox'
import Toast from './components/Toast'
import ListingDialogs from './components/ListingDialogs'
import { booking, heroPhotoIds, listing, nearbyStays, photoSections, photos, reviewSummary, reviews, thingsToKnow } from './data/listing'
import { nightsBetween } from './lib/dates'
import './App.css'

const TOUR_PARAM = 'PHOTO_TOUR_SCROLLABLE'
const ITEM_OFFSET = 1000 // reference encodes photo n as modalItem=1000+n
const TOUR_CLOSE_MS = 300
const TODAY = new Date(2026, 8, 24)
// Blocked nights as shown on the reference calendar.
const UNAVAILABLE = new Set(['2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-23', '2026-11-24', '2026-11-29', '2026-11-30'])

// URL <-> overlay state
function readUrl() {
  const params = new URLSearchParams(window.location.search)
  const tourOpen = params.get('modal') === TOUR_PARAM
  const item = Number(params.get('modalItem'))
  const index = tourOpen && Number.isInteger(item) && item >= ITEM_OFFSET && item - ITEM_OFFSET < photos.length ? item - ITEM_OFFSET : null
  return { tourOpen, index }
}

function buildUrl({ tourOpen, index }) {
  const params = new URLSearchParams(window.location.search)
  params.delete('modal')
  params.delete('modalItem')
  if (tourOpen) params.set('modal', TOUR_PARAM)
  if (tourOpen && index !== null) params.set('modalItem', String(ITEM_OFFSET + index))
  const query = params.toString()
  return `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
}

export default function App() {
  const initial = readUrl()
  const [tour, setTour] = useState(initial.tourOpen ? { target: null } : null)
  const [tourClosing, setTourClosing] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(initial.index)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [range, setRange] = useState({ checkIn: booking.checkIn, checkOut: booking.checkOut })
  const [guests, setGuests] = useState({ adults: booking.guests, children: 0, infants: 0, pets: 0 })

  const galleryRef = useRef(null)
  const calendarRef = useRef(null)
  const bookingCardRef = useRef(null)
  const pushedEntries = useRef(0) // history entries we pushed (so closing can go "back")
  const closeTimer = useRef(null)
  // Captured on open: making the page `inert` would otherwise drop focus before a trap can record it.
  const tourTrigger = useRef(null)
  const [lastViewedIndex, setLastViewedIndex] = useState(null)

  const showToast = useCallback((message) => setToast({ id: Date.now(), message }), [])
  const clearToast = useCallback(() => setToast(null), [])

  const closeTourAnimated = useCallback(() => {
    setTourClosing(true)
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      setTour(null)
      setTourClosing(false)
    }, TOUR_CLOSE_MS)
  }, [])

  // Back/forward buttons drive the overlays.
  useEffect(() => {
    const onPop = () => {
      pushedEntries.current = Math.max(0, pushedEntries.current - 1)
      const next = readUrl()
      setLightboxIndex(next.index)
      if (next.tourOpen) {
        clearTimeout(closeTimer.current)
        setTourClosing(false)
        setTour((t) => t ?? { target: null })
      } else {
        closeTourAnimated()
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [closeTourAnimated])

  const pushUrl = (state) => {
    window.history.pushState(null, '', buildUrl(state))
    pushedEntries.current += 1
  }

  // Return focus to whatever opened the tour once it has unmounted.
  useEffect(() => {
    if (tour || !tourTrigger.current) return
    tourTrigger.current.focus({ preventScroll: true })
    tourTrigger.current = null
  }, [tour])

  const openTour = useCallback((photoId = null) => {
    tourTrigger.current = document.activeElement
    setLastViewedIndex(null)
    clearTimeout(closeTimer.current)
    setTourClosing(false)
    setTour({ target: photoId })
    pushUrl({ tourOpen: true, index: null })
  }, [])

  const closeTour = useCallback(() => {
    if (pushedEntries.current > 0) {
      window.history.back() // popstate closes it
    } else {
      window.history.replaceState(null, '', buildUrl({ tourOpen: false, index: null }))
      closeTourAnimated()
    }
  }, [closeTourAnimated])

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index)
    pushUrl({ tourOpen: true, index })
  }, [])

  const changeLightbox = useCallback((index) => {
    setLightboxIndex(index)
    window.history.replaceState(null, '', buildUrl({ tourOpen: true, index }))
  }, [])

  const closeLightbox = useCallback(() => {
    const index = lightboxIndex
    if (pushedEntries.current > 0 && readUrl().index !== null && tour) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', buildUrl({ tourOpen: true, index: null }))
      setLightboxIndex(null)
      if (!tour) setTour({ target: photos[index]?.id ?? null })
    }
    setLastViewedIndex(index) // the tour focuses this photo when it becomes interactive again
  }, [lightboxIndex, tour])

  const toggleSave = () => {
    setSaved((s) => !s)
    showToast(saved ? 'Removed from wishlist' : 'Saved to wishlist')
  }
  const share = () => showToast('Share options')

  const scrollToCalendar = () => {
    const el = calendarRef.current
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' })
    el.querySelector('.cal-day__button[tabindex="0"]')?.focus({ preventScroll: true })
  }

  const reserve = () => {
    if (!range.checkIn || !range.checkOut) {
      scrollToCalendar()
      return
    }
    showToast('Reservation request started — you won’t be charged yet')
  }

  const nights = range.checkIn && range.checkOut ? nightsBetween(range.checkIn, range.checkOut) : 0
  const total = Math.round((booking.priceTotal / booking.nights) * nights).toLocaleString('en-IN')
  const priceLabel = nights ? (
    <>
      <strong>₹{total}</strong> for {nights} night{nights > 1 ? 's' : ''}
    </>
  ) : (
    'Add dates for prices'
  )

  const overlayOpen = Boolean(tour) || lightboxIndex !== null

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page" inert={overlayOpen || undefined} aria-hidden={overlayOpen || undefined}>
        <Header />
        <StickyNav
          galleryRef={galleryRef}
          priceLabel={priceLabel}
          rating={listing.rating}
          reviewCount={listing.reviewCount}
          onReserve={reserve}
        />

        <main id="main" className="container" tabIndex={-1}>
          <TitleBar title={listing.title} saved={saved} onShare={share} onToggleSave={toggleSave} />

          <div ref={galleryRef}>
            <HeroGallery photoIds={heroPhotoIds} title={listing.title} onOpenPhoto={openTour} onShowAll={() => openTour(null)} />
          </div>

          <div className="listing-body">
            <div className="listing-body__main">
              <Overview
                listing={listing}
                onShowDescription={() => setDialog({ type: 'description' })}
                onShowAmenities={() => setDialog({ type: 'amenities' })}
                onOpenPhoto={openTour}
              />
              <div ref={calendarRef} className="section">
                <Calendar range={range} onChange={setRange} unavailable={UNAVAILABLE} location="Candolim" today={TODAY} />
              </div>
            </div>
            <BookingPanel
              booking={booking}
              range={range}
              guests={guests}
              onGuestsChange={setGuests}
              onEditDates={scrollToCalendar}
              onReserve={reserve}
              onToast={showToast}
              bookingCardRef={bookingCardRef}
            />
          </div>

          <Reviews
            rating={listing.rating}
            reviewCount={listing.reviewCount}
            summary={reviewSummary}
            reviews={reviews}
            onShowAll={() => setDialog({ type: 'reviews' })}
            onShowReview={(review) => setDialog({ type: 'review', review })}
            onHowReviewsWork={() => setDialog({ type: 'how-reviews' })}
          />
          <Location
            location={listing.location}
            neighbourhood={listing.neighbourhood}
            onShowMore={() => setDialog({ type: 'neighbourhood' })}
            onSearch={() => showToast('Exact location will be provided after booking')}
          />
          <HostSection host={listing.host} onMessage={() => showToast('Messaging is available after you sign in')} />
          <ThingsToKnow items={thingsToKnow} onLearnMore={(item) => setDialog({ type: 'things', item })} />
          <MoreStays stays={nearbyStays} />
        </main>
      </div>

      <ListingDialogs dialog={dialog} onClose={() => setDialog(null)} listing={listing} reviews={reviews} />

      {tour && (
        <PhotoTour
          sections={photoSections}
          photos={photos}
          title={listing.title}
          targetPhotoId={tour.target}
          closing={tourClosing}
          onClose={closeTour}
          onOpenPhoto={openLightbox}
          inertBehind={lightboxIndex !== null}
          returnPhotoIndex={lastViewedIndex}
          saved={saved}
          onShare={share}
          onToggleSave={toggleSave}
        />
      )}
      {lightboxIndex !== null && <Lightbox photos={photos} index={lightboxIndex} onIndexChange={changeLightbox} onClose={closeLightbox} />}

      <Toast toast={toast} onDone={clearToast} />
    </>
  )
}
