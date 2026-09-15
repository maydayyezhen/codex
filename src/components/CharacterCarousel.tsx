import { useEffect, useState } from 'react'
import type { CharacterProfile } from '../types'
import { CharacterCard } from './CharacterCard'
import { CharacterDetail } from './CharacterDetail'

interface CharacterCarouselProps {
  characters: CharacterProfile[]
  onContinue: (character: CharacterProfile) => void
  onBack: () => void
}

export function CharacterCarousel({ characters, onContinue, onBack }: CharacterCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [detailCharacter, setDetailCharacter] = useState<CharacterProfile | null>(null)

  const current = characters[currentIndex]
  const previous = characters[(currentIndex - 1 + characters.length) % characters.length]
  const next = characters[(currentIndex + 1) % characters.length]

  const movePrevious = () => {
    setCurrentIndex((index) => (index - 1 + characters.length) % characters.length)
  }

  const moveNext = () => {
    setCurrentIndex((index) => (index + 1) % characters.length)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (detailCharacter) {
        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopImmediatePropagation()
          setDetailCharacter(null)
        }
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        onBack()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        movePrevious()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [detailCharacter, onBack, characters.length])

  if (characters.length < 3) {
    return <div className="character-carousel__empty">至少需要三张人物卡</div>
  }

  return (
    <div className="character-carousel">
      <button type="button" className="character-carousel__nav character-carousel__nav--left" onClick={movePrevious} aria-label="上一个人物">‹</button>

      <div className="character-carousel__cards">
        <CharacterCard
          character={previous}
          position="left"
          selected={false}
          onSelect={movePrevious}
          onDetail={() => setDetailCharacter(previous)}
          onContinue={() => undefined}
        />

        <CharacterCard
          character={current}
          position="center"
          selected
          onSelect={() => undefined}
          onDetail={() => setDetailCharacter(current)}
          onContinue={() => onContinue(current)}
        />

        <CharacterCard
          character={next}
          position="right"
          selected={false}
          onSelect={moveNext}
          onDetail={() => setDetailCharacter(next)}
          onContinue={() => undefined}
        />
      </div>

      <button type="button" className="character-carousel__nav character-carousel__nav--right" onClick={moveNext} aria-label="下一个人物">›</button>

      <div className="character-carousel__position">
        {String(currentIndex + 1).padStart(2, '0')} / {String(characters.length).padStart(2, '0')}
      </div>

      {detailCharacter && (
        <CharacterDetail character={detailCharacter} onClose={() => setDetailCharacter(null)} />
      )}
    </div>
  )
}
