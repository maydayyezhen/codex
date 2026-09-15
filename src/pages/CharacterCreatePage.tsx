import { PageShell } from '../components/PageShell'

export function CharacterCreatePage() {
  return (
    <PageShell path="LORE / CHARACTER" title="创建人物" bodyClassName="character-create-page">
      <div className="character-create-placeholder">
        <div className="character-create-placeholder__mark">＋</div>
        <p>人物创建流程将在下一步设计</p>
      </div>
    </PageShell>
  )
}
