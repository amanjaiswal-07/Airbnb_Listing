import { useRef, useState } from 'react'
import Icon from './Icon'
import { addDays, addMonths, fromKey, longDate, monthLabel, monthMatrix, nightsBetween, shortDate, toKey } from '../lib/dates'
import './Calendar.css'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function Month({ month, range, isDisabled, onSelect, focusKey, setFocusKey, gridRef }) {
  const { checkIn, checkOut } = range

  const handleKeyDown = (event, date) => {
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = toKey(addDays(date, moves[event.key]))
    setFocusKey(next)
    requestAnimationFrame(() => gridRef.current?.querySelector(`[data-date="${next}"]`)?.focus())
  }

  return (
    <div className="cal-month">
      <div className="cal-month__label">{monthLabel(month)}</div>
      <table className="cal-month__grid" role="grid" aria-label={monthLabel(month)}>
        <thead>
          <tr>
            {WEEKDAYS.map((d, i) => (
              <th key={i} scope="col" className="cal-month__weekday">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthMatrix(month).map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                if (!date) return <td key={di} />
                const key = toKey(date)
                const disabled = isDisabled(key)
                const isStart = key === checkIn
                const isEnd = key === checkOut
                const inRange = checkIn && checkOut && key > checkIn && key < checkOut
                const classes = [
                  'cal-day',
                  disabled && 'cal-day--disabled',
                  (isStart || isEnd) && 'cal-day--selected',
                  inRange && 'cal-day--in-range',
                  isStart && checkOut && 'cal-day--range-start',
                  isEnd && 'cal-day--range-end',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <td key={di} className={classes}>
                    <button
                      type="button"
                      data-date={key}
                      className="cal-day__button"
                      disabled={disabled}
                      tabIndex={key === focusKey ? 0 : -1}
                      aria-pressed={isStart || isEnd}
                      aria-label={`${longDate(date)}${disabled ? ', unavailable' : ''}${isStart ? ', check-in date' : ''}${isEnd ? ', checkout date' : ''}`}
                      onClick={() => onSelect(key)}
                      onKeyDown={(e) => handleKeyDown(e, date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Calendar({ range, onChange, unavailable, location, today }) {
  const { checkIn, checkOut } = range
  const [firstMonth, setFirstMonth] = useState(() => {
    const start = fromKey(checkIn ?? toKey(today))
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })
  const [focusKey, setFocusKey] = useState(checkIn ?? toKey(today))
  const gridRef = useRef(null)

  const todayKey = toKey(today)
  const isDisabled = (key) => key < todayKey || unavailable.has(key)

  const select = (key) => {
    if (!checkIn || checkOut || key <= checkIn) {
      onChange({ checkIn: key, checkOut: null })
      return
    }
    // A stay can't span an unavailable night.
    for (let d = fromKey(checkIn); toKey(d) < key; d = addDays(d, 1)) {
      if (unavailable.has(toKey(d))) {
        onChange({ checkIn: key, checkOut: null })
        return
      }
    }
    onChange({ checkIn, checkOut: key })
  }

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0
  const heading = nights ? `${nights} night${nights > 1 ? 's' : ''} in ${location}` : checkIn ? 'Select checkout date' : 'Select check-in date'
  const subheading = nights ? `${shortDate(checkIn)} - ${shortDate(checkOut)}` : 'Add your travel dates for exact pricing'

  const canGoBack = firstMonth > new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <section className="calendar" aria-labelledby="calendar-title">
      <h2 id="calendar-title" className="section-title">
        {heading}
      </h2>
      <p className="calendar__sub">{subheading}</p>

      <div className="calendar__months" ref={gridRef}>
        <button
          type="button"
          className="calendar__nav calendar__nav--prev"
          onClick={() => setFirstMonth((m) => addMonths(m, -1))}
          disabled={!canGoBack}
          aria-label="Move backward to switch to the previous month."
        >
          <Icon name="chevronLeft" size={12} strokeWidth={3.5} />
        </button>
        <button
          type="button"
          className="calendar__nav calendar__nav--next"
          onClick={() => setFirstMonth((m) => addMonths(m, 1))}
          aria-label="Move forward to switch to the next month."
        >
          <Icon name="chevronRight" size={12} strokeWidth={3.5} />
        </button>
        {[0, 1].map((offset) => (
          <Month
            key={offset}
            month={addMonths(firstMonth, offset)}
            range={range}
            isDisabled={isDisabled}
            onSelect={select}
            focusKey={focusKey}
            setFocusKey={setFocusKey}
            gridRef={gridRef}
          />
        ))}
      </div>

      <div className="calendar__footer">
        <button type="button" className="calendar__keyboard" aria-label="Keyboard shortcuts: use arrow keys to move between dates">
          <Icon name="keyboard" size={20} strokeWidth={1.5} />
        </button>
        <button type="button" className="calendar__clear" onClick={() => onChange({ checkIn: null, checkOut: null })}>
          Clear dates
        </button>
      </div>
    </section>
  )
}
