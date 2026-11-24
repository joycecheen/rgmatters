// Home hero visual: the logo geometry in 3D.
//
// Renders the tetrahedron-in-a-cube from ./geometry.js on a 2D canvas. It
// opens in the exact logo view, tumbles slowly, periodically settles back into
// the logo, and emits faint scintillation flashes from inside the crystal.
// Drag rotates; a click pauses. Honors prefers-reduced-motion (static view) and
// only animates while on screen.
import * as quat from './quaternion.js';
import {
  CUBE_EDGES,
  CUBE_VERTICES,
  LOGO_ORIENTATION,
  TETRA_EDGES,
  TETRA_FACES,
  TETRA_VERTICES,
  nearestLogoOrientation,
  randomPointInTetra,
} from './geometry.js';

const COLOR = {
  line: [0, 126, 164], // brand teal
  hidden: [96, 96, 96], // neutral hidden-line grey
  glow: [24, 200, 150], // scintillation emission
  core: [210, 255, 236],
};

// Seconds
const TIMING = { firstHold: 1.4, tumble: 8.5, align: 2.6, hold: 3.2, spinUp: 2.2 };
const SPIN = [0.17, 0.31, 0.05]; // rad/s about view-space axes
const FLASH = { meanInterval: 0.75, rise: 0.05, decay: 0.32, lifetime: 1.6 };

const CAMERA_DISTANCE = 9; // mild perspective
const FIT = 0.375; // projected cube radius as a share of the canvas
const DESIGN_SIZE = 520; // stroke widths are authored at this canvas size
const DRAG_SPEED = 0.0085; // radians per pixel
const LIGHT = [-0.45, 0.62, 0.64];

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;
/** 0 = facing away, 1 = facing the viewer, with a soft transition. */
const facing = (normal) => smoothstep(-0.06, 0.06, normal[2]);

export function initHeroVisual(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let orientation = LOGO_ORIENTATION;
  let phase = { name: 'hold', t: TIMING.hold - TIMING.firstHold };
  let align = null;
  let spinUp = 0;
  let inertia = [0, 0, 0];
  let paused = false;
  const flashes = [];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let unit = 1;

  // ---------- Layout ----------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    unit = Math.min(width, height) / DESIGN_SIZE;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    draw();
  }

  function project(v) {
    const focal = (CAMERA_DISTANCE * Math.min(width, height) * FIT) / Math.sqrt(3);
    const k = focal / (CAMERA_DISTANCE - v[2]);
    return [width / 2 + v[0] * k, height / 2 - v[1] * k];
  }

  // ---------- Drawing ----------
  function line(a, b, color, alpha, lineWidth, dash = []) {
    if (alpha < 0.02) return;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = lineWidth * unit;
    ctx.setLineDash(dash.map((d) => d * unit));
    ctx.stroke();
  }

  function fillTriangle(points, color, alpha) {
    if (alpha < 0.005) return;
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    ctx.lineTo(...points[1]);
    ctx.lineTo(...points[2]);
    ctx.closePath();
    ctx.fillStyle = rgba(color, alpha);
    ctx.fill();
  }

  function draw() {
    if (!width || !height) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rotate = (v) => quat.rotate(orientation, v);
    const cubePoints = CUBE_VERTICES.map((v) => project(rotate(v)));
    const tetraPoints = TETRA_VERTICES.map((v) => project(rotate(v)));

    // Cube edges are classified by their two adjacent faces: both facing away
    // (hidden), both facing us (inner), or one each (silhouette = the hexagon).
    const cube = CUBE_EDGES.map(({ a, b, faceNormals }) => {
      const [fa, fb] = faceNormals.map((n) => facing(rotate(n)));
      return {
        a: cubePoints[a],
        b: cubePoints[b],
        hidden: (1 - fa) * (1 - fb),
        inner: fa * fb,
        silhouette: fa * (1 - fb) + fb * (1 - fa),
      };
    });

    const faces = TETRA_FACES.map(({ vertices, normal }) => {
      const n = rotate(normal);
      return {
        points: vertices.map((i) => tetraPoints[i]),
        facing: facing(n),
        light: Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]),
      };
    });

    // A tetra edge is visible when either adjacent face (those opposite the
    // two other vertices) faces the viewer.
    const tetra = TETRA_EDGES.map(([i, j]) => {
      const [k, l] = [0, 1, 2, 3].filter((v) => v !== i && v !== j);
      return {
        a: tetraPoints[i],
        b: tetraPoints[j],
        visible: 1 - (1 - faces[k].facing) * (1 - faces[l].facing),
      };
    });

    const glow = Math.min(
      1,
      flashes.reduce((sum, f) => sum + f.intensity, 0),
    );

    // Back to front
    for (const e of cube) line(e.a, e.b, COLOR.hidden, 0.3 * e.hidden, 1, [2, 5]);
    for (const f of faces) {
      fillTriangle(f.points, COLOR.line, 0.035 * (1 - f.facing));
    }
    for (const e of tetra) line(e.a, e.b, COLOR.line, 0.55 * (1 - e.visible), 1.6);
    drawFlashes(rotate);
    for (const f of faces) {
      fillTriangle(f.points, COLOR.line, f.facing * (0.045 + 0.13 * f.light));
      fillTriangle(f.points, COLOR.glow, f.facing * glow * 0.06);
    }
    for (const e of tetra) line(e.a, e.b, COLOR.line, 0.95 * e.visible, 2.25);
    for (const e of cube) line(e.a, e.b, COLOR.hidden, 0.32 * e.inner, 1);
    for (const e of cube) line(e.a, e.b, COLOR.line, 0.92 * e.silhouette, 2.25);
  }

  function drawFlashes(rotate) {
    for (const flash of flashes) {
      const [x, y] = project(rotate(flash.position));
      const a = flash.intensity;
      const radius = (16 + 10 * flash.age) * unit;
      const halo = ctx.createRadialGradient(x, y, 0, x, y, radius);
      halo.addColorStop(0, rgba(COLOR.glow, 0.6 * a));
      halo.addColorStop(0.35, rgba(COLOR.glow, 0.2 * a));
      halo.addColorStop(1, rgba(COLOR.glow, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba(COLOR.core, Math.min(1, 1.2 * a));
      ctx.beginPath();
      ctx.arc(x, y, 1.6 * unit, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------- Animation ----------
  function setPhase(name) {
    phase = { name, t: 0 };
  }

  function spin(dt, strength) {
    const w = SPIN.map((s, i) => s * strength + inertia[i]);
    const speed = Math.hypot(...w);
    if (speed > 1e-6) {
      orientation = quat.normalize(quat.multiply(quat.fromAxisAngle(w, speed * dt), orientation));
    }
  }

  function update(dt) {
    inertia = inertia.map((c) => c * Math.exp(-dt / 0.55));
    phase.t += dt;

    if (phase.name === 'tumble') {
      spinUp = Math.min(1, spinUp + dt / TIMING.spinUp);
      spin(dt, smoothstep(0, 1, spinUp));
      if (phase.t >= TIMING.tumble) {
        align = { from: orientation, to: nearestLogoOrientation(orientation) };
        setPhase('align');
      }
    } else if (phase.name === 'align') {
      const t = Math.min(1, phase.t / TIMING.align);
      orientation = quat.slerp(align.from, align.to, easeInOutCubic(t));
      if (t >= 1) setPhase('hold');
    } else if (phase.name === 'hold' && phase.t >= TIMING.hold) {
      spinUp = 0;
      setPhase('tumble');
    }

    // Scintillation: Poisson arrivals, fast rise, exponential decay
    if (Math.random() < dt / FLASH.meanInterval) {
      flashes.push({ position: randomPointInTetra(), age: 0, intensity: 0 });
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      const flash = flashes[i];
      flash.age += dt;
      flash.intensity = smoothstep(0, FLASH.rise, flash.age) * Math.exp(-flash.age / FLASH.decay);
      if (flash.age > FLASH.lifetime) flashes.splice(i, 1);
    }
  }

  let frameId = 0;
  let lastTime = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if (!paused && !drag) update(dt);
    draw();
    frameId = requestAnimationFrame(frame);
  }
  function start() {
    if (frameId || reduceMotion) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  // ---------- Interaction: drag to rotate, click to pause ----------
  let drag = null;

  canvas.addEventListener('pointerdown', (e) => {
    drag = {
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      moved: 0,
    };
    inertia = [0, 0, 0];
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now();
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    const dt = Math.max(0.008, (now - drag.time) / 1000);
    Object.assign(drag, { x: e.clientX, y: e.clientY, time: now });
    drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY));

    orientation = quat.multiply(quat.fromAxisAngle([0, 1, 0], dx * DRAG_SPEED), orientation);
    orientation = quat.normalize(
      quat.multiply(quat.fromAxisAngle([1, 0, 0], dy * DRAG_SPEED), orientation),
    );
    inertia = [dy, dx, 0].map((d) => Math.max(-4, Math.min(4, (d * DRAG_SPEED) / dt)));
    if (reduceMotion) draw();
  });

  function endDrag() {
    if (!drag) return;
    const { moved, time } = drag;
    drag = null;
    if (moved < 4) {
      paused = !paused;
      inertia = [0, 0, 0];
      return;
    }
    if (reduceMotion || performance.now() - time > 80) inertia = [0, 0, 0];
    spinUp = 0.35;
    setPhase('tumble');
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // ---------- Lifecycle ----------
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(canvas);

  if (reduceMotion) {
    // A still, turned slightly off the logo axis so the depth reads
    orientation = quat.normalize(
      quat.multiply(quat.fromAxisAngle([0.2, 1, 0], -0.5), LOGO_ORIENTATION),
    );
  }
  resize();
}
