// Everything the paper does when asked: sidenotes, the running head, verify chain, cite.
// The page is complete without any of it.
const GENESIS = '0'.repeat(64);
const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (s: string) => toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));

const wide = matchMedia('(min-width: 1100px)');
let syncNotes = () => {};
wide.addEventListener('change', () => syncNotes());
let sectionIO: IntersectionObserver | undefined;

// Without the class, sidenotes stay readable inline.
const markJs = () => document.documentElement.classList.add('js');
markJs();
document.addEventListener('astro:after-swap', markJs);

document.addEventListener('astro:page-load', () => {
  if (document.documentElement.dataset.lens !== 'blockchain') return;

  // Sidenotes: tap-to-open below 1100px; plain margin notes above.
  const refs = [...document.querySelectorAll<HTMLButtonElement>('.sn-ref')];
  const noteFor = (ref: HTMLButtonElement) => document.getElementById(ref.getAttribute('aria-controls') ?? '');
  syncNotes = () => {
    for (const ref of refs) {
      const note = noteFor(ref);
      if (wide.matches) {
        ref.tabIndex = -1;
        ref.removeAttribute('aria-expanded');
        note?.classList.remove('open');
      } else {
        ref.tabIndex = 0;
        ref.setAttribute('aria-expanded', String(note?.classList.contains('open') ?? false));
      }
    }
  };
  for (const ref of refs) {
    ref.addEventListener('click', () => {
      if (wide.matches) return;
      ref.setAttribute('aria-expanded', String(noteFor(ref)?.classList.toggle('open') ?? false));
    });
  }
  syncNotes();

  // The running head follows the section in view.
  sectionIO?.disconnect();
  const runhead = document.querySelector<HTMLElement>('[data-runhead-section]');
  if (runhead) {
    sectionIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) runhead.textContent = (entry.target as HTMLElement).dataset.section ?? '';
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const section of document.querySelectorAll('[data-section]')) sectionIO.observe(section);
  }

  // Verify chain: recompute every block's SHA-256 from genesis upward. The payload format
  // (`prev|slug|date|title`) is the one buildChain() uses in src/lib/chain.js; change one, change both.
  const rows = [...document.querySelectorAll<HTMLTableRowElement>('.ledger tbody tr')];
  const status = document.querySelector<HTMLElement>('.chain-status');
  document.querySelector<HTMLButtonElement>('[data-verify]')?.addEventListener('click', async ({ currentTarget }) => {
    const button = currentTarget as HTMLButtonElement;
    if (!status) return;
    if (!globalThis.crypto?.subtle) {
      status.textContent = 'verification needs https';
      return;
    }
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    button.disabled = true;
    status.classList.remove('ok');
    status.textContent = 'verifying…';
    const chain = [...rows].sort((a, b) => Number(a.dataset.height) - Number(b.dataset.height));
    for (const row of chain) row.classList.remove('ok', 'bad');

    let prev = GENESIS;
    let valid = true;
    for (const row of chain) {
      const { hash = '', slug, date, title } = row.dataset;
      const ok = row.dataset.prev === prev && (await sha256(`${prev}|${slug}|${date}|${title}`)) === hash;
      row.classList.add(ok ? 'ok' : 'bad');
      valid &&= ok;
      prev = hash;
      if (!still) await new Promise((done) => setTimeout(done, 90));
    }
    status.textContent = valid ? `chain valid · ${chain.length} blocks` : 'chain broken — rebuild the site';
    status.classList.toggle('ok', valid);
    button.disabled = false;
  });

  // Hovering a block highlights its parent: the row whose hash is this row's prev.
  const byHash = new Map(rows.map((row) => [row.dataset.hash, row]));
  for (const row of rows) {
    const parent = byHash.get(row.dataset.prev);
    row.addEventListener('mouseenter', () => parent?.classList.add('linked'));
    row.addEventListener('mouseleave', () => parent?.classList.remove('linked'));
  }

  // Cite: copy a BibTeX entry, or show it at the end of the page when the clipboard is blocked.
  const citeStatus = document.querySelector<HTMLElement>('[data-cite-status]');
  const citeFallback = document.querySelector<HTMLElement>('[data-cite-fallback]');
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-cite]')) {
    button.addEventListener('click', async () => {
      const d = button.dataset;
      const url = new URL(d.citeUrl ?? '', location.origin).href;
      const bib = `@misc{${d.cite},\n  author       = {${d.citeAuthor}},\n  title        = {${d.citeTitle}},\n  year         = {${d.citeYear}},\n  howpublished = {\\url{${url}}},\n  note         = {${d.citeNote}}\n}`;
      try {
        await navigator.clipboard.writeText(bib);
        if (citeStatus) citeStatus.textContent = `copied bibtex for ${d.cite}`;
        const label = button.textContent;
        button.textContent = 'copied';
        setTimeout(() => (button.textContent = label), 1600);
      } catch {
        if (citeFallback) {
          citeFallback.textContent = bib;
          citeFallback.hidden = false;
        }
        if (citeStatus) citeStatus.textContent = 'copy failed — bibtex shown at the end of the page';
      }
    });
  }
});
