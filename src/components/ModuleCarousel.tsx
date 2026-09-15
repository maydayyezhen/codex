import { useEffect, useState } from 'react'
import type { GameModule } from '../types'

interface ModuleCarouselProps {
  modules: GameModule[]
}

export function ModuleCarousel({ modules }: ModuleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const current = modules[currentIndex]
  const previous = modules[(currentIndex - 1 + modules.length) % modules.length]
  const next = modules[(currentIndex + 1) % modules.length]

  const moveTo = (index: number, nextDirection: 'left' | 'right') => {
    setDirection(nextDirection)
    window.setTimeout(() => {
      setCurrentIndex(index)
      setDirection(null)
    }, 160)
  }

  const movePrevious = () => {
    const index = (currentIndex - 1 + modules.length) % modules.length
    moveTo(index, 'right')
  }

  const moveNext = () => {
    const index = (currentIndex + 1) % modules.length
    moveTo(index, 'left')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        movePrevious()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div className="module-carousel">
      <button type="button" className="module-carousel__zone module-carousel__zone--left" onClick={movePrevious} aria-label="上一个模组">‹</button>
      <span className="module-carousel__side module-carousel__side--left">{previous.title}</span>

      <article className={`module-card${direction ? ` module-card--exit-${direction}` : ''}`}>
        <div className="module-card__number">
          {String(currentIndex + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}
        </div>
        <h2 className="module-card__title">{current.title}</h2>
        <div className="module-card__tags">{current.tags.join(' · ')}</div>
        <p className="module-card__hook">{current.hook}</p>
        <p className="module-card__description">{current.description}</p>
        <button type="button" className="primary-action">继续</button>
      </article>

      <span className="module-carousel__side module-carousel__side--right">{next.title}</span>
      <button type="button" className="module-carousel__zone module-carousel__zone--right" onClick={moveNext} aria-label="下一个模组">›</button>

      <div className="module-carousel__dots" aria-label="模组位置">
        {modules.map((module, index) => (
          <button
            key={module.id}
            type="button"
            className={`module-dot${index === currentIndex ? ' is-active' : ''}`}
            onClick={() => {
              if (index === currentIndex) return
              moveTo(index, index > currentIndex ? 'left' : 'right')
            }}
            aria-label={`查看${module.title}`}
          />
        ))}
      </div>
    </div>
  )
}
