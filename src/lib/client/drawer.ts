// A lens's sidebar drawer. Each lens draws its own; the behaviour is the same:
// `[data-drawer-toggle]` buttons, whose `aria-controls` names the drawer, open and close it.
// Opening shows the drawer with `data-drawer="shut"`, then sets "open" so the lens's CSS slides
// it in; closing sets "shut" and hides it once the drawer's own transition has ended.
// Under reduced motion it simply shows and hides. While it is open the page behind is inert
// (all but the header and the parts marked `data-drawer-part`); Escape and a click outside close it.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const parts = () => {
  const toggles = [...document.querySelectorAll<HTMLButtonElement>('[data-drawer-toggle]')];
  const id = toggles[0]?.getAttribute('aria-controls');
  const drawer = id ? document.getElementById(id) : null;
  return drawer ? { toggles, drawer } : undefined;
};
type Parts = NonNullable<ReturnType<typeof parts>>;

const isOpen = (drawer: HTMLElement) => drawer.dataset.drawer === 'open';

const setPageInert = (inert: boolean) => {
  for (const element of document.querySelectorAll<HTMLElement>('body > :not(header, script, [data-drawer-part])')) {
    element.inert = inert;
  }
};

const open = ({ toggles, drawer }: Parts) => {
  for (const toggle of toggles) toggle.setAttribute('aria-expanded', 'true');
  setPageInert(true);
  drawer.hidden = false;
  if (!reducedMotion.matches) {
    drawer.dataset.drawer = 'shut';
    // Commit the shut state before it slides, or there is nothing to slide from.
    drawer.getBoundingClientRect();
  }
  drawer.dataset.drawer = 'open';
  // A drawer that covers the menu button carries its own close button: take focus there.
  drawer.querySelector<HTMLElement>('[data-drawer-toggle]')?.focus();
};

const close = ({ toggles, drawer }: Parts, { returnFocus = false } = {}) => {
  for (const toggle of toggles) toggle.setAttribute('aria-expanded', 'false');
  setPageInert(false);
  drawer.dataset.drawer = 'shut';
  if (returnFocus || drawer.contains(document.activeElement)) {
    toggles.find((toggle) => !drawer.contains(toggle))?.focus();
  }
  const hide = () => {
    // Reopened while it was closing: leave it be.
    if (!isOpen(drawer)) drawer.hidden = true;
  };
  if (reducedMotion.matches) return hide();
  // The drawer's own transition (a slide or a reveal) is the last thing to finish.
  const done = (event: TransitionEvent) => {
    if (event.target !== drawer) return;
    drawer.removeEventListener('transitionend', done);
    hide();
  };
  drawer.addEventListener('transitionend', done);
  // In case the transition never runs.
  setTimeout(hide, 1500);
};

document.addEventListener('click', (event) => {
  const found = parts();
  if (!found) return;
  const target = event.target as Node;
  if (found.toggles.some((toggle) => toggle.contains(target))) {
    if (isOpen(found.drawer)) close(found);
    else open(found);
  } else if (isOpen(found.drawer) && !found.drawer.contains(target)) {
    close(found);
  }
});

document.addEventListener('keydown', (event) => {
  const found = parts();
  if (event.key !== 'Escape' || !found || !isOpen(found.drawer)) return;
  close(found, { returnFocus: true });
});
