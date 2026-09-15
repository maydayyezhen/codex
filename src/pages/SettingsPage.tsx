import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/PageShell'

type DmAgent = 'ChatGPT' | 'DeepSeek'
type SettingKey = 'agent' | 'master' | 'music' | 'effects'

interface VolumeSetting {
  key: Exclude<SettingKey, 'agent'>
  label: string
  value: number
  setValue: (value: number) => void
}

const clampVolume = (value: number) => Math.min(100, Math.max(0, value))

const readStoredVolume = (key: string, fallback: number) => {
  const stored = window.localStorage.getItem(key)
  if (stored === null) return fallback
  const parsed = Number(stored)
  return Number.isFinite(parsed) ? clampVolume(parsed) : fallback
}

export function SettingsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [agent, setAgent] = useState<DmAgent>(() => {
    const stored = window.localStorage.getItem('lore.dmAgent')
    return stored === 'DeepSeek' ? 'DeepSeek' : 'ChatGPT'
  })
  const [masterVolume, setMasterVolume] = useState(() => readStoredVolume('lore.volume.master', 80))
  const [musicVolume, setMusicVolume] = useState(() => readStoredVolume('lore.volume.music', 60))
  const [effectsVolume, setEffectsVolume] = useState(() => readStoredVolume('lore.volume.effects', 70))

  const volumeSettings = useMemo<VolumeSetting[]>(
    () => [
      { key: 'master', label: '主音量', value: masterVolume, setValue: setMasterVolume },
      { key: 'music', label: '音乐音量', value: musicVolume, setValue: setMusicVolume },
      { key: 'effects', label: '音效音量', value: effectsVolume, setValue: setEffectsVolume },
    ],
    [masterVolume, musicVolume, effectsVolume],
  )

  useEffect(() => {
    window.localStorage.setItem('lore.dmAgent', agent)
  }, [agent])

  useEffect(() => {
    window.localStorage.setItem('lore.volume.master', String(masterVolume))
  }, [masterVolume])

  useEffect(() => {
    window.localStorage.setItem('lore.volume.music', String(musicVolume))
  }, [musicVolume])

  useEffect(() => {
    window.localStorage.setItem('lore.volume.effects', String(effectsVolume))
  }, [effectsVolume])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        const delta = event.key === 'ArrowUp' ? -1 : 1
        setSelectedIndex((current) => Math.min(3, Math.max(0, current + delta)))
        return
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

      event.preventDefault()
      const delta = event.key === 'ArrowLeft' ? -5 : 5

      if (selectedIndex === 0) {
        setAgent((current) => (current === 'ChatGPT' ? 'DeepSeek' : 'ChatGPT'))
        return
      }

      const setting = volumeSettings[selectedIndex - 1]
      setting.setValue(clampVolume(setting.value + delta))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, volumeSettings])

  const toggleAgent = () => {
    setAgent((current) => (current === 'ChatGPT' ? 'DeepSeek' : 'ChatGPT'))
  }

  return (
    <PageShell path="LORE / SETTINGS" title="设置" bodyClassName="settings-page">
      <div className="settings-layout">
        <section className="settings-group" aria-labelledby="dm-agent-heading">
          <h2 id="dm-agent-heading" className="settings-group__title">DM AGENT</h2>

          <button
            type="button"
            className={`settings-row${selectedIndex === 0 ? ' is-active' : ''}`}
            onClick={() => setSelectedIndex(0)}
          >
            <span className="settings-row__label">主持模型</span>
            <span className="settings-choice" onClick={toggleAgent}>
              <span aria-hidden="true">‹</span>
              <span className="settings-choice__value">{agent}</span>
              <span aria-hidden="true">›</span>
            </span>
          </button>
        </section>

        <section className="settings-group" aria-labelledby="audio-heading">
          <h2 id="audio-heading" className="settings-group__title">声音</h2>

          {volumeSettings.map((setting, index) => {
            const rowIndex = index + 1
            return (
              <div
                key={setting.key}
                className={`settings-row${selectedIndex === rowIndex ? ' is-active' : ''}`}
                onClick={() => setSelectedIndex(rowIndex)}
              >
                <span className="settings-row__label">{setting.label}</span>
                <div className="settings-volume">
                  <input
                    className="settings-volume__slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={setting.value}
                    tabIndex={-1}
                    aria-label={setting.label}
                    onChange={(event) => setting.setValue(Number(event.target.value))}
                  />
                  <span className="settings-volume__value">{setting.value}</span>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </PageShell>
  )
}
