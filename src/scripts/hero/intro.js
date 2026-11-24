// Load-in choreography for the hero logo, like a technical drawing being drafted.
//
// While the object rotates into the exact logo view, the hexagon (the cube's
// silhouette) draws on clockwise from the top, the "Y" grows out from the
// centre, the triangle closes, and finally the faces fill in.
import * as quat from './quaternion.js';
import {
  CUBE_EDGES,
  CUBE_VERTICES,
  LOGO_ORIENTATION,
  TETRA_EDGES,
  TETRA_VERTICES,
} from './geometry.js';

/** Seconds. The delay lets the headline start first. */
export const INTRO = { delay: 0.15, duration: 1.9 };

/** Start pose: turned away from the logo view, so it rotates into place while drawing. */
export const INTRO_FROM = quat.normalize(
  quat.multiply(quat.fromAxisAngle([0.35, 1, 0.12], -1.2), LOGO_ORIENTATION),
);

const TAU = 2 * Math.PI;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const easeOutCubic = (t) => 1 - (1 - t) ** 3;
export const easeOutQuart = (t) => 1 - (1 - t) ** 4;
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/** Clockwise angle from 12 o'clock of a vertex, as seen in the logo view. */
function clockAngle(v) {
  const [x, y] = quat.rotate(LOGO_ORIENTATION, v);
  return (Math.atan2(x, y) + TAU) % TAU;
}

/** Sort edges around the clock and orient each one to draw clockwise. */
function clockwise(edges, vertices) {
  return edges
    .map(({ index, a, b }) => {
      const mid = vertices[a].map((c, i) => (c + vertices[b][i]) / 2);
      const forward = (clockAngle(vertices[b]) - clockAngle(vertices[a]) + TAU) % TAU < Math.PI;
      return { index, angle: clockAngle(mid), from: forward ? 'a' : 'b' };
    })
    .sort((p, q) => p.angle - q.angle);
}

/**
 * When each edge appears, as fractions of the intro. "draw" edges are stroked
 * on from one end; "fade" edges (the faint inner and hidden lines) fade in.
 */
export function buildSchedule() {
  const inLogoView = (n) => quat.rotate(LOGO_ORIENTATION, n)[2] > 0;

  const cube = [];
  const silhouette = [];
  CUBE_EDGES.forEach(({ a, b, faceNormals }, index) => {
    const [fa, fb] = faceNormals.map(inLogoView);
    if (fa !== fb) silhouette.push({ index, a, b });
    else cube[index] = { start: 0.5, length: 0.35, mode: 'fade' };
  });
  clockwise(silhouette, CUBE_VERTICES).forEach(({ index, from }, k) => {
    cube[index] = { start: 0.02 + k * 0.075, length: 0.17, from, mode: 'draw' };
  });

  const tetra = [];
  const triangle = [];
  TETRA_EDGES.forEach(([a, b], index) => {
    // Edges from vertex 0 (the centre of the logo) form the "Y": draw outward.
    if (a === 0) tetra[index] = { start: 0.34, length: 0.24, from: 'a', mode: 'draw' };
    else triangle.push({ index, a, b });
  });
  clockwise(triangle, TETRA_VERTICES).forEach(({ index, from }, k) => {
    tetra[index] = { start: 0.5 + k * 0.07, length: 0.2, from, mode: 'draw' };
  });

  return { cube, tetra };
}

/**
 * The visible part of an edge at intro progress `t`:
 * [start point, end point, alpha multiplier], or null while not yet shown.
 */
export function revealSegment(entry, t, a, b) {
  if (t >= 1) return [a, b, 1];
  const e = clamp01((t - entry.start) / entry.length);
  if (e <= 0) return null;
  const k = easeOutCubic(e);
  if (entry.mode === 'fade') return [a, b, k];
  const [p0, p1] = entry.from === 'a' ? [a, b] : [b, a];
  return [p0, [p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k], 1];
}
