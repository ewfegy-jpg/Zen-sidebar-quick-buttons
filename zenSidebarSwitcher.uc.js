(function () {
  console.log("SidebarController-based toggle loaded");

  const mapping = [
    { buttonId: "history-panelmenu", sidebarId: "viewHistorySidebar" },
    { buttonId: "bookmarks-menu-button", sidebarId: "viewBookmarksSidebar" },
    { buttonId: "sync-button", sidebarId: "viewTabsSidebar" },
    { buttonId: "logins-button", sidebarId: "viewMegalistSidebar" },
    {
      buttonId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-browser-action",
      sidebarId: "_446900e4-71c2-419f-a6a7-df9c091e268b_-sidebar-action",
    },
  ];

  const extraPanel = document.getElementById("zen-sidebar-extra-panel");

  function updateActiveButtons() {
    const state = SidebarController.getUIState();
    const current = SidebarController.currentID;

    // highlight ONLY if sidebar is open
    const isOpen = state?.panelOpen;

    // mapped buttons
    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn) return;

      if (isOpen && current === sidebarId) {
        btn.setAttribute("data-sidebar-active", "true");
      } else {
        btn.removeAttribute("data-sidebar-active");
      }
    });

    // addon buttons (auto-detect)
    if (extraPanel) {
      extraPanel.querySelectorAll("toolbaritem").forEach((btn) => {
        const sidebarId = btn.id.replace("-browser-action", "-sidebar-action");

        if (isOpen && current === sidebarId) {
          btn.setAttribute("data-sidebar-active", "true");
        } else {
          btn.removeAttribute("data-sidebar-active");
        }
      });
    }
  }

  function setupButtons() {
    mapping.forEach(({ buttonId, sidebarId }) => {
      const btn = document.getElementById(buttonId);
      if (!btn) return;

      // remove bookmarks popup
      if (buttonId === "bookmarks-menu-button") {
        const popup = btn.querySelector("#BMB_bookmarksPopup");
        if (popup) popup.remove();
      }

      const handler = (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();

        SidebarController.toggle(sidebarId);

        // update highlight after toggle
        setTimeout(updateActiveButtons, 0);
      };

      if (btn._sidebarHandler) {
        btn.removeEventListener("click", btn._sidebarHandler);
      }

      btn._sidebarHandler = handler;
      btn.addEventListener("click", handler);
    });
  }

  setupButtons();

  // observe sidebar state changes
  const observer = new MutationObserver(updateActiveButtons);
  observer.observe(document.getElementById("sidebar-box"), {
    attributes: true,
  });

  // initial state
  setTimeout(updateActiveButtons, 50);

  console.log("SidebarController wiring complete");
})();
