import { PageShell } from '../components/PageShell'
import { CharacterSheetPreview } from '../components/CharacterSheetPreview'

export function CharacterCreatePage() {
  return (
    <PageShell path="LORE / CHARACTER" title="创建人物" bodyClassName="character-create-page">
      <div className="character-create-layout">
        <CharacterSheetPreview />

        <section className="character-create-chat">
          <header>
            <p>DM AGENT</p>
            <span>ChatGPT</span>
          </header>

          <div className="character-create-chat__messages">
            <div className="agent-message">
              欢迎，调查员。让我们开始创造你的角色。
            </div>
            <div className="player-message">
              我想创建一名调查记者。
            </div>
            <div className="agent-message">
              很好。接下来，我们确定他的过去与动机。
            </div>
          </div>

          <div className="character-create-chat__input">
            输入你的想法...
          </div>
        </section>
      </div>
    </PageShell>
  )
}
