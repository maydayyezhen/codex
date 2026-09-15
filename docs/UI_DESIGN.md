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
│  ├─ CreateCharacterCard.tsx
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
│  ├─ CharacterCreatePage.tsx
│  ├─ CharacterSelectPage.tsx
│  ├─ LoadGamePage.tsx
│  ├─ NewGamePage.tsx
│  └─ SettingsPage.tsx
├─ App.tsx
├─ character-create.css
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

`Esc` follows navigation depth:

```text
Character detail overlay
  Esc → close detail

Character creation
  Esc → character selection

Character selection
  Esc → module selection

Module selection / Load game / Settings
  Esc → main menu
```

Deeper flows should preserve this layered/page-stack behavior instead of jumping directly to the main menu.

### 5.1 Carousel arrow interaction rule

All left/right carousel controls use compact arrow buttons rather than full-height side hit zones.

Rules:

- hover feedback belongs only to the arrow button itself;
- surrounding left/right screen areas do not react to hover;
- no large translucent side background is shown;
- clicking works only within the compact arrow button hit target;
- keyboard left/right navigation remains available independently of mouse hit-target size.

This rule applies to module selection and character selection and should be reused by future carousels.

## 6. New Game / module selection

Page: `NewGamePage.tsx`

Primary component: `ModuleCarousel.tsx`

The page uses a full-screen carousel. The active module occupies the visual center of the full viewport and displays:

- current position;
- module title;
- tags;
- short hook;
- description;
- primary action: `继续`.

The left/right controls do not display adjacent module names and follow the shared compact-arrow rule.

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
- `CreateCharacterCard.tsx`
- `CharacterDetail.tsx`

Styles:

- `character.css`
- `character-create.css`

### 7.1 Design goal

The first character-selection layer is visual and low-density. It answers one question: **who does the player want to play?**

A normal character card initially shows only:

- avatar/portrait area;
- character name;
- occupation.

The current prototype uses typographic avatar placeholders. Production portraits should replace the placeholder area without changing card geometry.

### 7.2 Three-slot carousel

Exactly three slots are visible at once:

```text
previous        selected/current        next
```

Rules:

- the center slot is the current carousel position;
- left/right slots show adjacent entries;
- the carousel loops continuously;
- clicking a normal side character moves it to the center;
- arrow buttons and keyboard `ArrowLeft` / `ArrowRight` rotate the carousel;
- side cards are smaller/dimmer than the center card;
- arrows use compact hit targets and only the icon/button itself reacts visually to hover.

The carousel entry count includes both normal character cards and the final create-character card.

### 7.3 Normal character-card interaction

**Default**

- avatar;
- name;
- occupation;
- no detail action visible.

**Hover**

- only while the mouse is over that card, `详情` fades into the card's upper-right corner;
- moving the pointer away hides `详情` immediately;
- selection alone does not keep `详情` visible.

**Selected**

- the center normal character card is visually emphasized;
- only the selected normal character card shows `继续` inside the card.

Interaction semantics:

- clicking card body = select/center that character;
- clicking `详情` = open that character's full sheet without changing pages;
- clicking `继续` = confirm the selected character and advance to the next game-flow stage.

The post-character gameplay stage is not implemented yet.

### 7.4 Create-character card

A special `创建新人物` card is appended **after all predefined character entries**.

It is not represented as fake `CharacterProfile` data. It is a dedicated carousel entry/component.

Visual rules:

- the whole card is a create action;
- it displays a large `＋` and `创建新人物`;
- it has no occupation;
- it has no `详情` action;
- it has no `继续` action;
- it participates in the same three-slot carousel, scaling, dimming, looping, position count, and left/right navigation as normal character entries.

Interaction rule:

- clicking the create-character card immediately enters the character-creation flow, regardless of whether that card is currently in the left, center, or right slot.

The current character-creation page is intentionally only a placeholder. Its form/layout will be designed separately.

### 7.5 Character detail overlay

`详情` opens an overlay above character selection instead of navigating to a new page.

The detail layer currently contains:

- larger portrait placeholder;
- name;
- occupation;
- age;
- short background;
- strengths;
- weaknesses.

Closing details returns the player to the exact same carousel position. `Esc` closes the detail overlay before page-level navigation occurs.

### 7.6 Character creation placeholder

Page: `CharacterCreatePage.tsx`

Current behavior:

- entered from the final `创建新人物` carousel card;
- uses the shared page header with title `创建人物`;
- currently contains only a minimal placeholder because the creation form has not yet been designed;
- `Esc` returns to character selection.

## 8. Load Game

Page: `LoadGamePage.tsx`

Components:

- `SaveList.tsx`
- `SaveDetail.tsx`

The load screen follows a master/detail pattern:

- left: compact textual save list;
- right: selected save preview and details.

Layout rules:

- composition centered in the viewport and capped at 1200px;
- left side is a fixed-height browser with persistent background;
- save entries scroll internally instead of changing page geometry;
- right preview is anchored at the top;
- save metadata and load action are anchored at the bottom;
- flexible vertical space separates preview and details;
- preview is currently an empty 16:9 placeholder.

## 9. Settings

Page: `SettingsPage.tsx`

Styles: `settings.css`

The current settings page contains only:

- DM Agent selection (`ChatGPT` / `DeepSeek`);
- 主音量;
- 音乐音量;
- 音效音量.

Settings are immediate and persist automatically in `localStorage`. There is no Apply/Save button.

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

Owns the current carousel index, three-slot looping behavior, mixed normal/create entries, keyboard rotation, detail-overlay state, and character-flow back behavior.

### `CharacterCard`

Owns one normal character's compact visual representation and local hover/selected actions.

### `CreateCharacterCard`

Owns the special final carousel entry that launches character creation.

### `CharacterDetail`

Owns the expanded character-sheet overlay.

### `CharacterCreatePage`

Currently provides the placeholder destination for the create-character action. The actual form is not yet designed.

### `SaveList` / `SaveDetail`

Own save selection and selected-save presentation respectively.

### `SettingsPage`

Owns DM Agent selection, audio values, keyboard control, and local persistence.

### `App`

Owns top-level screen selection and shallow navigation transitions.

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
- the actual character-creation form;
- the stage after character confirmation;
- final animation timing system;
- game-session screen.

## 13. Change checklist

Whenever UI work changes, verify:

- Does the page still look like a game interface rather than a dashboard?
- Does `PageHeader` remain independent from page-body layout?
- Are titles aligned consistently?
- Is there any visible back button? If yes, remove it unless navigation is explicitly redesigned.
- Does `Esc` follow the correct depth?
- Are keyboard controls preserved?
- Do carousel arrows respond only on their compact icon/button area?
- Does character selection still show exactly three slots?
- Is `详情` hidden unless its normal character card is hovered?
- Is `继续` only visible inside the selected normal character card?
- Is the create-character card always the final carousel entry and free of detail/continue controls?
- Does closing character detail preserve carousel selection?
- Does the save browser keep fixed geometry and internal scrolling?
- Are settings immediate and free of Apply/Save buttons?
- Did reusable behavior get duplicated instead of componentized?
- Does this document still match the implementation?

If any answer changes, update this document together with the code.
