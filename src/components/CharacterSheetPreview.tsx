interface CharacterSheetPreviewProps {
  name?: string
  occupation?: string
}

export function CharacterSheetPreview({
  name = '未命名调查员',
  occupation = '职业未选择',
}: CharacterSheetPreviewProps) {
  return (
    <div className="create-sheet-preview">
      <div className="create-sheet-paper">
        <header>
          <small>CALL OF CTHULHU 7E · INVESTIGATOR</small>
          <h2>{name}</h2>
          <p>{occupation}</p>
        </header>

        <div className="create-sheet-section">基础属性</div>
        <div className="create-sheet-section">资源状态</div>
        <div className="create-sheet-section">技能</div>
        <div className="create-sheet-section">武器与战斗</div>
      </div>
    </div>
  )
}
