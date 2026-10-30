import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { LensId } from './lenses';

export type Project = CollectionEntry<'projects'>;

export async function getProfile() {
  const profile = await getEntry('profile', 'profile');
  if (!profile) throw new Error('data/portfolio.js has no profile');
  return profile;
}

// Covers are named in the data by path from the repo root.
const covers = import.meta.glob<{ default: ImageMetadata }>('/img/**/*.{png,jpg,jpeg,webp}', { eager: true });

/** An image named in the data by path from the repo root, ready for `<Image>`. */
function imageAt(slug: string, path: string) {
  const image = covers[`/${path}`];
  if (!image) throw new Error(`${slug}: image "${path}" is not a file under img/`);
  return image.default;
}

/** The project's cover image, ready for `<Image>`; undefined when it has none. */
export function coverOf({ data }: Project) {
  return data.cover ? imageAt(data.slug, data.cover) : undefined;
}

/** The project's other images, shown after the cover on its project page. */
export function galleryOf({ data }: Project) {
  return data.gallery.map(({ src, alt }) => ({ image: imageAt(data.slug, src), alt }));
}

/** `Etc/GMT-1` → `GMT+1`: the profile's time zone as an offset. */
export const gmtOffset = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'shortOffset' })
    .formatToParts(new Date())
    .find(({ type }) => type === 'timeZoneName')?.value ?? 'GMT';

/** `max_concurrent_games` → `max concurrent games` */
export const factLabel = (key: string) => key.replaceAll('_', ' ');

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
