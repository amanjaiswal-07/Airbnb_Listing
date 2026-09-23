import Icon from './Icon'
import { photoIndex, photos } from '../data/listing'
import './Overview.css'

export function Stars({ size = 10, className }) {
  return (
    <span className={`stars ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} />
      ))}
    </span>
  )
}

export function Laurel({ side, height }) {
  return <img src={`/images/ui/laurel-${side}.png`} alt="" className="laurel" style={{ height }} />
}

function GuestFavouriteCard({ rating, reviewCount, onReviewsClick }) {
  return (
    <div className="guest-fav">
      <div className="guest-fav__badge">
        <Laurel side="left" height={36} />
        <div className="guest-fav__badge-text">
          Guest
          <br />
          favourite
        </div>
        <Laurel side="right" height={36} />
      </div>
      <p className="guest-fav__text">One of the most loved homes on Airbnb, according to guests</p>
      <div className="guest-fav__stat">
        <div className="guest-fav__rating">{rating}</div>
        <Stars size={10} />
        <span className="visually-hidden">Rated {rating} out of 5 stars.</span>
      </div>
      <div className="guest-fav__divider" aria-hidden="true" />
      <a className="guest-fav__stat guest-fav__stat--link" href="#reviews" onClick={onReviewsClick}>
        <div className="guest-fav__rating">{reviewCount}</div>
        <div className="guest-fav__label">Reviews</div>
      </a>
    </div>
  )
}

export default function Overview({ listing, onShowDescription, onShowAmenities, onOpenPhoto }) {
  return (
    <div className="overview">
      <section className="overview__summary">
        <h2 className="overview__subtitle">{listing.subtitle}</h2>
        <p className="overview__facts">{listing.facts.join(' · ')}</p>
      </section>

      <GuestFavouriteCard rating={listing.rating} reviewCount={listing.reviewCount} />

      <div className="host-row">
        <img className="host-row__avatar" src={listing.host.avatar} alt="" width="46" height="46" />
        <div>
          <div className="host-row__name">Hosted by {listing.host.name}</div>
          <div className="host-row__meta">{listing.host.yearsHosting} years hosting</div>
        </div>
      </div>

      <ul className="highlights section">
        {listing.highlights.map((h) => (
          <li key={h.title} className="highlights__item">
            <Icon name={h.icon} size={24} strokeWidth={1.6} />
            <div>
              <div className="highlights__title">{h.title}</div>
              <div className="highlights__text">{h.text}</div>
            </div>
          </li>
        ))}
      </ul>

      <section className="description section">
        <div className="description__banner">
          Some info has been automatically translated.{' '}
          <button type="button" className="description__original">
            Show original
          </button>
        </div>
        <p className="description__text">{listing.description}</p>
        <button type="button" className="text-link-chevron description__more" onClick={onShowDescription}>
          <span className="text-link">Show more</span>
          <Icon name="chevronRight" size={12} strokeWidth={3} />
        </button>
      </section>

      <section className="sleep section" aria-labelledby="sleep-title">
        <h2 id="sleep-title" className="section-title">
          Where you'll sleep
        </h2>
        <div className="sleep__grid">
          {listing.sleep.map((room) => (
            <div key={room.title} className="sleep__card">
              <button
                type="button"
                className="sleep__photo"
                onClick={() => onOpenPhoto(room.photoId)}
                aria-label={`${room.title} photo`}
              >
                <img src={photos[photoIndex(room.photoId)].src} alt="" loading="lazy" />
              </button>
              <div className="sleep__name">{room.title}</div>
              <div className="sleep__text">{room.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="amenities section" id="amenities" aria-labelledby="amenities-title">
        <h2 id="amenities-title" className="section-title">
          What this place offers
        </h2>
        <ul className="amenities__list">
          {listing.amenities.map((a) => (
            <li key={a.label} className={`amenities__item${a.unavailable ? ' amenities__item--unavailable' : ''}`}>
              <Icon name={a.icon} size={24} strokeWidth={1.6} />
              {a.unavailable ? (
                <>
                  <del>{a.label}</del>
                  <span className="visually-hidden">(unavailable)</span>
                </>
              ) : (
                a.label
              )}
            </li>
          ))}
        </ul>
        <button type="button" className="outline-button" onClick={onShowAmenities}>
          Show all {listing.amenityTotal} amenities
        </button>
      </section>
    </div>
  )
}
