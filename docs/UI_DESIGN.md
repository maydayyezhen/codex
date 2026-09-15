# LORE UI Design Specification

This document records the current UI structure, interaction rules, component boundaries, and layout decisions for the LORE project.

> Maintenance rule: every change to page layout, navigation behavior, interaction semantics, shared components, visual hierarchy, or canonical media presentation must update the relevant documentation in the same change.

Image-production rules are canonical in [`IMAGE_ASSETS.md`](./IMAGE_ASSETS.md). Individual pages must not invent their own image ratios.

## 1. Product direction

LORE is a narrative TRPG-style game UI. The interface should feel like a game rather than a web dashboard.

Current principles:

- restrained, minimal interface;
- typography, spacing, hierarchy, and negative space do most of the visual work;
- avoid decorative UI added only to make the page feel more game-like;
- avoid dashboard/card-grid patterns unless the information model actually needs them;
- secondary-page titles are overlay/HUD elements, not document-flow content;
- keyboard interaction is first-class;
- secondary pages do not render visible back buttons.

## 2. Technology and project structure

Stack:

- React
- Vite
- TypeScript
- plain CSS

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
├─ media.css
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

`设置` is a secondary system action placed separately at the lower-left of the title screen rather than in the primary action stack.

### 3.2 Secondary pages

All secondary pages use:

```text
PageShell
├─ PageHeader
└─ PageBody
```

`PageHeader` is absolutely positioned and does **not** reserve layout space.

The page body always receives the full viewport. Each page independently decides where its main composition sits.

Rules:

- global title coordinates are shared;
- pages do not push their content down merely to make room for the title;
- if content visually conflicts with the title, fix that page composition rather than changing the shell rule;
- `PageHeader` is non-interactive.

## 4. Navigation model

There is no visible back button.

Current keyboard behavior:

- module selection: `ArrowLeft` / `ArrowRight`;
- character selection: `ArrowLeft` / `ArrowRight`;
- load-game selection: `ArrowUp` / `ArrowDown`;
- settings: `ArrowUp` / `ArrowDown` select rows, `ArrowLeft` / `ArrowRight` change values.

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

Deeper flows should preserve this layered/page-stack behavior rather than jumping directly to the main menu.

## 5. Shared carousel-control rule

All left/right carousels use compact arrow buttons.

Rules:

- hover feedback belongs only to the arrow button itself;
- the surrounding left/right side of the screen does not react;
- there is no full-height invisible side hit zone;
- there is no large translucent hover background;
- clicks are accepted only inside the compact arrow hit target;
- keyboard navigation remains available regardless of mouse hit-target size.

This currently applies to module selection and character selection and should be reused by future carousels.

## 6. New Game / module selection

Page: `NewGamePage.tsx`

Primary component: `ModuleCarousel.tsx`

The page uses a full-screen carousel with one active module at a time.

Displayed information:

- current position;
- module title;
- tags;
- short hook;
- description;
- `继续`.

Rules:

- adjacent module names are not displayed beside the arrows;
- carousel arrows follow the shared compact-control rule;
- `继续` confirms the module and enters character selection;
- the carousel is centered against the full viewport, not the space below the page title.

Current flow:

```text
Main menu
  ↓ 新游戏
Module selection
  ↓ 继续
Character selection
```

Module-specific character pools are not implemented yet; the prototype currently uses one shared character dataset.

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
- canonical portrait/card geometry in `media.css`

### 7.1 Three-slot carousel

Exactly three slots are visible:

```text
previous        selected/current        next
```

Rules:

- the center slot is the current selection;
- side slots show adjacent entries;
- the carousel loops continuously;
- side normal characters can be clicked to move them to the center;
- arrow buttons and keyboard arrows rotate the carousel;
- side cards are smaller/dimmer than the selected center slot;
- the final create-character card participates in the same loop and position count.

### 7.2 Normal character card

The compact selection layer shows only:

- portrait;
- name;
- occupation.

Interaction states:

**Default**

- portrait, name, occupation;
- no detail action visible.

**Hover**

- `详情` appears only while the mouse is over that specific card;
- moving the pointer away immediately hides it;
- selection alone does not keep `详情` visible.

**Selected**

- the center normal character is emphasized;
- only the selected normal character shows `继续` inside its own card.

Semantics:

- card body = select/center;
- `详情` = open that character's detail overlay;
- `继续` = confirm the selected character.

### 7.3 Create-character card

A special `创建新人物` card is always appended after predefined character entries.

It is a dedicated component, not fake `CharacterProfile` data.

Rules:

- whole card is the create action;
- displays `＋` and `创建新人物`;
- no occupation;
- no `详情`;
- no `继续`;
- participates in the same three-slot carousel, loop, scale/dim behavior, arrows, and position count;
- clicking it enters character creation even when it is currently a side slot.

### 7.4 Character detail

`详情` opens an overlay without replacing the selection page.

Current detail content:

- larger portrait;
- name;
- occupation;
- age;
- short background;
- strengths;
- weaknesses.

Closing the overlay preserves the exact carousel position.

### 7.5 Character creation

Page: `CharacterCreatePage.tsx`

Current state is intentionally a placeholder. The real creation form is not designed yet.

`Esc` returns to character selection.

## 8. Load Game

Page: `LoadGamePage.tsx`

Components:

- `SaveList.tsx`
- `SaveDetail.tsx`

The load screen follows a master/detail layout:

- left: compact textual save list;
- right: selected save preview and metadata.

Rules:

- composition is centered and capped at 1200px;
- the left save browser has fixed geometry and persistent background;
- long save lists scroll internally rather than expanding the page;
- the right preview is anchored at the top;
- metadata and `载入游戏` are anchored at the bottom;
- flexible vertical space separates preview from details;
- save preview uses the canonical 16:9 asset ratio.

## 9. Settings

Page: `SettingsPage.tsx`

Styles: `settings.css`

Current settings intentionally contain only:

- DM Agent: `ChatGPT` / `DeepSeek`;
- 主音量;
- 音乐音量;
- 音效音量.

Rules:

- no category tabs yet;
- DM Agent uses a left/right discrete selector rather than a dropdown;
- audio uses 0–100 sliders;
- keyboard audio adjustment uses 5-point steps;
- settings persist automatically in `localStorage`;
- no Apply/Save button;
- current audio values are UI state only until a real audio engine is connected.

## 10. Image asset system

Canonical image production rules live in [`IMAGE_ASSETS.md`](./IMAGE_ASSETS.md).

Current canonical ratios are:

| Asset | Ratio |
| --- | --- |
| Save screenshot | 16:9 |
| Module key art | 16:10 |
| Character portrait | 3:4 |

Implementation rules:

- ratios are defined centrally in `src/media.css`;
- individual pages/components must not redefine canonical image ratios;
- real images use cover-style fitting unless a context explicitly requires full uncropped display;
- character selection and detail reuse the same 3:4 portrait source;
- the character-card container itself is currently 3:5 because it also contains name, occupation, and contextual actions;
- module artwork is not rendered yet, but its 16:10 ratio is already reserved for future use.

Any change to these values must update both `media.css` and `IMAGE_ASSETS.md` in the same change.

## 11. Visual language

Current palette is neutral and provisional:

- near-black background;
- off-white primary text;
- gray hierarchy;
- restrained borders;
- no decorative textures or imagery required by the prototype.

The interface primarily relies on typography, spacing, alignment, contrast, motion, and information hierarchy.

## 12. Component responsibilities

### `PageShell`

Establishes the full-screen secondary-page coordinate system, shared title overlay, and full-screen body canvas.

### `ModuleCarousel`

Owns module browsing and module confirmation.

### `CharacterCarousel`

Owns current carousel index, three-slot looping, mixed normal/create entries, keyboard rotation, detail-overlay state, and character-flow back behavior.

### `CharacterCard`

Owns one normal character's compact selection card and local hover/selected actions.

### `CreateCharacterCard`

Owns the final special card that launches character creation.

### `CharacterDetail`

Owns the expanded character-sheet overlay.

### `CharacterCreatePage`

Currently provides the placeholder destination for the create-character action.

### `SaveList` / `SaveDetail`

Own save selection and selected-save presentation.

### `SettingsPage`

Owns DM Agent selection, audio values, keyboard control, and local persistence.

### `media.css`

Owns canonical media aspect-ratio tokens and shared image-fitting geometry.

### `App`

Owns top-level screen selection and shallow navigation transitions.

## 13. Current non-goals

The current prototype does not yet define:

- final art direction or fonts;
- production character portraits;
- production module artwork;
- production save screenshots;
- backend/API integration;
- module-specific character pools;
- actual audio-engine binding;
- DM Agent backend/provider initialization;
- persistent router architecture;
- actual character-creation form;
- the stage after character confirmation;
- final animation timing system;
- game-session screen.

## 14. Change checklist

Whenever UI work changes, verify:

- Does the page still feel like a game interface rather than a dashboard?
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
- Are canonical image ratios still sourced from `media.css` / `IMAGE_ASSETS.md` rather than page-specific CSS?
- Did reusable behavior get duplicated instead of componentized?
- Does this document still match the implementation?
