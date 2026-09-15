import type { SaveRecord } from '../types'

interface SaveListProps {
  saves: SaveRecord[]
  selectedId: string | null
  onSelect: (save: SaveRecord) => void
}

export function SaveList({ saves, selectedId, onSelect }: SaveListProps) {
  return (
    <div className="save-list" role="listbox" aria-label="游戏存档">
      {saves.length === 0 ? (
        <div className="save-list__empty">暂无存档</div>
      ) : (
        saves.map((save) => {
          const active = save.id === selectedId

          return (
            <button
              key={save.id}
              type="button"
              className={`save-item${active ? ' is-active' : ''}`}
              onClick={() => onSelect(save)}
              role="option"
              aria-selected={active}
            >
              <span className="save-item__index">{save.id}</span>
              <span className="save-item__main">
                <span className="save-item__title">{save.title}</span>
                <span className="save-item__location">{save.location}</span>
              </span>
              <span className="save-item__date">{save.shortDate}</span>
            </button>
          )
        })
      )}
    </div>
  )
}
