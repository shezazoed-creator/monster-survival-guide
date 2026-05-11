# Monster Survival Guide

A field-manual-themed website cataloguing cryptids and folklore entities — origins,
behaviour, documented encounters, and six rules per entry. Built with [Astro](https://astro.build).

## Stack

- **Astro 6** — static site generator
- **Vanilla CSS** with `color-mix()` — no Tailwind, no frameworks
- **TypeScript** — strict mode, typed monster entries
- `@astrojs/sitemap` — automatic `sitemap-index.xml`

## Project layout

```
src/
├── components/         # Reusable Astro components (DangerMeter, Section, EncounterCard, …)
├── config/site.ts      # Site name, URL, social links, upcoming-entry teaser
├── layouts/
│   └── FieldManual.astro   # Page chrome: head, classification bars, footer, SEO meta
├── lib/monsters.ts     # MonsterEntry type + auto-discovery loader
├── pages/
│   ├── index.astro     # Home — “About this guide”
│   ├── entries.astro   # Auto-generated index of all monster pages
│   ├── 404.astro
│   └── <monster>.astro # One file per entry, exporting `entry: MonsterEntry`
└── styles/
    ├── field-manual.css       # Shared layout + components (~700 lines, used by every page)
    └── pages/<page>.css       # Per-page :root color tokens only (~15 lines each)
```

## Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Local dev server at `localhost:4321` |
| `npm run build`   | Build to `./dist/`                   |
| `npm run preview` | Preview the production build         |
| `npm run check`   | Run `astro check` (TypeScript)       |
| `npm run format`  | Format all files with Prettier       |

## Adding a new monster entry

1. Create `src/pages/<slug>.astro`. The simplest way is to copy an existing entry like
   `wendigo.astro` as a template.
2. Export a typed `entry` const at the top:

   ```ts
   import type { MonsterEntry } from '../lib/monsters.ts';

   export const entry: MonsterEntry = {
     number: '09',
     entryClass: 'Whatever Threat',
     region: 'Where It Lives',
     title: 'The Thing',
     description: 'One-sentence hook.',
     tags: ['tag one', 'tag two', 'tag three'],
     danger: 7,
     bandColor: '#6a4018',
     url: '/the-thing',
   };
   ```

3. Create `src/styles/pages/<slug>.css` with theme tokens in `:root` (paper, ink,
   warn, accent, etc. — see any existing file for the full set).
4. The `/entries` index picks up the new entry automatically via `import.meta.glob`.
   Nothing else to wire up.

## Configuration

Update `src/config/site.ts` for:

- The public production URL (used for canonical, OG, sitemap)
- Social links (set a value to render the icon, leave `null` to hide it)
- The "coming soon" teaser shown at the bottom of `/entries` (set to `null` to hide)

If you change the production URL, also update `astro.config.mjs` — actually, no:
`astro.config.mjs` reads from `src/config/site.ts`, so just the one edit.

## Comments (Cloudflare Pages Function + D1)

Each monster page renders a comment form backed by a Cloudflare Pages Function
at `functions/api/posts/[slug]/comments.ts`, storing comments in a D1 SQLite
database. No third-party widget, no GitHub login.

### One-time setup

```sh
# 1. Sign in.
npx wrangler login

# 2. Create the D1 database. Note the `database_id` it prints — you'll bind it
#    in the Cloudflare dashboard in step 4.
npx wrangler d1 create monster-survival-guide-comments

# 3. Apply the schema to the production database.
npx wrangler d1 execute monster-survival-guide-comments \
  --file=migrations/0001_init.sql --remote
```

4. In the Cloudflare dashboard → **Pages** → your project → **Settings** →
   **Bindings** → **Add D1 database**:
   - Variable name: `COMMENTS_DB`
   - D1 database: `monster-survival-guide-comments`
5. (Optional) In the same dashboard, add an environment variable
   `COMMENTS_REQUIRE_APPROVAL=1` to gate every comment behind moderation.
   Comments stay invisible until you flip `approved=1` in D1.
6. Push — the next deploy includes the Pages Function.

### Local dev

```sh
# Apply schema to your local D1.
npx wrangler d1 execute monster-survival-guide-comments \
  --file=migrations/0001_init.sql --local

# Run the static site + Pages Functions together.
npm run build && npx wrangler pages dev dist
```

### Moderation

Comments are stored in the D1 `comments` table. To list pending or remove abusive
ones:

```sh
# List all comments awaiting approval (when COMMENTS_REQUIRE_APPROVAL=1).
npx wrangler d1 execute monster-survival-guide-comments --remote \
  --command "SELECT id, post_slug, author, body FROM comments WHERE approved = 0;"

# Approve one.
npx wrangler d1 execute monster-survival-guide-comments --remote \
  --command "UPDATE comments SET approved = 1 WHERE id = 42;"

# Delete one.
npx wrangler d1 execute monster-survival-guide-comments --remote \
  --command "DELETE FROM comments WHERE id = 42;"
```

A small admin UI is the natural next step if moderation volume grows.
