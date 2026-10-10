// The project filters, shared by every lens that offers them. `tag` matches the
// project frontmatter; `label` is what the visitor reads.
export const projectFilters = [
  { tag: 'all', label: 'all' },
  { tag: 'web', label: 'web' },
  { tag: 'onchain', label: 'onchain' },
  { tag: 'games', label: 'games' },
  { tag: 'open-source', label: 'open source' },
];

/** The filters worth offering for these projects: `all`, plus every tag at least one of them carries. */
export const filtersFor = (projects: { data: { tags: string[] } }[]) =>
  projectFilters.filter(({ tag }) => tag === 'all' || projects.some(({ data }) => data.tags.includes(tag)));
