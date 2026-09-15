import { ModuleCarousel } from '../components/ModuleCarousel'
import { PageShell } from '../components/PageShell'
import { gameModules } from '../data/modules'
import type { GameModule } from '../types'

interface NewGamePageProps {
  onContinue: (module: GameModule) => void
}

export function NewGamePage({ onContinue }: NewGamePageProps) {
  return (
    <PageShell path="LORE / NEW GAME" title="选择模组" bodyClassName="new-game-page">
      <ModuleCarousel modules={gameModules} onContinue={onContinue} />
    </PageShell>
  )
}
