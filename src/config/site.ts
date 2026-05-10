/**
 * Single source of truth for site-wide values.
 * Update the URLs here once and they propagate to layout, sitemap,
 * RSS, social cards, and footer.
 */
export const site = {
  name: 'Monster Survival Guide',
  shortName: 'Field Manual',
  signature: 'Zazu',
  tagline: 'Identification · Survival · Documented Accounts',
  description:
    'A field manual for the things that should not exist — researched, verified where possible, and written so you have the information before you need it.',
  /**
   * Public production URL. Used by canonical, og:url, sitemap.
   * Replace once the site has a real domain.
   */
  url: 'https://monster-survival-guide.pages.dev',
  defaultOgImage: '/og-default.png',
  season: 'Season One',
} as const;

/**
 * Social links shown in the footer. Set a real URL to render the icon;
 * leave a value as `null` (or empty) to hide that icon entirely.
 * No more `href="#"` placeholder links.
 */
export const social: Record<'youtube' | 'facebook' | 'instagram' | 'x' | 'tiktok', string | null> =
  {
    youtube: 'https://www.youtube.com/@ZazuDoes',
    facebook: null,
    instagram: null,
    x: 'https://x.com/zazudoes',
    tiktok: 'https://www.tiktok.com/@zazudoes',
  };

/**
 * Optional teaser shown at the bottom of the entries menu.
 * Set to `null` to hide the "coming soon" card entirely.
 */
export const upcoming: { label: string; title: string; description: string } | null = {
  label: 'Next Entry · Coming Soon',
  title: 'Unknown Entity',
  description: 'The next entry is being prepared. Check back soon.',
};
