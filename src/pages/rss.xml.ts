import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

import { site } from '../config/site.ts';

export async function GET(context: APIContext) {
  const now = new Date();
  const entries = (await getCollection('monsters', ({ data }) => data.status === 'published'))
    .filter((e) => !e.data.publishDate || e.data.publishDate <= now)
    .sort((a, b) => parseInt(a.data.number, 10) - parseInt(b.data.number, 10));

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      link: `/${e.id}/`,
      pubDate: e.data.publishDate,
      categories: [e.data.entryClass, e.data.region, ...e.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
