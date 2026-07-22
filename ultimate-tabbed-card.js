;(function () {
  "use strict"

  const VERSION = "0.3.11"
  const CARD_TYPE = "tabbed-card"
  const ALT_CARD_TYPE = "ultimate-tabbed-card"
  const CARD_EDITOR_TYPE = "tabbed-card-editor"
  const ALT_CARD_EDITOR_TYPE = "ultimate-tabbed-card-editor"

  const DEFAULT_OPTIONS = {
    defaultTabIndex: 0,
    defaultTabId: "",
    keepAlive: true,
    lazy: true,
    preload: "active",
    maxCachedTabs: 0,
    showIcons: true,
    showLabels: true,
    hideInactiveLabels: false,
    remember: "none",
    storageKey: "",
    deepLink: true,
    updateHash: false,
    hashPrefix: "",
    swipe: true,
    swipeThreshold: 48,
    haptic: false,
    animate: true,
    keyboardNavigation: true,
    autoSelectFirstVisible: true,
    scrollActiveIntoView: true,
    ariaLabel: "Tabbed card",
  }

  const DEFAULT_STYLES = {
    tab_position: "top",
    alignment: "start",
    variant: "pills",
    density: "comfortable",
    icon_position: "inline",
    equal_width: false,
    wrap_tabs: false,
    background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
    panel_background: "transparent",
    bar_background: "transparent",
    text_color: "var(--primary-text-color)",
    active_color: "var(--primary-color)",
    active_border_color: "color-mix(in srgb, var(--primary-color) 50%, transparent)",
    active_text_color: "var(--text-primary-color, #fff)",
    inactive_color: "var(--secondary-text-color)",
    hover_color: "rgba(127, 127, 127, 0.12)",
    border_color: "var(--divider-color)",
    badge_color: "var(--error-color)",
    shadow: "var(--ha-card-box-shadow, none)",
    radius: "var(--ha-card-border-radius, 12px)",
    tab_radius: "10px",
    tab_gap: "6px",
    tab_padding: "9px 12px",
    tab_min_width: "0px",
    tab_font_size: "0.9rem",
    tab_font_weight: "500",
    tab_text_transform: "none",
    tab_border_width: "1px",
    tab_icon_size: "19px",
    header_padding: "8px",
    panel_padding: "10px",
    content_gap: "10px",
    min_height: "0px",
  }

  const STYLE_PRESETS = {
    material: {
      variant: "underline",
      density: "comfortable",
      tab_radius: "0px",
      tab_padding: "12px 16px",
      tab_gap: "2px",
      tab_font_weight: "600",
      tab_text_transform: "none",
      tab_border_width: "0px",
      bar_background: "transparent",
      active_color: "var(--primary-color)",
      active_border_color: "var(--primary-color)",
      active_text_color: "var(--primary-color)",
      hover_color: "rgba(127, 127, 127, 0.12)",
      border_color: "var(--divider-color)",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
    pills: {
      variant: "pills",
      density: "comfortable",
      tab_radius: "999px",
      tab_padding: "9px 14px",
      tab_gap: "6px",
      tab_font_weight: "600",
      tab_text_transform: "none",
      tab_border_width: "1px",
      bar_background: "transparent",
      active_color: "var(--primary-color)",
      active_border_color: "color-mix(in srgb, var(--primary-color) 50%, transparent)",
      active_text_color: "var(--text-primary-color, #fff)",
      hover_color: "rgba(127, 127, 127, 0.12)",
      border_color: "var(--divider-color)",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
    segmented: {
      variant: "segmented",
      density: "compact",
      tab_radius: "8px",
      tab_padding: "8px 12px",
      tab_gap: "0px",
      tab_font_weight: "600",
      tab_text_transform: "none",
      tab_border_width: "1px",
      bar_background: "rgba(127, 127, 127, 0.10)",
      active_color: "var(--primary-color)",
      active_border_color: "color-mix(in srgb, var(--primary-color) 50%, transparent)",
      active_text_color: "var(--text-primary-color, #fff)",
      hover_color: "rgba(127, 127, 127, 0.12)",
      border_color: "var(--divider-color)",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
    minimal: {
      variant: "minimal",
      density: "compact",
      tab_radius: "8px",
      tab_padding: "7px 10px",
      tab_gap: "4px",
      tab_font_weight: "500",
      tab_text_transform: "none",
      tab_border_width: "0px",
      bar_background: "transparent",
      active_color: "var(--primary-color)",
      active_border_color: "var(--primary-color)",
      active_text_color: "var(--primary-color)",
      hover_color: "rgba(127, 127, 127, 0.12)",
      background_color: "transparent",
      border_color: "transparent",
      shadow: "none",
    },
    outline: {
      variant: "pills",
      density: "comfortable",
      tab_radius: "8px",
      tab_padding: "8px 12px",
      tab_gap: "8px",
      tab_font_weight: "600",
      tab_text_transform: "none",
      tab_border_width: "1px",
      active_text_color: "var(--primary-color)",
      bar_background: "transparent",
      active_color: "transparent",
      active_border_color: "var(--primary-color)",
      hover_color: "rgba(127, 127, 127, 0.10)",
      border_color: "var(--primary-color)",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
    compact: {
      variant: "segmented",
      density: "compact",
      tab_radius: "6px",
      tab_padding: "6px 9px",
      tab_gap: "0px",
      tab_font_size: "0.82rem",
      tab_font_weight: "600",
      tab_text_transform: "none",
      tab_border_width: "1px",
      bar_background: "rgba(127, 127, 127, 0.10)",
      active_color: "var(--primary-color)",
      active_border_color: "color-mix(in srgb, var(--primary-color) 50%, transparent)",
      active_text_color: "var(--text-primary-color, #fff)",
      hover_color: "rgba(127, 127, 127, 0.12)",
      border_color: "var(--divider-color)",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
    glass: {
      variant: "pills",
      density: "comfortable",
      tab_radius: "14px",
      tab_padding: "10px 14px",
      tab_gap: "8px",
      tab_font_weight: "600",
      tab_border_width: "1px",
      bar_background: "rgba(127, 127, 127, 0.08)",
      active_color: "color-mix(in srgb, var(--primary-color) 82%, transparent)",
      active_border_color: "color-mix(in srgb, var(--primary-color) 45%, transparent)",
      active_text_color: "var(--text-primary-color, #fff)",
      hover_color: "rgba(127, 127, 127, 0.16)",
      border_color: "color-mix(in srgb, var(--primary-color) 28%, var(--divider-color))",
      background_color: "var(--ha-card-background, var(--card-background-color, #fff))",
      shadow: "var(--ha-card-box-shadow, none)",
    },
  }

  const STYLE_PRESET_OPTIONS = [
    ["material", "Material"],
    ["pills", "Pills"],
    ["segmented", "Segmented"],
    ["minimal", "Minimal"],
    ["outline", "Outline"],
    ["compact", "Compact"],
    ["glass", "Glass"],
  ]

  const COLOR_STYLE_FIELDS = [
    "background_color",
    "panel_background",
    "bar_background",
    "text_color",
    "active_color",
    "active_border_color",
    "active_text_color",
    "inactive_color",
    "hover_color",
    "border_color",
    "badge_color",
  ]

  const TAB_SIZE_STYLE_FIELDS = [
    "tab_min_width",
    "tab_font_size",
    "tab_font_weight",
    "tab_border_width",
    "tab_icon_size",
  ]

  const SPACING_STYLE_FIELDS = [
    "radius",
    "tab_radius",
    "tab_padding",
    "header_padding",
    "panel_padding",
    "tab_gap",
    "content_gap",
    "min_height",
  ]

  const TAB_COLOR_FIELDS = ["accent_color", "panel_background"]
  const TAB_SIZE_FIELDS = ["panel_padding"]
  const TAB_STYLE_DEFAULTS = {
    accent_color: "",
    panel_background: "",
    panel_padding: "",
  }

  const STYLE_STEPPER_SETTINGS = {
    radius: { step: 1, min: 0, unit: "px" },
    tab_radius: { step: 1, min: 0, unit: "px" },
    tab_padding: { step: 1, min: 0, unit: "px" },
    header_padding: { step: 1, min: 0, unit: "px" },
    panel_padding: { step: 1, min: 0, unit: "px" },
    tab_gap: { step: 1, min: 0, unit: "px" },
    content_gap: { step: 1, min: 0, unit: "px" },
    min_height: { step: 1, min: 0, unit: "px" },
    tab_min_width: { step: 1, min: 0, unit: "px" },
    tab_font_size: { step: 0.05, min: 0, unit: "rem", precision: 2 },
    tab_font_weight: { step: 100, min: 100, max: 900, unit: "", precision: 0 },
    tab_border_width: { step: 1, min: 0, unit: "px" },
    tab_icon_size: { step: 1, min: 0, unit: "px" },
  }

  const CARD_CLIPBOARD_KEY = "ultimate-tabbed-card:card-clipboard"
  const ACTIVE_TAB_MEMORY_MAX_AGE = 10 * 60 * 1000

  let instanceCounter = 0

  function clone(value) {
    if (value === undefined) return undefined
    if (typeof structuredClone === "function") {
      return structuredClone(value)
    }
    return JSON.parse(JSON.stringify(value))
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
  }

  function toNumber(value, fallback = 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function asBool(value, fallback = false) {
    if (typeof value === "boolean") return value
    if (typeof value === "number") return value !== 0
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase()
      if (["true", "yes", "on", "1"].includes(normalized)) return true
      if (["false", "no", "off", "0"].includes(normalized)) return false
    }
    return fallback
  }

  function asString(value, fallback = "") {
    if (value === undefined || value === null) return fallback
    return String(value)
  }

  function enumValue(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : []
  }

  function dispatchConfigChanged(el, config) {
    el.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    )
  }

  function dispatchHaptic(el, type = "selection") {
    el.dispatchEvent(
      new CustomEvent("haptic", {
        detail: type,
        bubbles: true,
        composed: true,
      })
    )
    if (navigator.vibrate) {
      try {
        navigator.vibrate(type === "heavy" ? 18 : type === "medium" ? 12 : 8)
      } catch (_) {}
    }
  }

  function serializeConfig(config) {
    try {
      return JSON.stringify(config)
    } catch (_) {
      return ""
    }
  }

  function getFirstAreaId(hass) {
    const areas = hass?.areas
    if (!areas) return ""
    const firstKey = Object.keys(areas)[0]
    return firstKey || Object.values(areas)[0]?.area_id || ""
  }

  function normalizeChildCardConfig(card, hass, fallbackType = "") {
    const next = clone(card)
    if (!isObject(next)) return next
    if (!next.type) {
      next.type = fallbackType || (next.area || next.area_id ? "area" : "")
    }
    if (next.type === "area") {
      if (!next.area && next.area_id) next.area = next.area_id
      delete next.area_id
      if (!next.area) next.area = getFirstAreaId(hass)
    }
    return next
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }

  function cssColorToHex(value) {
    const text = asString(value, "").trim()
    let match = text.match(/^#([0-9a-f]{3})$/i)
    if (match) {
      return (
        "#" +
        match[1]
          .split("")
          .map((part) => part + part)
          .join("")
          .toLowerCase()
      )
    }
    match = text.match(/^#([0-9a-f]{6})$/i)
    if (match) return "#" + match[1].toLowerCase()
    match = text.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
    if (!match) return ""
    const toByte = (part) => clamp(Math.round(Number(part)), 0, 255).toString(16).padStart(2, "0")
    return "#" + toByte(match[1]) + toByte(match[2]) + toByte(match[3])
  }

  function decimalPlaces(value) {
    const text = String(value)
    return text.includes(".") ? text.split(".")[1].length : 0
  }

  function formatCssNumber(value, precision) {
    const rounded = precision > 0 ? value.toFixed(precision) : String(Math.round(value))
    if (!rounded.includes(".")) return rounded
    const cleaned = rounded.replace(/\.?0+$/, "")
    return cleaned || "0"
  }

  function stepCssValue(value, fallback, direction, settings = {}) {
    const source = asString(value || fallback || "", "")
    const step = Number(settings.step || 1) * direction
    const numberPattern = /(-?\d*\.?\d+)([a-z%]*)/gi
    const matches = [...source.matchAll(numberPattern)]
    if (!matches.length) {
      const next = Math.max(settings.min ?? 0, step > 0 ? step : 0)
      return formatCssNumber(next, settings.precision || 0) + asString(settings.unit, "px")
    }

    const adjust = (numberText, unitText) => {
      const current = Number(numberText)
      const precision = settings.precision ?? Math.max(decimalPlaces(numberText), decimalPlaces(settings.step || 1))
      let next = current + step
      if (settings.min !== undefined) next = Math.max(settings.min, next)
      if (settings.max !== undefined) next = Math.min(settings.max, next)
      return formatCssNumber(next, precision) + (unitText || asString(settings.unit, ""))
    }

    if (/\b(var|calc|clamp|min|max)\(/i.test(source)) {
      const last = matches[matches.length - 1]
      return adjust(last[1], last[2])
    }

    return source.replace(numberPattern, (_full, numberText, unitText) => adjust(numberText, unitText))
  }

  function slugify(value, fallback) {
    const text = asString(value, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    return text || fallback
  }

  function resolveTabLabel(tab, index) {
    return (
      tab?.title ||
      tab?.attributes?.label ||
      tab?.label ||
      tab?.name ||
      "Tab " + String(index + 1)
    )
  }

  function resolveTabIcon(tab) {
    return tab?.icon || tab?.attributes?.icon || ""
  }

  function resolveTabId(tab, label, index) {
    return tab?.id || tab?.attributes?.id || slugify(label, "tab-" + String(index + 1))
  }

  function normalizeCards(tab) {
    if (Array.isArray(tab?.cards) && tab.cards.length) {
      return tab.cards.filter(isObject).map((card) => normalizeChildCardConfig(card))
    }
    if (isObject(tab?.card)) {
      return [normalizeChildCardConfig(tab.card)]
    }
    if (tab?.area || tab?.area_id) {
      return [normalizeChildCardConfig({ type: "area", area: tab.area, area_id: tab.area_id })]
    }
    return []
  }

  function normalizeBadge(tab) {
    const source = isObject(tab?.badge) ? tab.badge : {}
    const legacyBadge = !isObject(tab?.badge) ? tab?.badge : undefined
    return {
      mode: enumValue(
        source.mode || tab?.badge_display || tab?.badgeMode || "dot",
        ["none", "dot", "count", "text", "exclamation", "state"],
        "dot"
      ),
      entity: asString(source.entity || tab?.badge_entity || "", ""),
      state: asString(source.state || tab?.badge_state || "", ""),
      text: asString(source.text || legacyBadge || "", ""),
      template: asString(source.template || tab?.badge_template || "", ""),
    }
  }

  function normalizeCondition(condition) {
    if (!isObject(condition)) return null
    if (condition.entity) {
      return {
        type: "entity",
        entity: asString(condition.entity, ""),
        attribute: asString(condition.attribute, ""),
        state: asString(condition.state ?? "", ""),
        state_not: asString(condition.state_not ?? condition.not_state ?? "", ""),
        above: condition.above ?? "",
        below: condition.below ?? "",
        exists: condition.exists,
      }
    }
    if (condition.user || condition.user_not) {
      return {
        type: "user",
        user: Array.isArray(condition.user) ? condition.user.join(",") : asString(condition.user, ""),
        user_not: Array.isArray(condition.user_not)
          ? condition.user_not.join(",")
          : asString(condition.user_not, ""),
      }
    }
    if (condition.media_query || condition.mediaQuery) {
      return {
        type: "media",
        media_query: asString(condition.media_query || condition.mediaQuery, ""),
      }
    }
    if (condition.template) {
      return { type: "template", template: asString(condition.template, "") }
    }
    return null
  }

  function normalizeTab(tab, index) {
    const label = asString(resolveTabLabel(tab, index), "Tab " + String(index + 1))
    const cards = normalizeCards(tab)
    const attr = tab?.attributes || {}
    const styles = isObject(tab?.styles) ? clone(tab.styles) : {}

    return {
      attributes: {
        label,
        icon: asString(resolveTabIcon(tab), ""),
        id: asString(resolveTabId(tab, label, index), "tab-" + String(index + 1)),
        hidden: asBool(attr.hidden ?? tab?.hidden, false),
        disabled: asBool(attr.disabled ?? tab?.disabled, false),
      },
      badge: normalizeBadge(tab),
      conditions: safeArray(tab?.conditions || attr.conditions).map(normalizeCondition).filter(Boolean),
      cards,
      styles,
    }
  }

  function normalizeConfig(inputConfig) {
    const source = inputConfig || {}
    const tabs = safeArray(source.tabs)

    if (!tabs.length) {
      throw new Error("Tabbed Card: at least one tab is required.")
    }

    const optionsSource = source.options || {}
    const legacyDefaultTab =
      source.default_tab !== undefined ? toNumber(source.default_tab, 1) - 1 : undefined
    const defaultTabIndex = toNumber(
      optionsSource.defaultTabIndex ??
        optionsSource.default_tab_index ??
        source.defaultTabIndex ??
        legacyDefaultTab,
      DEFAULT_OPTIONS.defaultTabIndex
    )
    const rememberSource =
      optionsSource.remember ?? optionsSource.rememberTab ?? optionsSource.remember_tab ?? "none"
    const rememberMode =
      rememberSource === true ? "card" : rememberSource === false ? "none" : asString(rememberSource, "none")

    const options = {
      ...DEFAULT_OPTIONS,
      defaultTabIndex,
      defaultTabId: asString(optionsSource.defaultTabId || optionsSource.default_tab_id || "", ""),
      keepAlive: asBool(optionsSource.keepAlive ?? optionsSource.keep_alive, DEFAULT_OPTIONS.keepAlive),
      lazy: asBool(optionsSource.lazy ?? optionsSource.lazy_load, DEFAULT_OPTIONS.lazy),
      preload: enumValue(
        optionsSource.preload || (asBool(optionsSource.lazy ?? true, true) ? "active" : "all"),
        ["active", "idle", "all"],
        DEFAULT_OPTIONS.preload
      ),
      maxCachedTabs: Math.max(
        0,
        toNumber(optionsSource.maxCachedTabs ?? optionsSource.max_cached_tabs, 0)
      ),
      showIcons: asBool(optionsSource.showIcons ?? optionsSource.show_icons, DEFAULT_OPTIONS.showIcons),
      showLabels: asBool(
        optionsSource.showLabels ?? optionsSource.show_labels,
        DEFAULT_OPTIONS.showLabels
      ),
      hideInactiveLabels: asBool(
        optionsSource.hideInactiveLabels ?? optionsSource.hide_inactive_labels,
        DEFAULT_OPTIONS.hideInactiveLabels
      ),
      remember: enumValue(rememberMode, ["none", "card", "browser", "user"], DEFAULT_OPTIONS.remember),
      storageKey: asString(optionsSource.storageKey || optionsSource.storage_key || "", ""),
      deepLink: asBool(optionsSource.deepLink ?? optionsSource.deep_link, DEFAULT_OPTIONS.deepLink),
      updateHash: asBool(optionsSource.updateHash ?? optionsSource.update_hash, DEFAULT_OPTIONS.updateHash),
      hashPrefix: asString(optionsSource.hashPrefix || optionsSource.hash_prefix || "", ""),
      swipe: asBool(optionsSource.swipe ?? optionsSource.enable_swipe, DEFAULT_OPTIONS.swipe),
      swipeThreshold: clamp(
        toNumber(optionsSource.swipeThreshold ?? optionsSource.swipe_threshold, 48),
        16,
        180
      ),
      haptic: asBool(optionsSource.haptic ?? optionsSource.haptic_feedback, DEFAULT_OPTIONS.haptic),
      animate: asBool(optionsSource.animate ?? optionsSource.swipe_animation, DEFAULT_OPTIONS.animate),
      keyboardNavigation: asBool(
        optionsSource.keyboardNavigation ?? optionsSource.keyboard_navigation,
        DEFAULT_OPTIONS.keyboardNavigation
      ),
      autoSelectFirstVisible: asBool(
        optionsSource.autoSelectFirstVisible ?? optionsSource.auto_select_first_visible,
        DEFAULT_OPTIONS.autoSelectFirstVisible
      ),
      scrollActiveIntoView: asBool(
        optionsSource.scrollActiveIntoView ?? optionsSource.scroll_active_into_view,
        DEFAULT_OPTIONS.scrollActiveIntoView
      ),
      ariaLabel: asString(optionsSource.ariaLabel || optionsSource.aria_label, DEFAULT_OPTIONS.ariaLabel),
    }

    const stylesSource = source.styles || {}
    const styles = {
      ...DEFAULT_STYLES,
      tab_position: enumValue(
        stylesSource.tab_position || stylesSource.tabPosition || source.tab_position,
        ["top", "bottom", "left", "right"],
        DEFAULT_STYLES.tab_position
      ),
      alignment: enumValue(
        stylesSource.alignment || source.tabs_alignment,
        ["start", "center", "end", "stretch"],
        DEFAULT_STYLES.alignment
      ),
      variant: enumValue(
        stylesSource.variant || stylesSource.style || "pills",
        ["pills", "segmented", "underline", "minimal"],
        DEFAULT_STYLES.variant
      ),
      density: enumValue(stylesSource.density || "comfortable", ["compact", "comfortable"], "comfortable"),
      icon_position: enumValue(
        stylesSource.icon_position || stylesSource.iconPosition,
        ["inline", "stacked"],
        DEFAULT_STYLES.icon_position
      ),
      equal_width: asBool(stylesSource.equal_width ?? stylesSource.equalWidth, DEFAULT_STYLES.equal_width),
      wrap_tabs: asBool(stylesSource.wrap_tabs ?? stylesSource.wrapTabs, DEFAULT_STYLES.wrap_tabs),
      background_color:
        stylesSource.background_color ||
        stylesSource.card_background ||
        source.card_background ||
        DEFAULT_STYLES.background_color,
      panel_background: stylesSource.panel_background || DEFAULT_STYLES.panel_background,
      bar_background:
        stylesSource.bar_background || source.bar_background || DEFAULT_STYLES.bar_background,
      text_color: stylesSource.text_color || DEFAULT_STYLES.text_color,
      active_color:
        stylesSource.active_color ||
        stylesSource.button_active_background ||
        stylesSource["--mdc-theme-primary"] ||
        DEFAULT_STYLES.active_color,
      active_border_color:
        stylesSource.active_border_color ||
        stylesSource.activeBorderColor ||
        DEFAULT_STYLES.active_border_color,
      active_text_color:
        stylesSource.active_text_color ||
        stylesSource.button_active_text_color ||
        DEFAULT_STYLES.active_text_color,
      inactive_color:
        stylesSource.inactive_color ||
        stylesSource.button_text_color ||
        stylesSource["--mdc-tab-color-default"] ||
        DEFAULT_STYLES.inactive_color,
      hover_color: stylesSource.hover_color || stylesSource.button_hover_color || DEFAULT_STYLES.hover_color,
      border_color:
        stylesSource.border_color || stylesSource.button_border_color || DEFAULT_STYLES.border_color,
      badge_color: stylesSource.badge_color || DEFAULT_STYLES.badge_color,
      shadow: stylesSource.shadow ?? DEFAULT_STYLES.shadow,
      radius: stylesSource.radius || stylesSource.card_border_radius || DEFAULT_STYLES.radius,
      tab_radius: stylesSource.tab_radius || stylesSource.button_border_radius || DEFAULT_STYLES.tab_radius,
      tab_gap: stylesSource.tab_gap || stylesSource.tabs_gap || DEFAULT_STYLES.tab_gap,
      tab_padding: stylesSource.tab_padding || stylesSource.button_padding || DEFAULT_STYLES.tab_padding,
      tab_min_width: stylesSource.tab_min_width || stylesSource.tabMinWidth || DEFAULT_STYLES.tab_min_width,
      tab_font_size: stylesSource.tab_font_size || stylesSource.tabFontSize || DEFAULT_STYLES.tab_font_size,
      tab_font_weight:
        stylesSource.tab_font_weight || stylesSource.tabFontWeight || DEFAULT_STYLES.tab_font_weight,
      tab_text_transform: enumValue(
        stylesSource.tab_text_transform || stylesSource.tabTextTransform || DEFAULT_STYLES.tab_text_transform,
        ["none", "uppercase", "lowercase", "capitalize"],
        DEFAULT_STYLES.tab_text_transform
      ),
      tab_border_width:
        stylesSource.tab_border_width || stylesSource.tabBorderWidth || DEFAULT_STYLES.tab_border_width,
      tab_icon_size: stylesSource.tab_icon_size || stylesSource.tabIconSize || DEFAULT_STYLES.tab_icon_size,
      header_padding: stylesSource.header_padding || stylesSource.bar_padding || DEFAULT_STYLES.header_padding,
      panel_padding: stylesSource.panel_padding || stylesSource.card_padding || DEFAULT_STYLES.panel_padding,
      content_gap: stylesSource.content_gap || DEFAULT_STYLES.content_gap,
      min_height: stylesSource.min_height || DEFAULT_STYLES.min_height,
    }

    const normalizedTabs = tabs.map(normalizeTab)
    options.defaultTabIndex = clamp(options.defaultTabIndex, 0, normalizedTabs.length - 1)

    return {
      type: source.type || "custom:" + CARD_TYPE,
      options,
      styles,
      tabs: normalizedTabs,
    }
  }

  function toPublicConfig(config) {
    return {
      type: config.type || "custom:" + CARD_TYPE,
      options: clone(config.options),
      styles: clone(config.styles),
      tabs: config.tabs.map((tab) => {
        const publicTab = {
          attributes: clone(tab.attributes),
          styles: clone(tab.styles),
          conditions: clone(tab.conditions),
          badge: clone(tab.badge),
        }
        if (!tab.cards.length) {
          publicTab.cards = []
        } else if (tab.cards.length === 1) {
          publicTab.card = clone(tab.cards[0])
        } else {
          publicTab.cards = clone(tab.cards)
        }
        return publicTab
      }),
    }
  }

  function truthy(value) {
    if (value === true) return true
    if (value === false || value === undefined || value === null) return false
    if (typeof value === "number") return value > 0
    const text = String(value).trim().toLowerCase()
    if (!text || ["false", "off", "no", "none", "null", "undefined", "0"].includes(text)) {
      return false
    }
    return true
  }

  function compareState(actual, expected) {
    if (expected === undefined || expected === null || expected === "") return true
    const actualText = String(actual ?? "")
    const expectedText = String(expected).trim()
    const numericMatch = expectedText.match(/^(>=|<=|>|<|==|=)\s*(-?\d+(?:\.\d+)?)$/)
    if (numericMatch) {
      const actualNumber = Number(actualText)
      const expectedNumber = Number(numericMatch[2])
      if (!Number.isFinite(actualNumber)) return false
      switch (numericMatch[1]) {
        case ">":
          return actualNumber > expectedNumber
        case ">=":
          return actualNumber >= expectedNumber
        case "<":
          return actualNumber < expectedNumber
        case "<=":
          return actualNumber <= expectedNumber
        default:
          return actualNumber === expectedNumber
      }
    }
    return actualText === expectedText
  }

  function getStateValue(hass, entity, attribute) {
    const stateObj = hass?.states?.[entity]
    if (!stateObj) return undefined
    if (attribute) return stateObj.attributes?.[attribute]
    return stateObj.state
  }

  function summarizeCard(card) {
    if (!card) return "Card"
    const entity = card.entity || (Array.isArray(card.entities) ? card.entities[0] : "")
    const entityText = isObject(entity) ? entity.entity || entity.name || "" : entity
    return [card.type || "card", card.title || card.name || entityText].filter(Boolean).join(" - ")
  }

  function getCardTagName(type) {
    if (!type) return ""
    if (type.startsWith("custom:")) return type.slice(7)
    return "hui-" + type + "-card"
  }

  function getLovelace() {
    try {
      return document
        .querySelector("home-assistant")
        ?.shadowRoot?.querySelector("home-assistant-main")
        ?.shadowRoot?.querySelector("ha-panel-lovelace")?.lovelace
    } catch (_) {
      return null
    }
  }

  function requestIdle(fn) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(fn, { timeout: 1500 })
      return
    }
    window.setTimeout(fn, 80)
  }

  function loadCardHelpersWhenReady() {
    if (window.loadCardHelpers) return window.loadCardHelpers()
    return new Promise((resolve, reject) => {
      let attempts = 0
      const check = () => {
        if (window.loadCardHelpers) {
          resolve(window.loadCardHelpers())
          return
        }
        attempts += 1
        if (attempts > 120) {
          reject(new Error("window.loadCardHelpers is not available."))
          return
        }
        window.setTimeout(check, 50)
      }
      check()
    })
  }

  class TabbedCard extends HTMLElement {
    static getConfigElement() {
      return document.createElement(CARD_EDITOR_TYPE)
    }

    static getStubConfig() {
      return {
        type: "custom:" + CARD_TYPE,
        options: {
          defaultTabIndex: 0,
          keepAlive: true,
          lazy: true,
          preload: "active",
          showIcons: true,
          showLabels: true,
          swipe: true,
        },
        styles: {
          variant: "pills",
          tab_position: "top",
          active_color: "var(--primary-color)",
          inactive_color: "var(--secondary-text-color)",
        },
        tabs: [
          {
            attributes: {
              label: "Overview",
              icon: "mdi:view-dashboard",
              id: "overview",
            },
            cards: [],
          },
          {
            attributes: {
              label: "Details",
              icon: "mdi:format-list-bulleted",
              id: "details",
            },
            card: {
              type: "markdown",
              content: "Add any Home Assistant card here from the visual editor.",
            },
          },
        ],
      }
    }

    static getGridOptions() {
      return {
        columns: 12,
        min_columns: 6,
        rows: 4,
        min_rows: 2,
      }
    }

    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this._instanceId = ++instanceCounter
      this._hass = null
      this._config = null
      this._helpersPromise = null
      this._selectedIndex = 0
      this._activeCardIndex = -1
      this._activationToken = 0
      this._cardCache = new Map()
      this._cardCreation = new Map()
      this._cacheOrder = []
      this._visibleIndices = []
      this._pendingTabsRender = false
      this._renderVersion = 0
      this._watchSignature = ""
      this._templateResults = new Map()
      this._templatePending = false
      this._touchStart = null

      this._onTabClick = this._onTabClick.bind(this)
      this._onTabKeydown = this._onTabKeydown.bind(this)
      this._onPanelTouchStart = this._onPanelTouchStart.bind(this)
      this._onPanelTouchEnd = this._onPanelTouchEnd.bind(this)
    }

    setConfig(config) {
      const hadConfig = Boolean(this._config)
      const previousIndex = this._selectedIndex
      const previousId = this._config?.tabs?.[previousIndex]?.attributes?.id || ""
      this._config = normalizeConfig(config)
      this._renderVersion += 1
      this._helpersPromise = loadCardHelpersWhenReady()
      this._selectedIndex = this._resolveInitialIndex({
        preserveCurrent: hadConfig,
        previousIndex,
        previousId,
      })
      this._activeCardIndex = -1
      this._cardCache.clear()
      this._cardCreation.clear()
      this._cacheOrder = []
      this._renderShell()
      this._refreshVisibleTabs()
      this._activateSelectedTab({ force: true, silent: true })
      if (this._config.options.preload === "all") {
        this._warmupAllTabs()
      } else if (this._config.options.preload === "idle") {
        requestIdle(() => this._warmupVisibleNeighbors())
      }
      this._scheduleTemplateEvaluation()
    }

    set hass(hass) {
      this._hass = hass
      this._cardCache.forEach((entry) => {
        entry.cards.forEach((card) => {
          if (card) card.hass = hass
        })
      })

      if (!this._config) return
      const nextSignature = this._buildWatchSignature()
      if (nextSignature !== this._watchSignature) {
        this._watchSignature = nextSignature
        this._refreshVisibleTabs()
        this._scheduleTemplateEvaluation()
      }
    }

    get hass() {
      return this._hass
    }

    getCardSize() {
      const active = this._cardCache.get(this._selectedIndex)
      if (!active) return 4
      return Math.max(
        1,
        active.cards.reduce((size, card) => {
          if (card && typeof card.getCardSize === "function") {
            try {
              return size + Number(card.getCardSize())
            } catch (_) {
              return size + 1
            }
          }
          return size + 1
        }, 0)
      )
    }

    connectedCallback() {
      if (!this._config) return
      if (!this.shadowRoot.innerHTML) this._renderShell()
      this._refreshVisibleTabs()
      this._activateSelectedTab({ force: true, silent: true })
    }

    disconnectedCallback() {
      this._touchStart = null
    }

    _resolveInitialIndex(options = {}) {
      if (!this._config) return 0
      const { tabs } = this._config
      if (options.preserveCurrent) {
        if (options.previousId) {
          const byId = tabs.findIndex((tab) => tab.attributes.id === options.previousId)
          if (byId !== -1) return byId
        }
        if (Number.isFinite(options.previousIndex) && options.previousIndex >= 0) {
          return clamp(options.previousIndex, 0, tabs.length - 1)
        }
      }

      const { options: cardOptions } = this._config
      const hashIndex = this._getIndexFromHash()
      if (hashIndex !== -1) return hashIndex

      const transient = this._readTransientIndex()
      if (transient !== -1) return transient

      const remembered = this._readRememberedIndex()
      if (remembered !== -1) return remembered

      if (cardOptions.defaultTabId) {
        const byId = tabs.findIndex((tab) => tab.attributes.id === cardOptions.defaultTabId)
        if (byId !== -1) return byId
      }

      return clamp(cardOptions.defaultTabIndex, 0, tabs.length - 1)
    }

    _getIndexFromHash() {
      if (!this._config?.options.deepLink) return -1
      const prefix = this._config.options.hashPrefix || ""
      if (!prefix && !this._config.options.updateHash) return -1
      const rawHash = decodeURIComponent((window.location.hash || "").replace(/^#/, ""))
      if (!rawHash) return -1
      if (prefix && !rawHash.startsWith(prefix)) return -1
      const tabId = prefix ? rawHash.slice(prefix.length) : rawHash
      return this._config.tabs.findIndex((tab) => tab.attributes.id === tabId)
    }

    _transientStateKey() {
      if (!this._config) return ""
      const path = window.location?.pathname || ""
      const ids = this._config.tabs.map((tab) => tab.attributes.id).join("|")
      const configuredKey = this._config.options.storageKey || ""
      return ["ultimate-tabbed-card", path, configuredKey, ids].join(":")
    }

    _readTransientIndex() {
      const key = this._transientStateKey()
      if (!key) return -1
      try {
        const store = window.__ultimateTabbedCardActiveTabs
        const entry = store instanceof Map ? store.get(key) : null
        if (!entry || Date.now() - entry.at > ACTIVE_TAB_MEMORY_MAX_AGE) return -1
        if (entry.id) {
          const byId = this._config.tabs.findIndex((tab) => tab.attributes.id === entry.id)
          if (byId !== -1) return byId
        }
        if (Number.isFinite(entry.index) && entry.index >= 0 && entry.index < this._config.tabs.length) {
          return entry.index
        }
      } catch (_) {}
      return -1
    }

    _rememberTransientIndex(index) {
      const key = this._transientStateKey()
      if (!key) return
      try {
        const store = (window.__ultimateTabbedCardActiveTabs =
          window.__ultimateTabbedCardActiveTabs instanceof Map
            ? window.__ultimateTabbedCardActiveTabs
            : new Map())
        store.set(key, {
          index,
          id: this._config.tabs[index]?.attributes?.id || "",
          at: Date.now(),
        })
        if (store.size > 80) {
          const oldest = [...store.entries()].sort((a, b) => a[1].at - b[1].at)[0]?.[0]
          if (oldest) store.delete(oldest)
        }
      } catch (_) {}
    }

    _storageKey() {
      const { options } = this._config
      if (options.remember === "none") return ""
      if (options.storageKey) return "ultimate-tabbed-card:" + options.storageKey
      const user = options.remember === "user" ? ":" + (this._hass?.user?.id || "anonymous") : ""
      const path = options.remember === "browser" ? window.location.pathname : ""
      const ids = this._config.tabs.map((tab) => tab.attributes.id).join("|")
      return "ultimate-tabbed-card:" + path + ":" + ids + user
    }

    _readRememberedIndex() {
      const key = this._storageKey()
      if (!key) return -1
      try {
        const stored = Number(window.localStorage.getItem(key))
        if (Number.isFinite(stored) && stored >= 0 && stored < this._config.tabs.length) {
          return stored
        }
      } catch (_) {}
      return -1
    }

    _rememberIndex(index) {
      const key = this._storageKey()
      if (!key) return
      try {
        window.localStorage.setItem(key, String(index))
      } catch (_) {}
    }

    _updateHash(index) {
      if (!this._config.options.updateHash) return
      const tab = this._config.tabs[index]
      if (!tab?.attributes.id) return
      const nextHash = "#" + encodeURIComponent(this._config.options.hashPrefix + tab.attributes.id)
      if (window.location.hash === nextHash) return
      history.replaceState(null, "", window.location.pathname + window.location.search + nextHash)
    }

    _renderShell() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }

          .card {
            --utc-align: flex-start;
            background: var(--utc-background);
            color: var(--utc-text);
            border: 1px solid var(--utc-border);
            border-radius: var(--utc-radius);
            box-shadow: var(--utc-shadow);
            min-height: var(--utc-min-height);
            overflow: hidden;
          }

          .surface {
            display: flex;
            flex-direction: column;
            min-width: 0;
          }

          .card.position-left .surface,
          .card.position-right .surface {
            flex-direction: row;
          }

          .card.position-right .tabs-shell,
          .card.position-bottom .tabs-shell {
            order: 2;
          }

          .tabs-shell {
            background: var(--utc-bar-background);
            border-bottom: 1px solid var(--utc-border);
            padding: var(--utc-header-padding);
            min-width: 0;
          }

          .card.position-bottom .tabs-shell {
            border-top: 1px solid var(--utc-border);
            border-bottom: 0;
          }

          .card.position-left .tabs-shell,
          .card.position-right .tabs-shell {
            border-bottom: 0;
            border-inline-end: 1px solid var(--utc-border);
            max-width: min(42%, 240px);
          }

          .card.position-right .tabs-shell {
            border-inline-start: 1px solid var(--utc-border);
            border-inline-end: 0;
          }

          .tabs {
            display: flex;
            align-items: center;
            justify-content: var(--utc-align);
            gap: var(--utc-tab-gap);
            overflow-x: auto;
            overflow-y: hidden;
            flex-wrap: nowrap;
            scrollbar-width: thin;
            scroll-snap-type: x proximity;
          }

          .card.wrap-tabs .tabs {
            flex-wrap: wrap;
            overflow-x: visible;
          }

          .card.position-left .tabs,
          .card.position-right .tabs {
            align-items: stretch;
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 100%;
          }

          .tabs::-webkit-scrollbar {
            height: 6px;
            width: 6px;
          }

          .tabs::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--utc-inactive) 35%, transparent);
            border-radius: 999px;
          }

          .tab-btn {
            appearance: none;
            position: relative;
            border: var(--utc-tab-border-width) solid transparent;
            border-radius: var(--utc-tab-radius);
            background: transparent;
            color: var(--utc-inactive);
            font: inherit;
            font-size: var(--utc-tab-font-size);
            font-weight: var(--utc-tab-font-weight);
            line-height: 1;
            min-width: var(--utc-tab-min-width);
            max-width: 100%;
            white-space: nowrap;
            padding: var(--utc-tab-padding);
            text-transform: var(--utc-tab-text-transform);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            scroll-snap-align: nearest;
            transition: color 160ms ease, background 160ms ease, border-color 160ms ease,
              transform 160ms ease;
          }

          .card.equal-width .tab-btn {
            flex: 1 1 0;
          }

          .card.icon-stacked .tab-btn {
            flex-direction: column;
            gap: 5px;
          }

          .tab-btn:hover:not(:disabled) {
            color: var(--utc-text);
            background: var(--utc-hover);
          }

          .tab-btn:focus-visible {
            outline: 2px solid var(--utc-active);
            outline-offset: 2px;
          }

          .tab-btn:disabled {
            cursor: not-allowed;
            opacity: 0.45;
          }

          .tab-btn.active {
            color: var(--utc-active-text);
          }

          .card.variant-pills .tab-btn.active,
          .card.variant-segmented .tab-btn.active {
            color: var(--utc-active-text);
            border-color: var(--utc-active-border);
            background: var(--utc-active);
          }

          .card.variant-segmented .tabs {
            background: var(--utc-bar-background);
            border: 1px solid var(--utc-border);
            border-radius: calc(var(--utc-tab-radius) + 3px);
            padding: 3px;
          }

          .card.variant-underline .tab-btn,
          .card.variant-minimal .tab-btn {
            border-radius: 0;
            border-bottom-color: transparent;
          }

          .card.variant-underline .tab-btn.active {
            color: var(--utc-active);
            border-bottom-color: var(--utc-active);
            background: transparent;
          }

          .card.variant-minimal .tab-btn.active {
            color: var(--utc-active);
            background: color-mix(in srgb, var(--utc-active) 10%, transparent);
          }

          .card.hide-inactive-labels .tab-btn:not(.active) .tab-label {
            display: none;
          }

          .tab-label {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .tab-icon {
            width: var(--utc-tab-icon-size);
            height: var(--utc-tab-icon-size);
            flex: 0 0 auto;
          }

          .badge {
            min-width: 8px;
            height: 8px;
            border-radius: 999px;
            background: var(--utc-badge);
            color: var(--text-primary-color, #fff);
            font-size: 0.68rem;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }

          .badge.text,
          .badge.count,
          .badge.state,
          .badge.exclamation {
            min-width: 17px;
            height: 17px;
            padding: 0 5px;
          }

          .panel {
            min-width: 0;
            flex: 1 1 auto;
            background: var(--utc-panel-background);
            padding: var(--utc-panel-padding);
            touch-action: pan-y;
          }

          .card.position-left .panel,
          .card.position-right .panel {
            min-width: 0;
          }

          .pane {
            display: none;
            min-width: 0;
            contain: layout style;
          }

          .pane.active {
            display: block;
          }

          .card.animate .pane.active {
            animation: utc-pane-in 140ms ease-out;
          }

          .card-stack {
            display: grid;
            gap: var(--utc-content-gap);
            min-width: 0;
          }

          .empty {
            border: 1px dashed var(--divider-color);
            border-radius: 10px;
            padding: 10px;
            color: var(--secondary-text-color);
            background: rgba(127, 127, 127, 0.08);
          }

          .error {
            border: 1px solid var(--error-color, #ef4444);
            border-radius: 10px;
            padding: 10px;
            color: var(--error-color, #ef4444);
            background: rgba(239, 68, 68, 0.08);
          }

          @keyframes utc-pane-in {
            from {
              opacity: 0.7;
              transform: translateY(2px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 720px) {
            .card.position-left .surface,
            .card.position-right .surface {
              flex-direction: column;
            }

            .card.position-left .tabs-shell,
            .card.position-right .tabs-shell {
              max-width: none;
              border-inline: 0;
              border-bottom: 1px solid var(--utc-border);
            }

            .card.position-left .tabs,
            .card.position-right .tabs {
              flex-direction: row;
              overflow-x: auto;
              overflow-y: hidden;
            }
          }
        </style>
        <ha-card class="card">
          <div class="surface">
            <header class="tabs-shell">
              <div class="tabs" role="tablist"></div>
            </header>
            <section class="panel"></section>
          </div>
        </ha-card>
      `

      const tabs = this.shadowRoot.querySelector(".tabs")
      const panel = this.shadowRoot.querySelector(".panel")
      tabs.addEventListener("click", this._onTabClick)
      tabs.addEventListener("keydown", this._onTabKeydown)
      panel.addEventListener("touchstart", this._onPanelTouchStart, { passive: true })
      panel.addEventListener("touchend", this._onPanelTouchEnd, { passive: true })
      this._applyStyleVars()
    }

    _applyStyleVars() {
      const card = this.shadowRoot.querySelector(".card")
      if (!card || !this._config) return
      const styles = this._config.styles
      const options = this._config.options
      const alignMap = {
        start: "flex-start",
        center: "center",
        end: "flex-end",
        stretch: "stretch",
      }
      card.className = [
        "card",
        "position-" + styles.tab_position,
        "variant-" + styles.variant,
        "density-" + styles.density,
        "icon-" + styles.icon_position,
        styles.equal_width || styles.alignment === "stretch" ? "equal-width" : "",
        styles.wrap_tabs ? "wrap-tabs" : "",
        options.hideInactiveLabels ? "hide-inactive-labels" : "",
        options.animate ? "animate" : "",
      ]
        .filter(Boolean)
        .join(" ")
      card.style.setProperty("--utc-align", alignMap[styles.alignment] || "flex-start")
      card.style.setProperty("--utc-background", styles.background_color)
      card.style.setProperty("--utc-panel-background", styles.panel_background)
      card.style.setProperty("--utc-bar-background", styles.bar_background)
      card.style.setProperty("--utc-text", styles.text_color)
      card.style.setProperty("--utc-active", styles.active_color)
      card.style.setProperty("--utc-active-border", styles.active_border_color)
      card.style.setProperty("--utc-active-text", styles.active_text_color)
      card.style.setProperty("--utc-inactive", styles.inactive_color)
      card.style.setProperty("--utc-hover", styles.hover_color)
      card.style.setProperty("--utc-border", styles.border_color)
      card.style.setProperty("--utc-badge", styles.badge_color)
      card.style.setProperty("--utc-shadow", styles.shadow)
      card.style.setProperty("--utc-radius", styles.radius)
      card.style.setProperty("--utc-tab-radius", styles.tab_radius)
      card.style.setProperty("--utc-tab-gap", styles.tab_gap)
      card.style.setProperty("--utc-tab-padding", styles.tab_padding)
      card.style.setProperty("--utc-tab-min-width", styles.tab_min_width)
      card.style.setProperty("--utc-tab-font-size", styles.tab_font_size)
      card.style.setProperty("--utc-tab-font-weight", styles.tab_font_weight)
      card.style.setProperty("--utc-tab-text-transform", styles.tab_text_transform)
      card.style.setProperty("--utc-tab-border-width", styles.tab_border_width)
      card.style.setProperty("--utc-tab-icon-size", styles.tab_icon_size)
      card.style.setProperty("--utc-header-padding", styles.header_padding)
      card.style.setProperty("--utc-panel-padding", styles.panel_padding)
      card.style.setProperty("--utc-content-gap", styles.content_gap)
      card.style.setProperty("--utc-min-height", styles.min_height)
      this.shadowRoot
        .querySelector(".tabs")
        ?.setAttribute("aria-label", options.ariaLabel || DEFAULT_OPTIONS.ariaLabel)
    }

    _scheduleTabsRender() {
      if (this._pendingTabsRender) return
      this._pendingTabsRender = true
      queueMicrotask(() => {
        this._pendingTabsRender = false
        this._renderTabsOnly()
      })
    }

    _refreshVisibleTabs() {
      if (!this._config || !this.shadowRoot) return
      this._visibleIndices = this._config.tabs
        .map((tab, index) => (this._isTabVisible(tab) ? index : -1))
        .filter((index) => index !== -1)

      let selectedChanged = false
      if (
        this._config.options.autoSelectFirstVisible &&
        (!this._visibleIndices.includes(this._selectedIndex) ||
          this._config.tabs[this._selectedIndex]?.attributes.disabled)
      ) {
        const next = this._resolveSelectableIndex(this._selectedIndex)
        if (next !== -1 && next !== this._selectedIndex) {
          this._selectedIndex = next
          selectedChanged = true
        }
      }

      this._scheduleTabsRender()
      if (!this._visibleIndices.length) {
        this._renderEmptyPanel("No visible tabs match the current conditions.")
        return
      }
      this._removePanelMessages()
      if (selectedChanged || this._needsActivePane()) {
        this._activateSelectedTab({ force: true, silent: true })
      }
    }

    _needsActivePane() {
      const entry = this._cardCache.get(this._selectedIndex)
      return this._activeCardIndex !== this._selectedIndex || !entry?.pane?.isConnected
    }

    _resolveSelectableIndex(preferredIndex = this._selectedIndex) {
      if (!this._config) return -1
      const visible = this._visibleIndices.length
        ? this._visibleIndices
        : this._config.tabs
            .map((tab, index) => (this._isTabVisible(tab) ? index : -1))
            .filter((index) => index !== -1)
      const enabled = visible.filter((index) => !this._config.tabs[index]?.attributes.disabled)
      if (!enabled.length) return -1
      const preferredNumber = Number(preferredIndex)
      const preferred = Number.isFinite(preferredNumber)
        ? clamp(preferredNumber, 0, this._config.tabs.length - 1)
        : -1
      if (enabled.includes(preferred)) return preferred
      if (this._config.options.defaultTabId) {
        const defaultById = this._config.tabs.findIndex(
          (tab) => tab.attributes.id === this._config.options.defaultTabId
        )
        if (enabled.includes(defaultById)) return defaultById
      }
      const defaultByIndex = clamp(this._config.options.defaultTabIndex, 0, this._config.tabs.length - 1)
      if (enabled.includes(defaultByIndex)) return defaultByIndex
      return enabled[0]
    }

    _activateSelectedTab(options = {}) {
      const next = this._resolveSelectableIndex(this._selectedIndex)
      if (next === -1) {
        this._renderEmptyPanel("No enabled tabs are available.")
        return Promise.resolve()
      }
      this._selectedIndex = next
      return this._activateTab(next, options)
    }

    _renderTabsOnly() {
      if (!this._config || !this.shadowRoot) return
      this._applyStyleVars()
      const tabsEl = this.shadowRoot.querySelector(".tabs")
      if (!tabsEl) return
      const fragment = document.createDocumentFragment()

      this._visibleIndices.forEach((index) => {
        const tab = this._config.tabs[index]
        const button = document.createElement("button")
        button.type = "button"
        button.className = "tab-btn" + (index === this._selectedIndex ? " active" : "")
        button.dataset.index = String(index)
        button.disabled = Boolean(tab.attributes.disabled)
        button.setAttribute("role", "tab")
        button.setAttribute("aria-selected", index === this._selectedIndex ? "true" : "false")
        button.setAttribute("aria-controls", "utc-panel-" + this._instanceId + "-" + index)
        button.setAttribute("tabindex", index === this._selectedIndex ? "0" : "-1")
        button.id = "utc-tab-" + this._instanceId + "-" + index

        const accent = tab.styles?.accent_color || tab.styles?.active_color
        const color = tab.styles?.color || tab.styles?.text_color
        const background = tab.styles?.background_color
        if (accent) button.style.setProperty("--utc-active", accent)
        if (color) button.style.color = color
        if (background) button.style.background = background

        if (this._config.options.showIcons && tab.attributes.icon) {
          const icon = document.createElement("ha-icon")
          icon.className = "tab-icon"
          icon.setAttribute("icon", tab.attributes.icon)
          button.appendChild(icon)
        }

        if (this._config.options.showLabels) {
          const label = document.createElement("span")
          label.className = "tab-label"
          label.textContent = tab.attributes.label
          button.appendChild(label)
        }

        const badge = this._resolveBadge(tab)
        if (badge) {
          const badgeEl = document.createElement("span")
          badgeEl.className = "badge " + badge.mode
          badgeEl.textContent = badge.text
          badgeEl.setAttribute("aria-label", badge.label)
          button.appendChild(badgeEl)
        }

        fragment.appendChild(button)
      })

      tabsEl.replaceChildren(fragment)

      if (this._config.options.scrollActiveIntoView) {
        const active = tabsEl.querySelector('.tab-btn.active')
        active?.scrollIntoView({ block: "nearest", inline: "nearest" })
      }
    }

    _renderEmptyPanel(message) {
      const panel = this.shadowRoot.querySelector(".panel")
      if (!panel) return
      const empty = document.createElement("div")
      empty.className = "empty"
      empty.textContent = message
      panel.replaceChildren(empty)
    }

    _removePanelMessages() {
      const panel = this.shadowRoot?.querySelector(".panel")
      Array.from(panel?.children || []).forEach((child) => {
        if (child.classList?.contains("empty") && !child.classList.contains("pane")) child.remove()
      })
    }

    _onTabClick(event) {
      const button = event.target.closest(".tab-btn")
      if (!button || button.disabled) return
      this._activateTab(Number(button.dataset.index))
    }

    _onTabKeydown(event) {
      if (!this._config?.options.keyboardNavigation) return
      const buttons = Array.from(this.shadowRoot.querySelectorAll(".tab-btn:not(:disabled)"))
      if (!buttons.length) return
      const currentPosition = buttons.indexOf(event.target.closest(".tab-btn"))
      if (currentPosition === -1) return

      const vertical = ["left", "right"].includes(this._config.styles.tab_position)
      let nextPosition = currentPosition
      if ((!vertical && event.key === "ArrowRight") || (vertical && event.key === "ArrowDown")) {
        nextPosition = (currentPosition + 1) % buttons.length
      } else if ((!vertical && event.key === "ArrowLeft") || (vertical && event.key === "ArrowUp")) {
        nextPosition = (currentPosition - 1 + buttons.length) % buttons.length
      } else if (event.key === "Home") {
        nextPosition = 0
      } else if (event.key === "End") {
        nextPosition = buttons.length - 1
      } else {
        return
      }

      event.preventDefault()
      const nextButton = buttons[nextPosition]
      nextButton.focus()
      this._activateTab(Number(nextButton.dataset.index))
    }

    async _activateTab(index, options = {}) {
      if (!this._config || !this.shadowRoot) return
      const clamped = clamp(index, 0, this._config.tabs.length - 1)
      const tab = this._config.tabs[clamped]
      if (!tab || tab.attributes.disabled || !this._isTabVisible(tab)) return
      if (!options.force && clamped === this._selectedIndex && this._activeCardIndex === clamped) {
        this._syncPaneVisibility(clamped)
        return
      }

      const activationToken = ++this._activationToken
      this._selectedIndex = clamped
      this._rememberTransientIndex(clamped)
      this._rememberIndex(clamped)
      this._updateHash(clamped)
      this._scheduleTabsRender()
      if (!options.silent) this._haptic()
      const renderVersion = this._renderVersion

      const panel = this.shadowRoot.querySelector(".panel")
      if (!panel) return

      if (!this._config.options.keepAlive && this._activeCardIndex !== -1 && this._activeCardIndex !== clamped) {
        this._deleteCachedTab(this._activeCardIndex)
      }

      this._syncPaneVisibility(clamped)

      let entry = this._cardCache.get(clamped)
      if (!entry) {
        let creation = this._cardCreation.get(clamped)
        if (!creation) {
          creation = this._createCardPane(clamped).finally(() => {
            this._cardCreation.delete(clamped)
          })
          this._cardCreation.set(clamped, creation)
        }
        entry = await creation
        if (
          renderVersion !== this._renderVersion ||
          (activationToken !== this._activationToken && clamped !== this._selectedIndex)
        ) {
          return
        }
        if (!this._cardCache.has(clamped)) {
          this._cardCache.set(clamped, entry)
          panel.appendChild(entry.pane)
        } else {
          entry = this._cardCache.get(clamped)
        }
      }

      if (activationToken !== this._activationToken && clamped !== this._selectedIndex) return
      if (entry?.pane && !entry.pane.isConnected) panel.appendChild(entry.pane)
      entry.lastUsed = Date.now()
      this._syncPaneVisibility(clamped)
      this._activeCardIndex = clamped
      this._touchCacheOrder(clamped)
      this._enforceCacheLimit()
    }

    _syncPaneVisibility(activeIndex = this._selectedIndex) {
      const panel = this.shadowRoot?.querySelector(".panel")
      const cachedPanes = new Set()
      this._cardCache.forEach((entry, entryIndex) => {
        if (!entry?.pane) return
        entry.pane.dataset.index = String(entryIndex)
        entry.pane.classList.toggle("active", entryIndex === activeIndex)
        cachedPanes.add(entry.pane)
      })
      Array.from(panel?.children || []).forEach((pane) => {
        if (!pane.classList?.contains("pane")) return
        if (cachedPanes.has(pane)) return
        pane.classList.remove("active")
        pane.remove()
      })
    }

    async _createCardPane(index) {
      const tab = this._config.tabs[index]
      const pane = document.createElement("div")
      pane.className = "pane"
      pane.dataset.index = String(index)
      pane.id = "utc-panel-" + this._instanceId + "-" + index
      pane.setAttribute("role", "tabpanel")
      pane.setAttribute("aria-labelledby", "utc-tab-" + this._instanceId + "-" + index)

      if (tab.styles?.panel_background) pane.style.background = tab.styles.panel_background
      if (tab.styles?.panel_padding) pane.style.padding = tab.styles.panel_padding

      const cards = []
      if (!tab.cards.length) {
        const empty = document.createElement("div")
        empty.className = "empty"
        empty.textContent = "No cards in this tab yet."
        pane.appendChild(empty)
        return { pane, cards, lastUsed: Date.now() }
      }

      const parent = tab.cards.length > 1 ? document.createElement("div") : pane
      if (parent !== pane) {
        parent.className = "card-stack"
        pane.appendChild(parent)
      }

      for (let cardIndex = 0; cardIndex < tab.cards.length; cardIndex += 1) {
        const cardConfig = tab.cards[cardIndex]
        try {
          const helpers = await this._helpersPromise
          const card = await helpers.createCardElement(cardConfig)
          card.hass = this._hass
          card.addEventListener(
            "ll-rebuild",
            (event) => {
              event.stopPropagation()
              this._rebuildTab(index).catch(() => {})
            },
            { once: true }
          )
          parent.appendChild(card)
          cards.push(card)
        } catch (error) {
          const errorEl = document.createElement("div")
          errorEl.className = "error"
          errorEl.textContent =
            "Unable to create card " +
            String(cardIndex + 1) +
            " for tab " +
            String(index + 1) +
            ". " +
            (error?.message || "Unknown error")
          parent.appendChild(errorEl)
          cards.push(null)
        }
      }

      return { pane, cards, lastUsed: Date.now() }
    }

    async _rebuildTab(index) {
      const current = this._cardCache.get(index)
      if (!current?.pane) return
      const replacement = await this._createCardPane(index)
      current.pane.replaceWith(replacement.pane)
      this._cardCache.set(index, replacement)
      this._syncPaneVisibility(this._selectedIndex)
    }

    _touchCacheOrder(index) {
      this._cacheOrder = this._cacheOrder.filter((entry) => entry !== index)
      this._cacheOrder.push(index)
    }

    _deleteCachedTab(index) {
      const entry = this._cardCache.get(index)
      if (entry?.pane?.isConnected) entry.pane.remove()
      this._cardCache.delete(index)
      this._cacheOrder = this._cacheOrder.filter((entry) => entry !== index)
    }

    _enforceCacheLimit() {
      const limit = this._config.options.maxCachedTabs
      if (!limit || this._cardCache.size <= limit) return
      for (const index of [...this._cacheOrder]) {
        if (this._cardCache.size <= limit) return
        if (index !== this._selectedIndex) this._deleteCachedTab(index)
      }
    }

    _warmupAllTabs() {
      const renderVersion = this._renderVersion
      requestIdle(async () => {
        for (const index of this._visibleIndices) {
          if (!this._cardCache.has(index) && !this._config.tabs[index].attributes.disabled) {
            let creation = this._cardCreation.get(index)
            if (!creation) {
              creation = this._createCardPane(index).finally(() => this._cardCreation.delete(index))
              this._cardCreation.set(index, creation)
            }
            const entry = await creation
            if (renderVersion !== this._renderVersion || this._cardCache.has(index)) continue
            entry.pane.classList.toggle("active", index === this._selectedIndex)
            this._cardCache.set(index, entry)
            this.shadowRoot.querySelector(".panel")?.appendChild(entry.pane)
            this._syncPaneVisibility(this._selectedIndex)
            this._touchCacheOrder(index)
          }
        }
        this._enforceCacheLimit()
      })
    }

    _warmupVisibleNeighbors() {
      const renderVersion = this._renderVersion
      const visiblePosition = this._visibleIndices.indexOf(this._selectedIndex)
      const neighbors = [
        this._visibleIndices[visiblePosition - 1],
        this._visibleIndices[visiblePosition + 1],
      ].filter((index) => index !== undefined)

      requestIdle(async () => {
        for (const index of neighbors) {
          if (!this._cardCache.has(index) && !this._config.tabs[index].attributes.disabled) {
            let creation = this._cardCreation.get(index)
            if (!creation) {
              creation = this._createCardPane(index).finally(() => this._cardCreation.delete(index))
              this._cardCreation.set(index, creation)
            }
            const entry = await creation
            if (renderVersion !== this._renderVersion || this._cardCache.has(index)) continue
            this._cardCache.set(index, entry)
            this.shadowRoot.querySelector(".panel")?.appendChild(entry.pane)
            this._syncPaneVisibility(this._selectedIndex)
            this._touchCacheOrder(index)
          }
        }
        this._enforceCacheLimit()
      })
    }

    _haptic(type = "selection") {
      if (!this._config.options.haptic) return
      dispatchHaptic(this, type)
    }

    _onPanelTouchStart(event) {
      if (!this._config?.options.swipe || this._isHorizontalGestureTarget(event.target)) return
      const touch = event.changedTouches?.[0]
      if (!touch) return
      this._touchStart = { x: touch.clientX, y: touch.clientY, at: Date.now() }
    }

    _onPanelTouchEnd(event) {
      if (!this._touchStart || !this._config?.options.swipe) return
      const touch = event.changedTouches?.[0]
      if (!touch) return
      const dx = touch.clientX - this._touchStart.x
      const dy = touch.clientY - this._touchStart.y
      this._touchStart = null
      if (Math.abs(dx) < this._config.options.swipeThreshold || Math.abs(dx) < Math.abs(dy) * 1.35) {
        return
      }
      if (dx < 0) this._activateRelative(1)
      else this._activateRelative(-1)
    }

    _isHorizontalGestureTarget(start) {
      let node = start
      const panel = this.shadowRoot.querySelector(".panel")
      while (node && node !== panel) {
        if (node.dataset?.noSwipe !== undefined || node.dataset?.utcNoSwipe !== undefined) {
          return true
        }
        if (node instanceof HTMLElement) {
          const style = window.getComputedStyle(node)
          const scrollable =
            /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 8
          if (scrollable) return true
        }
        node = node.parentElement || node.getRootNode?.().host
      }
      return false
    }

    _activateRelative(delta) {
      const enabled = this._visibleIndices.filter((index) => !this._config.tabs[index].attributes.disabled)
      const current = enabled.indexOf(this._selectedIndex)
      if (current === -1 || enabled.length < 2) return
      const next = enabled[(current + delta + enabled.length) % enabled.length]
      this._activateTab(next)
    }

    _isTabVisible(tab) {
      if (!tab || tab.attributes.hidden) return false
      return tab.conditions.every((condition) => this._isConditionMet(condition))
    }

    _isConditionMet(condition) {
      if (!condition) return true
      if (condition.type === "entity") {
        const stateObj = this._hass?.states?.[condition.entity]
        const value = getStateValue(this._hass, condition.entity, condition.attribute)
        if (condition.exists !== undefined && asBool(condition.exists, true) !== Boolean(stateObj)) {
          return false
        }
        if (!stateObj) return false
        if (condition.state && !compareState(value, condition.state)) return false
        if (condition.state_not && compareState(value, condition.state_not)) return false
        if (condition.above !== "" && !(Number(value) > Number(condition.above))) return false
        if (condition.below !== "" && !(Number(value) < Number(condition.below))) return false
        return true
      }

      if (condition.type === "user") {
        const userId = this._hass?.user?.id || ""
        const allowed = condition.user
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
        const denied = condition.user_not
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
        if (allowed.length && !allowed.includes(userId)) return false
        if (denied.length && denied.includes(userId)) return false
        return true
      }

      if (condition.type === "media") {
        if (!condition.media_query || !window.matchMedia) return true
        return window.matchMedia(condition.media_query).matches
      }

      if (condition.type === "template") {
        if (!condition.template) return true
        return truthy(this._templateResults.get(condition.template))
      }

      return true
    }

    _resolveBadge(tab) {
      const badge = tab.badge
      if (!badge || badge.mode === "none") return null
      let text = badge.text
      let active = false

      if (badge.entity) {
        const value = getStateValue(this._hass, badge.entity)
        active = badge.state ? compareState(value, badge.state) : truthy(value)
        if (badge.mode === "state") text = asString(value, "")
      } else if (badge.template) {
        const result = this._templateResults.get(badge.template)
        active = truthy(result)
        if (badge.mode === "text" || badge.mode === "state") text = asString(result, "")
      } else {
        active = truthy(text)
      }

      if (!active) return null
      if (badge.mode === "dot") text = ""
      if (badge.mode === "exclamation") text = "!"
      return {
        mode: badge.mode,
        text: badge.mode === "count" && !text ? "1" : asString(text, ""),
        label: "Tab badge",
      }
    }

    _collectWatchEntities() {
      if (!this._config) return []
      const entities = new Set()
      this._config.tabs.forEach((tab) => {
        tab.conditions.forEach((condition) => {
          if (condition.type === "entity" && condition.entity) entities.add(condition.entity)
        })
        if (tab.badge?.entity) entities.add(tab.badge.entity)
      })
      return [...entities]
    }

    _buildWatchSignature() {
      const parts = [this._hass?.user?.id || ""]
      this._collectWatchEntities().forEach((entity) => {
        const stateObj = this._hass?.states?.[entity]
        parts.push(entity + "=" + (stateObj ? stateObj.state : "missing"))
      })
      this._templateResults.forEach((value, key) => parts.push("tpl:" + key + "=" + value))
      return parts.join("|")
    }

    _templateStrings() {
      if (!this._config) return []
      const templates = new Set()
      this._config.tabs.forEach((tab) => {
        tab.conditions.forEach((condition) => {
          if (condition.type === "template" && condition.template) templates.add(condition.template)
        })
        if (tab.badge?.template) templates.add(tab.badge.template)
      })
      return [...templates]
    }

    _scheduleTemplateEvaluation() {
      if (this._templatePending || !this._hass?.callApi) return
      const templates = this._templateStrings()
      if (!templates.length) return
      this._templatePending = true
      window.setTimeout(async () => {
        const changed = await this._evaluateTemplates(templates)
        this._templatePending = false
        if (changed) this._refreshVisibleTabs()
      }, 200)
    }

    async _evaluateTemplates(templates) {
      let changed = false
      for (const template of templates) {
        try {
          const result = await this._hass.callApi("POST", "template", { template })
          if (this._templateResults.get(template) !== result) {
            this._templateResults.set(template, result)
            changed = true
          }
        } catch (_) {
          if (this._templateResults.get(template) !== false) {
            this._templateResults.set(template, false)
            changed = true
          }
        }
      }
      return changed
    }
  }

  class TabbedCardEditor extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this._hass = null
      this._config = null
      this._lovelace = null
      this._section = "general"
      this._editingTabIndex = 0
      this._nativeEditors = new Map()
      this._loadingEditors = new Set()
      this._expandedEditorKeys = new Set()
      this._openPickerTabs = new Set()
      this._cardClipboard = null
      this._nativeMountToken = 0
      this._renderPending = false
      this._lastEmittedConfigText = ""
      this._schemaCache = new Map()
      this._pickerDefinitionWait = false
      this._boundComputeLabel = this._computeFormLabel.bind(this)
      this._boundComputeHelper = this._computeFormHelper.bind(this)

      this._onRootChange = this._onRootChange.bind(this)
      this._onRootClick = this._onRootClick.bind(this)
      this._onRootToggle = this._onRootToggle.bind(this)
      this._onValueChanged = this._onValueChanged.bind(this)
    }

    set hass(hass) {
      this._hass = hass
      this._syncHassToChildren()
    }

    set lovelace(lovelace) {
      this._lovelace = lovelace
      this._syncLovelaceToChildren()
      this._mountCardPicker()
    }

    setConfig(config) {
      const incomingConfigText = serializeConfig(config)
      if (this._config && incomingConfigText && incomingConfigText === this._lastEmittedConfigText) {
        this._lastEmittedConfigText = ""
        return
      }
      try {
        this._config = normalizeConfig(config)
      } catch (_) {
        this._config = normalizeConfig(TabbedCard.getStubConfig())
      }
      this._editingTabIndex = clamp(this._editingTabIndex, 0, this._config.tabs.length - 1)
      this._render()
    }

    _render() {
      if (!this._config) return
      this._renderPending = false
      this._nativeMountToken += 1
      this._nativeEditors.clear()
      this._loadingEditors.clear()
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }

          .editor {
            display: grid;
            gap: 12px;
            color: var(--primary-text-color);
          }

          .nav {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 6px;
          }

          .nav ha-button {
            width: 100%;
          }

          .panel {
            display: grid;
            gap: 12px;
          }

          .panel[hidden] {
            display: none;
          }

          .section,
          .tab-body,
          .card-item {
            display: grid;
            gap: 12px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 12px;
            background: var(--card-background-color, var(--ha-card-background, #fff));
          }

          .section-title,
          .card-title {
            font-weight: 700;
            font-size: 0.92rem;
          }

          .grid-2,
          .grid-3,
          .grid-4 {
            display: grid;
            gap: 10px;
          }

          .grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .grid-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          label {
            display: grid;
            gap: 5px;
            font-size: 0.8rem;
            color: var(--secondary-text-color);
          }

          input,
          select,
          textarea {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            min-height: 36px;
            padding: 7px 9px;
            font: inherit;
          }

          input[type="checkbox"] {
            width: auto;
            min-height: auto;
          }

          input[type="color"] {
            padding: 3px;
          }

          .visual-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 10px;
          }

          .visual-control {
            display: grid;
            gap: 6px;
            min-width: 0;
          }

          .visual-control > span,
          .visual-control > label {
            font-size: 0.8rem;
            color: var(--secondary-text-color);
          }

          .control-row {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr) auto auto;
            gap: 6px;
            align-items: center;
            min-width: 0;
          }

          .stepper-row {
            grid-template-columns: auto minmax(0, 1fr) auto auto;
          }

          .text-row {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .color-swatch {
            width: 40px;
            height: 36px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            overflow: hidden;
            background:
              linear-gradient(45deg, rgba(127, 127, 127, 0.35) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(127, 127, 127, 0.35) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(127, 127, 127, 0.35) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(127, 127, 127, 0.35) 75%);
            background-position: 0 0, 0 10px, 10px -10px, -10px 0;
            background-size: 20px 20px;
          }

          .color-swatch input[type="color"] {
            width: 100%;
            height: 100%;
            min-height: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            cursor: pointer;
            opacity: 1;
          }

          .color-swatch.transparent input[type="color"] {
            opacity: 0.35;
          }

          .style-value {
            min-width: 0;
          }

          .mini-button,
          .text-mini-button {
            min-height: 36px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            cursor: pointer;
            font: inherit;
          }

          .mini-button {
            width: 36px;
            padding: 0;
          }

          .text-mini-button {
            padding: 0 9px;
            white-space: nowrap;
          }

          .mini-button ha-icon,
          .text-mini-button ha-icon {
            width: 18px;
            height: 18px;
            pointer-events: none;
          }

          textarea {
            min-height: 120px;
            font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
            resize: vertical;
          }

          .toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--primary-text-color);
          }

          .toolbar,
          .tab-list,
          .card-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
          }

          .preset-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(116px, 1fr));
            gap: 8px;
          }

          .preset-button {
            appearance: none;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 9px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            display: grid;
            gap: 7px;
            cursor: pointer;
            font: inherit;
            text-align: start;
          }

          .preset-button.active {
            border-color: var(--primary-color);
            box-shadow: inset 0 0 0 1px var(--primary-color);
          }

          .preset-preview {
            display: flex;
            gap: 4px;
            align-items: center;
            min-width: 0;
          }

          .preset-pill {
            height: 14px;
            flex: 1 1 0;
            min-width: 18px;
            border-radius: 999px;
            background: rgba(127, 127, 127, 0.18);
          }

          .preset-pill.active {
            background: var(--primary-color);
          }

          .preset-name {
            font-weight: 700;
            font-size: 0.82rem;
          }

          .tab-chip {
            appearance: none;
            border: 1px solid var(--divider-color);
            border-radius: 999px;
            background: transparent;
            color: var(--primary-text-color);
            padding: 7px 11px;
            cursor: pointer;
            font: inherit;
          }

          .tab-chip.active {
            border-color: var(--primary-color);
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
          }

          .icon-button {
            width: 36px;
            padding: 0;
            display: inline-grid;
            place-items: center;
          }

          .danger {
            color: var(--error-color, #ef4444);
          }

          ha-form {
            display: block;
          }

          ha-form + ha-form {
            margin-top: 8px;
          }

          ha-button.danger {
            --mdc-theme-primary: var(--error-color, #ef4444);
          }

          ha-icon-button.danger {
            color: var(--error-color, #ef4444);
          }

          .muted {
            color: var(--secondary-text-color);
            font-size: 0.78rem;
          }

          .error {
            color: var(--error-color, #ef4444);
            min-height: 18px;
            font-size: 0.78rem;
          }

          .native-editor-host {
            display: grid;
            gap: 8px;
          }

          .native-editor-details summary,
          .card-picker-details summary {
            cursor: pointer;
            color: var(--primary-text-color);
            font-weight: 600;
          }

          .card-picker-frame {
            display: grid;
            gap: 12px;
            border: 1px dashed var(--divider-color);
            border-radius: 8px;
            padding: 12px;
          }

          .native-card-picker {
            min-height: 120px;
            overflow: hidden;
          }

          .native-card-picker hui-card-picker {
            max-height: min(70vh, 720px);
          }

          .advanced-json summary {
            cursor: pointer;
            color: var(--secondary-text-color);
            font-size: 0.8rem;
          }

          @media (max-width: 720px) {
            .nav,
            .grid-2,
            .grid-3,
            .grid-4,
            .visual-grid {
              grid-template-columns: 1fr;
            }

            .control-row {
              grid-template-columns: auto minmax(0, 1fr) auto;
            }

            .text-row {
              grid-template-columns: minmax(0, 1fr) auto;
            }

            .text-mini-button {
              grid-column: 1 / -1;
              width: 100%;
            }
          }
        </style>
        <div class="editor">
          <div class="nav" role="tablist" aria-label="Ultimate Tabbed Card editor sections">
            ${this._navButton("general", "General")}
            ${this._navButton("appearance", "Appearance")}
            ${this._navButton("tabs", "Tabs")}
            ${this._navButton("advanced", "Advanced")}
          </div>
          <section class="panel" data-panel="${this._section}">
            ${this._renderActivePanel()}
          </section>
        </div>
      `

      this.shadowRoot.removeEventListener("change", this._onRootChange)
      this.shadowRoot.removeEventListener("click", this._onRootClick)
      this.shadowRoot.removeEventListener("toggle", this._onRootToggle, true)
      this.shadowRoot.removeEventListener("value-changed", this._onValueChanged)
      this.shadowRoot.addEventListener("change", this._onRootChange)
      this.shadowRoot.addEventListener("click", this._onRootClick)
      this.shadowRoot.addEventListener("toggle", this._onRootToggle, true)
      this.shadowRoot.addEventListener("value-changed", this._onValueChanged)
      this._hydrateHaControls()
      this._mountOpenedNativeEditors(this._nativeMountToken)
      this._mountCardPicker()
    }

    _scheduleRender() {
      if (this._renderPending) return
      this._renderPending = true
      const render = () => {
        if (!this._renderPending) return
        this._render()
      }
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(render)
      } else {
        queueMicrotask(render)
      }
    }

    _navButton(section, label) {
      const active = this._section === section
      return `<ha-button appearance="${
        active ? "filled" : "outlined"
      }" type="button" data-action="section" data-section="${section}" class="${
        active ? "active" : ""
      }">${label}</ha-button>`
    }

    _renderActivePanel() {
      if (this._section === "appearance") return this._renderAppearancePanel()
      if (this._section === "tabs") return this._renderTabsPanel()
      if (this._section === "advanced") return this._renderAdvancedPanel()
      return this._renderGeneralPanel()
    }

    _haForm(form, tabIndex, cardIndex, conditionIndex) {
      return `<ha-form data-form="${form}" ${this._dataAttrs(
        tabIndex,
        cardIndex,
        conditionIndex
      )}></ha-form>`
    }

    _cachedFormSchema(form) {
      if (!this._schemaCache.has(form)) {
        this._schemaCache.set(form, this._formSchema(form))
      }
      return this._schemaCache.get(form)
    }

    _optionList(options) {
      return options.map(([value, label]) => ({ value, label }))
    }

    _formSchema(form) {
      const select = (options) => ({ select: { mode: "dropdown", options: this._optionList(options) } })
      const cssText = { text: {} }

      switch (form) {
        case "general":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "220px",
              schema: [
                { name: "defaultTabIndex", selector: { number: { min: 0, mode: "box" } } },
                { name: "defaultTabId", selector: { text: {} } },
                {
                  name: "remember",
                  selector: select([
                    ["none", "None"],
                    ["card", "This card"],
                    ["browser", "Per browser path"],
                    ["user", "Per Home Assistant user"],
                  ]),
                },
                {
                  name: "preload",
                  selector: select([
                    ["active", "Active tab only"],
                    ["idle", "Active plus neighbors"],
                    ["all", "All tabs"],
                  ]),
                },
                { name: "maxCachedTabs", selector: { number: { min: 0, mode: "box" } } },
                { name: "swipeThreshold", selector: { number: { min: 16, max: 180, mode: "box" } } },
                { name: "keepAlive", selector: { boolean: {} } },
                { name: "swipe", selector: { boolean: {} } },
                { name: "haptic", selector: { boolean: {} } },
                { name: "showIcons", selector: { boolean: {} } },
                { name: "showLabels", selector: { boolean: {} } },
                { name: "hideInactiveLabels", selector: { boolean: {} } },
                { name: "deepLink", selector: { boolean: {} } },
                { name: "updateHash", selector: { boolean: {} } },
                { name: "hashPrefix", selector: { text: {} } },
              ],
            },
          ]
        case "appearance-layout":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "180px",
              schema: [
                {
                  name: "tab_position",
                  selector: select([
                    ["top", "Top"],
                    ["bottom", "Bottom"],
                    ["left", "Left"],
                    ["right", "Right"],
                  ]),
                },
                {
                  name: "alignment",
                  selector: select([
                    ["start", "Start"],
                    ["center", "Center"],
                    ["end", "End"],
                    ["stretch", "Stretch"],
                  ]),
                },
                {
                  name: "variant",
                  selector: select([
                    ["pills", "Pills"],
                    ["segmented", "Segmented"],
                    ["underline", "Underline"],
                    ["minimal", "Minimal"],
                  ]),
                },
                {
                  name: "density",
                  selector: select([
                    ["compact", "Compact"],
                    ["comfortable", "Comfortable"],
                  ]),
                },
                {
                  name: "icon_position",
                  selector: select([
                    ["inline", "Inline"],
                    ["stacked", "Stacked"],
                  ]),
                },
                { name: "equal_width", selector: { boolean: {} } },
                { name: "wrap_tabs", selector: { boolean: {} } },
              ],
            },
          ]
        case "appearance-colors":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "220px",
              schema: [
                { name: "background_color", selector: cssText },
                { name: "panel_background", selector: cssText },
                { name: "bar_background", selector: cssText },
                { name: "text_color", selector: cssText },
                { name: "active_color", selector: cssText },
                { name: "active_border_color", selector: cssText },
                { name: "active_text_color", selector: cssText },
                { name: "inactive_color", selector: cssText },
                { name: "hover_color", selector: cssText },
                { name: "border_color", selector: cssText },
                { name: "badge_color", selector: cssText },
              ],
            },
          ]
        case "appearance-tabs":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "180px",
              schema: [
                {
                  name: "tab_text_transform",
                  selector: select([
                    ["none", "None"],
                    ["uppercase", "Uppercase"],
                    ["lowercase", "Lowercase"],
                    ["capitalize", "Capitalize"],
                  ]),
                },
              ],
            },
          ]
        case "appearance-spacing":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "180px",
              schema: [
                { name: "radius", selector: cssText },
                { name: "tab_radius", selector: cssText },
                { name: "shadow", selector: cssText },
                { name: "tab_padding", selector: cssText },
                { name: "header_padding", selector: cssText },
                { name: "panel_padding", selector: cssText },
                { name: "tab_gap", selector: cssText },
                { name: "content_gap", selector: cssText },
                { name: "min_height", selector: cssText },
              ],
            },
          ]
        case "tab":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "220px",
              schema: [
                { name: "label", selector: { text: {} } },
                { name: "icon", selector: { icon: {} } },
                { name: "id", selector: { text: {} } },
                { name: "hidden", selector: { boolean: {} } },
                { name: "disabled", selector: { boolean: {} } },
              ],
            },
          ]
        case "badge":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "220px",
              schema: [
                {
                  name: "mode",
                  selector: select([
                    ["none", "None"],
                    ["dot", "Dot"],
                    ["count", "Count"],
                    ["text", "Text"],
                    ["exclamation", "Exclamation"],
                    ["state", "Entity state"],
                  ]),
                },
                { name: "entity", selector: { entity: {} } },
                { name: "state", selector: { text: {} } },
                { name: "text", selector: { text: {} } },
                { name: "template", selector: { template: {} } },
              ],
            },
          ]
        case "condition":
          return [
            {
              type: "grid",
              name: "",
              flatten: true,
              column_min_width: "220px",
              schema: [
                {
                  name: "type",
                  selector: select([
                    ["entity", "Entity"],
                    ["user", "User"],
                    ["media", "Media query"],
                    ["template", "Template"],
                  ]),
                },
                { name: "entity", selector: { entity: {} } },
                { name: "attribute", selector: { text: {} } },
                { name: "state", selector: { text: {} } },
                { name: "state_not", selector: { text: {} } },
                { name: "above", selector: { text: {} } },
                { name: "below", selector: { text: {} } },
                { name: "user", selector: { text: {} } },
                { name: "user_not", selector: { text: {} } },
                { name: "media_query", selector: { text: {} } },
                { name: "template", selector: { template: {} } },
              ],
            },
          ]
        default:
          return []
      }
    }

    _formData(form, target) {
      const tabIndex = Number(target?.dataset?.tabIndex)
      const conditionIndex = Number(target?.dataset?.conditionIndex)
      const tab = this._config.tabs[Number.isFinite(tabIndex) ? tabIndex : this._editingTabIndex]

      switch (form) {
        case "general":
          return { ...this._config.options }
        case "appearance-layout":
        case "appearance-tabs":
        case "appearance-colors":
        case "appearance-spacing":
          return { ...this._config.styles }
        case "tab":
          return {
            ...tab.attributes,
          }
        case "badge":
          return { ...tab.badge }
        case "condition":
          return { ...(tab.conditions[conditionIndex] || {}) }
        default:
          return {}
      }
    }

    _computeFormLabel(schema) {
      const labels = {
        defaultTabIndex: "Default tab index",
        defaultTabId: "Default tab id",
        remember: "Remember tab",
        preload: "Preload",
        maxCachedTabs: "Max cached tabs",
        swipeThreshold: "Swipe threshold",
        keepAlive: "Keep inactive cards alive",
        swipe: "Swipe navigation",
        haptic: "Haptic feedback",
        showIcons: "Show icons",
        showLabels: "Show labels",
        hideInactiveLabels: "Hide inactive labels",
        deepLink: "Deep links",
        updateHash: "Update URL hash",
        hashPrefix: "Hash prefix",
        tab_position: "Tab position",
        alignment: "Alignment",
        variant: "Variant",
        density: "Density",
        icon_position: "Icon position",
        equal_width: "Equal width tabs",
        wrap_tabs: "Wrap tabs",
        background_color: "Background",
        panel_background: "Panel background",
        bar_background: "Tab bar background",
        text_color: "Text color",
        active_color: "Active color",
        active_border_color: "Active border",
        active_text_color: "Active text color",
        inactive_color: "Inactive color",
        hover_color: "Hover color",
        border_color: "Border color",
        badge_color: "Badge color",
        radius: "Card radius",
        tab_radius: "Tab radius",
        shadow: "Shadow",
        tab_padding: "Tab padding",
        tab_min_width: "Tab minimum width",
        tab_font_size: "Tab font size",
        tab_font_weight: "Tab font weight",
        tab_text_transform: "Tab text transform",
        tab_border_width: "Tab border width",
        tab_icon_size: "Tab icon size",
        header_padding: "Header padding",
        panel_padding: "Panel padding",
        tab_gap: "Tab gap",
        content_gap: "Content gap",
        min_height: "Minimum height",
        label: "Label",
        icon: "Icon",
        id: "Deep-link id",
        hidden: "Hidden",
        disabled: "Disabled",
        accent_color: "Tab accent",
        mode: "Mode",
        entity: "Entity",
        state: "State rule",
        state_not: "State not",
        text: "Text",
        template: "Template",
        attribute: "Attribute",
        above: "Above",
        below: "Below",
        user: "User ids",
        user_not: "Excluded user ids",
        media_query: "Media query",
      }
      return labels[schema.name]
    }

    _computeFormHelper(schema) {
      const helpers = {
        defaultTabId: "Use the tab deep-link id when you prefer a stable default.",
        maxCachedTabs: "0 keeps every opened tab cached.",
        hashPrefix: "Optional prefix used before tab ids in the URL hash.",
        template: "Home Assistant template returning true/text, depending on the field.",
      }
      return helpers[schema.name]
    }

    _renderGeneralPanel() {
      return `
        <div class="section">
          <div class="section-title">Behavior</div>
          ${this._haForm("general")}
        </div>
      `
    }

    _renderAppearancePanel() {
      return `
        <div class="section">
          <div class="section-title">Presets</div>
          <div class="preset-grid">${STYLE_PRESET_OPTIONS.map(([key, label]) =>
            this._renderPresetButton(key, label)
          ).join("")}</div>
        </div>
        <div class="section">
          <div class="section-title">Layout</div>
          ${this._haForm("appearance-layout")}
        </div>
        <div class="section">
          <div class="section-title">Tabs</div>
          ${this._haForm("appearance-tabs")}
          ${this._renderSizeControls(TAB_SIZE_STYLE_FIELDS)}
        </div>
        <div class="section">
          <div class="section-title">Colors</div>
          ${this._renderColorControls()}
        </div>
        <div class="section">
          <div class="section-title">Spacing and shape</div>
          ${this._renderSizeControls(SPACING_STYLE_FIELDS)}
          ${this._renderStyleTextControl("shadow")}
        </div>
      `
    }

    _renderColorControls() {
      return `<div class="visual-grid">${COLOR_STYLE_FIELDS.map((field) => this._renderColorControl(field)).join(
        ""
      )}</div>`
    }

    _renderColorControl(field) {
      const value = this._styleValue(field)
      const fallbackHex = cssColorToHex(DEFAULT_STYLES[field]) || "#000000"
      const colorValue = cssColorToHex(value) || fallbackHex
      const label = this._computeFormLabel({ name: field }) || field
      const transparent = value.trim().toLowerCase() === "transparent"
      return `
        <div class="visual-control">
          <span>${escapeHtml(label)}</span>
          <div class="control-row">
            <span class="color-swatch ${transparent ? "transparent" : ""}">
              <input type="color" value="${escapeHtml(colorValue)}" data-style-field="${field}" data-style-mode="color" aria-label="${escapeHtml(
                label
              )} color picker">
            </span>
            <input class="style-value" type="text" value="${escapeHtml(value)}" data-style-field="${field}" data-style-mode="text" spellcheck="false" aria-label="${escapeHtml(
              label
            )} CSS value">
            <button class="text-mini-button" type="button" data-action="style-transparent" data-style-field="${field}" title="Set transparent">
              <ha-icon icon="mdi:checkerboard"></ha-icon>
              <span>Transparent</span>
            </button>
            <button class="mini-button" type="button" data-action="style-reset" data-style-field="${field}" title="Reset">
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
          </div>
        </div>
      `
    }

    _renderSizeControls(fields) {
      return `<div class="visual-grid">${fields.map((field) => this._renderSizeControl(field)).join("")}</div>`
    }

    _renderSizeControl(field) {
      const value = this._styleValue(field)
      const label = this._computeFormLabel({ name: field }) || field
      return `
        <div class="visual-control">
          <label>${escapeHtml(label)}</label>
          <div class="control-row stepper-row">
            <button class="mini-button" type="button" data-action="style-step" data-style-field="${field}" data-step="-1" title="Decrease">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <input class="style-value" type="text" value="${escapeHtml(value)}" data-style-field="${field}" data-style-mode="text" spellcheck="false" aria-label="${escapeHtml(
              label
            )} CSS value">
            <button class="mini-button" type="button" data-action="style-step" data-style-field="${field}" data-step="1" title="Increase">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
            <button class="mini-button" type="button" data-action="style-reset" data-style-field="${field}" title="Reset">
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
          </div>
        </div>
      `
    }

    _renderStyleTextControl(field) {
      const value = this._styleValue(field)
      const label = this._computeFormLabel({ name: field }) || field
      return `
        <div class="visual-control">
          <label>${escapeHtml(label)}</label>
          <div class="control-row text-row">
            <input class="style-value" type="text" value="${escapeHtml(value)}" data-style-field="${field}" data-style-mode="text" spellcheck="false" aria-label="${escapeHtml(
              label
            )} CSS value">
            <button class="mini-button" type="button" data-action="style-reset" data-style-field="${field}" title="Reset">
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
          </div>
        </div>
      `
    }

    _renderTabStyleControls(tabIndex) {
      return `
        <div class="visual-grid">
          ${TAB_COLOR_FIELDS.map((field) => this._renderTabColorControl(tabIndex, field)).join("")}
          ${TAB_SIZE_FIELDS.map((field) => this._renderTabSizeControl(tabIndex, field)).join("")}
        </div>
      `
    }

    _renderTabColorControl(tabIndex, field) {
      const value = this._tabStyleValue(tabIndex, field)
      const fallback = field === "accent_color" ? this._styleValue("active_color") : this._styleValue(field)
      const colorValue = cssColorToHex(value) || cssColorToHex(fallback) || "#000000"
      const label = this._computeFormLabel({ name: field }) || field
      const transparent = value.trim().toLowerCase() === "transparent"
      return `
        <div class="visual-control">
          <span>${escapeHtml(label)}</span>
          <div class="control-row">
            <span class="color-swatch ${transparent ? "transparent" : ""}">
              <input type="color" value="${escapeHtml(colorValue)}" data-tab-style-field="${field}" data-tab-index="${tabIndex}" data-style-mode="color" aria-label="${escapeHtml(
                label
              )} color picker">
            </span>
            <input class="style-value" type="text" value="${escapeHtml(value)}" data-tab-style-field="${field}" data-tab-index="${tabIndex}" data-style-mode="text" spellcheck="false" placeholder="Inherit" aria-label="${escapeHtml(
              label
            )} CSS value">
            <button class="text-mini-button" type="button" data-action="tab-style-transparent" data-tab-style-field="${field}" data-tab-index="${tabIndex}" title="Set transparent">
              <ha-icon icon="mdi:checkerboard"></ha-icon>
              <span>Transparent</span>
            </button>
            <button class="mini-button" type="button" data-action="tab-style-reset" data-tab-style-field="${field}" data-tab-index="${tabIndex}" title="Inherit">
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
          </div>
        </div>
      `
    }

    _renderTabSizeControl(tabIndex, field) {
      const value = this._tabStyleValue(tabIndex, field)
      const label = this._computeFormLabel({ name: field }) || field
      return `
        <div class="visual-control">
          <label>${escapeHtml(label)}</label>
          <div class="control-row stepper-row">
            <button class="mini-button" type="button" data-action="tab-style-step" data-tab-style-field="${field}" data-tab-index="${tabIndex}" data-step="-1" title="Decrease">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <input class="style-value" type="text" value="${escapeHtml(value)}" data-tab-style-field="${field}" data-tab-index="${tabIndex}" data-style-mode="text" spellcheck="false" placeholder="Inherit" aria-label="${escapeHtml(
              label
            )} CSS value">
            <button class="mini-button" type="button" data-action="tab-style-step" data-tab-style-field="${field}" data-tab-index="${tabIndex}" data-step="1" title="Increase">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
            <button class="mini-button" type="button" data-action="tab-style-reset" data-tab-style-field="${field}" data-tab-index="${tabIndex}" title="Inherit">
              <ha-icon icon="mdi:restore"></ha-icon>
            </button>
          </div>
        </div>
      `
    }

    _renderPresetButton(key, label) {
      const active = this._isPresetActive(key)
      return `
        <button type="button" class="preset-button ${active ? "active" : ""}" data-action="preset" data-preset="${key}">
          <span class="preset-preview" aria-hidden="true">
            <span class="preset-pill active"></span>
            <span class="preset-pill"></span>
            <span class="preset-pill"></span>
          </span>
          <span class="preset-name">${escapeHtml(label)}</span>
        </button>
      `
    }

    _isPresetActive(key) {
      const preset = STYLE_PRESETS[key]
      if (!preset) return false
      return Object.entries(preset).every(([name, value]) => {
        return String(this._config.styles[name] ?? "") === String(value)
      })
    }

    _renderTabsPanel() {
      const tab = this._config.tabs[this._editingTabIndex]
      const tabButtons = this._config.tabs
        .map(
          (item, index) => `
            <button type="button" class="tab-chip ${
              index === this._editingTabIndex ? "active" : ""
            }" data-action="edit-tab" data-tab-index="${index}">
              ${escapeHtml(item.attributes.label || "Tab " + String(index + 1))}
            </button>
          `
        )
        .join("")

      return `
        <div class="section">
          <div class="toolbar">
            <ha-button appearance="filled" type="button" data-action="add-tab">Add tab</ha-button>
            <ha-button appearance="outlined" type="button" data-action="duplicate-tab" data-tab-index="${
              this._editingTabIndex
            }">Duplicate tab</ha-button>
            <ha-button appearance="outlined" type="button" data-action="delete-tab" data-tab-index="${
              this._editingTabIndex
            }" class="danger">Delete tab</ha-button>
          </div>
          <div class="tab-list">${tabButtons}</div>
        </div>
        <div class="tab-body">
          <div class="section-title">Selected tab</div>
          ${this._haForm("tab", this._editingTabIndex)}
          <div class="section-title">Tab style</div>
          ${this._renderTabStyleControls(this._editingTabIndex)}
          <div class="toolbar">
            <ha-button appearance="outlined" type="button" data-action="make-default" data-tab-index="${
              this._editingTabIndex
            }">Make default</ha-button>
          </div>
        </div>
        ${this._renderBadgePanel(tab)}
        ${this._renderConditionsPanel(tab)}
        ${this._renderCardsPanel(tab)}
      `
    }

    _renderBadgePanel(tab) {
      return `
        <div class="section">
          <div class="section-title">Badge</div>
          ${this._haForm("badge", this._editingTabIndex)}
        </div>
      `
    }

    _renderConditionsPanel(tab) {
      const conditions = tab.conditions.length
        ? tab.conditions
            .map((condition, index) => this._renderCondition(condition, index))
            .join("")
        : `<div class="muted">No visibility condition. This tab is visible to everyone.</div>`

      return `
        <div class="section">
          <div class="section-title">Visibility conditions</div>
          ${conditions}
          <ha-button appearance="outlined" type="button" data-action="add-condition" data-tab-index="${
            this._editingTabIndex
          }">Add condition</ha-button>
        </div>
      `
    }

    _renderCondition(condition, index) {
      return `
        <div class="section" data-condition-index="${index}">
          ${this._haForm("condition", this._editingTabIndex, undefined, index)}
          <ha-button appearance="outlined" type="button" data-action="delete-condition" data-tab-index="${
            this._editingTabIndex
          }" data-condition-index="${index}" class="danger">Remove condition</ha-button>
        </div>
      `
    }

    _renderCardsPanel(tab) {
      const cards = tab.cards
        .map((card, index) => this._renderCardItem(card, index))
        .join("")
      const pickerOpen = !tab.cards.length || this._openPickerTabs.has(this._editingTabIndex)
      const hasClipboard = Boolean(this._readCardClipboard())
      return `
        <div class="section">
          <div class="section-title">Cards in this tab</div>
          <div class="toolbar">
            <ha-button appearance="outlined" type="button" data-action="paste-card" data-tab-index="${
              this._editingTabIndex
            }" ${hasClipboard ? "" : "disabled"}>Paste card</ha-button>
          </div>
          ${cards}
          <div class="card-picker-frame">
            <details class="card-picker-details" data-tab-index="${this._editingTabIndex}" ${
              pickerOpen ? "open" : ""
            }>
              <summary>Add a card</summary>
              <div class="native-card-picker" id="native-card-picker-${this._editingTabIndex}" data-tab-index="${
                this._editingTabIndex
              }">
                <div class="muted">Home Assistant card picker is loading.</div>
              </div>
            </details>
          </div>
        </div>
      `
    }

    _renderCardItem(card, index) {
      const key = this._nativeKey(this._editingTabIndex, index)
      const editorOpen = this._expandedEditorKeys.has(key)
      return `
        <div class="card-item" data-card-index="${index}">
          <div class="card-title">${escapeHtml(summarizeCard(card))}</div>
          <div class="card-actions">
            <ha-icon-button type="button" label="Move up" title="Move up" data-action="move-card-up" data-tab-index="${
              this._editingTabIndex
            }" data-card-index="${index}"><ha-icon icon="mdi:arrow-up"></ha-icon></ha-icon-button>
            <ha-icon-button type="button" label="Move down" title="Move down" data-action="move-card-down" data-tab-index="${
              this._editingTabIndex
            }" data-card-index="${index}"><ha-icon icon="mdi:arrow-down"></ha-icon></ha-icon-button>
            <ha-button appearance="outlined" type="button" data-action="duplicate-card" data-tab-index="${
              this._editingTabIndex
            }" data-card-index="${index}">Duplicate</ha-button>
            <ha-button appearance="outlined" type="button" data-action="copy-card" data-tab-index="${
              this._editingTabIndex
            }" data-card-index="${index}">Copy</ha-button>
            <ha-button appearance="outlined" type="button" data-action="delete-card" data-tab-index="${
              this._editingTabIndex
            }" data-card-index="${index}" class="danger">Delete</ha-button>
          </div>
          <details class="native-editor-details" data-editor-key="${key}" data-tab-index="${
            this._editingTabIndex
          }" data-card-index="${index}" ${editorOpen ? "open" : ""}>
            <summary>Visual editor</summary>
            <div class="native-editor-host" id="native-editor-${key}">
              <div class="muted">Open this panel to load the native visual editor.</div>
            </div>
          </details>
          <details class="advanced-json" data-json-details data-tab-index="${
            this._editingTabIndex
          }" data-card-index="${index}">
            <summary>Advanced JSON fallback</summary>
            <div class="json-editor-host" id="json-editor-${key}"></div>
            <div class="error" id="json-error-${key}"></div>
          </details>
        </div>
      `
    }

    _refreshEditorTabButtons() {
      const buttons = Array.from(this.shadowRoot.querySelectorAll(".tab-list .tab-chip"))
      buttons.forEach((button, index) => {
        const tab = this._config.tabs[index]
        if (!tab) return
        button.textContent = tab.attributes.label || "Tab " + String(index + 1)
      })
    }

    _refreshCardSummary(tabIndex, cardIndex) {
      if (tabIndex !== this._editingTabIndex) return
      const card = this._config.tabs[tabIndex]?.cards[cardIndex]
      const title = this.shadowRoot.querySelector(
        `.card-item[data-card-index="${cardIndex}"] .card-title`
      )
      if (title && card) title.textContent = summarizeCard(card)
    }

    _syncCardJsonTextarea(tabIndex, cardIndex) {
      const textarea = this.shadowRoot.querySelector(
        `textarea[data-field="card.json"][data-tab-index="${tabIndex}"][data-card-index="${cardIndex}"]`
      )
      const card = this._config.tabs[tabIndex]?.cards[cardIndex]
      if (textarea && card) textarea.value = JSON.stringify(card, null, 2)
    }

    _readCardClipboard() {
      if (isObject(this._cardClipboard)) return clone(this._cardClipboard)
      if (isObject(window.__ultimateTabbedCardClipboard)) {
        this._cardClipboard = clone(window.__ultimateTabbedCardClipboard)
        return clone(this._cardClipboard)
      }
      try {
        const stored = window.localStorage.getItem(CARD_CLIPBOARD_KEY)
        if (!stored) return null
        const parsed = JSON.parse(stored)
        if (!isObject(parsed) || !parsed.type) return null
        this._cardClipboard = parsed
        window.__ultimateTabbedCardClipboard = clone(parsed)
        return clone(parsed)
      } catch (_) {
        return null
      }
    }

    _writeCardClipboard(card) {
      if (!isObject(card) || !card.type) return false
      const copy = clone(card)
      this._cardClipboard = copy
      window.__ultimateTabbedCardClipboard = clone(copy)
      try {
        window.localStorage.setItem(CARD_CLIPBOARD_KEY, JSON.stringify(copy))
      } catch (_) {}
      return true
    }

    _clearMountedCardEditors(tabIndex) {
      const prefix = String(tabIndex) + "-"
      ;[this._expandedEditorKeys, this._nativeEditors, this._loadingEditors].forEach((collection) => {
        Array.from(collection.keys()).forEach((key) => {
          if (key.startsWith(prefix)) collection.delete(key)
        })
      })
    }

    _clearAllEditorState() {
      this._expandedEditorKeys.clear()
      this._nativeEditors.clear()
      this._loadingEditors.clear()
      this._openPickerTabs.clear()
    }

    _mountJsonEditor(details) {
      const tabIndex = Number(details.dataset.tabIndex)
      const cardIndex = Number(details.dataset.cardIndex)
      const host = details.querySelector(".json-editor-host")
      const card = this._config.tabs[tabIndex]?.cards[cardIndex]
      if (!host || !card || host.querySelector("textarea")) return
      const textarea = document.createElement("textarea")
      textarea.dataset.field = "card.json"
      textarea.dataset.tabIndex = String(tabIndex)
      textarea.dataset.cardIndex = String(cardIndex)
      textarea.value = JSON.stringify(card, null, 2)
      host.replaceChildren(textarea)
    }

    _renderAdvancedPanel() {
      return `
        <div class="section">
          <div class="section-title">Full generated config</div>
          <div class="muted">This read-only view helps with debugging and sharing, while normal editing stays visual.</div>
          <textarea readonly>${escapeHtml(JSON.stringify(toPublicConfig(this._config), null, 2))}</textarea>
        </div>
      `
    }

    _dataAttrs(tabIndex, cardIndex, conditionIndex) {
      return [
        tabIndex !== undefined ? `data-tab-index="${tabIndex}"` : "",
        cardIndex !== undefined ? `data-card-index="${cardIndex}"` : "",
        conditionIndex !== undefined ? `data-condition-index="${conditionIndex}"` : "",
      ]
        .filter(Boolean)
        .join(" ")
    }

    _styleValue(field) {
      return asString(this._config?.styles?.[field] ?? DEFAULT_STYLES[field] ?? "", "")
    }

    _setStyleValue(field, value) {
      if (!this._config || !(field in DEFAULT_STYLES)) return
      this._config.styles[field] = asString(value, "")
      this._emit(false)
      this._syncStyleInputs(field)
    }

    _stepStyleValue(field, direction) {
      if (!this._config || !(field in DEFAULT_STYLES)) return
      const settings = STYLE_STEPPER_SETTINGS[field] || { step: 1, min: 0, unit: "px" }
      const nextValue = stepCssValue(
        this._styleValue(field),
        DEFAULT_STYLES[field],
        direction < 0 ? -1 : 1,
        settings
      )
      this._setStyleValue(field, nextValue)
    }

    _syncStyleInputs(field) {
      if (!this.shadowRoot) return
      const value = this._styleValue(field)
      const colorValue = cssColorToHex(value) || cssColorToHex(DEFAULT_STYLES[field]) || "#000000"
      const transparent = value.trim().toLowerCase() === "transparent"
      this.shadowRoot.querySelectorAll("[data-style-field]").forEach((input) => {
        if (input.dataset.styleField !== field) return
        if (input.tagName !== "INPUT") return
        if (input.dataset.styleMode === "color") {
          input.value = colorValue
          input.closest(".color-swatch")?.classList.toggle("transparent", transparent)
          return
        }
        if ("value" in input) input.value = value
      })
    }

    _tabStyleValue(tabIndex, field) {
      return asString(this._config?.tabs?.[tabIndex]?.styles?.[field] ?? TAB_STYLE_DEFAULTS[field] ?? "", "")
    }

    _setTabStyleValue(tabIndex, field, value) {
      const tab = this._config?.tabs?.[tabIndex]
      if (!tab || !(field in TAB_STYLE_DEFAULTS)) return
      tab.styles = tab.styles || {}
      const nextValue = asString(value, "")
      if (nextValue) {
        tab.styles[field] = nextValue
      } else {
        delete tab.styles[field]
      }
      this._emit(false)
      this._syncTabStyleInputs(tabIndex, field)
    }

    _stepTabStyleValue(tabIndex, field, direction) {
      const tab = this._config?.tabs?.[tabIndex]
      if (!tab || !(field in TAB_STYLE_DEFAULTS)) return
      const fallback = this._tabStyleValue(tabIndex, field) || this._styleValue(field) || DEFAULT_STYLES[field]
      const settings = STYLE_STEPPER_SETTINGS[field] || { step: 1, min: 0, unit: "px" }
      const nextValue = stepCssValue(
        this._tabStyleValue(tabIndex, field),
        fallback,
        direction < 0 ? -1 : 1,
        settings
      )
      this._setTabStyleValue(tabIndex, field, nextValue)
    }

    _syncTabStyleInputs(tabIndex, field) {
      if (!this.shadowRoot) return
      const value = this._tabStyleValue(tabIndex, field)
      const fallback = field === "accent_color" ? this._styleValue("active_color") : this._styleValue(field)
      const colorValue = cssColorToHex(value) || cssColorToHex(fallback) || "#000000"
      const transparent = value.trim().toLowerCase() === "transparent"
      this.shadowRoot.querySelectorAll("[data-tab-style-field]").forEach((input) => {
        if (input.dataset.tabStyleField !== field) return
        if (Number(input.dataset.tabIndex) !== tabIndex) return
        if (input.tagName !== "INPUT") return
        if (input.dataset.styleMode === "color") {
          input.value = colorValue
          input.closest(".color-swatch")?.classList.toggle("transparent", transparent)
          return
        }
        if ("value" in input) input.value = value
      })
    }

    _onRootChange(event) {
      const target = event.target
      const tabStyleField = target?.dataset?.tabStyleField
      if (tabStyleField && this._config && !target.tagName?.startsWith("HA-")) {
        this._setTabStyleValue(Number(target.dataset.tabIndex), tabStyleField, target.value)
        return
      }
      const styleField = target?.dataset?.styleField
      if (styleField && this._config && !target.tagName?.startsWith("HA-")) {
        this._setStyleValue(styleField, target.value)
        return
      }
      const field = target?.dataset?.field
      if (!field || !this._config || target.tagName?.startsWith("HA-")) return
      if (field === "card.json") {
        this._applyCardJson(Number(target.dataset.tabIndex), Number(target.dataset.cardIndex), target.value)
      }
    }

    _onValueChanged(event) {
      const formTarget = this._eventDataTarget(event, "form")
      if (formTarget) {
        event.stopPropagation()
        this._applyFormData(formTarget.dataset.form, event.detail?.value || {}, formTarget)
        return
      }
    }

    _onRootClick(event) {
      const actionTarget = this._eventDataTarget(event, "action")
      const action = actionTarget?.dataset?.action
      if (!action || !this._config) return
      const tabIndex = Number(actionTarget.dataset.tabIndex)
      const cardIndex = Number(actionTarget.dataset.cardIndex)
      const conditionIndex = Number(actionTarget.dataset.conditionIndex)

      if (action === "section") {
        this._section = actionTarget.dataset.section
        this._render()
        return
      }

      if (action === "style-transparent") {
        this._setStyleValue(actionTarget.dataset.styleField, "transparent")
        return
      }

      if (action === "style-reset") {
        const field = actionTarget.dataset.styleField
        this._setStyleValue(field, DEFAULT_STYLES[field] ?? "")
        return
      }

      if (action === "style-step") {
        this._stepStyleValue(actionTarget.dataset.styleField, Number(actionTarget.dataset.step) || 1)
        return
      }

      if (action === "tab-style-transparent") {
        this._setTabStyleValue(
          Number(actionTarget.dataset.tabIndex),
          actionTarget.dataset.tabStyleField,
          "transparent"
        )
        return
      }

      if (action === "tab-style-reset") {
        this._setTabStyleValue(Number(actionTarget.dataset.tabIndex), actionTarget.dataset.tabStyleField, "")
        return
      }

      if (action === "tab-style-step") {
        this._stepTabStyleValue(
          Number(actionTarget.dataset.tabIndex),
          actionTarget.dataset.tabStyleField,
          Number(actionTarget.dataset.step) || 1
        )
        return
      }

      if (action === "preset") {
        Object.assign(this._config.styles, STYLE_PRESETS[actionTarget.dataset.preset] || {})
        this._emit(true)
        return
      }

      if (action === "edit-tab") {
        this._editingTabIndex = clamp(tabIndex, 0, this._config.tabs.length - 1)
        this._render()
        return
      }

      if (action === "add-tab") {
        this._config.tabs.push({
          attributes: {
            label: "New tab",
            icon: "mdi:tab",
            id: "tab-" + String(this._config.tabs.length + 1),
            hidden: false,
            disabled: false,
          },
          styles: {},
          conditions: [],
          badge: normalizeBadge({}),
          cards: [],
        })
        this._editingTabIndex = this._config.tabs.length - 1
        this._emit(true)
        return
      }

      if (action === "duplicate-tab") {
        const copy = clone(this._config.tabs[tabIndex])
        copy.attributes.label += " copy"
        copy.attributes.id = slugify(copy.attributes.label, "tab-" + String(this._config.tabs.length + 1))
        this._config.tabs.splice(tabIndex + 1, 0, copy)
        this._editingTabIndex = tabIndex + 1
        this._clearAllEditorState()
        this._emit(true)
        return
      }

      if (action === "delete-tab") {
        if (this._config.tabs.length <= 1) return
        this._config.tabs.splice(tabIndex, 1)
        this._editingTabIndex = clamp(tabIndex, 0, this._config.tabs.length - 1)
        this._clearAllEditorState()
        this._emit(true)
        return
      }

      if (action === "make-default") {
        this._config.options.defaultTabIndex = tabIndex
        this._config.options.defaultTabId = this._config.tabs[tabIndex].attributes.id
        this._emit(true)
        return
      }

      if (action === "add-condition") {
        this._config.tabs[tabIndex].conditions.push({
          type: "entity",
          entity: "",
          attribute: "",
          state: "on",
          state_not: "",
          above: "",
          below: "",
        })
        this._emit(true)
        return
      }

      if (action === "delete-condition") {
        this._config.tabs[tabIndex].conditions.splice(conditionIndex, 1)
        this._emit(true)
        return
      }

      if (action === "copy-card") {
        const card = this._config.tabs[tabIndex]?.cards?.[cardIndex]
        if (!this._writeCardClipboard(card)) return
        this._haptic("selection")
        this._scheduleRender()
        return
      }

      if (action === "paste-card") {
        const tab = this._config.tabs[tabIndex]
        const card = this._readCardClipboard()
        if (!tab || !card) return
        const nextCard = normalizeChildCardConfig(card, this._hass)
        const nextIndex = tab.cards.length
        tab.cards.push(nextCard)
        this._expandedEditorKeys.add(this._nativeKey(tabIndex, nextIndex))
        this._haptic("light")
        this._emit(true)
        return
      }

      if (action === "delete-card") {
        const cards = this._config.tabs[tabIndex].cards
        if (!cards || cardIndex < 0 || cardIndex >= cards.length) return
        this._clearMountedCardEditors(tabIndex)
        cards.splice(cardIndex, 1)
        this._emit(true)
        return
      }

      if (action === "duplicate-card") {
        const cards = this._config.tabs[tabIndex].cards
        if (!cards || cardIndex < 0 || cardIndex >= cards.length) return
        this._clearMountedCardEditors(tabIndex)
        cards.splice(cardIndex + 1, 0, clone(cards[cardIndex]))
        this._emit(true)
        return
      }

      if (action === "move-card-up" && cardIndex > 0) {
        this._clearMountedCardEditors(tabIndex)
        this._swap(this._config.tabs[tabIndex].cards, cardIndex, cardIndex - 1)
        this._emit(true)
        return
      }

      if (action === "move-card-down" && cardIndex < this._config.tabs[tabIndex].cards.length - 1) {
        this._clearMountedCardEditors(tabIndex)
        this._swap(this._config.tabs[tabIndex].cards, cardIndex, cardIndex + 1)
        this._emit(true)
      }
    }

    _onRootToggle(event) {
      const details = event.target
      if (!details || details.tagName !== "DETAILS") return

      if (details.classList.contains("card-picker-details")) {
        const tabIndex = Number(details.dataset.tabIndex)
        if (details.open) {
          this._openPickerTabs.add(tabIndex)
          this._mountCardPicker()
        } else {
          this._openPickerTabs.delete(tabIndex)
          const host = this.shadowRoot.getElementById("native-card-picker-" + tabIndex)
          if (host) {
            host.replaceChildren(Object.assign(document.createElement("div"), {
              className: "muted",
              textContent: "Open this panel to load the Home Assistant card picker.",
            }))
          }
        }
        return
      }

      if (details.classList.contains("native-editor-details")) {
        const key = details.dataset.editorKey
        if (!key) return
        if (details.open) {
          this._expandedEditorKeys.add(key)
          this._mountNativeEditorDetails(details, this._nativeMountToken)
        } else {
          this._expandedEditorKeys.delete(key)
          this._nativeEditors.delete(key)
          const host = this.shadowRoot.getElementById("native-editor-" + key)
          if (host) {
            host.replaceChildren(Object.assign(document.createElement("div"), {
              className: "muted",
              textContent: "Open this panel to load the native visual editor.",
            }))
          }
        }
        return
      }

      if (details.hasAttribute("data-json-details") && details.open) {
        this._mountJsonEditor(details)
      }
    }

    _eventDataTarget(event, key) {
      const path = typeof event.composedPath === "function" ? event.composedPath() : []
      for (const item of path) {
        if (item?.dataset && key in item.dataset) return item
      }
      return event.target?.closest?.(`[data-${key}]`) || null
    }

    _applyFormData(form, value, target) {
      const tabIndex = Number(target?.dataset?.tabIndex)
      const conditionIndex = Number(target?.dataset?.conditionIndex)
      const tab = this._config.tabs[Number.isFinite(tabIndex) ? tabIndex : this._editingTabIndex]

      if (form === "general") {
        Object.assign(this._config.options, value)
        this._config.options.defaultTabIndex = clamp(
          toNumber(this._config.options.defaultTabIndex, 0),
          0,
          this._config.tabs.length - 1
        )
        this._config.options.maxCachedTabs = Math.max(
          0,
          toNumber(this._config.options.maxCachedTabs, 0)
        )
        this._config.options.swipeThreshold = clamp(
          toNumber(this._config.options.swipeThreshold, 48),
          16,
          180
        )
        this._emit(false)
        return
      }

      if (form.startsWith("appearance-")) {
        Object.assign(this._config.styles, value)
        this._emit(false)
        return
      }

      if (!tab) return

      if (form === "tab") {
        tab.attributes.label = asString(value.label, tab.attributes.label)
        tab.attributes.icon = asString(value.icon, "")
        tab.attributes.id = slugify(value.id, tab.attributes.id || "tab")
        tab.attributes.hidden = asBool(value.hidden, false)
        tab.attributes.disabled = asBool(value.disabled, false)
        tab.styles = tab.styles || {}
        if ("accent_color" in value) tab.styles.accent_color = asString(value.accent_color, "")
        if ("panel_padding" in value) tab.styles.panel_padding = asString(value.panel_padding, "")
        if ("panel_background" in value) tab.styles.panel_background = asString(value.panel_background, "")
        this._refreshEditorTabButtons()
        this._emit(false)
        return
      }

      if (form === "badge") {
        tab.badge = {
          ...tab.badge,
          mode: enumValue(value.mode, ["none", "dot", "count", "text", "exclamation", "state"], "none"),
          entity: asString(value.entity, ""),
          state: asString(value.state, ""),
          text: asString(value.text, ""),
          template: asString(value.template, ""),
        }
        this._emit(false)
        return
      }

      if (form === "condition") {
        const condition = tab.conditions[conditionIndex]
        if (!condition) return
        Object.assign(condition, value)
        condition.type = enumValue(condition.type, ["entity", "user", "media", "template"], "entity")
        this._emit(false)
        return
      }

    }

    _applyCardJson(tabIndex, cardIndex, rawValue) {
      const key = this._nativeKey(tabIndex, cardIndex)
      const error = this.shadowRoot.getElementById("json-error-" + key)
      try {
        const parsed = JSON.parse(rawValue)
        if (!isObject(parsed) || !parsed.type) {
          throw new Error("Card JSON must be an object with a type field.")
        }
        this._config.tabs[tabIndex].cards[cardIndex] = normalizeChildCardConfig(parsed, this._hass)
        if (error) error.textContent = ""
        this._emit(true)
      } catch (err) {
        if (error) error.textContent = err.message
      }
    }

    _swap(items, a, b) {
      const tmp = items[a]
      items[a] = items[b]
      items[b] = tmp
    }

    _emit(reRender) {
      this._editingTabIndex = clamp(this._editingTabIndex, 0, this._config.tabs.length - 1)
      const publicConfig = toPublicConfig(this._config)
      this._lastEmittedConfigText = serializeConfig(publicConfig)
      dispatchConfigChanged(this, publicConfig)
      if (reRender) this._scheduleRender()
    }

    _hydrateHaControls(options = {}) {
      if (!this.shadowRoot) return
      const refreshSchema = options.schema !== false
      const refreshData = options.data !== false
      this.shadowRoot.querySelectorAll("ha-form").forEach((form) => {
        form.hass = this._hass
        if (refreshSchema || !form.schema) form.schema = this._cachedFormSchema(form.dataset.form)
        if (refreshData || !form.data) form.data = this._formData(form.dataset.form, form)
        form.computeLabel = this._boundComputeLabel
        form.computeHelper = this._boundComputeHelper
      })
      this.shadowRoot.querySelectorAll("ha-entity-picker, ha-icon-picker").forEach((picker) => {
        picker.hass = this._hass
        picker.value = picker.dataset.current || picker.value || ""
        picker.allowCustomEntity = true
      })
      this._nativeEditors.forEach((editor) => {
        editor.hass = this._hass
      })
    }

    _syncHassToChildren() {
      if (!this.shadowRoot) return
      this.shadowRoot.querySelectorAll("ha-form").forEach((form) => {
        form.hass = this._hass
      })
      this.shadowRoot.querySelectorAll("ha-entity-picker, ha-icon-picker").forEach((picker) => {
        picker.hass = this._hass
        picker.allowCustomEntity = true
      })
      const picker = this.shadowRoot.querySelector("hui-card-picker")
      if (picker) picker.hass = this._hass
      this._nativeEditors.forEach((editor) => {
        editor.hass = this._hass
      })
    }

    _syncLovelaceToChildren() {
      if (!this.shadowRoot) return
      const lovelace = this._lovelace || getLovelace()
      const lovelaceConfig = this._lovelaceConfig()
      const picker = this.shadowRoot.querySelector("hui-card-picker")
      if (picker) picker.lovelace = lovelaceConfig
      this._nativeEditors.forEach((editor) => {
        if (lovelace) editor.lovelace = lovelace
      })
    }

    _lovelaceConfig() {
      const lovelace = this._lovelace || getLovelace()
      return lovelace?.config || lovelace || { views: [] }
    }

    _mountCardPicker() {
      if (!this.shadowRoot || !this._config) return
      const host = this.shadowRoot.getElementById("native-card-picker-" + this._editingTabIndex)
      if (!host) return
      const details = host.closest(".card-picker-details")
      if (details && !details.open) return
      if (!customElements.get("hui-card-picker")) {
        host.innerHTML =
          '<div class="muted">Native Home Assistant card picker is not loaded in this editor session yet.</div>'
        if (!this._pickerDefinitionWait && typeof customElements.whenDefined === "function") {
          this._pickerDefinitionWait = true
          customElements.whenDefined("hui-card-picker").then(() => {
            this._pickerDefinitionWait = false
            this._mountCardPicker()
          })
        }
        return
      }

      const existingPicker = host.querySelector("hui-card-picker")
      const picker = existingPicker || document.createElement("hui-card-picker")
      picker.hass = this._hass
      picker.lovelace = this._lovelaceConfig()
      picker.suggestedCards = ["tile", "entities", "markdown", "button", "grid"]
      if (!picker._utcPickerListenerAttached) {
        picker._utcPickerListenerAttached = true
        picker.addEventListener("config-changed", (event) => {
          event.stopPropagation()
          const cardConfig = event.detail?.config
          if (!isObject(cardConfig)) return
          this._addPickedCard(Number(host.dataset.tabIndex), cardConfig)
        })
      }
      if (!existingPicker) host.replaceChildren(picker)
    }

    _addPickedCard(tabIndex, cardConfig) {
      const tab = this._config.tabs[tabIndex]
      if (!tab) return
      const nextCard = normalizeChildCardConfig(cardConfig, this._hass)
      if (!isObject(nextCard)) return
      const cardIndex = tab.cards.length
      tab.cards.push(nextCard)
      this._openPickerTabs.delete(tabIndex)
      this._expandedEditorKeys.add(this._nativeKey(tabIndex, cardIndex))
      this._emit(true)
    }

    _mountOpenedNativeEditors(token = this._nativeMountToken) {
      if (this._section !== "tabs") return
      this.shadowRoot.querySelectorAll(".native-editor-details[open]").forEach((details) => {
        this._mountNativeEditorDetails(details, token)
      })
    }

    _mountNativeEditorDetails(details, token = this._nativeMountToken) {
      const tabIndex = Number(details.dataset.tabIndex)
      const cardIndex = Number(details.dataset.cardIndex)
      const key = details.dataset.editorKey || this._nativeKey(tabIndex, cardIndex)
      const host = this.shadowRoot.getElementById("native-editor-" + key)
      if (!host || this._nativeEditors.has(key) || this._loadingEditors.has(key)) return

      this._loadingEditors.add(key)
      host.replaceChildren(Object.assign(document.createElement("div"), {
        className: "muted",
        textContent: "Loading native visual editor.",
      }))

      requestIdle(async () => {
        if (token !== this._nativeMountToken || !this._expandedEditorKeys.has(key)) {
          this._loadingEditors.delete(key)
          return
        }
        const editor = await this._createNativeEditor(tabIndex, cardIndex)
        this._loadingEditors.delete(key)
        if (token !== this._nativeMountToken || !this._expandedEditorKeys.has(key)) return
        if (editor) {
          this._nativeEditors.set(key, editor)
          host.replaceChildren(editor)
        } else {
          host.replaceChildren(Object.assign(document.createElement("div"), {
            className: "muted",
            textContent: "This card does not expose a native visual editor.",
          }))
        }
      })
    }

    async _createNativeEditor(tabIndex, cardIndex) {
      let card = this._config.tabs[tabIndex]?.cards[cardIndex]
      if (!card?.type || !window.loadCardHelpers) return null
      const normalizedCard = normalizeChildCardConfig(card, this._hass)
      if (serializeConfig(normalizedCard) !== serializeConfig(card)) {
        card = normalizedCard
        this._config.tabs[tabIndex].cards[cardIndex] = normalizedCard
        this._syncCardJsonTextarea(tabIndex, cardIndex)
        this._emit(false)
      }
      const tagName = getCardTagName(card.type)
      try {
        const helpers = await window.loadCardHelpers()
        try {
          await helpers.createCardElement(card)
        } catch (_) {}
        if (tagName && !customElements.get(tagName)) {
          await Promise.race([
            customElements.whenDefined(tagName),
            new Promise((resolve) => window.setTimeout(resolve, 1500)),
          ])
        }
        const cardClass = customElements.get(tagName)
        if (!cardClass || typeof cardClass.getConfigElement !== "function") return null
        const maybeEditor = cardClass.getConfigElement()
        const editor =
          maybeEditor && typeof maybeEditor.then === "function" ? await maybeEditor : maybeEditor
        if (!editor || typeof editor.setConfig !== "function") return null
        editor.hass = this._hass
        const lovelace = this._lovelace || getLovelace()
        if (lovelace) editor.lovelace = lovelace
        editor.setConfig(card)
        editor.addEventListener("config-changed", (event) => {
          event.stopPropagation()
          const nextConfig = event.detail?.config
          if (!isObject(nextConfig)) return
          const currentCard = this._config.tabs[tabIndex]?.cards[cardIndex] || {}
          const fallbackType = currentCard.type || card.type || ""
          this._config.tabs[tabIndex].cards[cardIndex] = normalizeChildCardConfig(
            nextConfig,
            this._hass,
            fallbackType
          )
          this._refreshCardSummary(tabIndex, cardIndex)
          this._syncCardJsonTextarea(tabIndex, cardIndex)
          this._emit(false)
        })
        return editor
      } catch (_) {
        return null
      }
    }

    _nativeKey(tabIndex, cardIndex) {
      return String(tabIndex) + "-" + String(cardIndex)
    }
  }

  class UltimateTabbedCard extends TabbedCard {}
  class UltimateTabbedCardEditor extends TabbedCardEditor {}

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, TabbedCard)
  }
  if (!customElements.get(ALT_CARD_TYPE)) {
    customElements.define(ALT_CARD_TYPE, UltimateTabbedCard)
  }
  if (!customElements.get(CARD_EDITOR_TYPE)) {
    customElements.define(CARD_EDITOR_TYPE, TabbedCardEditor)
  }
  if (!customElements.get(ALT_CARD_EDITOR_TYPE)) {
    customElements.define(ALT_CARD_EDITOR_TYPE, UltimateTabbedCardEditor)
  }

  window.customCards = window.customCards || []
  const registrations = [
    {
      type: CARD_TYPE,
      name: "Ultimate Tabbed Card",
      description: "Fast visual tabbed container with nested card editors, conditions, badges and deep links.",
    },
    {
      type: ALT_CARD_TYPE,
      name: "Ultimate Tabbed Card",
      description: "Alias for custom:tabbed-card.",
    },
  ]
  registrations.forEach((registration) => {
    const existing = window.customCards.find((entry) => entry?.type === registration.type)
    if (!existing) {
      window.customCards.push({
        ...registration,
        preview: true,
        documentationURL: "https://github.com/Micpi/ultimate-tabbed-card",
        getEntitySuggestion: (_hass, entityId) => {
          if (!entityId) return null
          return {
            config: {
              type: "custom:" + registration.type,
              tabs: [
                {
                  attributes: {
                    label: "Entity",
                    icon: "mdi:card",
                    id: "entity",
                  },
                  card: {
                    type: "tile",
                    entity: entityId,
                  },
                },
              ],
            },
          }
        },
      })
    }
  })

  console.info(
    "%cULTIMATE-TABBED-CARD " + VERSION,
    "color: var(--primary-color); font-weight: 700"
  )
})()
