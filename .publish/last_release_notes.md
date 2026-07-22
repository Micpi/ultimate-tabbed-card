# v0.3.0 - Ultimate Tabbed Card

- Date: 2026-07-22
- Component: card / ultimate-tabbed-card
- Repository: Micpi/ultimate-tabbed-card
- Previous remote tag: v0.1.3
- HACS version: v0.3.0

## Summary

- Rebuilt the card around a high-performance lazy renderer with keep-alive support, optional idle/all-tab preload and optional cache limits.
- Added a complete visual editor for behavior, appearance, tabs, badges, visibility conditions and child cards.
- Added nested Home Assistant card editor support when child cards expose a native visual editor.
- Added multi-card tabs, tab memory, URL hash deep links, swipe navigation, keyboard navigation and optional haptic feedback.
- Added per-tab styling, badges and visibility rules for entities, users, media queries and templates.
- Aligned HACS metadata and package metadata to v0.3.0.

## Validation

- `node --check ultimate-tabbed-card.js`
- `npm run build`
- `git diff --check`

## HACS update notes

- HACS should detect this release from tag `v0.3.0`.
- If the update does not appear immediately, refresh HACS cache or wait for the next HACS refresh cycle.
