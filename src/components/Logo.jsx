// Brand mark (original drawing) + wordmark set in the UI font.
export default function Logo() {
  return (
    <a className="logo" href="/" aria-label="Airbnb homepage">
      <svg viewBox="0 0 32 32" width="30" height="32" aria-hidden="true" focusable="false">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
          d="M16 22.6c-1.9-2.3-3.6-4.9-3.6-6.9a3.6 3.6 0 0 1 7.2 0c0 2-1.7 4.6-3.6 6.9Zm0 0c2.5 2.9 5 4.7 7.4 4.7a4.2 4.2 0 0 0 3.8-5.9L19.1 5.8a3.4 3.4 0 0 0-6.2 0L4.8 21.4a4.2 4.2 0 0 0 3.8 5.9c2.4 0 4.9-1.8 7.4-4.7Z"
        />
      </svg>
      <span className="logo-wordmark">airbnb</span>
    </a>
  )
}
