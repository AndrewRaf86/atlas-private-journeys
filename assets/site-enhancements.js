document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("details.mobile-menu").forEach((menu) => {
    const summary = menu.querySelector("summary");

    summary?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      menu.open = !menu.open;
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.open) return;
      menu.open = false;
      summary?.focus();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.open = false;
      });
    });
  });

  document.querySelectorAll(".skip-link").forEach((link) => {
    const moveToMain = (event) => {
      const main = document.querySelector(link.getAttribute("href"));
      if (!main) return;
      event.preventDefault();
      history.replaceState(null, "", link.getAttribute("href"));
      main.focus();
    };

    link.addEventListener("click", moveToMain);
    link.addEventListener("keydown", (event) => {
      if (event.key === "Enter") moveToMain(event);
    });
  });
});
