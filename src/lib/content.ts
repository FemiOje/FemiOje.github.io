import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { LensId } from './lenses';

export type Project = CollectionEntry<'projects'>;

export async function getProfile() {
  const profile = await getEntry('profile', 'profile');
  if (!profile) throw new Error('src/content/profile.md is missing');
  return profile;
}

/** Projects shown in a lens, in that lens's order, with its featured project split out. */
export async function getLensProjects(lens: LensId) {
  const all = (await getCollection('projects', ({ data }) => data.lenses.includes(lens))).sort(
    (a, b) => (a.data.order[lens] ?? Infinity) - (b.data.order[lens] ?? Infinity),
  );
  const featured = all.find(({ data }) => data.featured_in.includes(lens));
  const rest = all.filter((p) => p !== featured);
  return { all, featured, rest, featuredFirst: featured ? [featured, ...rest] : all };
}

export async function getExperience() {
  return (await getCollection('experience')).sort((a, b) => a.data.order - b.data.order);
}

export const statusLabel: Record<Project['data']['status'], string> = {
  contributor: 'contributor',
  shipped: 'shipped',
  'in-progress': 'in progress',
};
