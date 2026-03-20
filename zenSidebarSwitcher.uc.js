console.log("ZEN SIDEBAR SWITCHER INLINE LOADED");

(function () {
  const POPUP_ID = "sidebarMenu-popup";
  const HEADER_ID = "sidebar-header";
  const EXCLUDE_IDS = [
    "sidebar-menu-close",
    "sidebar-reverse-position",
    "sidebar-extensions-separator"
  ];

  function initSwitcherButtons() {
    const header = document.getElementById(HEADER_ID);
    const popup = document.getElementById(POPUP_ID);

    // If UI not ready, retry later
    if (!header || !popup) return false;

    // Already initialized?
    if (header.querySelector(".sidebar-switcher-inline")) return true;

    // Collect menu items, excluding certain IDs
    const items = Array.from(popup.querySelectorAll("menuitem")).filter(
      mi => !EXCLUDE_IDS.includes(mi.id)
    );

    // Create inline container
    const container = document.createElement("hbox");
    container.className = "sidebar-switcher-inline";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.alignItems = "center";
    container.style.justifyContent = "flex-start";
    container.style.gap = "4px";

    items.forEach(mi => {
      const btn = document.createElement("toolbarbutton");
      btn.setAttribute("id", mi.id + "-inline");
      btn.setAttribute("label", mi.label);
      btn.setAttribute("class", mi.className + " sidebar-switcher-button");
      btn.setAttribute("tooltiptext", mi.getAttribute("tooltip") || "");
      btn.style.flex = "0 0 auto";
      btn.style.minWidth = "auto";

      // Copy click/command handlers safely
      if (mi.onclick) btn.addEventListener("click", mi.onclick);
      if (mi.oncommand) btn.addEventListener("click", mi.oncommand);
      btn.addEventListener("click", () => mi.doCommand && mi.doCommand());

      container.appendChild(btn);
    });

    // Insert container at the top of the header
    header.insertBefore(container, header.firstChild);
    return true;
  }

  // Retry until the UI is ready
  function waitForUI() {
    if (!initSwitcherButtons()) setTimeout(waitForUI, 50);
  }

  waitForUI();
})();
