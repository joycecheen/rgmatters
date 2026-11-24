// Minimal unit-quaternion helpers. Quaternions are [w, x, y, z] arrays.

export const IDENTITY = Object.freeze([1, 0, 0, 0]);

export function multiply(a, b) {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}

export function normalize(q) {
  const length = Math.hypot(...q) || 1;
  return q.map((c) => c / length);
}

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/** Rotation of `angle` radians about `axis` (any length). */
export function fromAxisAngle(axis, angle) {
  const s = Math.sin(angle / 2) / (Math.hypot(...axis) || 1);
  return [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s];
}

/** Quaternion for a rotation matrix given as three row vectors. */
export function fromRotationRows([[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]]) {
  const trace = m00 + m11 + m22;
  let q;
  if (trace > 0) {
    const s = Math.sqrt(trace + 1) * 2;
    q = [0.25 * s, (m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s];
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    q = [(m21 - m12) / s, 0.25 * s, (m01 + m10) / s, (m02 + m20) / s];
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    q = [(m02 - m20) / s, (m01 + m10) / s, 0.25 * s, (m12 + m21) / s];
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    q = [(m10 - m01) / s, (m02 + m20) / s, (m12 + m21) / s, 0.25 * s];
  }
  return normalize(q);
}

/** Spherical interpolation along the shortest arc. */
export function slerp(a, b, t) {
  let d = dot(a, b);
  if (d < 0) {
    b = b.map((c) => -c);
    d = -d;
  }
  if (d > 0.9995) return normalize(a.map((c, i) => c + (b[i] - c) * t));
  const theta = Math.acos(d);
  const sin = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sin;
  const wb = Math.sin(t * theta) / sin;
  return a.map((c, i) => c * wa + b[i] * wb);
}

/** Rotate vector `v` ([x, y, z]) by quaternion `q`. */
export function rotate(q, v) {
  const [w, x, y, z] = q;
  const ix = w * v[0] + y * v[2] - z * v[1];
  const iy = w * v[1] + z * v[0] - x * v[2];
  const iz = w * v[2] + x * v[1] - y * v[0];
  const iw = -x * v[0] - y * v[1] - z * v[2];
  return [
    ix * w - iw * x - iy * z + iz * y,
    iy * w - iw * y - iz * x + ix * z,
    iz * w - iw * z - ix * y + iy * x,
  ];
}
