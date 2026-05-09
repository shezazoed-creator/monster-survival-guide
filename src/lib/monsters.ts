/**
 * Type definition for the `entry` object that every monster page exports.
 * Used by entries.astro to build the index, and by each monster page to
 * type-check its own export.
 */
export interface MonsterEntry {
  /** Two-digit string, used for ordering and display. */
  number: string;
  /** Short class label shown above the title (e.g., "Ancient Threat"). */
  entryClass: string;
  /** Geographic or contextual region label. */
  region: string;
  /** Display name. */
  title: string;
  /** One-sentence hook shown on the index card. */
  description: string;
  /** Short tags shown on the index card. */
  tags: readonly string[];
  /** Danger Index 1-10. */
  danger: number;
  /** Hex color used for the colored band on the index card. */
  bandColor: string;
  /** Absolute URL path to the page (e.g., "/wendigo"). */
  url: string;
}

/**
 * Loads every `.astro` page in src/pages that exports an `entry` object,
 * returning them sorted by `number`. Run at build time via import.meta.glob.
 */
export function loadMonsterEntries(
  modules: Record<string, { entry?: MonsterEntry }>,
): MonsterEntry[] {
  return Object.values(modules)
    .map((m) => m.entry)
    .filter((e): e is MonsterEntry => !!e && typeof e === 'object' && !!e.title && !!e.url)
    .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
}
