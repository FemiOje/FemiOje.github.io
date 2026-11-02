// Project filters. Each lens draws its own controls; the behaviour is the same:
// `[data-filter="<tag>"]` buttons show and hide `[data-tags]` items, a `[data-filter-group]`
// hides once nothing inside it is showing.
document.addEventListener('astro:page-load', () => {
  const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const items = [...document.querySelectorAll<HTMLElement>('[data-tags]')];
  const groups = [...document.querySelectorAll<HTMLElement>('[data-filter-group]')];

  for (const button of filters) {
    button.addEventListener('click', () => {
      const tag = button.dataset.filter ?? 'all';
      for (const other of filters) other.setAttribute('aria-pressed', String(other === button));

      for (const item of items) {
        item.hidden = !(tag === 'all' || (item.dataset.tags ?? '').split(' ').includes(tag));
      }
      for (const group of groups) {
        group.hidden = !group.querySelector('[data-tags]:not([hidden])');
      }
    });
  }
});
