import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Each monster entry lives in src/content/monsters/<slug>.mdx
 *
 * Frontmatter is validated by Zod at build time. The MDX body holds the
 * page content (sections, encounter cards, six rules, outro).
 */
const monsters = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/monsters' }),
  schema: z.object({
    /** Two-digit string used for ordering and display ("01", "02", …). */
    number: z.string(),
    /** Short class label shown above the title (e.g., "Ancient Threat"). */
    entryClass: z.string(),
    /** Geographic / contextual region label. */
    region: z.string(),
    /** Display name. */
    title: z.string(),
    /** One-sentence hook used on the index card and as meta description. */
    description: z.string(),
    /** Short tags shown on the index card; also drives related-entries. */
    tags: z.array(z.string()),
    /** Danger Index 1-10. */
    danger: z.number().int().min(1).max(10),
    /** Hex colour used for the colored band on the index card. */
    bandColor: z.string(),

    /** Top-bar classification text. */
    classification: z.string(),
    /** Optional bottom-bar text. Defaults to the classification text. */
    bottomBar: z.string().optional(),
    /** Status badge text in the sign-off block. */
    entryStatus: z.string().default('Active Entry'),

    /** "draft" entries are excluded from the build. Default "draft" so
     *  newly authored entries don't accidentally publish. */
    status: z.enum(['draft', 'published']).default('draft'),
    /** ISO date string. Entries with a future publishDate are excluded
     *  from the build. */
    publishDate: z.coerce.date().optional(),
    /** Last-modified ISO date for JSON-LD dateModified. */
    dateModified: z.coerce.date().optional(),
  }),
});

export const collections = { monsters };
