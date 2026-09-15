import type { SaveRecord } from '../types'

interface SaveDetailProps {
  save: SaveRecord
}

export function SaveDetail({ save }: SaveDetailProps) {
  return (
    <section className="save-detail" aria-live="polite">
      <div className="save-detail__preview" aria-label="存档预览占位" />

      <div className="save-detail__content">
        <div>
          <h2 className="save-detail__title">{save.title}</h2>
          <p className="save-detail__location">{save.location} · {save.chapter}</p>
          <div className="save-detail__meta">
            <div>游戏时间：{save.duration}</div>
            <div>最后保存：{save.savedAt}</div>
          </div>
        </div>

        <button type="button" className="primary-action">载入游戏</button>
      </div>
    </section>
  )
}
