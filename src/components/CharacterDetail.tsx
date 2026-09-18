import type { CharacterProfile } from '../types'

interface CharacterDetailProps {
  character: CharacterProfile
  onClose: () => void
}

export function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  return (
    <div className="character-sheet-overlay" onClick={onClose} role="presentation">
      <section
        className="character-sheet-view"
        role="dialog"
        aria-modal="true"
        aria-label={`${character.name}人物详情`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="character-sheet-view__header">
          <div>
            <p>LORE / CHARACTER DETAIL</p>
            <h2>{character.name}</h2>
            <span>{character.occupation}</span>
          </div>
          <button type="button" onClick={onClose}>×</button>
        </header>

        <div className="character-sheet-view__pages">
          <article className="character-sheet-page">
            <div className="character-sheet-page__label">正面</div>
            <div className="character-sheet-page__content">
              <div className="sheet-block">身份信息</div>
              <div className="sheet-block">属性 / 技能</div>
              <div className="sheet-block">战斗 / 状态</div>
            </div>
          </article>

          <article className="character-sheet-page">
            <div className="character-sheet-page__label">反面</div>
            <div className="character-sheet-page__content">
              <div className="sheet-block">背景故事</div>
              <div className="sheet-block">关系 / 物品</div>
              <div className="sheet-block">记录 / 备注</div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
