import { useState } from 'react'
import Icon from './Icon'
import './Location.css'

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5

// Illustrated (non-tile) map: coastline, parks and a home pin. Zoom buttons scale the artwork.
export default function Location({ location, neighbourhood, onShowMore, onSearch }) {
  const [zoom, setZoom] = useState(1)

  return (
    <section className="location section" id="location" aria-labelledby="location-title">
      <h2 id="location-title" className="section-title">
        Where you’ll be
      </h2>
      <p className="location__place">{location}</p>

      <div className="map" role="img" aria-label={`Map showing the approximate location in ${location}`}>
        <div className="map__art" style={{ transform: `scale(${zoom})` }}>
          <svg className="map__svg" viewBox="0 0 1120 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="1120" height="480" fill="#e8efe4" />
            <g stroke="#dbe5d6" strokeWidth="1">
              {Array.from({ length: 13 }, (_, i) => (
                <line key={`v${i}`} x1={92 + i * 92} y1="0" x2={92 + i * 92} y2="480" />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={92 + i * 92} x2="1120" y2={92 + i * 92} />
              ))}
            </g>
            <polygon points="0,0 456,0 232,480 0,480" fill="#add3e6" />
            <circle cx="336" cy="200" r="50" fill="#cfe2c8" />
            <circle cx="786" cy="288" r="67" fill="#cfe2c8" />
          </svg>
          <div className="map__pin">
            <Icon name="home" size={26} strokeWidth={2.4} />
          </div>
        </div>

        <button type="button" className="map__control map__search" onClick={onSearch} aria-label="Search nearby places">
          <Icon name="search" size={14} strokeWidth={3} />
        </button>
        <div className="map__zoom">
          <button
            type="button"
            className="map__control"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
          >
            <Icon name="plus" size={14} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="map__control"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
          >
            <Icon name="minus" size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <p className="location__note">Exact location will be provided after booking.</p>

      <h3 className="location__heading">Neighbourhood highlights</h3>
      <p className="location__text">{neighbourhood}</p>
      <button type="button" className="text-link-chevron location__more" onClick={onShowMore}>
        <span className="text-link">Show more</span>
        <Icon name="chevronRight" size={12} strokeWidth={3} />
      </button>
    </section>
  )
}
