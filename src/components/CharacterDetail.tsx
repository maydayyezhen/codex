import { useState } from 'react'
import type { CharacterProfile } from '../types'

interface CharacterDetailProps {
  character: CharacterProfile
  onClose: () => void
}

const skills = [
  ['侦查 Spot Hidden', 65],
  ['图书馆使用 Library Use', 70],
  ['心理学 Psychology', 50],
  ['聆听 Listen', 60],
  ['说服 Persuade', 55],
  ['手枪 Firearms', 55],
  ['斗殴 Fighting', 45],
  ['急救 First Aid', 40],
  ['历史 History', 45],
  ['神秘学 Occult', 25],
]

export function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  const [side, setSide] = useState<'front' | 'back'>('front')

  return (
    <div className="character-sheet-overlay" onClick={onClose} role="presentation">
      <section
        className="character-a4"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="character-a4__toolbar">
          <button className={side === 'front' ? 'active' : ''} onClick={() => setSide('front')}>正面</button>
          <button className={side === 'back' ? 'active' : ''} onClick={() => setSide('back')}>反面</button>
          <button onClick={onClose}>×</button>
        </header>

        {side === 'front' ? (
          <article className="character-a4__paper">
            <div className="character-a4__header">
              <div>
                <small>CALL OF CTHULHU 7E · INVESTIGATOR</small>
                <h2>{character.name}</h2>
                <p>{character.occupation}</p>
              </div>
              <div className="character-a4__portrait">PORTRAIT</div>
            </div>

            <section className="sheet-section">
              <h3>基础属性</h3>
              <div className="attribute-grid">
                {['STR','CON','SIZ','DEX','APP','INT','POW','EDU'].map((item) => (
                  <div key={item}><b>{item}</b><span>70</span><small>35 / 14</small></div>
                ))}
              </div>
            </section>

            <section className="sheet-section">
              <h3>资源状态</h3>
              <div className="resource-grid">
                <span>HP 10 / 10</span>
                <span>SAN 58 / 60</span>
                <span>MP 12 / 12</span>
                <span>LUCK 62</span>
                <span>BUILD 0</span>
                <span>DB +0</span>
              </div>
            </section>

            <section className="sheet-section">
              <h3>技能</h3>
              <div className="skill-grid">
                {skills.map(([name, value]) => (
                  <div key={name as string}>
                    <span>{name}</span>
                    <b>{value}</b>
                    <small>{Math.floor(Number(value) / 2)} / {Math.floor(Number(value) / 5)}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="sheet-section">
              <h3>武器与战斗</h3>
              <div className="weapon-table">
                徒手　45　1D3+DB<br />
                左轮　55　1D8　弹药6
              </div>
            </section>
          </article>
        ) : (
          <article className="character-a4__paper">
            <div className="sheet-section">
              <h3>我的故事</h3>
              <p>记录调查员经历、长期事件以及与神秘事件相关的变化。</p>
            </div>
            <div className="sheet-columns">
              <section><h3>思想与信念</h3><p>真相必须被记录。</p></section>
              <section><h3>重要之人</h3><p>家人、朋友、敌人。</p></section>
              <section><h3>恐惧与躁狂</h3><p>长期精神影响。</p></section>
              <section><h3>装备与财产</h3><p>物品、现金、资产。</p></section>
              <section><h3>典籍 / 法术 / 神秘物品</h3><p>异常记录。</p></section>
              <section><h3>同伴调查员</h3><p>同行角色。</p></section>
            </div>
          </article>
        )}
      </section>
    </div>
  )
}
