document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details.site-menu').forEach((menu) => {
    const summary = menu.querySelector('summary');

    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menu.open) return;
      menu.open = false;
      summary?.focus();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { menu.open = false; });
    });
  });

  document.querySelectorAll('.skip-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const main = document.querySelector(link.getAttribute('href'));
      if (!main) return;
      event.preventDefault();
      history.replaceState(null, '', link.getAttribute('href'));
      main.focus();
    });
  });
});
