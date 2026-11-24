// Home hero visual
// ---------------------------------------------------------------------------
// The Roentgen Matters mark is a tetrahedron inscribed in a cube, seen along the
// cube's body diagonal: the cube's silhouette becomes the hexagon and the
// tetrahedron becomes the inner triangle + "Y". This renders that geometry in
// 3D. It tumbles slowly, periodically settles into the exact logo view, and
// emits faint scintillation flashes from inside the crystal.
//
// Interaction (kept from the previous version): drag to rotate, click to pause.

const BRAND = [0, 126, 164];
const SLATE = [86, 106, 115];
const GLOW = [24, 200, 150]; // scintillation emission (green-teal)

// ---------- Geometry ----------
const TETRA = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];
const TETRA_EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];
// The face opposite vertex k has outward normal -V_k (tetra is centred at origin).
const TETRA_FACES = [
  { verts: [1, 2, 3], normal: scale(TETRA[0], -1 / Math.sqrt(3)) },
  { verts: [0, 2, 3], normal: scale(TETRA[1], -1 / Math.sqrt(3)) },
  { verts: [0, 1, 3], normal: scale(TETRA[2], -1 / Math.sqrt(3)) },
  { verts: [0, 1, 2], normal: scale(TETRA[3], -1 / Math.sqrt(3)) },
];

const CUBE = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE.push([x, y, z]);
const CUBE_EDGES = [];
for (let i = 0; i < 8; i++) {
  for (let j = i + 1; j < 8; j++) {
    const diff = [0, 1, 2].filter((a) => CUBE[i][a] !== CUBE[j][a]);
    if (diff.length !== 1) continue;
    const axis = diff[0];
    // the two faces adjacent to this edge: normals along the other two axes
    const faces = [0, 1, 2]
      .filter((a) => a !== axis)
      .map((a) => {
        const n = [0, 0, 0];
        n[a] = CUBE[i][a];
        return n;
      });
    CUBE_EDGES.push({ a: i, b: j, faces });
  }
}

// ---------- Math ----------
function scale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}
function qMul(a, b) {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}
function qAxisAngle(axis, angle) {
  const l = Math.hypot(...axis) || 1;
  const s = Math.sin(angle / 2) / l;
  return [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s];
}
function qNormalize(q) {
  const l = Math.hypot(...q) || 1;
  return q.map((c) => c / l);
}
function qDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function qSlerp(a, b, t) {
  let d = qDot(a, b);
  if (d < 0) {
    b = b.map((c) => -c);
    d = -d;
  }
  if (d > 0.9995) return qNormalize(a.map((c, i) => c + (b[i] - c) * t));
  const th = Math.acos(d);
  const s = Math.sin(th);
  const wa = Math.sin((1 - t) * th) / s;
  const wb = Math.sin(t * th) / s;
  return a.map((c, i) => c * wa + b[i] * wb);
}
function qRotate(q, v) {
  const [w, x, y, z] = q;
  const ix = w * v[0] + y * v[2] - z * v[1];
  const iy = w * v[1] + z * v[0] - x * v[2];
  const iz = w * v[2] + x * v[1] - y * v[0];
  const iw = -x * v[0] - y * v[1] - z * v[2];
  return [
    ix * w + iw * -x + iy * -z - iz * -y,
    iy * w + iw * -y + iz * -x - ix * -z,
    iz * w + iw * -z + ix * -y - iy * -x,
  ];
}
function qFromRows(r) {
  // rotation matrix (rows) -> quaternion
  const [m00, m01, m02] = r[0];
  const [m10, m11, m12] = r[1];
  const [m20, m21, m22] = r[2];
  const tr = m00 + m11 + m22;
  let q;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
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
  return qNormalize(q);
}
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Logo orientation: body diagonal (1,1,1) toward the viewer, vertex (1,-1,-1) up.
const S2 = Math.SQRT2;
const S3 = Math.sqrt(3);
const S6 = Math.sqrt(6);
const Q_LOGO = qFromRows([
  [0, -1 / S2, 1 / S2],
  [2 / S6, -1 / S6, -1 / S6],
  [1 / S3, 1 / S3, 1 / S3],
]);

// The 12 rotations that map the cube+tetrahedron onto itself. Any of them
// composed with Q_LOGO yields the identical logo view, so we settle into the
// nearest one for the shortest, calmest motion.
const SYMMETRIES = (() => {
  const g = [[1, 0, 0, 0]];
  for (const axis of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) g.push(qAxisAngle(axis, Math.PI));
  for (const v of TETRA) {
    g.push(qAxisAngle(v, (2 * Math.PI) / 3));
    g.push(qAxisAngle(v, (4 * Math.PI) / 3));
  }
  return g;
})();
const LOGO_TARGETS = SYMMETRIES.map((g) => qNormalize(qMul(Q_LOGO, g)));

function nearestLogo(q) {
  let best = LOGO_TARGETS[0];
  let bestDot = -1;
  for (const t of LOGO_TARGETS) {
    const d = Math.abs(qDot(q, t));
    if (d > bestDot) {
      bestDot = d;
      best = t;
    }
  }
  return best;
}

function randomPointInTetra() {
  // uniform barycentric sample (Dirichlet(1,1,1,1)), pulled slightly inward
  const w = [0, 0, 0, 0].map(() => -Math.log(Math.random() || 1e-6));
  const s = w.reduce((a, b) => a + b, 0);
  const p = [0, 0, 0];
  w.forEach((wi, i) => {
    p[0] += (TETRA[i][0] * wi) / s;
    p[1] += (TETRA[i][1] * wi) / s;
    p[2] += (TETRA[i][2] * wi) / s;
  });
  return scale(p, 0.85);
}

// ---------- Component ----------
export function initHeroVisual(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Timeline (seconds)
  const TUMBLE = 8.5;
  const ALIGN = 2.6;
  const HOLD = 3.2;
  const RAMP = 2.2;
  const BASE_SPIN = [0.17, 0.31, 0.05]; // rad/s in view space

  let q = Q_LOGO.slice();
  let phase = 'hold';
  let phaseT = HOLD - 1.4; // first hold is short: show the mark, then come alive
  let alignFrom = q;
  let alignTo = q;
  let spinRamp = 0;

  let paused = false;
  let visible = true;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const flashes = [];
  let inertia = [0, 0, 0];

  // ---------- Sizing ----------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const W = Math.max(1, Math.round(width * dpr));
    const H = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    draw();
  }
  new ResizeObserver(resize).observe(canvas);

  // ---------- Projection ----------
  const CAM = 9; // camera distance (mild perspective)
  function project(v) {
    const size = Math.min(width, height);
    const f = (CAM * size * 0.375) / S3;
    const k = f / (CAM - v[2]);
    return [width / 2 + v[0] * k, height / 2 - v[1] * k, v[2]];
  }

  // ---------- Drawing ----------
  function line(a, b, color, w, dash) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.setLineDash(dash || []);
    ctx.stroke();
  }

  function draw() {
    if (!width || !height) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const unit = Math.min(width, height) / 520; // stroke scale relative to design size
    const tView = TETRA.map((v) => qRotate(q, v));
    const tProj = tView.map(project);
    const cProj = CUBE.map((v) => project(qRotate(q, v)));
    const front = (z) => smoothstep(-0.06, 0.06, z);

    // Overall scintillation intensity lights up the crystal slightly
    const glow = Math.min(1, flashes.reduce((s, f) => s + f.intensity, 0));

    // ---- Cube edges: classify by adjacent face orientation ----
    const cube = CUBE_EDGES.map((e) => {
      const fa = front(qRotate(q, e.faces[0])[2]);
      const fb = front(qRotate(q, e.faces[1])[2]);
      return {
        a: cProj[e.a],
        b: cProj[e.b],
        sil: fa * (1 - fb) + fb * (1 - fa),
        front: fa * fb,
        back: (1 - fa) * (1 - fb),
      };
    });

    // 1. hidden cube edges (dashed, technical-drawing convention)
    for (const e of cube) {
      if (e.back > 0.02) line(e.a, e.b, rgba(SLATE, 0.3 * e.back), 1 * unit, [2 * unit, 5 * unit]);
    }

    // ---- Tetra faces ----
    const light = [-0.45, 0.62, 0.64];
    const faces = TETRA_FACES.map((f) => {
      const n = qRotate(q, f.normal);
      const lambert = Math.max(0, n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);
      return { pts: f.verts.map((i) => tProj[i]), facing: front(n[2]), lambert };
    });

    const fillFace = (f, alpha) => {
      ctx.beginPath();
      ctx.moveTo(f.pts[0][0], f.pts[0][1]);
      ctx.lineTo(f.pts[1][0], f.pts[1][1]);
      ctx.lineTo(f.pts[2][0], f.pts[2][1]);
      ctx.closePath();
      ctx.fillStyle = rgba(BRAND, alpha);
      ctx.fill();
      if (glow > 0.01) {
        ctx.fillStyle = rgba(GLOW, glow * 0.06);
        ctx.fill();
      }
    };

    // 2. back faces
    for (const f of faces) if (f.facing < 0.99) fillFace(f, 0.035 * (1 - f.facing));

    // ---- Tetra edges ----
    // Edge (i,j) borders the faces opposite the two other vertices.
    const tetraEdge = ([i, j]) => {
      const others = [0, 1, 2, 3].filter((k) => k !== i && k !== j);
      const fa = faces[others[0]].facing;
      const fb = faces[others[1]].facing;
      const vis = 1 - (1 - fa) * (1 - fb); // visible if either face is front-facing
      return { a: tProj[i], b: tProj[j], vis };
    };
    const tEdges = TETRA_EDGES.map(tetraEdge);

    // 3. hidden tetra edges (seen through the translucent crystal)
    for (const e of tEdges) {
      if (e.vis < 0.98) line(e.a, e.b, rgba(BRAND, 0.55 * (1 - e.vis)), 1.6 * unit);
    }

    // 4. scintillation flashes (inside the crystal)
    for (const fl of flashes) {
      const p = project(qRotate(q, fl.pos));
      const a = fl.intensity;
      const r = (16 + 10 * fl.age) * unit;
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
      g.addColorStop(0, rgba(GLOW, 0.6 * a));
      g.addColorStop(0.35, rgba(GLOW, 0.2 * a));
      g.addColorStop(1, rgba(GLOW, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba([210, 255, 236], Math.min(1, 1.2 * a));
      ctx.beginPath();
      ctx.arc(p[0], p[1], 1.6 * unit, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. front faces
    for (const f of faces) if (f.facing > 0.01) fillFace(f, f.facing * (0.045 + 0.13 * f.lambert));

    // 6. visible tetra edges
    for (const e of tEdges) {
      if (e.vis > 0.02) line(e.a, e.b, rgba(BRAND, 0.95 * e.vis), 2.25 * unit);
    }

    // 7. visible cube edges: silhouette in brand (the hexagon of the mark), inner edges faint
    for (const e of cube) {
      if (e.front > 0.02) line(e.a, e.b, rgba(SLATE, 0.32 * e.front), 1 * unit);
    }
    for (const e of cube) {
      if (e.sil > 0.02) line(e.a, e.b, rgba(BRAND, 0.92 * e.sil), 2.25 * unit);
    }
  }

  // ---------- Animation ----------
  function spin(dt, strength) {
    const w = [
      BASE_SPIN[0] * strength + inertia[0],
      BASE_SPIN[1] * strength + inertia[1],
      BASE_SPIN[2] * strength + inertia[2],
    ];
    const mag = Math.hypot(...w);
    if (mag > 1e-6) q = qNormalize(qMul(qAxisAngle(w, mag * dt), q));
  }

  function step(dt) {
    // decay drag inertia
    const decay = Math.exp(-dt / 0.55);
    inertia = inertia.map((c) => c * decay);

    phaseT += dt;
    if (phase === 'tumble') {
      spinRamp = Math.min(1, spinRamp + dt / RAMP);
      spin(dt, smoothstep(0, 1, spinRamp));
      if (phaseT >= TUMBLE) {
        phase = 'align';
        phaseT = 0;
        alignFrom = q.slice();
        alignTo = nearestLogo(q);
      }
    } else if (phase === 'align') {
      const t = Math.min(1, phaseT / ALIGN);
      q = qSlerp(alignFrom, alignTo, easeInOutCubic(t));
      if (t >= 1) {
        phase = 'hold';
        phaseT = 0;
      }
    } else if (phase === 'hold') {
      if (phaseT >= HOLD) {
        phase = 'tumble';
        phaseT = 0;
        spinRamp = 0;
      }
    }

    // scintillation events: Poisson arrivals, fast rise + exponential decay
    if (Math.random() < dt / 0.75) {
      flashes.push({ pos: randomPointInTetra(), age: 0, intensity: 0 });
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      f.age += dt;
      f.intensity = smoothstep(0, 0.05, f.age) * Math.exp(-f.age / 0.32);
      if (f.age > 1.6) flashes.splice(i, 1);
    }
  }

  let last = performance.now();
  let raf = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!paused && !dragging) step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (raf || reduceMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  // ---------- Interaction: drag to rotate, click to pause ----------
  let dragging = false;
  let downX = 0;
  let downY = 0;
  let px = 0;
  let py = 0;
  let pt = 0;
  let moved = 0;
  const DRAG_SPEED = 0.0085;

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    downX = px = e.clientX;
    downY = py = e.clientY;
    pt = performance.now();
    inertia = [0, 0, 0];
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    const dt = Math.max(0.008, (now - pt) / 1000);
    px = e.clientX;
    py = e.clientY;
    pt = now;
    moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
    // rotate about view axes (screen-space trackball)
    q = qNormalize(qMul(qAxisAngle([0, 1, 0], dx * DRAG_SPEED), q));
    q = qNormalize(qMul(qAxisAngle([1, 0, 0], dy * DRAG_SPEED), q));
    inertia = [(dy * DRAG_SPEED) / dt, (dx * DRAG_SPEED) / dt, 0].map((c) => Math.max(-4, Math.min(4, c)));
    if (reduceMotion) draw();
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 4) {
      // a click: pause / resume (as before)
      paused = !paused;
      inertia = [0, 0, 0];
      return;
    }
    if (performance.now() - pt > 80) inertia = [0, 0, 0]; // released while still
    // resume the gentle tumble; the cycle restarts from here
    phase = 'tumble';
    phaseT = 0;
    spinRamp = 0.35;
    if (reduceMotion) inertia = [0, 0, 0];
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // Only animate while on screen
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(canvas);

  resize();
  if (reduceMotion) {
    // static, slightly turned off the logo axis so the depth reads
    q = qNormalize(qMul(qAxisAngle([0.2, 1, 0], -0.5), Q_LOGO));
    draw();
  } else if (visible) {
    start();
  }
}
