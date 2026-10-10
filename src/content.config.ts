import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lens = z.enum(['web', 'chain', 'games']);

const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    fullName: z.string(),
    role: z.string(),
    location: z.string(),
    timeZone: z.string(),
    // The one line that changes per lens (AGENTS.md §5.3).
    intro: z.partialRecord(lens, z.string()),
    email: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      role: z.string(),
      status: z.enum(['contributor', 'shipped', 'in-progress']),
      lenses: z.array(lens),
      featured_in: z.array(lens).default([]),
      order: z.partialRecord(lens, z.number()),
      stack: z.array(z.string()),
      links: z.object({ live: z.string().default(''), repo: z.string().default('') }),
      cover: image().optional(),
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    label: z.string(),
    title: z.string(),
    detail: z.string(),
    order: z.number(),
  }),
});

export const collections = { profile, projects, experience };
