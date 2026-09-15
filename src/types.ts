export type Screen = 'menu' | 'new-game' | 'load-game' | 'settings'

export interface SaveRecord {
  id: string
  title: string
  location: string
  chapter: string
  duration: string
  savedAt: string
  shortDate: string
}

export interface GameModule {
  id: string
  title: string
  tags: string[]
  hook: string
  description: string
}
