import type { CharacterProfile } from '../types'

interface CharacterCardProps {
  character: CharacterProfile
  position: 'left' | 'center' | 'right'
  selected: boolean
  onSelect: () => void
  onDetail: () => void
  onContinue: () => void
}

export function CharacterCard({ character, position, selected, onSelect, onDetail, onContinue }: CharacterCardProps) {
  return (
    <article
      className={`character-card character-card--${position}${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
    >
      <button
        type="button"
        className="character-card__detail"
        onClick={(event) => {
          event.stopPropagation()
          onDetail()
        }}
      >
        详情
      </button>

      <div className="character-card__avatar" aria-label={`${character.name}头像占位`}>
        <span>{character.avatarLabel}</span>
      </div>

      <div className="character-card__identity">
        <h2>{character.name}</h2>
        <p>{character.occupation}</p>
      </div>

      {selected && (
        <button
          type="button"
          className="character-card__continue"
          onClick={(event) => {
            event.stopPropagation()
            onContinue()
          }}
        >
          继续
        </button>
      )}
    </article>
  )
}
