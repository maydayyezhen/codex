import { useEffect, useState } from 'react'
import { MainMenu } from './components/MainMenu'
import { CharacterSelectPage } from './pages/CharacterSelectPage'
import { LoadGamePage } from './pages/LoadGamePage'
import { NewGamePage } from './pages/NewGamePage'
import { SettingsPage } from './pages/SettingsPage'
import type { CharacterProfile, Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (screen === 'menu' || screen === 'character-select') return

      event.preventDefault()
      setScreen('menu')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen])

  if (screen === 'new-game') {
    return <NewGamePage onContinue={() => setScreen('character-select')} />
  }

  if (screen === 'character-select') {
    return (
      <CharacterSelectPage
        onBack={() => setScreen('new-game')}
        onContinue={(_character: CharacterProfile) => undefined}
      />
    )
  }

  if (screen === 'load-game') return <LoadGamePage />
  if (screen === 'settings') return <SettingsPage />

  return (
    <MainMenu
      onContinue={() => undefined}
      onNewGame={() => setScreen('new-game')}
      onLoadGame={() => setScreen('load-game')}
      onSettings={() => setScreen('settings')}
    />
  )
}
