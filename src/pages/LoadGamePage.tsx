import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { SaveDetail } from '../components/SaveDetail'
import { SaveList } from '../components/SaveList'
import { saves } from '../data/saves'

export function LoadGamePage() {
  const [selectedId, setSelectedId] = useState(saves[0].id)

  const selectedSave = useMemo(
    () => saves.find((save) => save.id === selectedId) ?? saves[0],
    [selectedId],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

      event.preventDefault()
      const currentIndex = saves.findIndex((save) => save.id === selectedId)
      const delta = event.key === 'ArrowUp' ? -1 : 1
      const nextIndex = Math.min(saves.length - 1, Math.max(0, currentIndex + delta))
      setSelectedId(saves[nextIndex].id)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  return (
    <PageShell path="LORE / LOAD GAME" title="载入游戏" bodyClassName="load-game-page">
      <div className="load-game-layout">
        <SaveList saves={saves} selectedId={selectedId} onSelect={(save) => setSelectedId(save.id)} />
        <SaveDetail save={selectedSave} />
      </div>
    </PageShell>
  )
}
