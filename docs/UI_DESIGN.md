# LORE UI Design Specification

This document records the current UI structure, interaction rules, component boundaries, and visual/layout decisions for the LORE project.

> Maintenance rule: every change to page layout, navigation behavior, interaction semantics, shared components, or visual hierarchy must update this document in the same change.

## 1. Product direction

LORE is a narrative TRPG-style game UI. The interface should feel like a game rather than a web dashboard.

Current design priorities:

- restrained, minimal interface;
- strong use of typography, spacing, hierarchy, and negative space;
- no decorative UI added merely to make the page feel more game-like;
- avoid card-dashboard layouts unless the information model truly needs cards;
- secondary-page titles behave like an overlay/HUD layer, not like document-flow content;
- keyboard interaction is first-class;
- no visible back button in secondary pages.

## 2. Technology and project structure

Stack:

- React
- Vite
- TypeScript
- plain CSS for the current prototype

Current structure:

```text
src/
├─ components/
│  ├─ MainMenu.tsx
│  ├─ ModuleCarousel.tsx
│  ├─ PageHeader.tsx
│  ├─ PageShell.tsx
│  ├─ SaveDetail.tsx
│  └─ SaveList.tsx
├─ data/
│  ├─ modules.ts
│  └─ saves.ts
├─ pages/
│  ├─ LoadGamePage.tsx
│  ├─ NewGamePage.tsx
│  └─ SettingsPage.tsx
├─ App.tsx
├─ main.tsx
├─ settings.css
├─ styles.css
└─ types.ts
```

Prototype data is separated from UI components so backend/API data can replace it later without changing the page structure.

## 3. Global page model

### 3.1 Main menu

The main menu is a standalone centered screen and does not use `PageShell`.

Primary entries:

1. 继续游戏
2. 新游戏
3. 载入游戏

The title is `LORE`.

`设置` is a secondary system entry and is placed separately at the lower-left of the main menu screen rather than in the primary game-entry stack.

### 3.2 Secondary pages

All secondary pages use:

```text
PageShell
├─ PageHeader
└─ PageBody
```

`PageHeader` is an overlay layer. It is absolutely positioned using shared coordinates and does **not** reserve or consume layout space.

The page content layer always receives the full viewport. Each page decides its own internal composition independently of the title.

This is an architectural rule, not a page-specific style preference.

## 4. Shared title design

Component: `PageHeader.tsx`

Shared CSS coordinates:

- horizontal position: `--page-x`
- vertical position: `--page-y`

The header contains:

- a small path label, e.g. `LORE / NEW GAME`;
- the current page title, e.g. `选择模组`.

Rules:

- title position must remain consistent across secondary pages;
- pages must not individually redefine the global title position;
- title must not push page content downward;
- title is non-interactive and uses `pointer-events: none`;
- if the title overlaps a page composition, fix that page's composition rather than reintroducing shared header spacing.

## 5. Navigation and keyboard behavior

Current behavior:

- `Esc` on any secondary page returns to the main menu;
- there is no visible back button;
- module selection supports `ArrowLeft` / `ArrowRight`;
- load-game save selection supports `ArrowUp` / `ArrowDown`;
- settings uses `ArrowUp` / `ArrowDown` to select rows and `ArrowLeft` / `ArrowRight` to modify the selected value.

The absence of a visible back button is intentional and should be preserved unless the overall navigation model is explicitly redesigned.

## 6. New Game / module selection

Page: `NewGamePage.tsx`

Primary component: `ModuleCarousel.tsx`

### 6.1 Design goal

Module selection should feel like browsing worlds/stories rather than choosing a row from a management interface.

The page therefore uses a full-screen carousel instead of a list-detail layout.

### 6.2 Composition

The active module occupies the visual center of the full viewport.

Displayed information:

- current position, e.g. `01 / 05`;
- module title;
- tags;
- short hook;
- description;
- primary action: `继续`.

The primary action is deliberately labeled `继续`, not `开始游戏`.

### 6.3 Switching modules

Users can switch modules with:

- left/right arrow buttons;
- keyboard `ArrowLeft` / `ArrowRight`;
- pagination dots.

The left/right switch controls must not display adjacent module names. Only the directional controls remain visible.

### 6.4 Layout rule

The carousel is centered against the full viewport, not against the space below the title.

The shared `PageHeader` floats above it as an independent layer.

## 7. Load Game

Page: `LoadGamePage.tsx`

Components:

- `SaveList.tsx`
- `SaveDetail.tsx`

### 7.1 Design goal

The load screen follows a game-save master/detail pattern:

- left side: compact textual save list;
- right side: selected save preview and details.

It intentionally avoids a grid of dashboard-like cards.

### 7.2 Desktop composition

Conceptually:

```text
┌─────────────────────────────────────────────────────────┐
│ Header overlay                                          │
│                                                         │
│  ┌ fixed save browser ┐      ┌──────────────────────┐   │
│  │ 01 ...             │      │                      │   │
│  │ 02 ...             │      │       preview        │   │
│  │ 03 ...             │      │                      │   │
│  │ ... scroll ...     │      └──────────────────────┘   │
│  └────────────────────┘                                 │
│                              save title       载入游戏  │
│                              location                   │
│                              play time                  │
│                              saved at                   │
└─────────────────────────────────────────────────────────┘
```

Desktop layout behavior:

- the entire load-game composition is centered in the viewport;
- width is capped at 1200px;
- the left column is a fixed-height save browser with a persistent background color;
- save entries scroll inside that fixed browser region instead of changing page geometry;
- the right column uses the full height of the composition;
- the right preview is anchored to the top;
- save information and the primary action are anchored to the bottom;
- flexible vertical space separates preview and details;
- the preview is currently an empty 16:9 placeholder.

### 7.3 Save browser behavior

The left side is treated as one fixed visual region rather than a transparent list floating on the page background.

Its production structure is:

```text
SaveBrowser
└─ SaveList   ← internal scroll container
```

Rules:

- the browser background remains visible regardless of save count;
- the browser geometry must not grow with the number of saves;
- only `SaveList` scrolls;
- each save entry contains compact identifying information;
- the selected entry is visually emphasized;
- keyboard navigation keeps the selected entry visible inside the scroll viewport;
- the empty-list state remains valid even though the current prototype data contains saves.

The temporary add/delete/count stress-test controls used during layout validation have been removed and are not part of the production UI design.

### 7.4 Right-side detail behavior

The structural rule is:

```text
SaveDetail
├─ Preview            ← top anchor
└─ DetailContent      ← bottom anchor
   ├─ Save metadata
   └─ Load action
```

Desktop `SaveDetail` is a vertical flex container using `justify-content: space-between`.

The load button belongs to the bottom detail group and must not float independently elsewhere on the screen.

### 7.5 Mobile behavior

On narrow screens the master/detail layout becomes vertical.

The save browser receives an explicit mobile height so its background and internal scrolling behavior remain stable.

The desktop top/bottom anchoring rule is relaxed on mobile: `SaveDetail` becomes normal-height content with an explicit gap between preview and details.

The title remains an overlay. Any local spacing required for readability belongs to the page composition, not `PageShell`.

## 8. Settings

Page: `SettingsPage.tsx`

Styles: `settings.css`

### 8.1 Design goal

The settings screen is intentionally small and focused. It should not imitate a large AAA options menu with many tabs because the current product only needs two settings domains:

- DM Agent selection;
- audio levels.

The page uses plain grouped rows rather than cards, panels, or dashboard-style controls.

### 8.2 Main-menu entry

`设置` is placed at the lower-left of the main menu screen as a lower-priority system action.

It is visually separated from:

- 继续游戏;
- 新游戏;
- 载入游戏.

This separation communicates that settings are system-level rather than a primary game-entry action.

### 8.3 Composition

The settings content is centered in the full-screen page canvas while `PageHeader` remains an independent overlay.

Current groups:

```text
DM AGENT

主持模型                         ‹ ChatGPT ›


声音

主音量                           ───●──── 80
音乐音量                         ──●───── 60
音效音量                         ────●─── 70
```

No tab bar is used because the number of settings is currently small.

### 8.4 DM Agent

Available values:

- `ChatGPT`
- `DeepSeek`

The selector is a discrete left/right choice rather than a web-style dropdown.

The setting is stored in `localStorage` under `lore.dmAgent`.

### 8.5 Audio

Current values:

- 主音量;
- 音乐音量;
- 音效音量.

Audio values use sliders from 0 to 100 and are stored in `localStorage`:

- `lore.volume.master`
- `lore.volume.music`
- `lore.volume.effects`

The UI value updates immediately. Actual audio-engine binding will be added when the audio system exists; the settings architecture should not require an extra Apply/Save action.

### 8.6 Keyboard interaction

Settings use a game-menu interaction model:

- `ArrowUp` / `ArrowDown`: move the active setting row;
- `ArrowLeft` / `ArrowRight`: change the active value;
- volume changes use 5-point steps from the keyboard;
- `Esc`: return to the main menu.

Mouse interaction remains available for selecting rows, switching the DM Agent, and dragging volume sliders.

### 8.7 Apply/save behavior

There is no `应用`, `保存设置`, or confirmation button.

Changes are treated as immediate settings changes and persisted automatically.

## 9. Visual language

Current palette is intentionally neutral and provisional:

- near-black background;
- off-white primary text;
- multiple gray levels for hierarchy;
- restrained borders;
- no gradients, decorative textures, icons, or imagery required for the current prototype.

The current design relies primarily on:

- typography;
- spacing;
- alignment;
- contrast;
- motion;
- information hierarchy.

## 10. Component responsibilities

### `PageShell`

Responsible for:

- establishing the full-screen secondary-page coordinate system;
- rendering the shared page header overlay;
- providing a full-screen body canvas.

It must not add universal content offsets to make room for the title.

### `PageHeader`

Responsible only for shared secondary-page title presentation.

### `ModuleCarousel`

Responsible for:

- module selection state;
- left/right switching;
- keyboard switching;
- module pagination dots;
- module information presentation.

### `SaveList`

Responsible for:

- compact save selection;
- internal scrolling;
- the empty-list state;
- keeping the selected item visible inside the scroll viewport.

### `SaveDetail`

Responsible for:

- selected-save preview placeholder;
- selected-save metadata;
- load action;
- no-selection/empty-list detail state;
- top/bottom anchoring on desktop.

### `LoadGamePage`

Responsible for composing the fixed save browser and the save detail area, and for page-level keyboard selection behavior.

### `SettingsPage`

Responsible for:

- DM Agent selection;
- audio-value state;
- settings keyboard navigation;
- settings persistence through `localStorage`.

### `App`

Responsible for top-level screen selection and global `Esc` behavior.

## 11. Current non-goals

The current prototype intentionally does not yet define:

- final art direction;
- final fonts;
- production image assets;
- save screenshots;
- backend/API integration;
- actual audio-engine binding;
- DM Agent backend/provider initialization;
- persistent router architecture;
- character creation flow after module selection;
- final animation timing system;
- game-session screen.

These should be introduced incrementally without breaking the established layout rules above.

## 12. Change checklist

Whenever UI work is changed, check the following:

- Does the page still look like a game interface rather than a dashboard?
- Does `PageHeader` remain independent from page-body layout?
- Are titles still aligned consistently across pages?
- Is there any visible back button? If yes, remove it unless navigation is explicitly redesigned.
- Does `Esc` still return from secondary pages?
- Are keyboard controls preserved?
- Does the save browser keep fixed geometry as save count changes?
- Does a long save list scroll internally rather than expand the page?
- Does the selected save stay visible during keyboard navigation?
- Are settings still immediate and free of Apply/Save buttons?
- Is the settings entry visually secondary to the three main menu actions?
- Did a reusable layout pattern get duplicated instead of componentized?
- Does this document still describe the actual implementation?

If any answer changes, update this document together with the code.
