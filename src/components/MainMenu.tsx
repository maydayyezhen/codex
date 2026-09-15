interface MainMenuProps {
  onContinue: () => void
  onNewGame: () => void
  onLoadGame: () => void
}

export function MainMenu({ onContinue, onNewGame, onLoadGame }: MainMenuProps) {
  return (
    <main className="main-menu-screen">
      <div className="main-menu">
        <h1 className="main-menu__logo">LORE</h1>
        <nav className="main-menu__actions" aria-label="主菜单">
          <button type="button" onClick={onContinue}>继续游戏</button>
          <button type="button" onClick={onNewGame}>新游戏</button>
          <button type="button" onClick={onLoadGame}>载入游戏</button>
        </nav>
      </div>
    </main>
  )
}
