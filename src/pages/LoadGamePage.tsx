import { useEffect, useMemo, useRef, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { SaveDetail } from '../components/SaveDetail'
import { SaveList } from '../components/SaveList'
import { saves as initialSaves } from '../data/saves'
import type { SaveRecord } from '../types'

const mockTitles = ['雨夜来信', '失落剧院', '无月港', '北境旧路', '深井回声', '冬日旅店', '王城余烬', '无人车站']
const mockLocations = ['旧城区', '中央剧院', '北方港口', '山间古道', '矿区下层', '雪原驿站', '王都西区', '终点站']

export function LoadGamePage() {
  const [saveRecords, setSaveRecords] = useState<SaveRecord[]>(initialSaves)
  const [selectedId, setSelectedId] = useState<string | null>(initialSaves[0]?.id ?? null)
  const nextSaveNumber = useRef(initialSaves.length + 1)

  const selectedSave = useMemo(
    () => saveRecords.find((save) => save.id === selectedId),
    [saveRecords, selectedId],
  )

  const addSave = () => {
    const number = nextSaveNumber.current
    nextSaveNumber.current += 1

    const mockIndex = (number - 1) % mockTitles.length
    const id = String(number).padStart(2, '0')
    const newSave: SaveRecord = {
      id,
      title: `${mockTitles[mockIndex]} ${id}`,
      location: mockLocations[mockIndex],
      chapter: `第${number}日 · 夜晚`,
      duration: `${String(number % 24).padStart(2, '0')}:${String((number * 7) % 60).padStart(2, '0')}:${String((number * 13) % 60).padStart(2, '0')}`,
      savedAt: `2026.09.${String(Math.max(1, 30 - (number % 29))).padStart(2, '0')} ${String(number % 24).padStart(2, '0')}:00`,
      shortDate: `09.${String(Math.max(1, 30 - (number % 29))).padStart(2, '0')}`,
    }

    setSaveRecords((current) => [...current, newSave])
    setSelectedId(newSave.id)
  }

  const deleteSelectedSave = () => {
    if (!selectedId) return

    const selectedIndex = saveRecords.findIndex((save) => save.id === selectedId)
    const nextRecords = saveRecords.filter((save) => save.id !== selectedId)

    setSaveRecords(nextRecords)

    if (nextRecords.length === 0) {
      setSelectedId(null)
      return
    }

    const fallbackIndex = Math.min(Math.max(selectedIndex, 0), nextRecords.length - 1)
    setSelectedId(nextRecords[fallbackIndex].id)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      if (saveRecords.length === 0) return

      event.preventDefault()
      const currentIndex = Math.max(0, saveRecords.findIndex((save) => save.id === selectedId))
      const delta = event.key === 'ArrowUp' ? -1 : 1
      const nextIndex = Math.min(saveRecords.length - 1, Math.max(0, currentIndex + delta))
      setSelectedId(saveRecords[nextIndex].id)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveRecords, selectedId])

  return (
    <PageShell path="LORE / LOAD GAME" title="载入游戏" bodyClassName="load-game-page">
      <div className="load-game-layout">
        <section className="save-browser" aria-label="存档浏览器">
          <div className="save-browser__toolbar">
            <span>{saveRecords.length} 个存档</span>
            <div className="save-browser__actions">
              <button type="button" onClick={addSave}>新增存档</button>
              <button type="button" onClick={deleteSelectedSave} disabled={!selectedId}>删除选中</button>
            </div>
          </div>

          <SaveList
            saves={saveRecords}
            selectedId={selectedId}
            onSelect={(save) => setSelectedId(save.id)}
          />
        </section>

        <SaveDetail save={selectedSave} />
      </div>
    </PageShell>
  )
}
