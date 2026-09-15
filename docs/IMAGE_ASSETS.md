# LORE Image Asset Specification

This document defines the canonical image specifications used by the LORE UI.

> Maintenance rule: image ratio, crop behavior, recommended source resolution, and safe-area rules must be changed here first. Individual pages must not invent their own image ratios.

## 1. Canonical asset classes

| Asset type | Canonical ratio | Recommended source | Minimum source | Preferred format |
| --- | --- | --- | --- | --- |
| Save screenshot | 16:9 | 1600×900 | 1280×720 | WebP / JPEG |
| Module key art | 16:10 | 1600×1000 | 1280×800 | WebP / JPEG |
| Character portrait | 3:4 | 1200×1600 | 600×800 | WebP / JPEG; PNG only when alpha is needed |

The ratios above are canonical. UI components should preserve these ratios instead of stretching assets to fit arbitrary boxes.

## 2. Save screenshots

### Purpose

Save screenshots represent the actual game state at the moment of saving.

### Specification

- ratio: **16:9**;
- recommended source: **1600×900**;
- minimum source: **1280×720**;
- preferred format: WebP, with JPEG as a fallback;
- UI ratio token: `--asset-ratio-save-preview`;
- default fit: `object-fit: cover` only when a real image element is introduced; same-ratio sources should normally require no crop.

### Composition rules

- treat the image as a gameplay frame, not as key art;
- do not bake save title, date, location, or UI labels into the screenshot;
- do not rely on important content sitting directly against the extreme edges;
- the save UI owns all metadata outside the image.

## 3. Module key art

### Purpose

Module artwork identifies the world/story and should feel more like key art than a gameplay screenshot.

### Specification

- ratio: **16:10**;
- recommended source: **1600×1000**;
- minimum source: **1280×800**;
- preferred format: WebP, with JPEG as a fallback;
- UI ratio token: `--asset-ratio-module-art`;
- default fit: `object-fit: cover`;
- default position: centered.

### Composition rules

- keep the main subject within roughly the central 80% of the frame;
- avoid important faces, landmarks, or silhouettes touching the outer edge;
- do not bake module title, tags, or description into the image;
- the UI renders module text independently so artwork can be reused in other contexts;
- artwork may be atmospheric, but it should remain readable when scaled down.

### Rationale for 16:10

The module image is intentionally slightly taller than the 16:9 save screenshot. This gives key art more vertical room and prevents module imagery from visually reading like another gameplay screenshot.

## 4. Character portraits

### Purpose

Character portraits are reused in character selection and expanded character detail.

### Specification

- ratio: **3:4**;
- recommended source: **1200×1600**;
- minimum source: **600×800**;
- preferred format: WebP or JPEG;
- PNG is reserved for portraits that genuinely require transparency;
- UI ratio token: `--asset-ratio-character-portrait`;
- default fit: `object-fit: cover`;
- default position: center/top.

### Composition rules

- frame the character as a portrait, ideally head plus upper torso;
- keep the face and identifying silhouette inside the central safe area;
- avoid placing the face at the extreme top edge;
- leave enough room around hair, hats, horns, or other identity-defining shapes;
- do not bake character name, profession, stats, or decorative frames into the image;
- the same portrait source should be reusable in both the compact selector card and the character-detail view.

## 5. Character card geometry

The portrait ratio and the card ratio are intentionally different.

A character card contains:

1. the 3:4 portrait;
2. character name;
3. occupation;
4. contextual actions such as `详情` and `继续`.

Therefore the current character-card container uses a taller **3:5** geometry via `--character-card-ratio`.

The 3:5 value is a UI container rule, not an image-asset rule.

## 6. Crop and scaling policy

General rules:

- never stretch an asset away from its canonical ratio;
- use `object-fit: cover` for real image elements unless a page explicitly requires full uncropped display;
- use the same canonical source across responsive breakpoints rather than producing arbitrary ratio variants;
- if a future context needs a different crop, define that derivative explicitly instead of silently changing the canonical asset ratio;
- text and UI controls should remain outside source artwork whenever possible.

## 7. Naming and storage convention

Recommended future asset structure:

```text
public/assets/
├─ saves/
│  └─ <save-id>.webp
├─ modules/
│  └─ <module-id>.webp
└─ characters/
   └─ <character-id>.webp
```

Naming rules:

- use stable IDs instead of display names;
- lowercase where practical;
- no spaces;
- do not encode mutable metadata such as dates or titles into canonical file names.

## 8. Current implementation status

Current UI status:

- save preview already uses the 16:9 canonical ratio;
- character portrait placeholders now reserve the 3:4 canonical portrait area;
- character cards use 3:5 UI geometry so portrait plus name/profession fit without distorting the portrait;
- module artwork is not yet rendered, but the 16:10 ratio is already defined centrally for future implementation.

The canonical CSS ratios live in `src/media.css` and must not be redefined per page.
