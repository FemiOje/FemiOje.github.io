// The poster's working parts: recompose, grid overlay and the entrance reveal.
// Project filters are shared with the other lenses (lib/client/project-filter).
document.addEventListener('astro:page-load', () => {
  if (document.documentElement.dataset.lens !== 'web') return;

  // Recompose: cycle the hero composition (1/3 → 2/3 → 3/3 → 1/3).
  const hero = document.querySelector<HTMLElement>('[data-comp]');
  const recompose = document.querySelector<HTMLButtonElement>('[data-recompose]');
  const compLabel = recompose?.querySelector('[data-comp-label]');
  if (hero && recompose) {
    recompose.addEventListener('click', () => {
      const next = (Number(hero.dataset.comp) + 1) % 3;
      hero.dataset.comp = String(next);
      if (compLabel) compLabel.textContent = `${next + 1}/3`;
    });
  }

  const gridToggle = document.querySelector<HTMLButtonElement>('[data-grid-toggle]');
  const overlay = document.querySelector<HTMLElement>('[data-grid-overlay]');
  if (gridToggle && overlay) {
    gridToggle.addEventListener('click', () => {
      const on = gridToggle.getAttribute('aria-pressed') !== 'true';
      gridToggle.setAttribute('aria-pressed', String(on));
      overlay.classList.toggle('is-on', on);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  for (const el of document.querySelectorAll('.sw-reveal')) observer.observe(el);
});
