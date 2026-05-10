/**
 * Extract `references={[ ... ]}` arrays from a raw MDX body — the same source
 * the encounter cards render from. Keeps the MDX body as the single source of
 * truth; the bibliography page derives its data from this.
 */
export interface Reference {
  text: string;
  label?: string;
  href?: string;
}

const BLOCK_RE = /references=\{(\[[\s\S]*?\])\}/g;
// Capture text + optional label + optional href, in any order, from a single
// object literal like `{ text: '...', href: '...', label: '...' }`.
const ITEM_RE = /\{\s*([\s\S]*?)\s*\},?/g;
const FIELD_RE = (field: string) => new RegExp(`${field}:\\s*'((?:[^'\\\\]|\\\\.|'')*)'`);

function unquote(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return value.replace(/''/g, "'").replace(/\\'/g, "'");
}

export function extractReferences(body: string): Reference[] {
  const refs: Reference[] = [];
  for (const blockMatch of body.matchAll(BLOCK_RE)) {
    const inner = blockMatch[1];
    for (const itemMatch of inner.matchAll(ITEM_RE)) {
      const item = itemMatch[1];
      const text = unquote(item.match(FIELD_RE('text'))?.[1]);
      if (!text) continue;
      const label = unquote(item.match(FIELD_RE('label'))?.[1]);
      const href = unquote(item.match(FIELD_RE('href'))?.[1]);
      refs.push({ text, label, href });
    }
  }
  return refs;
}
