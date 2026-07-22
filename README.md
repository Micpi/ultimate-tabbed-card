# Ultimate Tabbed Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://hacs.xyz)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue?style=for-the-badge&logo=home-assistant)](https://www.home-assistant.io)
[![Version](https://img.shields.io/github/v/release/Micpi/ultimate-tabbed-card?style=for-the-badge&label=Version)](https://github.com/Micpi/ultimate-tabbed-card/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/mickaelpila)

Ultimate Tabbed Card is a fast Lovelace container that lets you build tabbed dashboards from the Home Assistant visual editor. It keeps the familiar `custom:tabbed-card` type for compatibility and also exposes `custom:ultimate-tabbed-card` as an alias.

## Highlights

- Fully visual card configuration with Home Assistant native `ha-form` controls and selectors.
- Native entity, icon, template and card type pickers are used throughout the editor.
- The tab editor includes the Home Assistant card picker when it is available, plus native child-card editors when cards support them.
- Lazy rendering by default, optional idle/all-tab preload, keep-alive mode and an optional max cache size.
- Multiple cards per tab with visual add, duplicate, reorder and delete controls.
- Top, bottom, left or right tabs with pill, segmented, underline and minimal presets.
- Per-tab icon, label, deep-link id, disabled/hidden state, accent color and panel styling.
- Visibility conditions for entity states, users, media queries and Home Assistant templates.
- Badge support from static text, entity state or template results.
- Swipe navigation, keyboard navigation, optional haptic feedback, tab memory and URL hash deep links.
- HACS-friendly single JavaScript module with no runtime dependency bundle.

## Installation

Add this repository to HACS as a Dashboard/Lovelace custom repository:

```text
https://github.com/Micpi/ultimate-tabbed-card
```

HACS installs this resource automatically:

```yaml
url: /hacsfiles/ultimate-tabbed-card/ultimate-tabbed-card.js
type: module
```

## Visual Editor

Add `Ultimate Tabbed Card` from the Home Assistant card picker, then use the visual editor sections:

- General: default tab, cache strategy, tab memory, deep links, swipe and display toggles.
- Appearance: tab position, alignment, visual preset, density, colors, spacing and radius.
- Tabs: labels, icons, ids, tab badges, visibility conditions and child cards.
- Advanced: read-only generated JSON for debugging or sharing.

The normal workflow does not require YAML. A JSON fallback remains available per child card for custom cards that do not expose their own visual editor.

## Minimal Example

```yaml
type: custom:tabbed-card
tabs:
  - attributes:
      label: Overview
      icon: mdi:view-dashboard
      id: overview
    card:
      type: tile
      entity: sun.sun
```

## Multi-Card Tab

```yaml
type: custom:tabbed-card
tabs:
  - attributes:
      label: Living room
      icon: mdi:sofa
      id: living-room
    cards:
      - type: tile
        entity: light.living_room
      - type: thermostat
        entity: climate.living_room
```

## Useful Options

```yaml
type: custom:tabbed-card
options:
  defaultTabIndex: 0
  keepAlive: true
  preload: active
  maxCachedTabs: 0
  remember: card
  deepLink: true
  updateHash: false
  swipe: true
styles:
  tab_position: top
  variant: pills
  alignment: start
  active_color: var(--primary-color)
  inactive_color: var(--secondary-text-color)
tabs:
  - attributes:
      label: Alerts
      icon: mdi:alert
      id: alerts
    badge:
      mode: count
      entity: sensor.unread_alerts
      state: "> 0"
    conditions:
      - entity: sensor.unread_alerts
        state: "> 0"
    card:
      type: entities
      entities:
        - sensor.unread_alerts
```

## Release Repository

The release repository is:

```text
Micpi/ultimate-tabbed-card
```
