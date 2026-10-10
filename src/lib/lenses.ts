// The switcher contract (AGENTS.md §4): always these three, always in this order.
export type LensId = 'web' | 'chain' | 'games';

export const lenses: { id: LensId; href: string; ready: boolean }[] = [
  { id: 'web', href: '/', ready: true },
  { id: 'chain', href: '/chain', ready: false },
  { id: 'games', href: '/games', ready: true },
];

/** Project detail route for a lens: `/work/<slug>` for web, `/<lens>/work/<slug>` otherwise. */
export const workHref = (lens: LensId, slug: string) =>
  lens === 'web' ? `/work/${slug}` : `/${lens}/work/${slug}`;
