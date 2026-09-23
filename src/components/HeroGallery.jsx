import Icon from './Icon'
import { photoIndex, photos } from '../data/listing'
import './HeroGallery.css'

export default function HeroGallery({ photoIds, title, onOpenPhoto, onShowAll }) {
  return (
    <section className="hero" aria-label="Photos of this place">
      {photoIds.map((id, i) => {
        const index = photoIndex(id)
        return (
          <button
            key={id}
            type="button"
            className={`hero__item hero__item--${i}`}
            onClick={() => onOpenPhoto(id)}
            aria-label={`${title} image ${index + 1}`}
          >
            <img src={photos[index].src} alt="" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} />
          </button>
        )
      })}
      <button type="button" className="hero__show-all" onClick={onShowAll}>
        <Icon name="gridDots" size={15} />
        Show all photos
      </button>
    </section>
  )
}
