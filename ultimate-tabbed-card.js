;(function () {
  const CARD_TYPE = "tabbed-card"
  const CARD_EDITOR_TYPE = "tabbed-card-editor"

  const DEFAULT_OPTIONS = {
    defaultTabIndex: 0,
    keepAlive: true,
    lazy: true,
    showIcons: true,
    showLabels: true,
  }

  const DEFAULT_STYLES = {
    background_color: "var(--card-background-color, #1F2937)",
    text_color: "var(--primary-text-color, #F9FAFB)",
    active_color: "var(--primary-color, #00AEEF)",
    inactive_color: "var(--secondary-text-color, #9CA3AF)",
    border_color: "rgba(255, 255, 255, 0.10)",
  }

  function clone(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value)
    }
    return JSON.parse(JSON.stringify(value))
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

  function toNumber(value, fallback = 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function resolveTabLabel(tab, index) {
    return tab?.title || tab?.attributes?.label || tab?.label || "Tab " + String(index + 1)
  }

  function resolveTabIcon(tab) {
    return tab?.icon || tab?.attributes?.icon || ""
  }

  function normalizeConfig(inputConfig) {
    const source = inputConfig || {}
    const tabs = Array.isArray(source.tabs) ? source.tabs : []

    if (!tabs.length) {
      throw new Error("Tabbed Card: at least one tab is required.")
    }

    const optionsSource = source.options || {}
    const options = {
      ...DEFAULT_OPTIONS,
      defaultTabIndex: toNumber(
        optionsSource.defaultTabIndex ?? optionsSource.default_tab_index,
        DEFAULT_OPTIONS.defaultTabIndex
      ),
      keepAlive: optionsSource.keepAlive ?? optionsSource.keep_alive ?? DEFAULT_OPTIONS.keepAlive,
      lazy: optionsSource.lazy ?? optionsSource.lazy_load ?? DEFAULT_OPTIONS.lazy,
      showIcons: optionsSource.showIcons ?? optionsSource.show_icons ?? DEFAULT_OPTIONS.showIcons,
      showLabels:
        optionsSource.showLabels ?? optionsSource.show_labels ?? DEFAULT_OPTIONS.showLabels,
    }

    const stylesSource = source.styles || {}
    const styles = {
      ...DEFAULT_STYLES,
      background_color: stylesSource.background_color || DEFAULT_STYLES.background_color,
      text_color: stylesSource.text_color || DEFAULT_STYLES.text_color,
      active_color:
        stylesSource.active_color ||
        stylesSource["--mdc-theme-primary"] ||
        DEFAULT_STYLES.active_color,
      inactive_color:
        stylesSource.inactive_color ||
        stylesSource["--mdc-tab-color-default"] ||
        DEFAULT_STYLES.inactive_color,
      border_color: stylesSource.border_color || DEFAULT_STYLES.border_color,
    }

    const normalizedTabs = tabs.map((tab, index) => {
      const card = tab?.card
      if (!card || typeof card !== "object") {
        throw new Error("Tabbed Card: each tab must contain a valid card configuration.")
      }

      return {
        attributes: {
          label: resolveTabLabel(tab, index),
          icon: resolveTabIcon(tab),
          hidden: Boolean(tab?.attributes?.hidden || tab?.hidden),
        },
        card: clone(card),
        styles: tab?.styles && typeof tab.styles === "object" ? { ...tab.styles } : {},
      }
    })

    options.defaultTabIndex = clamp(options.defaultTabIndex, 0, normalizedTabs.length - 1)

    return {
      options,
      styles,
      tabs: normalizedTabs,
    }
  }

  class TabbedCard extends HTMLElement {
    static getConfigElement() {
      return document.createElement(CARD_EDITOR_TYPE)
    }

    static getStubConfig() {
      return {
        type: "custom:tabbed-card",
        options: {
          defaultTabIndex: 0,
          keepAlive: true,
          lazy: true,
          showIcons: true,
          showLabels: true,
        },
        styles: {
          active_color: "var(--primary-color, #00AEEF)",
          inactive_color: "var(--secondary-text-color, #9CA3AF)",
        },
        tabs: [
          {
            attributes: {
              label: "Sun",
              icon: "mdi:white-balance-sunny",
            },
            card: {
              type: "entity",
              entity: "sun.sun",
            },
          },
        ],
      }
    }

    constructor() {
      super()
      this.attachShadow({ mode: "open" })

      this._hass = null
      this._config = null
      this._helpersPromise = null
      this._selectedIndex = 0
      this._cardCache = new Map()
      this._activeCardIndex = -1
      this._pendingRender = false

      this._onTabClick = this._onTabClick.bind(this)
      this._onTabKeydown = this._onTabKeydown.bind(this)
    }

    setConfig(config) {
      this._config = normalizeConfig(config)
      this._selectedIndex = this._config.options.defaultTabIndex
      this._cardCache.clear()
      this._activeCardIndex = -1

      if (!this._helpersPromise) {
        this._helpersPromise = window.loadCardHelpers
          ? window.loadCardHelpers()
          : Promise.reject(new Error("window.loadCardHelpers is not available."))
      }

      this._renderShell()
      this._renderTabsOnly()
      this._activateTab(this._selectedIndex, { force: true })

      if (!this._config.options.lazy) {
        this._warmupAllTabs().catch(() => {})
      }
    }

    set hass(hass) {
      this._hass = hass
      if (!hass) return

      this._cardCache.forEach((entry) => {
        if (entry?.card) {
          entry.card.hass = hass
        }
      })
    }

    get hass() {
      return this._hass
    }

    getCardSize() {
      return 4
    }

    connectedCallback() {
      if (this._config && !this.shadowRoot.innerHTML) {
        this._renderShell()
        this._renderTabsOnly()
        this._activateTab(this._selectedIndex, { force: true })
      }
    }

    _scheduleTabHeaderRefresh() {
      if (this._pendingRender) return
      this._pendingRender = true

      queueMicrotask(() => {
        this._pendingRender = false
        this._renderTabsOnly()
      })
    }

    _renderShell() {
      if (!this.shadowRoot) return

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }

          .card {
            border-radius: var(--ha-card-border-radius, 12px);
            overflow: hidden;
            border: 1px solid var(--tabs-border-color);
            background: var(--tabs-bg);
            color: var(--tabs-text);
          }

          .tabs {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px;
            border-bottom: 1px solid var(--tabs-border-color);
            overflow-x: auto;
            scrollbar-width: thin;
          }

          .tabs::-webkit-scrollbar {
            height: 6px;
          }

          .tabs::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.18);
            border-radius: 999px;
          }

          .tab-btn {
            appearance: none;
            border: 1px solid transparent;
            border-radius: 10px;
            background: transparent;
            color: var(--tabs-inactive);
            font: inherit;
            font-size: 0.9rem;
            line-height: 1;
            white-space: nowrap;
            padding: 9px 12px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: color 180ms ease, background 180ms ease, border-color 180ms ease;
          }

          .tab-btn:hover {
            border-color: rgba(255, 255, 255, 0.18);
            color: var(--tabs-text);
            background: rgba(255, 255, 255, 0.05);
          }

          .tab-btn.active {
            color: var(--tabs-active);
            border-color: color-mix(in srgb, var(--tabs-active) 35%, transparent);
            background: color-mix(in srgb, var(--tabs-active) 12%, transparent);
          }

          .tab-icon {
            width: 18px;
            height: 18px;
          }

          .panel {
            position: relative;
            min-height: 72px;
            padding: 10px;
          }

          .pane {
            display: none;
          }

          .pane.active {
            display: block;
          }

          .error {
            border: 1px solid var(--error-color, #ef4444);
            border-radius: 10px;
            padding: 10px;
            color: var(--error-color, #ef4444);
            background: rgba(239, 68, 68, 0.08);
          }
        </style>
        <div
          class="card"
          style="--tabs-bg:${this._config.styles.background_color};--tabs-text:${this._config.styles.text_color};--tabs-active:${this._config.styles.active_color};--tabs-inactive:${this._config.styles.inactive_color};--tabs-border-color:${this._config.styles.border_color};"
        >
          <div class="tabs" role="tablist" aria-label="Tabbed card tabs"></div>
          <section class="panel"></section>
        </div>
      `

      this.shadowRoot.querySelector(".tabs").addEventListener("click", this._onTabClick)
      this.shadowRoot.querySelector(".tabs").addEventListener("keydown", this._onTabKeydown)
    }

    _renderTabsOnly() {
      if (!this._config || !this.shadowRoot) return

      const tabsEl = this.shadowRoot.querySelector(".tabs")
      if (!tabsEl) return

      const fragment = document.createDocumentFragment()
      this._config.tabs.forEach((tab, index) => {
        if (tab.attributes.hidden) return

        const button = document.createElement("button")
        button.type = "button"
        button.className = "tab-btn" + (index === this._selectedIndex ? " active" : "")
        button.dataset.index = String(index)
        button.setAttribute("role", "tab")
        button.setAttribute("aria-selected", index === this._selectedIndex ? "true" : "false")
        button.setAttribute("tabindex", index === this._selectedIndex ? "0" : "-1")

        const showIcon = this._config.options.showIcons && tab.attributes.icon
        const showLabel = this._config.options.showLabels

        if (showIcon) {
          const icon = document.createElement("ha-icon")
          icon.className = "tab-icon"
          icon.setAttribute("icon", tab.attributes.icon)
          button.appendChild(icon)
        }

        if (showLabel) {
          const label = document.createElement("span")
          label.textContent = tab.attributes.label
          button.appendChild(label)
        }

        fragment.appendChild(button)
      })

      tabsEl.replaceChildren(fragment)
    }

    _onTabClick(event) {
      const button = event.target.closest(".tab-btn")
      if (!button) return
      const index = Number(button.dataset.index)
      this._activateTab(index)
    }

    _onTabKeydown(event) {
      const buttons = Array.from(this.shadowRoot.querySelectorAll(".tab-btn"))
      if (!buttons.length) return

      const current = Number(event.target?.dataset?.index ?? this._selectedIndex)
      let next = current

      if (event.key === "ArrowRight") {
        next = (current + 1) % buttons.length
      } else if (event.key === "ArrowLeft") {
        next = (current - 1 + buttons.length) % buttons.length
      } else if (event.key === "Home") {
        next = 0
      } else if (event.key === "End") {
        next = buttons.length - 1
      } else {
        return
      }

      event.preventDefault()
      const nextBtn = buttons[next]
      nextBtn.focus()
      const nextIndex = Number(nextBtn.dataset.index)
      this._activateTab(nextIndex)
    }

    async _activateTab(index, options = {}) {
      if (!this._config || !this.shadowRoot) return

      const clamped = clamp(index, 0, this._config.tabs.length - 1)
      if (!options.force && clamped === this._selectedIndex && this._activeCardIndex === clamped) {
        return
      }

      this._selectedIndex = clamped
      this._scheduleTabHeaderRefresh()

      const panel = this.shadowRoot.querySelector(".panel")
      if (!panel) return

      const keepAlive = Boolean(this._config.options.keepAlive)

      if (!keepAlive && this._activeCardIndex !== -1 && this._activeCardIndex !== clamped) {
        const previous = this._cardCache.get(this._activeCardIndex)
        if (previous?.pane && previous.pane.isConnected) {
          previous.pane.remove()
        }
        this._cardCache.delete(this._activeCardIndex)
      }

      if (keepAlive) {
        this._cardCache.forEach((entry, entryIndex) => {
          if (!entry?.pane) return
          entry.pane.classList.toggle("active", entryIndex === clamped)
        })
      } else {
        panel.querySelectorAll(".pane").forEach((pane) => pane.classList.remove("active"))
      }

      let entry = this._cardCache.get(clamped)
      if (!entry) {
        entry = await this._createCardPane(clamped)
        if (!entry) return
        this._cardCache.set(clamped, entry)
        panel.appendChild(entry.pane)
      }

      entry.pane.classList.add("active")
      this._activeCardIndex = clamped
    }

    async _createCardPane(index) {
      const tab = this._config.tabs[index]
      const pane = document.createElement("div")
      pane.className = "pane"

      try {
        const helpers = await this._helpersPromise
        const card = await helpers.createCardElement(tab.card)

        card.hass = this._hass
        card.addEventListener(
          "ll-rebuild",
          (ev) => {
            ev.stopPropagation()
            this._rebuildCard(index).catch(() => {})
          },
          { once: true }
        )

        pane.appendChild(card)
        return { pane, card }
      } catch (error) {
        const message = document.createElement("div")
        message.className = "error"
        message.textContent =
          "Unable to create card for tab " +
          String(index + 1) +
          ". " +
          (error && error.message ? error.message : "Unknown error")
        pane.appendChild(message)
        return { pane, card: null }
      }
    }

    async _warmupAllTabs() {
      if (!this._config || !this.shadowRoot) return
      const panel = this.shadowRoot.querySelector(".panel")
      if (!panel) return

      for (let index = 0; index < this._config.tabs.length; index += 1) {
        if (this._cardCache.has(index)) continue
        const entry = await this._createCardPane(index)
        if (!entry) continue
        this._cardCache.set(index, entry)
        panel.appendChild(entry.pane)
        entry.pane.classList.toggle("active", index === this._selectedIndex)
      }
    }

    async _rebuildCard(index) {
      if (!this._config) return

      const current = this._cardCache.get(index)
      if (!current?.pane) return

      const replacement = await this._createCardPane(index)
      if (!replacement) return

      current.pane.replaceWith(replacement.pane)
      this._cardCache.set(index, replacement)
      if (index === this._activeCardIndex) {
        replacement.pane.classList.add("active")
      }
    }
  }

  class TabbedCardEditor extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: "open" })
      this._hass = null
      this._config = null
      this._nativeEditors = new Map()
      this._loadingEditor = new Set()
      this._onRootInput = this._onRootInput.bind(this)
      this._onRootClick = this._onRootClick.bind(this)
      this._onRootChange = this._onRootChange.bind(this)
    }

    set hass(hass) {
      this._hass = hass
      this._nativeEditors.forEach((editor) => {
        editor.hass = hass
      })
    }

    setConfig(config) {
      this._config = normalizeConfig(config)
      this._render()
    }

    _render() {
      if (!this.shadowRoot || !this._config) return

      const tabsHtml = this._config.tabs
        .map((tab, index) => {
          const cardText = JSON.stringify(tab.card, null, 2)
          return `
            <details class="tab-details" data-index="${index}" ${index === 0 ? "open" : ""}>
              <summary>Tab ${index + 1}: ${this._escape(resolveTabLabel(tab, index))}</summary>
              <div class="section-content">
                <div class="row row-actions">
                  <button type="button" data-action="move-up" data-index="${index}">Up</button>
                  <button type="button" data-action="move-down" data-index="${index}">Down</button>
                  <button type="button" data-action="delete-tab" data-index="${index}" class="danger">Delete</button>
                </div>

                <label>Label</label>
                <input data-field="tab.label" data-index="${index}" value="${this._escape(
                  tab.attributes.label
                )}" />

                <label>Icon (mdi:...)</label>
                <input data-field="tab.icon" data-index="${index}" value="${this._escape(
                  tab.attributes.icon || ""
                )}" placeholder="mdi:home" />

                <label>
                  <input type="checkbox" data-field="tab.hidden" data-index="${index}" ${
                    tab.attributes.hidden ? "checked" : ""
                  } />
                  Hide this tab
                </label>

                <label>Tab text color (optional)</label>
                <input data-field="tab.style.color" data-index="${index}" value="${this._escape(
                  tab.styles?.color || ""
                )}" placeholder="#ffffff" />

                <div class="native-editor-wrap">
                  <div class="native-editor-title">Visual card editor (if available)</div>
                  <div class="native-editor-host" id="native-editor-${index}"></div>
                </div>

                <label>Card JSON (fallback / manual)</label>
                <textarea data-field="tab.card" data-index="${index}" rows="8">${this._escape(
                  cardText
                )}</textarea>
                <div class="muted" id="json-error-${index}"></div>
              </div>
            </details>
          `
        })
        .join("")

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }

          .form {
            display: grid;
            gap: 10px;
            padding: 8px 0;
          }

          details {
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.02);
            overflow: hidden;
          }

          details[open] {
            border-color: rgba(56, 189, 248, 0.4);
          }

          summary {
            list-style: none;
            cursor: pointer;
            padding: 10px 12px;
            font-size: 0.86rem;
            font-weight: 700;
            color: var(--primary-text-color, #f9fafb);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          summary::-webkit-details-marker {
            display: none;
          }

          .section-content {
            display: grid;
            gap: 10px;
            padding: 12px;
          }

          .row {
            display: grid;
            gap: 8px;
          }

          .row-2 {
            grid-template-columns: 1fr 1fr;
          }

          .row-actions {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          label {
            font-size: 0.82rem;
            color: var(--secondary-text-color, #9ca3af);
          }

          select,
          input,
          textarea,
          button {
            width: 100%;
            box-sizing: border-box;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.04);
            color: var(--primary-text-color, #f9fafb);
            padding: 8px 10px;
            font: inherit;
          }

          textarea {
            font-family: monospace;
            resize: vertical;
            min-height: 100px;
          }

          button {
            cursor: pointer;
            background: rgba(56, 189, 248, 0.18);
            border-color: rgba(56, 189, 248, 0.35);
            font-weight: 600;
          }

          button.danger {
            background: rgba(239, 68, 68, 0.18);
            border-color: rgba(239, 68, 68, 0.4);
          }

          .native-editor-wrap {
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px;
            display: grid;
            gap: 8px;
          }

          .native-editor-title {
            font-size: 0.8rem;
            color: var(--secondary-text-color, #9ca3af);
            font-weight: 600;
          }

          .muted {
            font-size: 0.78rem;
            color: var(--secondary-text-color, #9ca3af);
            min-height: 16px;
          }

          .error {
            color: var(--error-color, #ef4444);
          }

          @media (max-width: 720px) {
            .row-2,
            .row-actions {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <div class="form">
          <details open>
            <summary>General</summary>
            <div class="section-content">
              <label>Default tab index</label>
              <input type="number" min="0" step="1" data-field="options.defaultTabIndex" value="${
                this._config.options.defaultTabIndex
              }" />

              <label><input type="checkbox" data-field="options.keepAlive" ${
                this._config.options.keepAlive ? "checked" : ""
              } /> Keep inactive cards alive</label>
              <label><input type="checkbox" data-field="options.lazy" ${
                this._config.options.lazy ? "checked" : ""
              } /> Lazy load tabs</label>
              <label><input type="checkbox" data-field="options.showIcons" ${
                this._config.options.showIcons ? "checked" : ""
              } /> Show icons</label>
              <label><input type="checkbox" data-field="options.showLabels" ${
                this._config.options.showLabels ? "checked" : ""
              } /> Show labels</label>
            </div>
          </details>

          <details>
            <summary>Styles</summary>
            <div class="section-content">
              <label>Background color</label>
              <div class="row row-2">
                <input type="color" data-field="styles.background_color_picker" value="${this._safeColor(
                  this._config.styles.background_color,
                  "#1f2937"
                )}" />
                <input data-field="styles.background_color" value="${this._escape(
                  this._config.styles.background_color
                )}" />
              </div>

              <label>Text color</label>
              <div class="row row-2">
                <input type="color" data-field="styles.text_color_picker" value="${this._safeColor(
                  this._config.styles.text_color,
                  "#f9fafb"
                )}" />
                <input data-field="styles.text_color" value="${this._escape(
                  this._config.styles.text_color
                )}" />
              </div>

              <label>Active color</label>
              <div class="row row-2">
                <input type="color" data-field="styles.active_color_picker" value="${this._safeColor(
                  this._config.styles.active_color,
                  "#00aeef"
                )}" />
                <input data-field="styles.active_color" value="${this._escape(
                  this._config.styles.active_color
                )}" />
              </div>

              <label>Inactive color</label>
              <div class="row row-2">
                <input type="color" data-field="styles.inactive_color_picker" value="${this._safeColor(
                  this._config.styles.inactive_color,
                  "#9ca3af"
                )}" />
                <input data-field="styles.inactive_color" value="${this._escape(
                  this._config.styles.inactive_color
                )}" />
              </div>
            </div>
          </details>

          <details open>
            <summary>Tabs</summary>
            <div class="section-content">
              <button type="button" data-action="add-tab">+ Add tab</button>
              ${tabsHtml}
            </div>
          </details>
        </div>
      `

      this.shadowRoot.removeEventListener("input", this._onRootInput)
      this.shadowRoot.removeEventListener("change", this._onRootChange)
      this.shadowRoot.removeEventListener("click", this._onRootClick)
      this.shadowRoot.addEventListener("input", this._onRootInput)
      this.shadowRoot.addEventListener("change", this._onRootChange)
      this.shadowRoot.addEventListener("click", this._onRootClick)

      this._mountNativeEditors()
    }

    _onRootInput(event) {
      const field = event.target?.dataset?.field
      if (!field || !this._config) return

      if (field === "options.defaultTabIndex") {
        this._config.options.defaultTabIndex = clamp(
          toNumber(event.target.value, 0),
          0,
          Math.max(0, this._config.tabs.length - 1)
        )
        this._emit(false)
        return
      }

      if (field.startsWith("styles.") && field.endsWith("_picker")) {
        const key = field.replace("styles.", "").replace("_picker", "")
        this._config.styles[key] = event.target.value
        this._syncTextInput(field, event.target.value)
        this._emit(false)
        return
      }

      if (field.startsWith("styles.")) {
        const key = field.replace("styles.", "")
        this._config.styles[key] = event.target.value
        this._emit(false)
        return
      }

      if (!field.startsWith("tab.")) return

      const index = Number(event.target.dataset.index)
      const tab = this._config.tabs[index]
      if (!tab) return

      if (field === "tab.label") {
        tab.attributes.label = event.target.value
        this._emit(false)
      }

      if (field === "tab.icon") {
        tab.attributes.icon = event.target.value
        this._emit(false)
      }

      if (field === "tab.style.color") {
        tab.styles = tab.styles || {}
        tab.styles.color = event.target.value
        this._emit(false)
      }
    }

    _onRootChange(event) {
      const field = event.target?.dataset?.field
      if (!field || !this._config) return

      if (field === "options.keepAlive") {
        this._config.options.keepAlive = event.target.checked
        this._emit(false)
        return
      }
      if (field === "options.lazy") {
        this._config.options.lazy = event.target.checked
        this._emit(false)
        return
      }
      if (field === "options.showIcons") {
        this._config.options.showIcons = event.target.checked
        this._emit(false)
        return
      }
      if (field === "options.showLabels") {
        this._config.options.showLabels = event.target.checked
        this._emit(false)
        return
      }

      if (field === "tab.hidden") {
        const index = Number(event.target.dataset.index)
        const tab = this._config.tabs[index]
        if (!tab) return
        tab.attributes.hidden = event.target.checked
        this._emit(false)
        return
      }

      if (field === "tab.card") {
        const index = Number(event.target.dataset.index)
        this._applyCardJson(index, event.target.value)
      }
    }

    _onRootClick(event) {
      const action = event.target?.dataset?.action
      if (!action || !this._config) return

      if (action === "add-tab") {
        this._config.tabs.push({
          attributes: {
            label: "New tab",
            icon: "mdi:tab",
            hidden: false,
          },
          styles: {},
          card: {
            type: "entity",
            entity: "sun.sun",
          },
        })
        this._emit(true)
        return
      }

      const index = Number(event.target.dataset.index)
      if (!Number.isFinite(index)) return

      if (action === "delete-tab") {
        if (this._config.tabs.length <= 1) return
        this._config.tabs.splice(index, 1)
        this._nativeEditors.delete(index)
        this._emit(true)
        return
      }

      if (action === "move-up" && index > 0) {
        const tmp = this._config.tabs[index - 1]
        this._config.tabs[index - 1] = this._config.tabs[index]
        this._config.tabs[index] = tmp
        this._emit(true)
        return
      }

      if (action === "move-down" && index < this._config.tabs.length - 1) {
        const tmp = this._config.tabs[index + 1]
        this._config.tabs[index + 1] = this._config.tabs[index]
        this._config.tabs[index] = tmp
        this._emit(true)
      }
    }

    _emit(reRender) {
      dispatchConfigChanged(this, clone(this._config))
      if (reRender) {
        this._render()
      }
    }

    _syncTextInput(fieldPicker, value) {
      const fieldText = fieldPicker.replace("_picker", "")
      const textInput = this.shadowRoot.querySelector(`[data-field="${fieldText}"]`)
      if (textInput) {
        textInput.value = value
      }
    }

    _applyCardJson(index, rawValue) {
      const error = this.shadowRoot.getElementById("json-error-" + index)
      try {
        const parsed = JSON.parse(rawValue)
        if (!parsed || typeof parsed !== "object" || !parsed.type) {
          throw new Error("Card JSON must be an object with a 'type' field.")
        }
        this._config.tabs[index].card = parsed
        if (error) {
          error.textContent = ""
          error.classList.remove("error")
        }

        const editor = this._nativeEditors.get(index)
        if (editor) {
          try {
            editor.setConfig(parsed)
          } catch (_) {}
        }

        this._emit(false)
      } catch (err) {
        if (error) {
          error.textContent = err.message
          error.classList.add("error")
        }
      }
    }

    async _mountNativeEditors() {
      if (!this._config || !this.shadowRoot) return

      for (let index = 0; index < this._config.tabs.length; index += 1) {
        const host = this.shadowRoot.getElementById("native-editor-" + index)
        if (!host) continue

        const existing = this._nativeEditors.get(index)
        if (existing) {
          existing.hass = this._hass
          if (!host.contains(existing)) {
            host.appendChild(existing)
          }
          continue
        }

        if (this._loadingEditor.has(index)) continue
        this._loadingEditor.add(index)

        this._createNativeEditor(index)
          .then((editor) => {
            this._loadingEditor.delete(index)
            if (!editor) return
            this._nativeEditors.set(index, editor)
            const freshHost = this.shadowRoot.getElementById("native-editor-" + index)
            if (freshHost && !freshHost.contains(editor)) {
              freshHost.appendChild(editor)
            }
          })
          .catch(() => {
            this._loadingEditor.delete(index)
          })
      }
    }

    async _createNativeEditor(index) {
      const tab = this._config.tabs[index]
      if (!tab?.card?.type) return null

      const cardType = tab.card.type
      const isCustom = cardType.startsWith("custom:")
      const tagName = isCustom ? cardType.slice(7) : "hui-" + cardType + "-card"

      try {
        const helpers = await Promise.race([
          window.loadCardHelpers(),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("loadCardHelpers timeout")), 5000)
          }),
        ])

        try {
          helpers.createCardElement({ type: cardType })
        } catch (_) {}

        if (!customElements.get(tagName)) {
          await Promise.race([
            customElements.whenDefined(tagName),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ])
        }

        const cardClass = customElements.get(tagName)
        if (!cardClass || typeof cardClass.getConfigElement !== "function") {
          return null
        }

        const maybeEditor = cardClass.getConfigElement()
        const editor =
          maybeEditor instanceof Promise
            ? await Promise.race([
                maybeEditor,
                new Promise((_, reject) => {
                  setTimeout(() => reject(new Error("getConfigElement timeout")), 3000)
                }),
              ])
            : maybeEditor

        if (!editor) return null

        if (this._hass) editor.hass = this._hass
        try {
          const lovelace = document
            .querySelector("home-assistant")
            ?.shadowRoot?.querySelector("home-assistant-main")
            ?.shadowRoot?.querySelector("ha-panel-lovelace")?.lovelace
          if (lovelace) {
            editor.lovelace = lovelace
          }
        } catch (_) {}

        editor.setConfig(tab.card)
        editor.addEventListener("config-changed", (ev) => {
          ev.stopPropagation()
          const nextConfig = ev.detail?.config
          if (!nextConfig || typeof nextConfig !== "object") return
          this._config.tabs[index].card = clone(nextConfig)

          const textarea = this.shadowRoot.querySelector(
            `textarea[data-field="tab.card"][data-index="${index}"]`
          )
          if (textarea) {
            textarea.value = JSON.stringify(nextConfig, null, 2)
          }

          dispatchConfigChanged(this, clone(this._config))
        })

        return editor
      } catch (_) {
        return null
      }
    }

    _safeColor(value, fallback) {
      if (typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())) {
        const normalized = value.trim()
        if (normalized.length === 4) {
          const r = normalized[1]
          const g = normalized[2]
          const b = normalized[3]
          return "#" + r + r + g + g + b + b
        }
        return normalized
      }
      return fallback
    }

    _escape(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
    }
  }

  if (!customElements.get(CARD_TYPE)) {
    customElements.define(CARD_TYPE, TabbedCard)
  }
  if (!customElements.get("ultimate-tabbed-card")) {
    customElements.define("ultimate-tabbed-card", TabbedCard)
  }
  if (!customElements.get(CARD_EDITOR_TYPE)) {
    customElements.define(CARD_EDITOR_TYPE, TabbedCardEditor)
  }

  window.customCards = window.customCards || []
  if (!window.customCards.some((entry) => entry?.type === CARD_TYPE)) {
    window.customCards.push({
      type: CARD_TYPE,
      name: "Ultimate Tabbed Card",
      description:
        "High-performance tabbed container card with lazy rendering and full visual editor.",
    })
  }
})()
