import { useEffect, useMemo, useState } from 'react'
import type { CharacterProfile } from '../types'
import { CharacterCard } from './CharacterCard'
import { CharacterDetail } from './CharacterDetail'
import { CreateCharacterCard } from './CreateCharacterCard'

interface CharacterCarouselProps {
  characters: CharacterProfile[]
  onContinue: (character: CharacterProfile) => void
  onCreate: () => void
  onBack: () => void
}

type CarouselEntry =
  | { kind: 'character'; character: CharacterProfile }
  | { kind: 'create' }

export function CharacterCarousel({ characters, onContinue, onCreate, onBack }: CharacterCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [detailCharacter, setDetailCharacter] = useState<CharacterProfile | null>(null)

  const entries = useMemo<CarouselEntry[]>(
    () => [
      ...characters.map((character) => ({ kind: 'character' as const, character })),
      { kind: 'create' as const },
    ],
    [characters],
  )

  const current = entries[currentIndex]
  const previous = entries[(currentIndex - 1 + entries.length) % entries.length]
  const next = entries[(currentIndex + 1) % entries.length]

  const movePrevious = () => {
    setCurrentIndex((index) => (index - 1 + entries.length) % entries.length)
  }

  const moveNext = () => {
    setCurrentIndex((index) => (index + 1) % entries.length)
  }

  useEffect(() => {
    if (currentIndex >= entries.length) setCurrentIndex(0)
  }, [currentIndex, entries.length])

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
  }, [detailCharacter, onBack, entries.length])

  const renderEntry = (
    entry: CarouselEntry,
    position: 'left' | 'center' | 'right',
    selected: boolean,
    onSelect: () => void,
  ) => {
    if (entry.kind === 'create') {
      return (
        <CreateCharacterCard
          position={position}
          selected={selected}
          onCreate={onCreate}
        />
      )
    }

    return (
      <CharacterCard
        character={entry.character}
        position={position}
        selected={selected}
        onSelect={onSelect}
        onDetail={() => setDetailCharacter(entry.character)}
        onContinue={() => onContinue(entry.character)}
      />
    )
  }

  if (entries.length < 3) {
    return <div className="character-carousel__empty">至少需要两个预设人物</div>
  }

  return (
    <div className="character-carousel">
      <button type="button" className="character-carousel__nav character-carousel__nav--left" onClick={movePrevious} aria-label="上一个人物">‹</button>

      <div className="character-carousel__cards">
        {renderEntry(previous, 'left', false, movePrevious)}
        {renderEntry(current, 'center', true, () => undefined)}
        {renderEntry(next, 'right', false, moveNext)}
      </div>

      <button type="button" className="character-carousel__nav character-carousel__nav--right" onClick={moveNext} aria-label="下一个人物">›</button>

      <div className="character-carousel__position">
        {String(currentIndex + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
      </div>

      {detailCharacter && (
        <CharacterDetail character={detailCharacter} onClose={() => setDetailCharacter(null)} />
      )}
    </div>
  )
}
