// The switcher contract (AGENTS.md §4): always these four, always in this order.
export type LensId = 'home' | 'web' | 'games' | 'blockchain';

export const lenses: { id: LensId; href: string; ready: boolean }[] = [
  { id: 'home', href: '/', ready: true },
  { id: 'web', href: '/web', ready: true },
  { id: 'games', href: '/games', ready: true },
  { id: 'blockchain', href: '/blockchain', ready: true },
];

/** Project detail route for a lens: `/work/<slug>` for home, `/<lens>/work/<slug>` otherwise. */
export const workHref = (lens: LensId, slug: string) =>
  lens === 'home' ? `/work/${slug}` : `/${lens}/work/${slug}`;
