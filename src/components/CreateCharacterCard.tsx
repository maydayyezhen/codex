interface CreateCharacterCardProps {
  position: 'left' | 'center' | 'right'
  selected: boolean
  onCreate: () => void
}

export function CreateCharacterCard({ position, selected, onCreate }: CreateCharacterCardProps) {
  return (
    <button
      type="button"
      className={`character-card character-card--create character-card--${position}${selected ? ' is-selected' : ''}`}
      onClick={onCreate}
    >
      <span className="character-card__create-symbol" aria-hidden="true">＋</span>
      <span className="character-card__create-label">创建新人物</span>
    </button>
  )
}
