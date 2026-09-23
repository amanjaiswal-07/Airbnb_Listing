import { useState } from 'react'
import Icon from './Icon'
import './MoreStays.css'

const PER_PAGE = 5

export default function MoreStays({ stays }) {
  const pages = Math.ceil(stays.length / PER_PAGE)
  const [page, setPage] = useState(0)

  return (
    <section className="stays section" aria-labelledby="stays-title">
      <div className="stays__header">
        <h2 id="stays-title" className="section-title">
          More stays nearby
        </h2>
        <div className="stays__pager">
          <span aria-live="polite">
            {page + 1} / {pages}
          </span>
          <button type="button" className="stays__arrow" onClick={() => setPage((p) => p - 1)} disabled={page === 0} aria-label="Previous">
            <Icon name="chevronLeft" size={12} strokeWidth={3.5} />
          </button>
          <button type="button" className="stays__arrow" onClick={() => setPage((p) => p + 1)} disabled={page === pages - 1} aria-label="Next">
            <Icon name="chevronRight" size={12} strokeWidth={3.5} />
          </button>
        </div>
      </div>

      <div className="stays__viewport">
        <ul className="stays__track" style={{ transform: `translateX(calc(${-page} * (100% + 20px)))` }}>
          {stays.map((stay, i) => {
            const onPage = Math.floor(i / PER_PAGE) === page
            return (
              <li key={stay.title} className="stay" aria-hidden={!onPage} inert={!onPage}>
                <a href="#" className="stay__link" onClick={(e) => e.preventDefault()}>
                  <img className="stay__image" src={stay.image} alt="" loading="lazy" />
                  <div className="stay__title">{stay.title}</div>
                  <div className="stay__meta">
                    {stay.price}
                    <span className="stay__rating">
                      <Icon name="star" size={11} />
                      <span className="visually-hidden">Rated</span> {stay.rating}
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
