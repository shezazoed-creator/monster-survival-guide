// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    mdx(),
    sitemap({
      // /drafts/* is the internal editorial preview tree — not for public
      // crawl. Also reinforced by Disallow in robots.txt and a noindex meta
      // on every draft page.
      filter: (page) => !page.includes('/drafts/'),
    }),
  ],
});
