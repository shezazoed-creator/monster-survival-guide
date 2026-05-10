import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { site } from '../config/site.ts';
import { loadMonsterEntries, type MonsterEntry } from '../lib/monsters.ts';

// Auto-discover every monster page that exports a typed `entry`. Same source
// as /entries — the menu and the RSS feed never drift.
const modules = import.meta.glob<{ entry?: MonsterEntry }>('./*.astro', { eager: true });
const entries = loadMonsterEntries(modules);

export async function GET(context: APIContext) {
  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: entries.map((e) => ({
      title: e.title,
      description: e.description,
      link: e.url,
      categories: [e.entryClass, e.region, ...e.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
