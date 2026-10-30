import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
// The whole site renders from this one file.
import type portfolioData from '../data/portfolio.js';

type Portfolio = typeof portfolioData;

/** Imports data/portfolio.js afresh: a new URL each time, so Node's module cache can't hand back the old copy. */
async function readPortfolio(path: string): Promise<Portfolio> {
  return (await import(/* @vite-ignore */ `${pathToFileURL(path).href}?t=${Date.now()}`)).default;
}

/** Fills a collection from part of data/portfolio.js and, in `astro dev`, refills it whenever that file
    is saved, so edits show without restarting the server. */
function fromPortfolio(entries: (portfolio: Portfolio) => { id: string }[]): Loader {
  return {
    name: 'portfolio',
    load: async ({ config, store, parseData, watcher, logger }) => {
      const path = fileURLToPath(new URL('data/portfolio.js', config.root));
      const sync = async () => {
        const items = entries(await readPortfolio(path));
        store.clear();
        for (const item of items) store.set({ id: item.id, data: await parseData({ id: item.id, data: item }) });
      };
      await sync();
      watcher?.on('change', async (changed) => {
        if (changed !== path) return;
        try {
          await sync();
          logger.info('reloaded data/portfolio.js');
        } catch (error) {
          // A half-finished edit: keep what was loaded and wait for the next save.
          logger.error(`data/portfolio.js: ${(error as Error).message}`);
        }
      });
    },
  };
}

const lens = z.enum(['home', 'web', 'games', 'blockchain']);

const profile = defineCollection({
  loader: fromPortfolio(({ profile }) => [{ id: 'profile', ...profile }]),
  schema: z.object({
    name: z.string(),
    fullName: z.string(),
    role: z.string(),
    timeZone: z.string(),
    focus: z.string(),
    /** One paragraph per entry. */
    bio: z.array(z.string()),
    // The one line that changes per lens (AGENTS.md §5.3).
    intro: z.partialRecord(lens, z.string()),
    // Each lens home page's search and social description.
    meta: z.record(lens, z.string()),
    email: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
});

const projects = defineCollection({
  loader: fromPortfolio(({ projects }) => projects.map((project) => ({ id: project.slug, ...project }))),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    role: z.string(),
    status: z.enum(['contributor', 'shipped', 'in-progress']),
    lenses: z.array(lens),
    featured_in: z.array(lens).default([]),
    order: z.partialRecord(lens, z.number()),
    // Drives the project filters.
    tags: z.array(z.enum(['web', 'onchain', 'games', 'open-source'])).default([]),
    stack: z.array(z.string()),
    links: z.object({ live: z.string().default(''), repo: z.string().default('') }),
    years: z.string().default('[years]'),
    /** Image path from the repo root, e.g. `img/web-dev/dashboard.png`. */
    cover: z.string().optional(),
    /** More images for the project page, after the cover. `alt` says what each one shows. */
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    kind: z.enum(['game', 'dapp', 'contract', 'web', 'tool', 'research']).optional(),
    net: z.enum(['mainnet', 'testnet']).optional(),
    /** `owner/repo` of the project this contributes to or forks. */
    upstream: z.string().optional(),
    facts: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    onchain: z.object({ network: z.string(), address: z.string(), url: z.string() }).optional(),
    /** Real lines from the project's repo, shown as its code figure; `url` is the permalink they were copied from. */
    excerpt: z
      .object({ file: z.string(), lang: z.string(), caption: z.string(), url: z.string(), code: z.string() })
      .optional(),
  }),
});

const experience = defineCollection({
  loader: fromPortfolio(({ experience }) => experience),
  schema: z.object({
    label: z.string(),
    title: z.string(),
    detail: z.string(),
    years: z.string().optional(),
    order: z.number(),
  }),
});

// Dated events (a submission, a deployment, a merged contribution). The blockchain lens chains them into its ledger.
const txs = defineCollection({
  loader: fromPortfolio(({ txs }) => txs),
  schema: z.object({
    /** `YYYY-MM-DD` */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    src: z.enum(['push', 'commit']),
    method: z.string(),
    /** Slug of the project it happened to. */
    to: z.string().optional(),
    /** `owner/repo`, for a one-off contribution to a project that has no entry of its own. */
    ext: z.string().optional(),
    status: z.enum(['pending']).optional(),
    note: z.string(),
    url: z.string(),
  }),
});

export const collections = { profile, projects, experience, txs };
