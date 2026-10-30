import { gitSha } from './git.js';
import { statusLabel, type Project } from '../../lib/content';

// Monochrome highlighting: weight and italic only, never colour.
export const paperMono = {
  name: 'paper-mono',
  type: 'light' as const,
  colors: { 'editor.background': '#F5F5F1', 'editor.foreground': '#141414' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#4F4F4B', fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'entity.name.type', 'support.type'],
      settings: { foreground: '#141414', fontStyle: 'bold' },
    },
    { scope: ['string', 'constant', 'variable', 'entity.name.function'], settings: { foreground: '#141414' } },
    // Operators stay regular, and nothing inside a comment is bold.
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#141414', fontStyle: '' } },
    {
      scope: ['comment keyword', 'comment storage.type', 'comment entity.name.type', 'comment support.type', 'comment variable'],
      settings: { foreground: '#4F4F4B', fontStyle: 'italic' },
    },
  ],
};

const now = new Date();
const month = now.toISOString().slice(0, 7);
export const build = {
  /** `2026-10` */
  month,
  /** `2026.10` */
  version: month.replace('-', '.'),
  year: month.slice(0, 4),
  monthName: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
  sha: gitSha(),
};

/** `Oluwafemi Ojetokun` → `O. Ojetokun` */
export const initialled = (name: string) => {
  const [first, ...rest] = name.split(' ');
  return `${first[0]}. ${rest.join(' ')}`;
};

/** `Oluwafemi Ojetokun` → `Ojetokun, Oluwafemi` (BibTeX author) */
export const bibAuthor = (name: string) => {
  const [first, ...rest] = name.split(' ');
  return `${rest.join(' ')}, ${first}`;
};

export const citeKey = (fullName: string, year: string, slug: string) =>
  `${fullName.split(' ').at(-1)}${year}${slug}`.toLowerCase().replace(/[^a-z0-9]/g, '');

/** A project's year if it has one, else the build year. */
export const yearOf = ({ data }: Project) => data.years.match(/\d{4}/)?.[0] ?? build.year;

/**
 * The status line of a paper, ending in its net (`shipped · mainnet`).
 * `live` is what earns the green dot: a deployed contract or a live URL.
 */
export function standing({ data }: Project) {
  const [live, status] = data.onchain
    ? [true, `deployed · ${data.onchain.network.toLowerCase()}`]
    : data.links.live
      ? [true, 'live']
      : [false, statusLabel[data.status]];
  return { live, label: [status, data.net].filter(Boolean).join(' · ') };
}

/** Where a project lives or is deployed, if it is. */
export const deploymentOf = ({ data }: Project) => data.onchain?.url || data.links.live;

// Table 2. The tools come from the projects' `stack`; this only says which layer each one sits in.
const layers: [string, string[]][] = [
  ['contracts', ['Cairo', 'Dojo', 'Scarb', 'Snforge', 'Starkli']],
  ['networks', ['Starknet']],
  ['identity', ['ENSv2', 'World ID', 'Cartridge Controller']],
  ['interface', ['TypeScript', 'React', 'Starknet-React', 'Three.js', 'Tailwind CSS', 'SVG']],
];

export function toolsByLayer(projects: Project[]) {
  const used = new Set(projects.flatMap(({ data }) => data.stack));
  const known = new Set(layers.flatMap(([, tools]) => tools));
  const other = [...used].filter((tool) => !known.has(tool));
  return [...layers.map(([layer, tools]) => ({ layer, tools: tools.filter((tool) => used.has(tool)) })), { layer: 'other', tools: other }].filter(
    ({ tools }) => tools.length > 0,
  );
}

/** The tools at least two of these projects share, most used first. */
export function keywords(projects: Project[]) {
  const counts = new Map<string, number>();
  for (const tool of projects.flatMap(({ data }) => data.stack)) counts.set(tool, (counts.get(tool) ?? 0) + 1);
  return [...counts]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([tool]) => tool.toLowerCase());
}

/** `https://github.com/FemiOje/hexed` → `github.com/FemiOje/hexed` */
export const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
