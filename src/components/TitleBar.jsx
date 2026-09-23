import Icon from './Icon'
import './TitleBar.css'

export function ShareSaveActions({ saved, onShare, onToggleSave, compact = false }) {
  return (
    <div className={`share-save${compact ? ' share-save--compact' : ''}`}>
      <button type="button" className="share-save__button" onClick={onShare} aria-label={compact ? 'Share' : undefined}>
        <Icon name="share" size={16} />
        {!compact && <span>Share</span>}
      </button>
      <button
        type="button"
        className="share-save__button"
        onClick={onToggleSave}
        aria-pressed={saved}
        aria-label={compact ? (saved ? 'Remove from wishlist' : 'Save') : undefined}
      >
        <Icon name={saved ? 'heartFilled' : 'heart'} size={16} className={saved ? 'share-save__heart--saved' : undefined} />
        {!compact && <span>{saved ? 'Saved' : 'Save'}</span>}
      </button>
    </div>
  )
}

export default function TitleBar({ title, ...actions }) {
  return (
    <div className="title-bar">
      <h1 className="title-bar__title">{title}</h1>
      <ShareSaveActions {...actions} />
    </div>
  )
}
