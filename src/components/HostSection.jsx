import Icon from './Icon'
import { Avatar } from './Reviews'
import './HostSection.css'

export default function HostSection({ host, onMessage }) {
  return (
    <section className="host section" aria-labelledby="host-title">
      <h2 id="host-title" className="section-title">
        Meet your host
      </h2>

      <div className="host__layout">
        <div>
          <div className="host-card">
            <div className="host-card__identity">
              <div className="host-card__avatar">
                <img src={host.avatar} alt="" width="104" height="104" />
                <span className="host-card__badge" aria-hidden="true">
                  <Icon name="check" size={16} strokeWidth={3} />
                </span>
              </div>
              <div className="host-card__name">{host.name}</div>
              <div className="host-card__role">Host</div>
            </div>
            <dl className="host-card__stats">
              <div>
                <dt className="visually-hidden">Reviews</dt>
                <dd className="host-card__value">{host.reviews}</dd>
                <dd className="host-card__label" aria-hidden="true">
                  Reviews
                </dd>
              </div>
              <div>
                <dt className="visually-hidden">Rating</dt>
                <dd className="host-card__value">
                  {host.rating}
                  <Icon name="star" size={14} />
                </dd>
                <dd className="host-card__label" aria-hidden="true">
                  Rating
                </dd>
              </div>
              <div>
                <dt className="visually-hidden">Years hosting</dt>
                <dd className="host-card__value">{host.yearsHosting}</dd>
                <dd className="host-card__label" aria-hidden="true">
                  Years hosting
                </dd>
              </div>
            </dl>
          </div>

          <ul className="host__facts">
            {host.facts.map((f) => (
              <li key={f.text}>
                <Icon name={f.icon} size={24} strokeWidth={1.6} />
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="host__details">
          <h3 className="host__subheading">Co-Hosts</h3>
          <ul className="host__cohosts">
            {host.coHosts.map((c) => (
              <li key={c.name}>
                <Avatar person={c} size={34} />
                {c.name}
              </li>
            ))}
          </ul>

          <h3 className="host__subheading host__subheading--details">Host details</h3>
          <p className="host__line">Response rate: {host.responseRate}</p>
          <p className="host__line">Responds {host.responseTime}</p>
          <button type="button" className="host__message" onClick={onMessage}>
            Message host
          </button>

          <p className="host__protect">
            <Icon name="shield" size={24} strokeWidth={1.6} />
            To help protect your payment, always use Airbnb to send money and communicate with hosts.
          </p>
        </div>
      </div>
    </section>
  )
}
