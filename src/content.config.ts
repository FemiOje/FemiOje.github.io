import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
// The whole site renders from this one file.
import portfolio from '../data/portfolio.js';

const lens = z.enum(['classic', 'web', 'games', 'blockchain']);

const profile = defineCollection({
  loader: () => [{ id: 'profile', ...portfolio.profile }],
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
    email: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
});

const projects = defineCollection({
  loader: () => portfolio.projects.map((project) => ({ id: project.slug, ...project })),
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
  loader: () => portfolio.experience,
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
  loader: () => portfolio.txs,
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
