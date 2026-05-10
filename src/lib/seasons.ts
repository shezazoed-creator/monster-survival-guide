/**
 * Helpers for grouping monster entries by season. Seasons are an integer
 * stored on the entry's frontmatter (`season: 1` by default). Adding a new
 * season is a content-only change: write entries with `season: 2` and the
 * routes / menus pick them up.
 */
import type { CollectionEntry } from 'astro:content';

export const ROMAN: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
};
export const ROMAN_WORD: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
};

export function seasonRoman(n: number): string {
  return ROMAN[n] ?? String(n);
}
export function seasonWord(n: number): string {
  return ROMAN_WORD[n] ?? String(n);
}

export function groupBySeason(
  entries: CollectionEntry<'monsters'>[],
): { season: number; entries: CollectionEntry<'monsters'>[] }[] {
  const map = new Map<number, CollectionEntry<'monsters'>[]>();
  for (const entry of entries) {
    const list = map.get(entry.data.season) ?? [];
    list.push(entry);
    map.set(entry.data.season, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([season, list]) => ({
      season,
      entries: list.sort((a, b) => parseInt(a.data.number, 10) - parseInt(b.data.number, 10)),
    }));
}
