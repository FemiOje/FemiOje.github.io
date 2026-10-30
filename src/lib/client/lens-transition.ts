// Plays a full-page overlay when the visitor moves from one lens to another: the old lens
// closes over the page, the new one opens onto it (see lens-transition.css). Navigation
// inside a lens keeps the plain crossfade, and so does everything under reduced motion.
import { lenses, type LensId } from '../lenses';
// Inlined so the styles travel with the overlay and survive the swap of the page's <head>.
import css from './lens-transition.css?inline';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const lensOf = ({ pathname }: URL): LensId =>
  lenses.find(({ href }) => href !== '/' && (pathname === href || pathname.startsWith(`${href}/`)))?.id ?? 'home';

const play = (layer: HTMLElement, state: string) => {
  layer.dataset.state = state;
  return Promise.allSettled(layer.getAnimations({ subtree: true }).map((animation) => animation.finished));
};

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

let current: { overlay: HTMLElement; reveal: () => void } | undefined;

const begin = (from: LensId, to: LensId) => {
  current?.overlay.remove();

  const overlay = document.createElement('div');
  overlay.className = 'lens-shift';
  overlay.setAttribute('aria-hidden', 'true');
  const style = document.createElement('style');
  style.textContent = css;
  const [leaving, entering] = [from, to].map((motif) => {
    const layer = document.createElement('div');
    layer.className = 'lens-shift__layer';
    layer.dataset.motif = motif;
    layer.dataset.state = 'wait';
    return layer;
  });
  // On <html>, beside <body>, so the router's body swap leaves it in place.
  overlay.append(style, leaving, entering);
  document.documentElement.append(overlay);

  const covered = play(leaving, 'cover').then(() => play(entering, 'blend'));
  const done = () => {
    overlay.remove();
    if (current?.overlay === overlay) current = undefined;
  };
  const reveal = async () => {
    await covered;
    leaving.remove();
    // Let the new page paint under the cover first, so the reveal runs on an idle frame.
    await nextFrame();
    await nextFrame();
    await play(entering, 'reveal');
    done();
  };
  // Never leave the page covered if the navigation stalls or fails.
  setTimeout(done, 6000);

  current = { overlay, reveal };
  return covered;
};

document.addEventListener('astro:before-preparation', (event) => {
  const from = document.documentElement.dataset.lens as LensId | undefined;
  const to = lensOf(event.to);
  if (!from || from === to || reducedMotion.matches) return;

  // The page is fetched while the cover closes; the swap waits for both.
  const covered = begin(from, to);
  const load = event.loader;
  event.loader = async () => {
    await Promise.all([load(), covered]);
  };
});

// The overlay replaces the crossfade for this navigation.
document.addEventListener('astro:before-swap', (event) => {
  if (current) event.viewTransition.skipTransition();
});

// After the new page's scripts have run, so they cannot stutter the reveal.
document.addEventListener('astro:page-load', () => current?.reveal());
