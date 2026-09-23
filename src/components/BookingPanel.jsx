import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon'
import { nightsBetween, slashDate } from '../lib/dates'
import { guestSummary } from '../lib/guests'
import './BookingPanel.css'

const GUEST_TYPES = [
  { key: 'adults', label: 'Adults', hint: 'Age 13+', min: 1, counted: true },
  { key: 'children', label: 'Children', hint: 'Ages 2–12', min: 0, counted: true },
  { key: 'infants', label: 'Infants', hint: 'Under 2', min: 0, max: 5 },
  { key: 'pets', label: 'Pets', hint: 'Bringing a service animal?', min: 0, max: 2 },
]

function GuestPicker({ guests, maxGuests, onChange, onClose, labelledBy }) {
  const ref = useRef(null)
  const people = guests.adults + guests.children

  useEffect(() => {
    const onPointer = (e) => {
      if (!ref.current?.parentElement.contains(e.target)) onClose(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose(true)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div ref={ref} className="guest-picker" role="group" aria-labelledby={labelledBy}>
      {GUEST_TYPES.map((type) => {
        const value = guests[type.key]
        const max = type.counted ? value + (maxGuests - people) : type.max
        return (
          <div key={type.key} className="guest-picker__row">
            <div>
              <div className="guest-picker__label">{type.label}</div>
              <div className="guest-picker__hint">{type.hint}</div>
            </div>
            <div className="guest-picker__stepper">
              <button
                type="button"
                className="guest-picker__step"
                disabled={value <= type.min}
                onClick={() => onChange({ ...guests, [type.key]: value - 1 })}
                aria-label={`Decrease ${type.label.toLowerCase()}`}
              >
                <Icon name="minus" size={12} strokeWidth={3} />
              </button>
              <span className="guest-picker__value" aria-live="polite">
                {value}
              </span>
              <button
                type="button"
                className="guest-picker__step"
                disabled={value >= max}
                onClick={() => onChange({ ...guests, [type.key]: value + 1 })}
                aria-label={`Increase ${type.label.toLowerCase()}`}
              >
                <Icon name="plus" size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        )
      })}
      <p className="guest-picker__note">
        This place has a maximum of {maxGuests} guests, not including infants. Pets allowed.
      </p>
      <div className="guest-picker__footer">
        <button type="button" className="guest-picker__close" onClick={() => onClose(true)}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function BookingPanel({ booking, range, guests, onGuestsChange, onEditDates, onReserve, onToast, bookingCardRef }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const guestsButtonRef = useRef(null)
  const guestsLabelId = useId()
  const nights = range.checkIn && range.checkOut ? nightsBetween(range.checkIn, range.checkOut) : 0
  const nightly = booking.priceTotal / booking.nights
  const total = `₹${Math.round(nightly * nights).toLocaleString('en-IN')}`

  const closePicker = (restoreFocus) => {
    setPickerOpen(false)
    if (restoreFocus) guestsButtonRef.current?.focus()
  }

  return (
    <aside className="booking-panel" aria-label="Booking">
      <div className="booking-panel__sticky">
        <div className="promo">
          <img src={booking.promo.icon} alt="" className="promo__icon" width="32" height="32" />
          <div className="promo__text">
            {booking.promo.text}
            <br />
            <a href="#" className="promo__link" onClick={(e) => e.preventDefault()}>
              {booking.promo.link}
            </a>
          </div>
          <button type="button" className="promo__claim" onClick={() => onToast('Coupon claimed')}>
            {booking.promo.action}
          </button>
        </div>

        <div className="booking-card" ref={bookingCardRef}>
          <div className="booking-card__price">
            {nights ? (
              <>
                <span className="booking-card__amount">{total}</span> for {nights} night{nights > 1 ? 's' : ''}
              </>
            ) : (
              <span className="booking-card__prompt">Add dates for prices</span>
            )}
          </div>

          <div className="booking-card__fields">
            <button type="button" className="booking-card__field" onClick={onEditDates}>
              <span className="booking-card__label">Check-in</span>
              <span className="booking-card__value">{range.checkIn ? slashDate(range.checkIn) : 'Add date'}</span>
            </button>
            <button type="button" className="booking-card__field booking-card__field--right" onClick={onEditDates}>
              <span className="booking-card__label">Checkout</span>
              <span className="booking-card__value">{range.checkOut ? slashDate(range.checkOut) : 'Add date'}</span>
            </button>
            <div className="booking-card__guests">
              <button
                type="button"
                ref={guestsButtonRef}
                className="booking-card__field booking-card__field--guests"
                aria-expanded={pickerOpen}
                onClick={() => setPickerOpen((o) => !o)}
              >
                <span className="booking-card__label" id={guestsLabelId}>
                  Guests
                </span>
                <span className="booking-card__value">{guestSummary(guests)}</span>
                <Icon name="chevronDown" size={16} strokeWidth={2.5} className={`booking-card__chevron${pickerOpen ? ' is-open' : ''}`} />
              </button>
              {pickerOpen && (
                <GuestPicker guests={guests} maxGuests={booking.maxGuests} onChange={onGuestsChange} onClose={closePicker} labelledBy={guestsLabelId} />
              )}
            </div>
          </div>

          {nights > 0 && (
            <div className="booking-card__cancellation">
              Free cancellation before <strong>{booking.freeCancellationBy}</strong>
            </div>
          )}

          <button type="button" className="booking-card__reserve" onClick={nights ? onReserve : onEditDates}>
            {nights ? 'Reserve' : 'Check availability'}
          </button>
          {nights > 0 && <p className="booking-card__note">You won't be charged yet</p>}
        </div>

        <button type="button" className="report-link" onClick={() => onToast('Thanks — we’ll review this listing')}>
          <Icon name="flag" size={16} />
          <span>Report this listing</span>
        </button>
      </div>
    </aside>
  )
}
