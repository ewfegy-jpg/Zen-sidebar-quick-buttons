console.log("ZEN SIDEBAR SWITCHER LOADED");

(function () {
  const POPUP_ID = "sidebarMenu-popup";
  const HEADER_ID = "sidebar-header";
  const EXCLUDE_IDS = ["sidebar-menu-close", "sidebar-reverse-position", "sidebar-extensions-separator"];

  function initSwitcherButtons() {
    const header = document.getElementById(HEADER_ID);
    const popup = document.getElementById(POPUP_ID);

    if (!header || !popup) return false;
    if (header.querySelector(".sidebar-switcher-inline")) return true; // already initialized

    // clone each menuitem (except excluded ones)
    const items = Array.from(popup.querySelectorAll("menuitem")).filter(
      mi => !EXCLUDE_IDS.includes(mi.id)
    );

    // create container box
    const container = document.createElement("hbox");
    container.className = "sidebar-switcher-inline";
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.alignItems = "center";
    container.style.justifyContent = "flex-start";
    container.style.gap = "4px"; // spacing between buttons

    items.forEach(mi => {
      // clone button
      const btn = document.createElement("toolbarbutton");
      btn.setAttribute("id", mi.id + "-inline");
      btn.setAttribute("label", mi.label);
      btn.setAttribute("class", mi.className + " sidebar-switcher-button");
      btn.setAttribute("tooltiptext", mi.getAttribute("tooltip") || "");
      btn.style.flex = "0 0 auto";

      // click handler: trigger original menuitem command
      btn.addEventListener("command", () => mi.doCommand && mi.doCommand());

      container.appendChild(btn);
    });

    // insert into header
    header.appendChild(container);
    return true;
  }

  function waitForUI() {
    if (!initSwitcherButtons()) setTimeout(waitForUI, 50);
  }

  waitForUI();
})();
