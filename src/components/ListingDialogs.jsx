import Modal from './Modal'
import { ReviewItem } from './Reviews'
import './ListingDialogs.css'

// Content for the page's "Show more" / "Show all" / "Learn more" dialogs.
export default function ListingDialogs({ dialog, onClose, listing, reviews }) {
  if (!dialog) return null

  switch (dialog.type) {
    case 'description':
      return (
        <Modal title="About this space" onClose={onClose}>
          <p className="dialog-text">{listing.description}</p>
        </Modal>
      )
    case 'amenities':
      return (
        <Modal title="What this place offers" onClose={onClose}>
          {listing.amenityGroups.map((group) => (
            <section key={group.title} className="dialog-group">
              <h3 className="dialog-group__title">{group.title}</h3>
              <ul className="dialog-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                {group.unavailable?.map((item) => (
                  <li key={item}>
                    <del>{item}</del>
                    <span className="visually-hidden">(unavailable)</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Modal>
      )
    case 'reviews':
      return (
        <Modal title={`${listing.rating} · ${listing.reviewCount} reviews`} onClose={onClose} width={1032}>
          <div className="dialog-reviews">
            {reviews.map((review) => (
              <ReviewItem key={review.name} review={review} expanded />
            ))}
          </div>
        </Modal>
      )
    case 'review':
      return (
        <Modal title={`Review from ${dialog.review.name}`} onClose={onClose}>
          <ReviewItem review={dialog.review} expanded />
        </Modal>
      )
    case 'how-reviews':
      return (
        <Modal title="How reviews work" onClose={onClose}>
          <p className="dialog-text">
            Reviews from past guests help our community learn more about each home. By default, reviews are sorted by relevancy.
            Relevancy is based on recency, length and information that you provide to us, such as your booking search, country and
            language preferences.
          </p>
          <p className="dialog-text">
            Only the guest who booked the reservation can leave a review, and Airbnb only moderates reviews flagged for not
            following our policies.
          </p>
          <p className="dialog-text">
            To be eligible for a percentile ranking or guest favourite label, listings need five or more recent reviews.
          </p>
        </Modal>
      )
    case 'neighbourhood':
      return (
        <Modal title="Where you’ll be" onClose={onClose}>
          <p className="dialog-subtitle">{listing.location}</p>
          <p className="dialog-text">{listing.neighbourhood}</p>
        </Modal>
      )
    case 'things':
      return (
        <Modal title={dialog.item.title} onClose={onClose}>
          <ul className="dialog-list">
            {dialog.item.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </Modal>
      )
    default:
      return null
  }
}
