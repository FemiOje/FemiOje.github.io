// Remembers the last chosen lens (AGENTS.md §3). The site must work without storage,
// so every access is guarded.
const remember = (lens: string | undefined) => {
  if (!lens) return;
  try {
    localStorage.setItem('lens', lens);
  } catch {}
};

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLElement>('[data-lens-link]');
  if (link) remember(link.dataset.lensLink);
});

document.addEventListener('astro:page-load', () => {
  // Arriving on a non-default lens counts as choosing it.
  const current = document.documentElement.dataset.lens;
  if (current !== 'web') remember(current);

  const offer = document.querySelector<HTMLElement>('[data-lens-offer]');
  if (!offer) return;
  try {
    const remembered = localStorage.getItem('lens');
    const link = offer.querySelector<HTMLAnchorElement>(`a[data-offer="${remembered}"]`);
    if (link) {
      link.hidden = false;
      offer.hidden = false;
    }
  } catch {}
});
