import { getCollection, type CollectionEntry } from 'astro:content';
import { renderOgPng } from '../../lib/og-image.ts';

export async function getStaticPaths() {
  const now = new Date();
  const monsters = await getCollection('monsters', ({ data }) => {
    if (data.status !== 'published') return false;
    if (data.publishDate && data.publishDate > now) return false;
    return true;
  });
  return monsters.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'monsters'>;
}

export async function GET({ props }: { props: Props }): Promise<Response> {
  const { entry } = props;
  const png = await renderOgPng({
    title: entry.data.title,
    description: entry.data.description,
    number: entry.data.number,
    entryClass: entry.data.entryClass,
    region: entry.data.region,
    danger: entry.data.danger,
    bandColor: entry.data.bandColor,
  });
  if (!png) {
    // Font fetch failed (offline build?). Fall back to the default OG image.
    return new Response(null, {
      status: 302,
      headers: { Location: '/og-default.png' },
    });
  }
  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
