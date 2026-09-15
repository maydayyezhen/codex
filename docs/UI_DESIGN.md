# LORE UI Design Specification

This document records the current UI structure, interaction rules, component boundaries, and visual/layout decisions for the LORE project.

> Maintenance rule: every change to page layout, navigation behavior, interaction semantics, shared components, or visual hierarchy must update this document in the same change.

## 1. Product direction

LORE is a narrative TRPG-style game UI. The interface should feel like a game rather than a web dashboard.

Current design priorities:

- restrained, minimal interface;
- strong use of typography, spacing, hierarchy, and negative space;
- no decorative UI added merely to make the page feel more "game-like";
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
│  └─ NewGamePage.tsx
├─ App.tsx
├─ main.tsx
├─ styles.css
└─ types.ts
```

The UI is intentionally split into pages, reusable components, and prototype data. Prototype data should later be replaceable by backend/API data without rewriting the page components.

## 3. Global page model

### 3.1 Main menu

The main menu is a standalone centered screen and does not use `PageShell`.

Current entries:

1. 继续游戏
2. 新游戏
3. 载入游戏

The title is `LORE`.

### 3.2 Secondary pages

All secondary pages use:

```text
PageShell
├─ PageHeader
└─ PageBody
```

`PageHeader` is an overlay layer.

It is absolutely positioned using shared coordinates and does **not** reserve or consume layout space.

Conceptually:

```text
┌────────────────────────────────────────────┐
│  PageHeader overlay                       │
│  LORE / ...                               │
│  页面标题                                  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │      full-screen page canvas         │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

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
- title is non-interactive and currently uses `pointer-events: none`;
- if the title overlaps a page composition, fix that page's composition rather than reintroducing shared header spacing.

## 5. Navigation and keyboard behavior

Navigation is coordinated at the application level where appropriate.

Current behavior:

- `Esc` on any secondary page returns to the main menu;
- there is no visible back button;
- module selection supports `ArrowLeft` / `ArrowRight`;
- load-game save selection supports `ArrowUp` / `ArrowDown`.

The absence of a visible back button is intentional and should be preserved unless the overall navigation model is explicitly redesigned.

## 6. New Game / module selection

Page: `NewGamePage.tsx`

Primary component: `ModuleCarousel.tsx`

### 6.1 Design goal

Module selection should feel like browsing worlds/stories rather than choosing a row from a management interface.

Therefore the page uses a full-screen carousel instead of a list-detail layout.

### 6.2 Composition

The active module occupies the visual center of the entire viewport.

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

The left/right switch controls must **not display adjacent module names**. Only the directional controls remain visible.

### 6.4 Layout rule

The carousel is centered against the full viewport, not against the space below the title.

The shared `PageHeader` floats above it as an independent layer.

## 7. Load Game

Page: `LoadGamePage.tsx`

Components:

- `SaveList.tsx`
- `SaveDetail.tsx`

### 7.1 Design goal

The load screen follows a game-save master/detail pattern inspired by CRPG save interfaces:

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
│  │ count / test tools │      │                      │   │
│  │ 01 ...             │      │       preview        │   │
│  │ 02 ...             │      │                      │   │
│  │ 03 ...             │      └──────────────────────┘   │
│  │ ... scroll ...     │                                 │
│  └────────────────────┘      save title       载入游戏  │
│                              location                   │
│                              play time                  │
│                              saved at                   │
└─────────────────────────────────────────────────────────┘
```

The load-game composition is positioned independently within the full-screen canvas. The title overlay does not create top padding for the page.

Desktop layout behavior:

- the entire load-game composition is centered in the viewport;
- width is capped at 1200px;
- the left column occupies a fixed-height browser region within the composition;
- the left browser has a persistent background color even when it contains only a few saves or no saves;
- save entries scroll inside that fixed browser region rather than changing the page size;
- the right column uses the full height of the load-game composition;
- the right preview is anchored to the top of the right column;
- the save information and primary action are anchored to the bottom of the right column;
- the vertical space between preview and details is flexible and expands automatically;
- the right column therefore behaves as one vertically balanced unit rather than several floating blocks;
- the right preview is currently an empty 16:9 placeholder;
- no image assets are required at this stage.

The structural rule for the right column is:

```text
SaveDetail
├─ Preview            ← top anchor
└─ DetailContent      ← bottom anchor
   ├─ Save metadata
   └─ Load action
```

This is implemented with a vertical flex container using `justify-content: space-between`.

### 7.3 Save browser behavior

The left side is treated as one fixed visual region rather than a transparent list floating on the background.

Its structure is:

```text
SaveBrowser
├─ PrototypeToolbar
└─ SaveList            ← scroll container
```

The background belongs to the browser/list region itself, so its geometry remains visible regardless of how many saves are present.

Each save entry contains compact identifying information rather than a long narrative summary.

The selected entry is visually emphasized.

When the list exceeds the available height, only `SaveList` scrolls.

When keyboard navigation or a newly created test save selects an item outside the current viewport, the selected entry is automatically scrolled into view using nearest-edge behavior.

The empty-list state is supported and keeps the browser geometry intact.

### 7.4 Prototype save stress-test controls

The current prototype intentionally includes temporary controls in the fixed save browser:

- `新增存档` appends generated mock save data and selects the new record;
- `删除选中` removes the current record and moves selection to a neighboring record;
- all saves can be deleted, producing a valid empty state;
- the displayed save count updates dynamically.

These controls exist specifically to stress-test layout behavior with different save counts. They are **prototype/development controls**, not a final production interaction decision.

They are useful for validating:

- fixed browser height;
- scrolling behavior with many records;
- empty and near-empty states;
- selected-state stability after deletion;
- right-side detail behavior when no save exists;
- text overflow and spacing under changing data volume.

If these controls are removed later, the fixed-browser and dynamic-list behavior should remain.

### 7.5 Mobile behavior

On narrow screens the master/detail layout becomes vertical.

The save browser receives an explicit mobile height so that its fixed-background/scroll behavior can still be tested independently from the detail section.

The desktop top/bottom anchoring rule is relaxed on mobile: `SaveDetail` becomes normal-height content with an explicit gap between preview and details so that the vertical stack remains readable.

The title remains an overlay. Any spacing used to keep mobile content readable belongs to the load-game page's local layout and is not reserved by `PageShell`.

## 8. Visual language

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

## 9. Component responsibilities

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
- the empty-list state;
- keeping the currently selected item visible inside the scroll viewport.

### `SaveDetail`

Responsible for:

- the selected save preview placeholder;
- selected-save metadata;
- the load action;
- the no-selection/empty-list detail state;
- keeping the preview anchored to the top and the detail/action group anchored to the bottom on desktop.

### `LoadGamePage`

Currently also owns the prototype-only dynamic save collection used for layout stress testing.

### `App`

Currently responsible for top-level screen selection and global `Esc` behavior.

## 10. Current non-goals

The current prototype intentionally does not yet define:

- final art direction;
- final fonts;
- production image assets;
- save screenshots;
- backend/API integration;
- persistent navigation/router architecture;
- character creation flow after module selection;
- final animation timing system;
- game-session screen.

These should be introduced incrementally without breaking the established layout rules above.

## 11. Change checklist

Whenever UI work is changed, check the following:

- Does the page still look like a game interface rather than a dashboard?
- Does `PageHeader` remain independent from page-body layout?
- Are titles still aligned consistently across pages?
- Is there any visible back button? If yes, remove it unless the navigation design was explicitly changed.
- Does `Esc` still return from secondary pages?
- Are keyboard controls preserved?
- Does the save browser keep its fixed geometry when save count changes?
- Does the selected save remain visible when navigating a long list?
- Does deleting all saves produce a valid empty state?
- Did a reusable layout pattern get duplicated instead of componentized?
- Does this document still describe the actual implementation?

If any answer changes, update this document together with the code.
