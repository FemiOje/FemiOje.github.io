// The poster's working parts: recompose, grid overlay, project filters and the entrance reveal.
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

  const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const posters = [...document.querySelectorAll<HTMLElement>('[data-tags]')];
  const count = document.querySelector<HTMLElement>('[data-count]');
  for (const button of filters) {
    button.addEventListener('click', () => {
      const tag = button.dataset.filter;
      for (const other of filters) other.setAttribute('aria-pressed', String(other === button));
      let shown = 0;
      for (const poster of posters) {
        const show = tag === 'all' || (poster.dataset.tags ?? '').split(' ').includes(tag ?? '');
        poster.hidden = !show;
        if (show) shown++;
      }
      if (count) count.textContent = `${String(shown).padStart(2, '0')} ${shown === 1 ? 'project' : 'projects'}`;
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
