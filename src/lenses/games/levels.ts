import { getCollection, type CollectionEntry } from 'astro:content';
import { getLensProjects, type Project } from '../../lib/content';
import { workHref } from '../../lib/lenses';

/** Picks the level's building on the map (design/games/DESIGN.md › Level sprite). */
export type LevelKind = 'onchain' | 'jam' | 'multiplayer' | 'other';

export interface Level {
  project: Project;
  slug: string;
  title: string;
  /** `1-3`: world, then place in it. */
  code: string;
  /** Zero-based world, and zero-based place in that world. */
  world: number;
  place: number;
  kind: LevelKind;
  kindLabel: string;
  href: string;
  /** Its dated events, newest first. */
  log: CollectionEntry<'txs'>[];
}

/** Games per map; the next one starts a new world. */
export const WORLD_SIZE = 7;

const kindLabel: Record<LevelKind, string> = {
  onchain: 'onchain game',
  jam: 'game jam entry',
  multiplayer: 'multiplayer game',
  other: 'game',
};

// The data has no field for this, so it is read off what the data does say.
const kindOf = ({ data }: Project, log: Level['log']): LevelKind => {
  if (data.tags.includes('onchain')) return 'onchain';
  if (log.some((tx) => tx.data.method === 'submit')) return 'jam';
  if (/multiplayer/i.test(data.summary)) return 'multiplayer';
  return 'other';
};

/** Every project shown in the games lens, in the lens's order. Adding a game to the data adds a level. */
export async function getLevels(): Promise<Level[]> {
  const { featuredFirst } = await getLensProjects('games');
  const txs = (await getCollection('txs')).sort((a, b) => b.data.date.localeCompare(a.data.date));
  return featuredFirst.map((project, i) => {
    const { slug, title } = project.data;
    const log = txs.filter((tx) => tx.data.to === slug);
    const kind = kindOf(project, log);
    const world = Math.floor(i / WORLD_SIZE);
    const place = i % WORLD_SIZE;
    return {
      project, slug, title, world, place, kind, log,
      code: `${world + 1}-${place + 1}`,
      kindLabel: kindLabel[kind],
      href: workHref('games', slug),
    };
  });
}

export const worldsOf = (levels: Level[]) =>
  Array.from({ length: Math.ceil(levels.length / WORLD_SIZE) }, (_, w) => levels.filter(({ world }) => world === w));

/** A level's node on its world's map: node 0 is START or the way back, so levels begin at 1. */
export const nodeId = ({ world, place }: Level) => `${world}:${place + 1}`;
