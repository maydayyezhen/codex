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
      <section className="character-a4-stage" onClick={(e) => e.stopPropagation()}>
        <button className="character-sheet-close" onClick={onClose}>×</button>

        <button
          className="character-sheet-arrow character-sheet-arrow--left"
          onClick={() => setSide(side === 'front' ? 'back' : 'front')}
        >
          ‹
        </button>

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

        <button
          className="character-sheet-arrow character-sheet-arrow--right"
          onClick={() => setSide(side === 'front' ? 'back' : 'front')}
        >
          ›
        </button>
      </section>
    </div>
  )
}
