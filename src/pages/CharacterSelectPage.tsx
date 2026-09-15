import { CharacterCarousel } from '../components/CharacterCarousel'
import { PageShell } from '../components/PageShell'
import { characters } from '../data/characters'
import type { CharacterProfile } from '../types'

interface CharacterSelectPageProps {
  onContinue: (character: CharacterProfile) => void
  onCreate: () => void
  onBack: () => void
}

export function CharacterSelectPage({ onContinue, onCreate, onBack }: CharacterSelectPageProps) {
  return (
    <PageShell path="LORE / CHARACTER" title="选择人物" bodyClassName="character-select-page">
      <CharacterCarousel
        characters={characters}
        onContinue={onContinue}
        onCreate={onCreate}
        onBack={onBack}
      />
    </PageShell>
  )
}
