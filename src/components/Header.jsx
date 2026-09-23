import Icon from './Icon'
import Logo from './Logo'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <Logo />

      <div className="search-pill" role="search">
        <button type="button" className="search-pill__segment search-pill__segment--first">
          <img src="/images/ui/searchbar-house.png" alt="" className="search-pill__house" width="48" height="48" />
          Anywhere
        </button>
        <span className="search-pill__divider" aria-hidden="true" />
        <button type="button" className="search-pill__segment">
          Anytime
        </button>
        <span className="search-pill__divider" aria-hidden="true" />
        <button type="button" className="search-pill__segment search-pill__segment--muted">
          Add guests
        </button>
        <button type="button" className="search-pill__submit" aria-label="Search">
          <Icon name="search" size={12} strokeWidth={4.5} />
        </button>
      </div>

      <nav className="header__actions" aria-label="Account">
        <a className="header__host" href="#">
          Become a host
        </a>
        <button type="button" className="header__circle" aria-label="Choose a language and currency">
          <Icon name="globe" size={16} strokeWidth={2.2} />
        </button>
        <button type="button" className="header__circle" aria-label="Main navigation menu">
          <Icon name="menu" size={16} strokeWidth={2.5} />
        </button>
      </nav>
    </header>
  )
}
