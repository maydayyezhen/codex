import { useEffect, useState } from 'react'
import { MainMenu } from './components/MainMenu'
import { LoadGamePage } from './pages/LoadGamePage'
import { NewGamePage } from './pages/NewGamePage'
import { SettingsPage } from './pages/SettingsPage'
import type { Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && screen !== 'menu') {
        event.preventDefault()
        setScreen('menu')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen])

  if (screen === 'new-game') return <NewGamePage />
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
