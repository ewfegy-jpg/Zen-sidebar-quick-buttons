// ======================
// ZEN SIDEBAR SYSTEM (MERGED)
// ======================
console.log("ZEN SIDEBAR MERGED SCRIPT LOADED");

(function () {
  const SIDEBAR_PANEL_ID = "zen-sidebar-extra-panel";
  const WIDGET_ID = "zen-ai-sidebar-toggle";
  const SIDEBAR_ID = "viewGenaiChatSidebar";

  let sidebarPanelReady = false;

  // ─────────────────────────────────────────
  // SVG ICON
  // ─────────────────────────────────────────
  function makeSrc(svg) {
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  const AI_ICON = makeSrc(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="context-fill" fill-opacity="context-fill-opacity">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1"
            stroke="context-fill" stroke-width="1.5" fill="none"/>
    </svg>
  `);

  // ─────────────────────────────────────────
  // CREATE EXTRA PANEL
  // ─────────────────────────────────────────
  function initSidebarPanel() {
    if (sidebarPanelReady) return true;
    if (!window.CustomizableUI) return false;

    const container = document.getElementById("zen-appcontent-navbar-container");
    if (!container) return false;

    if (document.getElementById(SIDEBAR_PANEL_ID)) {
      sidebarPanelReady = true;
      return true;
    }

    try {
      if (!CustomizableUI.getAreaType(SIDEBAR_PANEL_ID)) {
        CustomizableUI.registerArea(SIDEBAR_PANEL_ID, {
          type: CustomizableUI.TYPE_TOOLBAR,
          defaultPlacements: []
        });
      }

      const panel = document.createXULElement("toolbar");
      panel.id = SIDEBAR_PANEL_ID;
      panel.setAttribute("customizable", "true");
      panel.setAttribute("mode", "icons");
      panel.setAttribute("iconsize", "small");
      panel.setAttribute("context", "toolbar-context-menu");

      container.appendChild(panel);
      CustomizableUI.registerToolbarNode(panel);

      if (CustomizableUI.getWidgetIdsInArea(SIDEBAR_PANEL_ID).length === 0) {
        CustomizableUI.resetArea(SIDEBAR_PANEL_ID);
      }

      console.log("Sidebar extra panel ready");
      sidebarPanelReady = true;
      return true;
    } catch (e) {
      console.error("Sidebar panel init failed:", e);
      return false;
    }
  }

  // ─────────────────────────────────────────
  // CREATE AI BUTTON (WITH ICON)
  // ─────────────────────────────────────────
  function initAIButton() {
    if (!window.CustomizableUI) return;

    if (CustomizableUI.getWidget(WIDGET_ID)) return;

    CustomizableUI.createWidget({
      id: WIDGET_ID,
      type: "button",
      defaultArea: SIDEBAR_PANEL_ID, // 🔥 goes directly into your panel

      label: "AI Sidebar",
      tooltiptext: "Toggle AI Sidebar",

      onCreated(btn) {
        btn.style.listStyleImage = `url("${AI_ICON}")`;
      },

      onCommand() {
        SidebarController.toggle(SIDEBAR_ID);
      },
    });

    console.log("AI button created");
  }

  // ─────────────────────────────────────────
  // SIDEBAR BUTTON MAPPING
  // ─────────────────────────────────────────
  const mapping = [
    { buttonId: "history-panelmenu", sidebarId: "viewHistorySidebar" },
    { buttonId: "bookmarks-menu-button", sidebarId: "viewBookmarksSidebar" },
    { buttonId: "sync-button", sidebarId: "viewTabsSidebar" },
    { buttonId: "logins-button", sidebarId: "viewMegalistSidebar" },
    { buttonId: WIDGET_ID, sidebarId: SIDEBAR_ID },
    {
      buttonId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-browser-action",
      sidebarId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-sidebar-action",
    },
  ];

  // ─────────────────────────────────────────
  // ACTIVE STATE
  // ─────────────────────────────────────────
  function updateActiveButtons() {
    const state = SidebarController.getUIState();
    const current = SidebarController.currentID;
    const isOpen = state?.panelOpen;

    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn) return;

      if (isOpen && current === sidebarId) {
        btn.setAttribute("data-sidebar-active", "true");
      } else {
        btn.removeAttribute("data-sidebar-active");
      }
    });

    // addon buttons auto-detect
    document.querySelectorAll(".toolbaritem-combined-buttons").forEach((btn) => {
      const sidebarId = btn.id.replace("-browser-action", "-sidebar-action");

      if (isOpen && current === sidebarId) {
        btn.setAttribute("data-sidebar-active", "true");
      } else {
        btn.removeAttribute("data-sidebar-active");
      }
    });
  }

  // ─────────────────────────────────────────
  // CLICK HANDLERS
  // ─────────────────────────────────────────
  function setupButtons() {
    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn || btn._sidebarHandler) return;

      if (buttonId === "bookmarks-menu-button") {
        const popup = btn.querySelector("#BMB_bookmarksPopup");
        if (popup) popup.remove();
      }

      const handler = (e) => {
        if (e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();

        SidebarController.toggle(sidebarId);
        setTimeout(updateActiveButtons, 0);
      };

      btn._sidebarHandler = handler;
      btn.addEventListener("click", handler);

      console.log("Connected:", buttonId);
    });
  }

  // ─────────────────────────────────────────
  // INIT LOOP (wait for UI)
  // ─────────────────────────────────────────
  function initLoop() {
    if (!initSidebarPanel()) {
      setTimeout(initLoop, 50);
      return;
    }

    initAIButton();
    setupButtons();
    updateActiveButtons();
  }

  // observe DOM for late buttons
  const waitObserver = new MutationObserver(setupButtons);
  waitObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // observe sidebar state
  const sidebarBox = document.getElementById("sidebar-box");
  if (sidebarBox) {
    const observer = new MutationObserver(updateActiveButtons);
    observer.observe(sidebarBox, { attributes: true });
  }

  // start
  initLoop();

})();
// ======================
// ZEN SIDEBAR SYSTEM (MERGED)
// ======================
console.log("ZEN SIDEBAR MERGED SCRIPT LOADED");

(function () {
  const SIDEBAR_PANEL_ID = "zen-sidebar-extra-panel";
  const WIDGET_ID = "zen-ai-sidebar-toggle";
  const SIDEBAR_ID = "viewGenaiChatSidebar";

  let sidebarPanelReady = false;

  // ─────────────────────────────────────────
  // SVG ICON
  // ─────────────────────────────────────────
  function makeSrc(svg) {
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  const AI_ICON = makeSrc(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="context-fill" fill-opacity="context-fill-opacity">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1"
            stroke="context-fill" stroke-width="1.5" fill="none"/>
    </svg>
  `);

  // ─────────────────────────────────────────
  // CREATE EXTRA PANEL
  // ─────────────────────────────────────────
  function initSidebarPanel() {
    if (sidebarPanelReady) return true;
    if (!window.CustomizableUI) return false;

    const container = document.getElementById("zen-appcontent-navbar-container");
    if (!container) return false;

    if (document.getElementById(SIDEBAR_PANEL_ID)) {
      sidebarPanelReady = true;
      return true;
    }

    try {
      if (!CustomizableUI.getAreaType(SIDEBAR_PANEL_ID)) {
        CustomizableUI.registerArea(SIDEBAR_PANEL_ID, {
          type: CustomizableUI.TYPE_TOOLBAR,
          defaultPlacements: []
        });
      }

      const panel = document.createXULElement("toolbar");
      panel.id = SIDEBAR_PANEL_ID;
      panel.setAttribute("customizable", "true");
      panel.setAttribute("mode", "icons");
      panel.setAttribute("iconsize", "small");
      panel.setAttribute("context", "toolbar-context-menu");

      container.appendChild(panel);
      CustomizableUI.registerToolbarNode(panel);

      if (CustomizableUI.getWidgetIdsInArea(SIDEBAR_PANEL_ID).length === 0) {
        CustomizableUI.resetArea(SIDEBAR_PANEL_ID);
      }

      console.log("Sidebar extra panel ready");
      sidebarPanelReady = true;
      return true;
    } catch (e) {
      console.error("Sidebar panel init failed:", e);
      return false;
    }
  }

  // ─────────────────────────────────────────
  // CREATE AI BUTTON (WITH ICON)
  // ─────────────────────────────────────────
  function initAIButton() {
    if (!window.CustomizableUI) return;

    if (CustomizableUI.getWidget(WIDGET_ID)) return;

    CustomizableUI.createWidget({
      id: WIDGET_ID,
      type: "button",
      defaultArea: SIDEBAR_PANEL_ID, // 🔥 goes directly into your panel

      label: "AI Sidebar",
      tooltiptext: "Toggle AI Sidebar",

      onCreated(btn) {
        btn.style.listStyleImage = `url("${AI_ICON}")`;
      },

      onCommand() {
        SidebarController.toggle(SIDEBAR_ID);
      },
    });

    console.log("AI button created");
  }

  // ─────────────────────────────────────────
  // SIDEBAR BUTTON MAPPING
  // ─────────────────────────────────────────
  const mapping = [
    { buttonId: "history-panelmenu", sidebarId: "viewHistorySidebar" },
    { buttonId: "bookmarks-menu-button", sidebarId: "viewBookmarksSidebar" },
    { buttonId: "sync-button", sidebarId: "viewTabsSidebar" },
    { buttonId: "logins-button", sidebarId: "viewMegalistSidebar" },
    { buttonId: WIDGET_ID, sidebarId: SIDEBAR_ID },
    {
      buttonId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-browser-action",
      sidebarId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-sidebar-action",
    },
  ];

  // ─────────────────────────────────────────
  // ACTIVE STATE
  // ─────────────────────────────────────────
  function updateActiveButtons() {
    const state = SidebarController.getUIState();
    const current = SidebarController.currentID;
    const isOpen = state?.panelOpen;

    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn) return;

      if (isOpen && current === sidebarId) {
        btn.setAttribute("data-sidebar-active", "true");
      } else {
        btn.removeAttribute("data-sidebar-active");
      }
    });

    // addon buttons auto-detect
    document.querySelectorAll(".toolbaritem-combined-buttons").forEach((btn) => {
      const sidebarId = btn.id.replace("-browser-action", "-sidebar-action");

      if (isOpen && current === sidebarId) {
        btn.setAttribute("data-sidebar-active", "true");
      } else {
        btn.removeAttribute("data-sidebar-active");
      }
    });
  }

  // ─────────────────────────────────────────
  // CLICK HANDLERS
  // ─────────────────────────────────────────
  function setupButtons() {
    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn || btn._sidebarHandler) return;

      if (buttonId === "bookmarks-menu-button") {
        const popup = btn.querySelector("#BMB_bookmarksPopup");
        if (popup) popup.remove();
      }

      const handler = (e) => {
        if (e.button !== 0) return;

        e.stopPropagation();
        e.preventDefault();

        SidebarController.toggle(sidebarId);
        setTimeout(updateActiveButtons, 0);
      };

      btn._sidebarHandler = handler;
      btn.addEventListener("click", handler);

      console.log("Connected:", buttonId);
    });
  }

  // ─────────────────────────────────────────
  // INIT LOOP (wait for UI)
  // ─────────────────────────────────────────
  function initLoop() {
    if (!initSidebarPanel()) {
      setTimeout(initLoop, 50);
      return;
    }

    initAIButton();
    setupButtons();
    updateActiveButtons();
  }

  // observe DOM for late buttons
  const waitObserver = new MutationObserver(setupButtons);
  waitObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // observe sidebar state
  const sidebarBox = document.getElementById("sidebar-box");
  if (sidebarBox) {
    const observer = new MutationObserver(updateActiveButtons);
    observer.observe(sidebarBox, { attributes: true });
  }

  // start
  initLoop();

})();
