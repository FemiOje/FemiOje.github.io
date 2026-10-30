// Build-time half of the inspector: where each registry rule sits in inspector.css (the Styles
// pane cites the real line), what the Console answers, and a check that the two files agree.
import { getExperience, getLensProjects, getProfile, statusLabel } from '../../lib/content';
import { lenses } from '../../lib/lenses';
import css from './inspector.css?raw';
import { registry, type InspectorData } from './registry';

const STYLESHEET = 'inspector.css';
const lines = css.split('\n');

function ruleSources() {
  const sources: Record<string, number> = {};
  for (const [id, { rule, decls }] of Object.entries(registry)) {
    const start = lines.indexOf(`${rule} {`);
    if (start < 0) throw new Error(`${STYLESHEET} has no rule "${rule}" (registry "${id}")`);
    const block = lines.slice(start + 1, lines.indexOf('}', start)).map((line) => line.trim());
    for (const { prop, value } of decls) {
      if (!block.includes(`${prop}: ${value};`)) {
        throw new Error(`registry "${id}": ${STYLESHEET} does not declare \`${prop}: ${value}\` in ${rule}`);
      }
    }
    sources[id] = start + 1;
  }
  return sources;
}

const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const quote = (s: string) => `'${s.replaceAll("'", "\\'")}'`;

export async function getInspectorData(): Promise<InspectorData> {
  const { data: profile } = await getProfile();
  const { featuredFirst: projects } = await getLensProjects('web');
  const experience = await getExperience();

  const stack = [...new Set(projects.flatMap(({ data }) => data.stack))];
  const titleWidth = Math.max(...projects.map(({ data }) => data.title.length));
  const statusWidth = Math.max(...projects.map(({ data }) => statusLabel[data.status].length));

  return {
    stylesheet: STYLESHEET,
    sources: ruleSources(),
    accentLine: lines.findIndex((line) => line.trim().startsWith('--accent:')) + 1,
    commands: {
      about: {
        kind: 'ret',
        text: `"${profile.fullName} — ${profile.role.toLowerCase()}. ${profile.bio.join(' ')}"`,
      },
      experience: {
        kind: 'out',
        text: experience
          .map(({ data }) => `${data.label.padEnd(12)} ${[data.title, data.detail, data.years].filter(Boolean).join(' · ')}`)
          .join('\n'),
      },
      stack: { kind: 'ret', text: `[${stack.map(quote).join(', ')}]` },
      projects: {
        kind: 'out',
        text: projects
          .map(({ data }) =>
            [data.title.padEnd(titleWidth), statusLabel[data.status].padEnd(statusWidth), data.tags.join(' · ')].join('   '),
          )
          .join('\n'),
      },
      lenses: {
        kind: 'out',
        text: lenses
          .map(({ id, href, ready }) => {
            const note = id === 'web' ? '   ← you are here' : ready ? '' : '   (soon)';
            return `${id.padEnd(10)}  →  ${href}${note}`;
          })
          .join('\n'),
      },
      contact: {
        kind: 'ret',
        text: quote([profile.email, ...profile.links.map(({ url }) => bare(url))].join('  ·  ')),
      },
    },
  };
}
