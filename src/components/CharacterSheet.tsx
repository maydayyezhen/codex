import type { CharacterProfile } from '../types'

interface CharacterSheetProps {
  character?: CharacterProfile
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  return (
    <div className="character-sheet-shared">
      <div className="character-sheet-shared__paper">
        <section className="character-sheet-shared__front">
          <h2>{character?.name ?? '未命名调查员'}</h2>
          <p>{character?.occupation ?? '职业未选择'}</p>
          <div className="character-sheet-shared__placeholder">A4 CHARACTER SHEET</div>
        </section>
      </div>
    </div>
  )
}
