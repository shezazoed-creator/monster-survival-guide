import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Each monster entry lives in src/content/monsters/<slug>.mdx.
 * Frontmatter is validated by Zod at build time; the MDX body holds the
 * sections, encounter cards, six rules, and outro.
 */
const monsters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/monsters' }),
  schema: z.object({
    number: z.string(),
    entryClass: z.string(),
    region: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    danger: z.number().int().min(1).max(10),
    bandColor: z.string(),

    classification: z.string(),
    bottomBar: z.string().optional(),
    entryStatus: z.string().default('Active Entry'),

    status: z.enum(['draft', 'published']).default('draft'),
    publishDate: z.coerce.date().optional(),
    dateModified: z.coerce.date().optional(),

    /** Season number. Used to group entries on /entries and /seasons/<n>. */
    season: z.number().int().min(1).default(1),

    /**
     * Optional pin coordinates for the /sightings map. Coordinates are in the
     * stylized 1000×600 SVG space — see src/data/map.ts for the projection.
     * Entries without coords (no clear single location) just don't appear on
     * the map.
     */
    coords: z
      .object({
        x: z.number(),
        y: z.number(),
        /** Optional short label shown next to the pin. Defaults to title. */
        label: z.string().optional(),
      })
      .optional(),
  }),
});

/**
 * Glossary terms — each lives at src/content/glossary/<slug>.mdx.
 * Linked from monster entries so recurring terminology gets one canonical
 * definition (and one indexable URL each).
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    /** Optional aliases / alternate spellings. */
    aliases: z.array(z.string()).default([]),
    /** One-line summary — used in tooltips and the index page. */
    summary: z.string(),
    /** Tags help cluster related terms (e.g., 'folklore', 'medical'). */
    tags: z.array(z.string()).default([]),
    /** Sort key — defaults to lower-cased term. */
    sortKey: z.string().optional(),
  }),
});

export const collections = { monsters, glossary };
