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

Current structure includes:

```text
src/
├─ components/
│  ├─ CharacterCard.tsx
│  ├─ CharacterCarousel.tsx
│  ├─ CharacterDetail.tsx
│  ├─ MainMenu.tsx
│  ├─ ModuleCarousel.tsx
│  ├─ PageHeader.tsx
│  ├─ PageShell.tsx
│  ├─ SaveDetail.tsx
│  └─ SaveList.tsx
├─ data/
│  ├─ characters.ts
│  ├─ modules.ts
│  └─ saves.ts
├─ pages/
│  ├─ CharacterSelectPage.tsx
│  ├─ LoadGamePage.tsx
│  ├─ NewGamePage.tsx
│  └─ SettingsPage.tsx
├─ App.tsx
├─ character.css
├─ main.tsx
├─ settings.css
├─ styles.css
└─ types.ts
```

Prototype data is separated from UI components so backend/API data can replace it later without changing page structure.

## 3. Global page model

### 3.1 Main menu

The main menu is a standalone centered screen and does not use `PageShell`.

Primary entries:

1. 继续游戏
2. 新游戏
3. 载入游戏

The title is `LORE`.

`设置` is a secondary system entry placed separately at the lower-left of the main menu screen.

### 3.2 Secondary pages

All secondary pages use:

```text
PageShell
├─ PageHeader
└─ PageBody
```

`PageHeader` is an overlay layer. It is absolutely positioned using shared coordinates and does **not** reserve or consume layout space.

The page content layer always receives the full viewport. Each page decides its own internal composition independently of the title.

## 4. Shared title design

Component: `PageHeader.tsx`

Shared CSS coordinates:

- horizontal position: `--page-x`
- vertical position: `--page-y`

Rules:

- title position remains consistent across secondary pages;
- pages do not redefine the global title position;
- title must not push page content downward;
- title is non-interactive and uses `pointer-events: none`;
- title overlap is solved inside the page composition, never by restoring shared header spacing.

## 5. Navigation and keyboard behavior

Current behavior:

- there is no visible back button;
- module selection supports `ArrowLeft` / `ArrowRight`;
- load-game save selection supports `ArrowUp` / `ArrowDown`;
- settings uses `ArrowUp` / `ArrowDown` to select rows and `ArrowLeft` / `ArrowRight` to modify values;
- character selection supports `ArrowLeft` / `ArrowRight`.

`Esc` now follows navigation depth rather than always returning directly to the main menu:

```text
Character detail overlay
  Esc → close detail

Character selection
  Esc → module selection

Module selection / Load game / Settings
  Esc → main menu
```

This is the beginning of a layered/page-stack navigation model. Deeper flows should preserve this behavior rather than jumping directly to the main menu.

### 5.1 Carousel arrow interaction rule

All left/right carousel controls use compact arrow buttons rather than full-height side hit zones.

Rules:

- hover feedback belongs only to the arrow button itself;
- moving the pointer over the surrounding left/right side of the screen must not trigger hover styling;
- the arrow control does not render a large translucent side background on hover;
- clicking works only within the compact arrow button hit target;
- keyboard left/right navigation remains available independently of mouse hit-target size.

This rule currently applies to both module selection and character selection and should be reused by future carousels.

## 6. New Game / module selection

Page: `NewGamePage.tsx`

Primary component: `ModuleCarousel.tsx`

### 6.1 Design goal

Module selection should feel like browsing worlds/stories rather than choosing a row from a management interface.

The page uses a full-screen carousel.

### 6.2 Composition

The active module occupies the visual center of the full viewport.

Displayed information:

- current position;
- module title;
- tags;
- short hook;
- description;
- primary action: `继续`.

The left/right switch controls do not display adjacent module names.

The left/right controls follow the shared compact-arrow interaction rule: only the arrow itself has hover feedback and click behavior.

### 6.3 Continue behavior

`继续` confirms the current module and enters character selection.

Current flow:

```text
Main menu
  ↓ 新游戏
Module selection
  ↓ 继续
Character selection
```

The module-specific character pool is not yet implemented; the current prototype uses one shared character dataset.

## 7. Character selection

Page: `CharacterSelectPage.tsx`

Components:

- `CharacterCarousel.tsx`
- `CharacterCard.tsx`
- `CharacterDetail.tsx`

Styles: `character.css`

### 7.1 Design goal

The first character-selection layer is intentionally visual and low-density. It answers one question: **who does the player want to play?**

The default card must not expose the full character sheet.

Each visible character card initially shows only:

- avatar/portrait area;
- character name;
- occupation.

The current prototype uses typographic avatar placeholders because final portrait assets do not exist yet. Production portraits should replace the placeholder area without changing card geometry.

### 7.2 Three-slot carousel

Exactly three character cards are visible at once:

```text
previous        selected/current        next
```

Rules:

- the center card is always the selected character;
- left/right cards show the adjacent characters;
- the carousel loops continuously;
- clicking a side card moves it to the center;
- arrow buttons and keyboard `ArrowLeft` / `ArrowRight` also rotate the carousel;
- side cards are smaller/dimmer than the selected center card;
- the left/right arrows use compact hit targets and only the arrow itself responds visually to hover.

With five characters `A B C D E`, if `C` is selected the view is `B C D`; moving right produces `C D E`, then `D E A`.

### 7.3 Card interaction states

A character card has three interaction concepts:

**Default**

- avatar;
- name;
- occupation;
- no detail action visible.

**Hover**

- only while the mouse is over that card, `详情` fades into the card's upper-right corner;
- moving the pointer away hides `详情` immediately;
- selection alone must **not** make `详情` permanently visible.

**Selected**

- the center card is visually emphasized;
- only the selected card shows `继续` inside the card;
- `继续` belongs to the selected card rather than to a detached page-level action area.

Interaction semantics:

- clicking card body = select/center that character;
- clicking `详情` = open that specific character's full sheet without changing pages;
- clicking `继续` = confirm the selected character and advance to the next game-flow stage.

The post-character stage is not implemented yet, so `继续` currently stops at this prototype boundary.

### 7.4 Character detail overlay

`详情` opens an overlay above the character-selection page instead of navigating to a new page.

The detail layer currently contains:

- larger portrait placeholder;
- name;
- occupation;
- age;
- short background;
- strengths;
- weaknesses.

The character-selection state remains underneath the overlay, so closing details returns the player to the exact same carousel position.

`Esc` closes the detail overlay before any page-level navigation occurs.

## 8. Load Game

Page: `LoadGamePage.tsx`

Components:

- `SaveList.tsx`
- `SaveDetail.tsx`

### 8.1 Design goal

The load screen follows a game-save master/detail pattern:

- left: compact textual save list;
- right: selected save preview and details.

It avoids dashboard-style save cards.

### 8.2 Layout rules

- the composition is centered in the viewport and capped at 1200px;
- the left side is a fixed-height save browser with a persistent background;
- save entries scroll inside the browser instead of changing page geometry;
- the right preview is anchored at the top;
- save metadata and the load action are anchored at the bottom;
- flexible vertical space separates preview and details;
- the current preview is an empty 16:9 placeholder.

The temporary add/delete/count stress-test controls have been removed.

## 9. Settings

Page: `SettingsPage.tsx`

Styles: `settings.css`

### 9.1 Scope

The current settings page intentionally contains only:

- DM Agent selection;
- audio levels.

There is no tab bar because the settings set is small.

### 9.2 DM Agent

Available values:

- `ChatGPT`
- `DeepSeek`

The setting uses a left/right selector and is persisted in `localStorage` under `lore.dmAgent`.

### 9.3 Audio

Current values:

- 主音量;
- 音乐音量;
- 音效音量.

Values are 0–100 sliders and persist automatically in `localStorage`.

There is no Apply/Save button. Changes are immediate from the UI perspective; actual audio-engine binding is a future integration task.

## 10. Visual language

Current palette is neutral and provisional:

- near-black background;
- off-white primary text;
- gray hierarchy;
- restrained borders;
- no decorative textures or imagery required by the prototype.

The design relies primarily on typography, spacing, alignment, contrast, motion, and information hierarchy.

## 11. Component responsibilities

### `PageShell`

Establishes the full-screen secondary-page coordinate system, renders the shared header overlay, and provides a full-screen body canvas.

### `ModuleCarousel`

Owns module browsing and module confirmation.

### `CharacterCarousel`

Owns the selected-character index, three-slot looping behavior, keyboard rotation, detail-overlay state, and character-flow back behavior.

### `CharacterCard`

Owns one character's compact visual representation and local hover/selected actions.

### `CharacterDetail`

Owns the expanded character-sheet overlay.

### `SaveList` / `SaveDetail`

Own save selection and selected-save presentation respectively.

### `SettingsPage`

Owns DM Agent selection, audio values, keyboard control, and local persistence.

### `App`

Owns top-level screen selection. Global `Esc` handles shallow secondary pages, while character selection handles its deeper nested navigation locally.

## 12. Current non-goals

The current prototype does not yet define:

- final art direction or fonts;
- production character portraits;
- production save screenshots;
- backend/API integration;
- module-specific character pools;
- actual audio-engine binding;
- DM Agent backend/provider initialization;
- persistent router architecture;
- the stage after character confirmation;
- final animation timing system;
- game-session screen.

## 13. Change checklist

Whenever UI work changes, verify:

- Does the page still look like a game interface rather than a dashboard?
- Does `PageHeader` remain independent from page-body layout?
- Are titles aligned consistently?
- Is there any visible back button? If yes, remove it unless navigation is explicitly redesigned.
- Does `Esc` follow the correct depth rather than unexpectedly jumping screens?
- Are keyboard controls preserved?
- Do carousel arrows respond only on their compact icon/button area rather than full side regions?
- Does the character selector still show exactly three slots?
- Is `详情` hidden unless its card is hovered?
- Is `继续` only visible inside the selected character card?
- Does closing character detail preserve carousel selection?
- Does the save browser keep fixed geometry and internal scrolling?
- Are settings immediate and free of Apply/Save buttons?
- Did reusable behavior get duplicated instead of componentized?
- Does this document still match the implementation?

If any answer changes, update this document together with the code.
