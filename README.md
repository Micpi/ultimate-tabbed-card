# Ultimate Tabbed Card

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://hacs.xyz)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue?style=for-the-badge&logo=home-assistant)](https://www.home-assistant.io)
[![Version](https://img.shields.io/github/v/release/Micpi/ultimate-tabbed-card?style=for-the-badge&label=Version)](https://github.com/Micpi/ultimate-tabbed-card/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/mickaelpila)

Ultimate Tabbed Card is a fast Lovelace container that lets you build tabbed dashboards from the Home Assistant visual editor. It keeps the familiar `custom:tabbed-card` type for compatibility and also exposes `custom:ultimate-tabbed-card` as an alias.

## Highlights

- Fully visual card configuration with Home Assistant native `ha-form` controls and selectors.
- Native entity, icon and template pickers are used throughout the tabbed-card editor.
- Child cards are added with the Home Assistant native card picker and edited with their own native visual editors when available.
- Appearance tuning includes color pickers, transparent buttons, reset buttons and plus/minus steppers for CSS sizes.
- The visual editor avoids full rebuilds, renders only the active editor section and loads child-card editors or the card picker only when opened.
- The live preview keeps the currently selected tab while child cards are edited.
- Lazy rendering by default, optional idle/all-tab preload, keep-alive mode and an optional max cache size.
- Multiple cards per tab with native visual add, duplicate, reorder and delete controls, including intentionally empty tabs while configuring.
- Top, bottom, left or right tabs with Material, Pills, Segmented, Minimal, Outline, Compact and Glass presets.
- Copy and paste child cards between tabs from the visual editor.
- Per-tab icon, label, deep-link id, disabled/hidden state, accent color and panel styling.
- Visibility conditions for entity states, users, media queries and Home Assistant templates.
- Badge support from static text, entity state or template results.
- Swipe navigation, keyboard navigation, Companion App haptic feedback, tab memory and URL hash deep links.
- URL hash deep links ignore unrelated Home Assistant hashes unless the card owns hash updates or a `hashPrefix` is configured.
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
- Appearance: tab position, alignment, visual preset, density, color pickers, transparent values, spacing and radius steppers.
- Tabs: labels, icons, ids, per-tab style controls, tab badges, visibility conditions and child cards.
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

## Complete Configuration Reference

```yaml
type: custom:tabbed-card
options:
  defaultTabIndex: 0
  keepAlive: true
  preload: active
  maxCachedTabs: 0
  remember: browser
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

The visual editor is the recommended workflow. YAML remains supported for sharing, backup, advanced custom cards, and manual migration.

### Card Type

Use either card type:

```yaml
type: custom:tabbed-card
```

```yaml
type: custom:ultimate-tabbed-card
```

### Top-Level Fields

| Field | Type | Description |
| --- | --- | --- |
| `type` | string | `custom:tabbed-card` or `custom:ultimate-tabbed-card`. |
| `options` | object | Behavior, navigation, caching, memory and accessibility options. |
| `styles` | object | Global visual styling for the card, tab bar, tabs and panels. |
| `tabs` | array | Required list of tab definitions. At least one tab is required. |

### Options

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTabIndex` | number | `0` | Zero-based fallback tab index used on first load. |
| `defaultTabId` | string | `""` | Preferred default tab by tab `attributes.id`. Takes priority over `defaultTabIndex`. |
| `keepAlive` | boolean | `true` | Keeps inactive tab card elements mounted instead of destroying them on each switch. |
| `lazy` | boolean | `true` | Legacy-friendly lazy flag. The effective preload behavior is controlled by `preload`. |
| `preload` | `active`, `idle`, `all` | `active` | `active` loads only the current tab, `idle` also prepares neighbors, `all` prepares every visible tab. |
| `maxCachedTabs` | number | `0` | Maximum number of cached tabs. `0` means no cache limit. |
| `showIcons` | boolean | `true` | Shows tab icons when configured. |
| `showLabels` | boolean | `true` | Shows tab labels. |
| `hideInactiveLabels` | boolean | `false` | Hides labels on inactive tabs, useful for compact mobile layouts. |
| `remember` | `none`, `card`, `browser`, `user` | `browser` | Persists the last selected tab after navigation/reload. `browser` remembers per device and dashboard path. `none` always falls back to default on a fresh load. |
| `storageKey` | string | `""` | Custom key for remembered tab state. Useful when multiple cards have similar tab ids. |
| `deepLink` | boolean | `true` | Allows URL hash selection when the hash belongs to this card. |
| `updateHash` | boolean | `false` | Updates the browser hash when a tab is selected. |
| `hashPrefix` | string | `""` | Prefix for tab hashes, for example `utc-`. With a prefix, only matching hashes are handled. |
| `swipe` | boolean | `true` | Enables horizontal swipe navigation on the panel. |
| `swipeThreshold` | number | `48` | Minimum horizontal swipe distance in pixels. |
| `haptic` | boolean | `false` | Emits Home Assistant haptic events and uses browser vibration when available. |
| `animate` | boolean | `true` | Animates the active panel when tabs change. |
| `keyboardNavigation` | boolean | `true` | Enables arrow, Home and End keyboard navigation between tabs. |
| `autoSelectFirstVisible` | boolean | `true` | Selects another visible enabled tab when the current tab is hidden or disabled. |
| `scrollActiveIntoView` | boolean | `true` | Scrolls the active tab button into view. |
| `ariaLabel` | string | `Tabbed card` | Accessible label for the tab list. |

### Global Styles

All color fields accept CSS colors, Home Assistant CSS variables such as `var(--primary-color)`, `rgba(...)`, `color-mix(...)`, or `transparent`.

| Field | Default | Description |
| --- | --- | --- |
| `tab_position` | `top` | Tab bar position: `top`, `bottom`, `left`, `right`. |
| `alignment` | `start` | Tab alignment: `start`, `center`, `end`, `stretch`. |
| `variant` | `pills` | Tab style: `pills`, `segmented`, `underline`, `minimal`. Presets set this automatically. |
| `density` | `comfortable` | `comfortable` or `compact`. |
| `icon_position` | `inline` | `inline` or `stacked`. |
| `equal_width` | `false` | Gives every tab the same width. Also implied by `alignment: stretch`. |
| `wrap_tabs` | `false` | Allows tabs to wrap instead of scrolling. |
| `background_color` | `var(--ha-card-background, var(--card-background-color, #fff))` | Outer card background. |
| `panel_background` | `transparent` | Content panel background. |
| `bar_background` | `transparent` | Tab bar background. |
| `text_color` | `var(--primary-text-color)` | Base text color. |
| `active_color` | `var(--primary-color)` | Active tab background/accent color. |
| `active_border_color` | `color-mix(in srgb, var(--primary-color) 50%, transparent)` | Active tab border or underline color. |
| `active_text_color` | `var(--text-primary-color, #fff)` | Active tab text color. |
| `inactive_color` | `var(--secondary-text-color)` | Inactive tab text/icon color. |
| `hover_color` | `rgba(127, 127, 127, 0.12)` | Hover and focus background. |
| `border_color` | `var(--divider-color)` | Borders and separators. |
| `badge_color` | `var(--error-color)` | Badge background. |
| `shadow` | `var(--ha-card-box-shadow, none)` | Outer card shadow. |
| `radius` | `var(--ha-card-border-radius, 12px)` | Outer card radius. |
| `tab_radius` | `10px` | Tab button radius. |
| `tab_gap` | `6px` | Space between tabs. |
| `tab_padding` | `9px 12px` | Tab button padding. |
| `tab_min_width` | `0px` | Minimum width per tab. |
| `tab_font_size` | `0.9rem` | Tab label font size. |
| `tab_font_weight` | `500` | Tab label font weight. |
| `tab_text_transform` | `none` | Label transform: `none`, `uppercase`, `lowercase`, `capitalize`. |
| `tab_border_width` | `1px` | Tab button border width. |
| `tab_icon_size` | `19px` | Tab icon size. |
| `header_padding` | `8px` | Padding around the tab bar. |
| `panel_padding` | `10px` | Padding around the active tab content. |
| `content_gap` | `10px` | Gap between multiple cards in the same tab. |
| `min_height` | `0px` | Minimum content panel height. |

### Appearance Presets

The visual editor includes these presets:

| Preset | Best for |
| --- | --- |
| `material` | Native Home Assistant style with underline tabs. |
| `pills` | Rounded tabs with clear active state. |
| `segmented` | Compact segmented control layout. |
| `minimal` | Transparent, low-chrome dashboards. |
| `outline` | Active tab outlined instead of filled. |
| `compact` | Dense dashboards and mobile views. |
| `glass` | Soft translucent tab bar styling. |

### Tabs

Each entry in `tabs` can contain `attributes`, `styles`, `badge`, `conditions`, and either `card` or `cards`.

```yaml
tabs:
  - attributes:
      label: Kitchen
      icon: mdi:countertop
      id: kitchen
      hidden: false
      disabled: false
    styles:
      accent_color: var(--warning-color)
      panel_background: transparent
      panel_padding: 8px
    badge:
      mode: state
      entity: sensor.kitchen_alerts
    conditions: []
    cards:
      - type: tile
        entity: light.kitchen
```

### Tab Attributes

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | string | `Tab N` | Visible tab label. |
| `icon` | icon | `""` | Material Design Icon, for example `mdi:home`. |
| `id` | string | generated from label | Stable id for defaults and deep links. |
| `hidden` | boolean | `false` | Hides the tab completely. |
| `disabled` | boolean | `false` | Shows the tab disabled and prevents activation. |

Legacy shortcuts are also accepted: `title`, `label`, `name`, `icon`, `id`, `hidden`, `disabled` at the tab root.

### Per-Tab Styles

| Field | Description |
| --- | --- |
| `accent_color` | Per-tab active accent. |
| `active_color` | Legacy alias used as per-tab active accent. |
| `color` | Per-tab button text color. |
| `text_color` | Legacy per-tab text color. |
| `background_color` | Per-tab button background. |
| `panel_background` | Background for this tab content panel. |
| `panel_padding` | Padding for this tab content panel. |

The visual editor exposes `accent_color`, `panel_background`, and `panel_padding` with picker/stepper controls.

### Child Cards

Use `card` for one child card or `cards` for multiple child cards.

```yaml
tabs:
  - attributes:
      label: Single
    card:
      type: tile
      entity: light.office
  - attributes:
      label: Stack
    cards:
      - type: markdown
        content: "## Office"
      - type: entities
        entities:
          - light.office
```

The visual editor uses the native Home Assistant card picker to add child cards. Cards that expose a native editor can be edited visually inside their tab. A JSON fallback remains available for custom cards without a visual editor.

Legacy area shortcuts are accepted and converted to an area card:

```yaml
tabs:
  - attributes:
      label: Kitchen
    area: kitchen
```

### Badges

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `none`, `dot`, `count`, `text`, `exclamation`, `state` | `dot` | Badge display mode. |
| `entity` | entity id | `""` | Entity used to decide badge visibility or text. |
| `state` | string | `""` | State comparison. Supports exact values and numeric comparisons like `> 0`. |
| `text` | string | `""` | Static badge text. |
| `template` | template | `""` | Home Assistant template used for badge visibility/text. |

Examples:

```yaml
badge:
  mode: dot
  entity: binary_sensor.front_door
  state: "on"
```

```yaml
badge:
  mode: count
  entity: sensor.open_windows
  state: "> 0"
```

### Visibility Conditions

Conditions are ANDed together: every condition must pass for the tab to be visible.

Entity condition:

```yaml
conditions:
  - type: entity
    entity: binary_sensor.guest_mode
    state: "on"
```

Supported entity fields:

| Field | Description |
| --- | --- |
| `entity` | Entity id to check. If `type` is omitted and `entity` is present, `type: entity` is inferred. |
| `attribute` | Optional attribute to check instead of the entity state. |
| `state` | Required state or numeric comparison, for example `on`, `> 20`, `<= 5`. |
| `state_not` | Hides the tab when this comparison matches. |
| `above` | Numeric lower bound. |
| `below` | Numeric upper bound. |
| `exists` | Set to `true` or `false` to check whether the entity exists. |

User condition:

```yaml
conditions:
  - type: user
    user: "user-id-1,user-id-2"
    user_not: "blocked-user-id"
```

Media condition:

```yaml
conditions:
  - type: media
    media_query: "(max-width: 700px)"
```

Template condition:

```yaml
conditions:
  - type: template
    template: "{{ is_state('input_boolean.show_energy', 'on') }}"
```

### Deep Links And Memory

The default memory mode for new cards is:

```yaml
options:
  remember: browser
```

This stores the last selected tab in browser/app local storage for the current Lovelace path. Existing cards created with older releases may still contain `remember: none`; change `General > Remember tab` to `Per browser path` in the visual editor to enable last-tab memory for those cards.

For predictable dashboards, use unique tab ids:

```yaml
options:
  defaultTabId: security
  deepLink: true
  updateHash: true
  hashPrefix: utc-
tabs:
  - attributes:
      label: Security
      id: security
```

With this setup, selecting the tab writes `#utc-security`. On load, only hashes starting with `utc-` are handled by this card, so unrelated Home Assistant hashes are ignored.

### Legacy Compatibility

The card accepts several older field names to ease migration:

| Legacy field | Normalized field |
| --- | --- |
| `default_tab` | `options.defaultTabIndex`, converted from 1-based to 0-based. |
| `default_tab_index` | `options.defaultTabIndex`. |
| `keep_alive` | `options.keepAlive`. |
| `lazy_load` | `options.lazy`. |
| `remember_tab` | `options.remember`. |
| `deep_link` | `options.deepLink`. |
| `update_hash` | `options.updateHash`. |
| `hash_prefix` | `options.hashPrefix`. |
| `enable_swipe` | `options.swipe`. |
| `swipe_threshold` | `options.swipeThreshold`. |
| `tabs_alignment` | `styles.alignment`. |
| `card_background` | `styles.background_color`. |
| `bar_padding` | `styles.header_padding`. |
| `card_padding` | `styles.panel_padding`. |
| `button_*` style fields | Matching tab style fields where possible. |

## Release Repository

The release repository is:

```text
Micpi/ultimate-tabbed-card
```
