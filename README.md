# LORE

LORE UI prototype built with React, Vite and TypeScript.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/components/PageShell.tsx` — shared secondary-page shell; page title is an overlay and does not reserve content space.
- `src/components/PageHeader.tsx` — shared page title component.
- `src/pages/NewGamePage.tsx` — full-screen module selection.
- `src/pages/LoadGamePage.tsx` — save list + preview/detail layout.
- `src/data/` — prototype module/save data separated from UI.
- `docs/UI_DESIGN.md` — current UI design specification and interaction rules.

`Esc` returns from secondary pages to the main menu. No visible back button is rendered.

## UI design documentation rule

`docs/UI_DESIGN.md` is the source of truth for the current UI structure and design decisions.

Any change to layout, navigation behavior, interaction semantics, shared UI components, or visual hierarchy should update `docs/UI_DESIGN.md` in the same change.
