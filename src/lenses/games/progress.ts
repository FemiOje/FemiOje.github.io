// What the visitor has done this visit: levels visited, coins picked up, where the player stands.
// Kept in sessionStorage so it survives going to a level page and back; the lens works without it.
const KEY = 'games-progress';

export interface Progress {
  /** Level slugs. */
  visited: string[];
  /** Roads whose coin is taken, as `world:road`. */
  coins: string[];
  /** Achievements already announced. */
  shown: string[];
  /** Node the player stands on, as `world:node`. */
  at?: string;
}

const read = (): Progress => {
  const empty: Progress = { visited: [], coins: [], shown: [] };
  try {
    return { ...empty, ...JSON.parse(sessionStorage.getItem(KEY) ?? '{}') };
  } catch {
    return empty;
  }
};

export const progress = read();

export const save = () => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
};

export function visit(slug: string) {
  if (!progress.visited.includes(slug)) progress.visited.push(slug);
}
