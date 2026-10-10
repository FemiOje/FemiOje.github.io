// Project filters. Each lens draws its own controls; the behaviour is the same:
// `[data-filter="<tag>"]` buttons show and hide `[data-tags]` items, a `[data-filter-group]`
// hides once nothing inside it is showing, and `[data-count]` reports how many are left
// (zero-padded to `data-count-pad` digits when set).
document.addEventListener('astro:page-load', () => {
  const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const items = [...document.querySelectorAll<HTMLElement>('[data-tags]')];
  const groups = [...document.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const count = document.querySelector<HTMLElement>('[data-count]');

  for (const button of filters) {
    button.addEventListener('click', () => {
      const tag = button.dataset.filter ?? 'all';
      for (const other of filters) other.setAttribute('aria-pressed', String(other === button));

      let shown = 0;
      for (const item of items) {
        const show = tag === 'all' || (item.dataset.tags ?? '').split(' ').includes(tag);
        item.hidden = !show;
        if (show) shown++;
      }
      for (const group of groups) {
        group.hidden = !group.querySelector('[data-tags]:not([hidden])');
      }
      if (count) {
        const n = String(shown).padStart(Number(count.dataset.countPad ?? 0), '0');
        count.textContent = `${n} ${shown === 1 ? 'project' : 'projects'}`;
      }
    });
  }
});
