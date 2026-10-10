import { getCollection } from 'astro:content';
import { buildChain } from '../../lib/chain.js';
import { getLensProjects } from '../../lib/content';

/** `0x1a2b3c…9f0e` */
export const short = (hash: string) => `0x${hash.slice(0, 6)}…${hash.slice(-4)}`;

/**
 * The ledger: every dated event that belongs to a project in this lens, plus one-off
 * contributions to projects that have no entry of their own, chained oldest first.
 */
export async function getLedger() {
  const { all } = await getLensProjects('blockchain');
  const projects = new Map(all.map((project) => [project.data.slug, project]));

  const entries = (await getCollection('txs'))
    .flatMap(({ id, data }) => {
      const project = data.to ? projects.get(data.to) : undefined;
      if (!project && !data.ext) return [];
      const own = project && project.data.status !== 'contributor';
      return {
        // What the hash commits to.
        slug: id,
        date: data.date.slice(0, 7),
        title: project?.data.title ?? data.ext ?? '',
        // What the page shows beside it.
        kind: own ? 'project' : 'contribution',
        day: data.date,
        note: data.note,
        url: data.url,
        project: project?.data.slug,
      };
    })
    .sort((a, b) => a.day.localeCompare(b.day) || a.slug.localeCompare(b.slug));

  return buildChain(entries);
}

export type Block = Awaited<ReturnType<typeof getLedger>>[number];
