export type Screen = 'menu' | 'new-game' | 'character-select' | 'load-game' | 'settings'

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

export interface CharacterProfile {
  id: string
  name: string
  occupation: string
  avatarLabel: string
  age: number
  background: string
  strengths: string[]
  weaknesses: string[]
}
