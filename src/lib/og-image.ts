/**
 * Per-entry OG image generation.
 *
 * Satori takes a JSX-like tree and produces SVG; resvg rasterises to PNG. The
 * fonts satori needs (TTF / OTF) aren't shipped by @fontsource — those packages
 * only have woff2 — so we fetch the two we need from Google Fonts on first
 * call and cache the bytes in module scope. The cache survives the entire
 * build, so we only download once per `npm run build`.
 *
 * If the fetch fails (offline build, network restrictions), the loader returns
 * `null`, and the OG endpoint falls back to redirecting to the static default.
 */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const FONT_URLS = {
  rajdhani700: 'https://github.com/google/fonts/raw/main/ofl/rajdhani/Rajdhani-Bold.ttf',
  sortsMillGoudyItalic:
    'https://github.com/google/fonts/raw/main/ofl/sortsmillgoudy/SortsMillGoudy-Italic.ttf',
} as const;

let fontCache: { rajdhani: ArrayBuffer; sortsMill: ArrayBuffer } | null = null;
let fontFetchAttempted = false;

async function loadFonts(): Promise<typeof fontCache> {
  if (fontCache) return fontCache;
  if (fontFetchAttempted) return null;
  fontFetchAttempted = true;
  try {
    const [r1, r2] = await Promise.all([
      fetch(FONT_URLS.rajdhani700),
      fetch(FONT_URLS.sortsMillGoudyItalic),
    ]);
    if (!r1.ok || !r2.ok) return null;
    fontCache = {
      rajdhani: await r1.arrayBuffer(),
      sortsMill: await r2.arrayBuffer(),
    };
    return fontCache;
  } catch {
    return null;
  }
}

export interface OgInput {
  title: string;
  description: string;
  number: string;
  entryClass: string;
  region: string;
  danger: number;
  bandColor: string;
}

const W = 1200;
const H = 630;

function card(input: OgInput): Record<string, unknown> {
  const bars = Array.from({ length: 10 }, (_, i) => i < input.danger);
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`,
        height: `${H}px`,
        background: '#f0ead8',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Rajdhani, sans-serif',
        position: 'relative',
        padding: '0',
      },
      children: [
        // Top classification bar
        {
          type: 'div',
          props: {
            style: {
              background: '#111108',
              color: '#f0ead8',
              padding: '14px 0',
              textAlign: 'center',
              fontSize: '20px',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              fontFamily: 'Rajdhani, sans-serif',
              display: 'flex',
              justifyContent: 'center',
            },
            children: `◆   monster survival guide   —   entry ${input.number}   ◆`,
          },
        },
        // Body
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              padding: '52px 80px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              borderLeft: `8px solid ${input.bandColor}`,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '20px',
                    letterSpacing: '5px',
                    color: '#6a5a3a',
                    textTransform: 'uppercase',
                    display: 'flex',
                  },
                  children: `${input.entryClass} · ${input.region}`,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 700,
                    fontSize: '110px',
                    color: '#1a1610',
                    lineHeight: 1,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    display: 'flex',
                  },
                  children: input.title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Sorts Mill Goudy, serif',
                    fontStyle: 'italic',
                    fontSize: '28px',
                    color: '#4a4030',
                    lineHeight: 1.4,
                    display: 'flex',
                  },
                  children: input.description,
                },
              },
              // Spacer
              { type: 'div', props: { style: { flex: 1 }, children: '' } },
              // Danger meter row
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '18px',
                          letterSpacing: '5px',
                          color: '#6a5a3a',
                          textTransform: 'uppercase',
                          fontFamily: 'Rajdhani, sans-serif',
                          display: 'flex',
                        },
                        children: `Danger ${input.danger}/10`,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          gap: '6px',
                          flex: 1,
                        },
                        children: bars.map((filled) => ({
                          type: 'div',
                          props: {
                            style: {
                              flex: 1,
                              height: '24px',
                              background: filled ? '#8b1a0a' : '#dcd2bc',
                              border: filled ? '1px solid #8b1a0a' : '1px solid rgba(26,22,16,0.2)',
                            },
                            children: '',
                          },
                        })),
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Bottom bar
        {
          type: 'div',
          props: {
            style: {
              background: '#111108',
              color: '#f0ead8',
              padding: '12px 0',
              textAlign: 'center',
              fontSize: '16px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontFamily: 'Rajdhani, sans-serif',
              display: 'flex',
              justifyContent: 'center',
            },
            children: '◆   field manual series   ·   season one   ◆',
          },
        },
      ],
    },
  };
}

export async function renderOgPng(input: OgInput): Promise<Buffer | null> {
  const fonts = await loadFonts();
  if (!fonts) return null;
  const svg = await satori(card(input) as never, {
    width: W,
    height: H,
    fonts: [
      { name: 'Rajdhani', data: fonts.rajdhani, weight: 700, style: 'normal' },
      { name: 'Sorts Mill Goudy', data: fonts.sortsMill, weight: 400, style: 'italic' },
    ],
  });
  const png = new Resvg(svg).render().asPng();
  return Buffer.from(png);
}
