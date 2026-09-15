import { ModuleCarousel } from '../components/ModuleCarousel'
import { PageShell } from '../components/PageShell'
import { gameModules } from '../data/modules'

export function NewGamePage() {
  return (
    <PageShell path="LORE / NEW GAME" title="选择模组" bodyClassName="new-game-page">
      <ModuleCarousel modules={gameModules} />
    </PageShell>
  )
}
