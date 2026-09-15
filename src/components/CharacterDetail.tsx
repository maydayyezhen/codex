import type { CharacterProfile } from '../types'

interface CharacterDetailProps {
  character: CharacterProfile
  onClose: () => void
}

export function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  return (
    <div className="character-detail-backdrop" onClick={onClose} role="presentation">
      <section
        className="character-detail"
        aria-modal="true"
        role="dialog"
        aria-label={`${character.name}人物详情`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="character-detail__close" onClick={onClose} aria-label="关闭人物详情">
          ×
        </button>

        <div className="character-detail__avatar" aria-hidden="true">{character.avatarLabel}</div>

        <div className="character-detail__body">
          <p className="character-detail__eyebrow">CHARACTER FILE</p>
          <h2>{character.name}</h2>
          <p className="character-detail__occupation">{character.occupation} · {character.age}岁</p>
          <p className="character-detail__background">{character.background}</p>

          <dl className="character-detail__meta">
            <div>
              <dt>擅长</dt>
              <dd>{character.strengths.join(' / ')}</dd>
            </div>
            <div>
              <dt>弱点</dt>
              <dd>{character.weaknesses.join(' / ')}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
