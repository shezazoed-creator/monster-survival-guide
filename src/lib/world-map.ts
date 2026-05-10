/**
 * Build-time world-map projection. Used by MonsterMap.astro.
 *
 * We use d3-geo's equirectangular projection so latitude/longitude pairs
 * land at predictable {x, y} positions in the SVG, and topojson-client to
 * decode the world-atlas land feature into one path string.
 */
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
// world-atlas ships TopoJSON; the type isn't exported, so cast loosely.
import landTopo from 'world-atlas/land-110m.json' with { type: 'json' };

const WIDTH = 1000;
const HEIGHT = 500;

const land = feature(
  landTopo as unknown as Parameters<typeof feature>[0],
  (landTopo as unknown as { objects: { land: unknown } }).objects.land as never,
);
const projection = geoEquirectangular().fitSize([WIDTH, HEIGHT], land as never);
const pathBuilder = geoPath(projection);

/** SVG `d` attribute for the world land mass. */
export const WORLD_LAND_PATH: string = pathBuilder(land as never) ?? '';
export const WORLD_VIEWBOX = `0 0 ${WIDTH} ${HEIGHT}`;
export const WORLD_WIDTH = WIDTH;
export const WORLD_HEIGHT = HEIGHT;

/**
 * Project a (lat, lon) pair to {x, y} pixels in the world SVG. Returns null
 * if the projection rejects the input (nowhere in our viewport).
 */
export function projectLatLon(lat: number, lon: number): { x: number; y: number } | null {
  const out = projection([lon, lat]);
  if (!out) return null;
  return { x: out[0], y: out[1] };
}
