// Geometry of the Roentgen Matters mark.
//
// The logo is a regular tetrahedron inscribed in a cube, viewed along the
// cube's body diagonal: the cube's silhouette becomes the hexagon, and the
// tetrahedron becomes the inner triangle with its "Y".
import * as quat from './quaternion.js';

/** Tetrahedron: four alternating vertices of the cube [-1, 1]^3. */
export const TETRA_VERTICES = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];

export const TETRA_EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

/**
 * Faces indexed by the vertex they are opposite to. Because the solid is
 * centred on the origin, the outward normal of face k is -V_k.
 */
export const TETRA_FACES = TETRA_VERTICES.map((opposite, k) => ({
  vertices: [0, 1, 2, 3].filter((i) => i !== k),
  normal: opposite.map((c) => -c / Math.sqrt(3)),
}));

export const CUBE_VERTICES = [];
for (const x of [-1, 1])
  for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE_VERTICES.push([x, y, z]);

/** Cube edges, each with the outward normals of its two adjacent faces. */
export const CUBE_EDGES = [];
for (let a = 0; a < CUBE_VERTICES.length; a++) {
  for (let b = a + 1; b < CUBE_VERTICES.length; b++) {
    const changing = [0, 1, 2].filter((axis) => CUBE_VERTICES[a][axis] !== CUBE_VERTICES[b][axis]);
    if (changing.length !== 1) continue;
    const faceNormals = [0, 1, 2]
      .filter((axis) => axis !== changing[0])
      .map((axis) => {
        const n = [0, 0, 0];
        n[axis] = CUBE_VERTICES[a][axis];
        return n;
      });
    CUBE_EDGES.push({ a, b, faceNormals });
  }
}

/**
 * Orientation that reproduces the logo exactly: body diagonal (1,1,1) toward
 * the viewer, vertex (1,-1,-1) at the top. Rows are the view-space axes.
 */
export const LOGO_ORIENTATION = quat.fromRotationRows([
  [0, -1 / Math.SQRT2, 1 / Math.SQRT2],
  [2 / Math.sqrt(6), -1 / Math.sqrt(6), -1 / Math.sqrt(6)],
  [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)],
]);

/**
 * The 12 rotations that map the cube + tetrahedron onto itself. Composing any
 * of them with LOGO_ORIENTATION gives the identical picture, so the animation
 * can settle into whichever is closest.
 */
const SYMMETRIES = [
  quat.IDENTITY,
  ...[
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ].map((axis) => quat.fromAxisAngle(axis, Math.PI)),
  ...TETRA_VERTICES.flatMap((v) => [
    quat.fromAxisAngle(v, (2 * Math.PI) / 3),
    quat.fromAxisAngle(v, (4 * Math.PI) / 3),
  ]),
];

const LOGO_ORIENTATIONS = SYMMETRIES.map((s) => quat.normalize(quat.multiply(LOGO_ORIENTATION, s)));

export function nearestLogoOrientation(q) {
  let best = LOGO_ORIENTATIONS[0];
  let bestDot = -1;
  for (const candidate of LOGO_ORIENTATIONS) {
    const d = Math.abs(quat.dot(q, candidate));
    if (d > bestDot) [best, bestDot] = [candidate, d];
  }
  return best;
}

/** Uniform random point inside the tetrahedron, pulled slightly inward. */
export function randomPointInTetra(inset = 0.85) {
  const weights = TETRA_VERTICES.map(() => -Math.log(Math.random() || 1e-6));
  const total = weights.reduce((sum, w) => sum + w, 0);
  return [0, 1, 2].map(
    (axis) => (inset * weights.reduce((sum, w, i) => sum + w * TETRA_VERTICES[i][axis], 0)) / total,
  );
}
