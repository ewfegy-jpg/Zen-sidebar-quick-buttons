(function () {
  console.log("Initializing sidebar-switcher and toolbar buttons...");

  // Sidebar buttons mapping
  const sidebarMapping = [
    { buttonId: "history-panelmenu", menuItemId: "sidebar-switcher-history" },
    { buttonId: "bookmarks-menu-button", menuItemId: "sidebar-switcher-bookmarks" },
    { buttonId: "sync-button", menuItemId: "sidebar-switcher-tabs" },
    { buttonId: "logins-button", menuItemId: "sidebar-switcher-megalist" },
  ];

  sidebarMapping.forEach(({ buttonId, menuItemId }) => {
    const panelButton = document.getElementById(buttonId);
    const menuItem = document.getElementById(menuItemId);

    if (!panelButton) {
      console.warn("Sidebar button not found:", buttonId);
      return;
    }
    if (!menuItem) {
      console.warn("Menu item not found:", menuItemId);
      return;
    }

    // Remove BMB_bookmarksPopup inside bookmarks button
    if (buttonId === "bookmarks-menu-button") {
      const popup = panelButton.querySelector("#BMB_bookmarksPopup");
      if (popup) {
        popup.remove();
        console.log("Removed BMB_bookmarksPopup from bookmarks-menu-button");
      }
    }

    // Clone button to remove all old listeners
    const newBtn = panelButton.cloneNode(true);
    panelButton.replaceWith(newBtn);

    // Assign menuitem click behavior
    const handler = (event) => {
      if (event.button !== 0) return; // left click only
      event.stopPropagation();
      event.preventDefault();

      try {
        if (typeof menuItem._onClick === "function") {
          menuItem._onClick();
          console.log(`Triggered _onClick for ${menuItemId}`);
        } else if (typeof menuItem.doCommand === "function") {
          menuItem.doCommand();
          console.log(`Triggered doCommand for ${menuItemId}`);
        } else {
          console.warn("No clickable handler found on menuItem", menuItemId);
        }
      } catch (e) {
        console.error("Error triggering menuitem:", menuItemId, e);
      }
    };

    // Remove previous custom handler if exists
    if (newBtn._customHandler) {
      newBtn.removeEventListener("click", newBtn._customHandler);
    }

    // Save handler reference and attach
    newBtn._customHandler = handler;
    newBtn.addEventListener("click", handler);

    console.log(`Cloned and wired menuitem behavior for ${buttonId}`);
  });

  // Toolbar browser-action button
  const toolbarMapping = [
    {
      buttonId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-browser-action",
      menuItemId: "sidebarswitcher_menu__446900e4-71c2-419f-a6a7-df9c091e268b_-sidebar-action",
    },
  ];

  toolbarMapping.forEach(({ buttonId, menuItemId }) => {
    const toolbarButton = document.getElementById(buttonId);
    const menuItem = document.getElementById(menuItemId);

    if (!toolbarButton) {
      console.warn("Toolbar button not found:", buttonId);
      return;
    }
    if (!menuItem) {
      console.warn("Menu item not found:", menuItemId);
      return;
    }

    // Clone toolbar button to remove listeners
    const newBtn = toolbarButton.cloneNode(true);
    toolbarButton.replaceWith(newBtn);

    const handler = (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      event.preventDefault();

      try {
        if (typeof menuItem._onClick === "function") {
          menuItem._onClick();
          console.log(`Triggered _onClick for ${menuItemId}`);
        } else if (typeof menuItem.doCommand === "function") {
          menuItem.doCommand();
          console.log(`Triggered doCommand for ${menuItemId}`);
        } else {
          console.warn("No clickable handler found on menuItem", menuItemId);
        }
      } catch (e) {
        console.error("Error triggering menuitem:", menuItemId, e);
      }
    };

    if (newBtn._customHandler) {
      newBtn.removeEventListener("click", newBtn._customHandler);
    }

    newBtn._customHandler = handler;
    newBtn.addEventListener("click", handler);

    console.log(`Cloned and wired menuitem behavior for toolbar button ${buttonId}`);
  });

  console.log("All sidebar and toolbar buttons wired successfully!");
})();
