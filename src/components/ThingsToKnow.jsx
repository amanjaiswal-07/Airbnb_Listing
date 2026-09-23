import Icon from './Icon'
import './ThingsToKnow.css'

export default function ThingsToKnow({ items, onLearnMore }) {
  return (
    <section className="things section" aria-labelledby="things-title">
      <h2 id="things-title" className="section-title">
        Things to know
      </h2>
      <div className="things__grid">
        {items.map((item) => (
          <div key={item.title} className="things__col">
            <Icon name={item.icon} size={24} strokeWidth={2} />
            <h3 className="things__title">{item.title}</h3>
            {item.lines.map((line) => (
              <p key={line} className="things__line">
                {line}
              </p>
            ))}
            <button type="button" className="text-link things__more" onClick={() => onLearnMore(item)}>
              Learn more
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
