// The switcher contract (AGENTS.md §4): always these four, always in this order.
export type LensId = 'classic' | 'web' | 'games' | 'blockchain';

export const lenses: { id: LensId; href: string; ready: boolean }[] = [
  { id: 'classic', href: '/', ready: true },
  { id: 'web', href: '/web', ready: true },
  { id: 'games', href: '/games', ready: false },
  { id: 'blockchain', href: '/blockchain', ready: true },
];

/** Project detail route for a lens: `/work/<slug>` for classic, `/<lens>/work/<slug>` otherwise. */
export const workHref = (lens: LensId, slug: string) =>
  lens === 'classic' ? `/work/${slug}` : `/${lens}/work/${slug}`;
