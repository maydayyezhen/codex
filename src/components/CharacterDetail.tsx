import { useState } from 'react'
import type { CharacterProfile } from '../types'

interface CharacterDetailProps {
  character: CharacterProfile
  onClose: () => void
}

export function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  const [side, setSide] = useState<'front' | 'back'>('front')

  return (
    <div className="character-sheet-overlay" onClick={onClose}>
      <section className="character-a4-view" onClick={(e) => e.stopPropagation()}>
        <div className="character-a4-tabs">
          <button className={side === 'front' ? 'active' : ''} onClick={() => setSide('front')}>正面</button>
          <button className={side === 'back' ? 'active' : ''} onClick={() => setSide('back')}>反面</button>
          <button onClick={onClose}>×</button>
        </div>

        <div className="character-a4-paper">
          {side === 'front' ? (
            <div className="character-a4-placeholder">
              <h2>{character.name}</h2>
              <p>{character.occupation}</p>
            </div>
          ) : (
            <div className="character-a4-placeholder">
              <p>角色背景记录</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
