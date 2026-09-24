import Icon from './Icon'
import { Laurel, Stars } from './Overview'
import './Reviews.css'

const LONG_REVIEW = 200

export function Avatar({ person, size }) {
  if (person.avatar) {
    return <img className="avatar" src={person.avatar} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" />
  }
  return (
    <span className={`avatar avatar--initial avatar--${person.tint}`} style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {person.initial}
    </span>
  )
}

export function ReviewItem({ review, onShowMore, expanded = false }) {
  const isLong = review.text.length > LONG_REVIEW
  return (
    <article className="review">
      <header className="review__author">
        <Avatar person={review} size={42} />
        <div>
          <h3 className="review__name">{review.name}</h3>
          <div className="review__tenure">{review.tenure}</div>
        </div>
      </header>
      <div className="review__meta">
        <Stars size={10} />
        <span className="visually-hidden">Rating, 5 stars,</span>
        <span aria-hidden="true">·</span>
        <span>{review.date}</span>
      </div>
      <div className={`review__text${isLong && !expanded ? ' review__text--clamped' : ''}`}>
        {review.text.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {isLong && !expanded && (
        <button type="button" className="text-link review__more" onClick={onShowMore}>
          Show more
        </button>
      )}
    </article>
  )
}

export default function Reviews({ rating, reviewCount, summary, reviews, onShowAll, onShowReview, onHowReviewsWork }) {
  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews__hero">
        <div className="reviews__score">
          <Laurel side="left" height={110} />
          <div className="reviews__number" aria-hidden="true">
            {rating}
          </div>
          <Laurel side="right" height={110} />
        </div>
        <h2 id="reviews-title" className="reviews__title">
          <span className="visually-hidden">Rated {rating} out of 5 from {reviewCount} reviews. </span>
          Guest favourite
        </h2>
        <p className="reviews__lead">This home is a guest favourite based on ratings, reviews and reliability</p>
        <button type="button" className="reviews__how" onClick={onHowReviewsWork}>
          How reviews work
        </button>
      </div>

      <div className="rating-bar">
        <div className="rating-bar__overall">
          <div className="rating-bar__label">Overall rating</div>
          <ol className="rating-bar__dist" aria-label="Rating distribution">
            {summary.distribution.map((share, i) => (
              <li key={i}>
                <span>{5 - i}</span>
                <span className="rating-bar__track">
                  <span className="rating-bar__fill" style={{ width: `${share * 100}%` }} />
                </span>
              </li>
            ))}
          </ol>
        </div>
        {summary.categories.map((c) => (
          <div key={c.label} className="rating-bar__category">
            <div className="rating-bar__label">{c.label}</div>
            <div className="rating-bar__score">{c.score}</div>
            <Icon name={c.icon} size={32} strokeWidth={1.8} />
          </div>
        ))}
      </div>

      <ul className="review-tags" aria-label="Review topics">
        {summary.tags.map((tag) => (
          <li key={tag.label}>
            <button type="button" className="review-tag">
              <img src={tag.icon} alt="" width="20" height="20" />
              <span className="review-tag__label">{tag.label}</span>
              <span className="review-tag__count">{tag.count}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="reviews__grid">
        {reviews.map((review) => (
          <ReviewItem key={review.name} review={review} onShowMore={() => onShowReview(review)} />
        ))}
      </div>

      <button type="button" className="outline-button" onClick={onShowAll}>
        Show all {reviewCount} reviews
      </button>
    </section>
  )
}
