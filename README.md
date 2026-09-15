# LORE

LORE UI prototype built with React, Vite and TypeScript.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/components/PageShell.tsx` — shared secondary-page layout and title placement.
- `src/components/PageHeader.tsx` — shared page title component.
- `src/pages/NewGamePage.tsx` — full-screen module selection.
- `src/pages/LoadGamePage.tsx` — save list + preview/detail layout.
- `src/data/` — prototype module/save data separated from UI.

`Esc` returns from secondary pages to the main menu. No visible back button is rendered.
