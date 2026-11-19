// Fig 3 · 植物的身体: a plant in a school science planter with its near wall cut away.
// Run `node fig/src/plant.mjs` from the repo root; writes fig/plant.html.
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600;
const HEIGHT = 410;

// World layout (z up). The planter's near (+y) wall is cut away at y = CUT.
const BOARD = { x: -132, y: -58, w: 268, d: 108, r: 6 };
const TRAY = { x: -68, y: -44, w: 136, d: 84, r: 4 };
const TRAY_TOP = 6;
const BOX = { x: -60, y: -36, w: 120, d: 72, r: 0 };
const CUT = BOX.y + BOX.d;
const WALL = 4;
const FLOOR_Z = 10;
const FLOOR_TOP = 14;
const GRAVEL_TOP = 22;
const SOIL_TOP = 56;
const RIM = 66;
const INNER = { x: BOX.x + WALL, y: BOX.y + WALL, w: BOX.w - WALL * 2, d: BOX.d - WALL, r: 0 };

const STEM = [0, 30];
const STEM_R = 2.4;
const STEM_TOP = 186;
// Leaves: height, direction (degrees in plan, 0 = +x), length, half-width.
const LEAVES = [
  { z: 92, a: 150, len: 40, w: 11 },
  { z: 116, a: 16, len: 42, w: 11.5 },
  { z: 140, a: 205, len: 36, w: 10 },
  { z: 161, a: 338, len: 32, w: 9 },
];
const FLOW_LEAF = 1;

const DROP_AT = [-50, -27];
const TIP_Z = 84;
const POST = [-112, -27];
const LAMP_POST = [96, -22];
const LAMP_HEAD = [30, -22];
const LAMP_Z = 214;

const P = k.fitProjection(
  [...k.boxCorners(BOARD, -18, 0), [LAMP_HEAD[0], LAMP_HEAD[1], LAMP_Z + 16], [LAMP_POST[0], LAMP_POST[1], LAMP_Z + 24], [0, 30, STEM_TOP + 6], [POST[0], POST[1], 132]],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 58 },
);
const at = (point) => k.iso(point, P);
const depth = (point) => k.depthOf(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed) => k.pathOf(points.map(at), closed);
const byDepth = (points) => [...points].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const TV = k.towardViewer(P);

// A deterministic scatter, so the soil speckle is the same on every build.
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function board() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BOARD, -18, 18, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BOARD, 20))) {
    out.push(S(k.cylinder(x, y, 7, -18, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -16.4, 4.4, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BOARD, -12, 12, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(BOARD, 5), 0, P), { tone: "faint" }));
  const screws = k.corners(BOARD, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Ruler strip along the near edge.
  const strip = { x: -40, y: BOARD.y + BOARD.d - 9, w: 150, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function lamp() {
  const [x, y] = LAMP_POST;
  const out = [];
  out.push(S(k.cylinder(x, y, 13, 0, 3, P, 48, 0.6), { tone: "mid" }));
  out.push(L(k.ring(x, y, 9.5, 3, P, 40), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 5, 3, 4, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 2.6, 7, LAMP_Z, P, 24), { tone: "mid", crease: "none", inner: L([70, 150].map((z) => k.sideArc(x, y, 2.6, z, P, 12)).join(""), { tone: "faint" }) }));
  // Clamp block with a knurled knob on top: it sets the lamp's height.
  const block = { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 };
  out.push(S(k.slabOf(block, LAMP_Z + 7, 10, P, 4, 0.5), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 5.2, LAMP_Z + 17, 4.4, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(x, y, 5.2, LAMP_Z + 17, LAMP_Z + 21.4, 32, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([x - 2.6, y], [x + 4.2, y], LAMP_Z + 21.4, P), { tone: "hi", free: true }));
  // Arm from the clamp to the lamp head.
  const arm = { x: LAMP_HEAD[0], y: y - 2.5, w: x - 6 - LAMP_HEAD[0], d: 5, r: 1.2 };
  out.push(S(k.slabOf(arm, LAMP_Z + 10, 4, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at([arm.x + arm.w - 4, y, LAMP_Z + 14]), at([arm.x + 16, y, LAMP_Z + 14])], { size: 0.45 }));
  // Lamp head: a shade with vent slots between two seams, and a cap.
  const [hx, hy] = LAMP_HEAD;
  const vents = k.knurl(hx, hy, 12, LAMP_Z + 3, LAMP_Z + 7, 22, P, 0.6) + k.sideArc(hx, hy, 12, LAMP_Z + 3, P, 40) + k.sideArc(hx, hy, 12, LAMP_Z + 7, P, 40);
  out.push(S(k.cylinder(hx, hy, 12, LAMP_Z, 10, P, 56, 0.6), { tone: "mid", inner: L(vents, { tone: "lo" }) }));
  out.push(S(k.cylinder(hx, hy, 5, LAMP_Z + 10, 4, P, 28), { tone: "mid" }));
  out.push(D([at([hx, hy, LAMP_Z + 14])], { size: 0.55, tone: "hi" }));
  return out.join("");
}

function dropperPost() {
  const [x, y] = POST;
  const out = [];
  out.push(S(k.cylinder(x, y, 12, 0, 3, P, 48, 0.6), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 2.4, 3, 125, P, 24), { tone: "mid", crease: "none", inner: L(k.sideArc(x, y, 2.4, 60, P, 12), { tone: "faint" }) }));
  out.push(S(k.cylinder(x, y, 3, 128, 2, P, 24), { tone: "mid" }));
  return out.join("");
}

function dropperArm() {
  const [x, y] = POST;
  const [dx, dy] = DROP_AT;
  const out = [];
  const block = { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 };
  out.push(S(k.slabOf(block, 100, 10, P, 4, 0.5), { tone: "mid" }));
  // Thumb screw on the clamp's near face.
  out.push(S(k.slabOf({ x: x - 1.4, y: y + 6, w: 2.8, d: 3, r: 0.8 }, 103, 4, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(x, y + 10.4, 2.6, 102, 6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(x, y + 10.4, 2.6, 102, 108, 18, P), { tone: "lo" }));
  const arm = { x: x + 6, y: y - 2.5, w: dx - 4 - x - 6, d: 5, r: 1.2 };
  out.push(S(k.slabOf(arm, 103, 4, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at([arm.x + 5, y, 107]), at([arm.x + arm.w - 5, y, 107])], { size: 0.45 }));
  // Dropper: a glass tube through a ring clamp, a rubber bulb on top.
  out.push(S(k.cylinder(dx, dy, 0.9, TIP_Z, 4, P, 16), { tone: "hi", crease: "none" }));
  out.push(S(k.cylinder(dx, dy, 1.8, TIP_Z + 4, 98 - TIP_Z, P, 20), { tone: "hi", crease: "none" }));
  out.push(S(k.cylinder(dx, dy, 4, 101, 6, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(dx, dy, 1.8, 107, 5, P, 20), { tone: "hi", crease: "none" }));
  out.push(S(k.cylinder(dx, dy, 4.4, 112, 9, P, 28), { tone: "mid", inner: L(k.sideArc(dx, dy, 4.4, 116.5, P, 20), { tone: "faint" }) }));
  out.push(S(k.cylinder(dx, dy, 3, 121, 2, P, 24), { tone: "mid" }));
  return out.join("");
}

function tray() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(TRAY, 4), 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(TRAY, 0, TRAY_TOP, P, 4, 0.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(TRAY, 2.4), TRAY_TOP, P, 4), { tone: "lo" }));
  // Feet that lift the planter off the tray, so water can drain.
  const feet = byDepth(k.corners(BOX, 8));
  for (const [x, y] of feet) out.push(S(k.slabOf({ x: x - 4, y: y - 4, w: 8, d: 8, r: 1 }, TRAY_TOP, FLOOR_Z - TRAY_TOP, P, 3), { tone: "lo" }));
  return out.join("");
}

function planterBack() {
  const out = [];
  out.push(S(k.slabOf(BOX, FLOOR_Z, FLOOR_TOP - FLOOR_Z, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOX.x, y: BOX.y, w: BOX.w, d: WALL, r: 0 }, FLOOR_TOP, RIM - FLOOR_TOP, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: BOX.x, y: BOX.y, w: WALL, d: BOX.d, r: 0 }, FLOOR_TOP, RIM - FLOOR_TOP, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}

// A closed ellipse on the cut face (y = CUT).
const onFace = (cx, cz, rx, rz, steps = 14) =>
  path3(Array.from({ length: steps }, (_, i) => [cx + rx * Math.cos((i / steps) * Math.PI * 2), CUT, cz + rz * Math.sin((i / steps) * Math.PI * 2)]), true);

function soil() {
  const out = [];
  out.push(S(k.slabOf(INNER, FLOOR_TOP, GRAVEL_TOP - FLOOR_TOP, P, 2), { tone: "lo", crease: "none" }));
  const pebbles = [];
  for (let x = INNER.x + 4; x < INNER.x + INNER.w - 3; x += 6.4) {
    const row = Math.round((x - INNER.x) / 6.4) % 2;
    pebbles.push(onFace(x + (rand() - 0.5) * 1.2, 16.6 + row * 2.6 + rand() * 0.6, 2 + rand() * 0.8, 1.3 + rand() * 0.5));
  }
  out.push(L(pebbles.join(""), { tone: "mid" }));
  out.push(S(k.slabOf(INNER, GRAVEL_TOP, SOIL_TOP - GRAVEL_TOP, P, 2), { tone: "mid", crease: "faint" }));
  // Speckle on the cut face and the top: grains of soil.
  const grains = [];
  for (let i = 0; i < 90; i++) grains.push(at([INNER.x + 2 + rand() * (INNER.w - 4), CUT, GRAVEL_TOP + 2 + rand() * (SOIL_TOP - GRAVEL_TOP - 4)]));
  for (let i = 0; i < 60; i++) grains.push(at([INNER.x + 2 + rand() * (INNER.w - 4), INNER.y + 2 + rand() * (INNER.d - 4), SOIL_TOP]));
  out.push(D(grains, { size: 0.45, tone: "lo" }));
  out.push(L(onFace(-44, 30, 3.2, 2) + onFace(38, 27, 2.6, 1.7) + onFace(46, 49, 2.2, 1.5), { tone: "mid" }));
  return out.join("");
}

// Root system on the cut face, as [x, z] polylines; the first is the tap root.
const ROOTS = [
  { w: 2.2, pts: [[0, 56], [0.8, 50], [-0.6, 43], [0.6, 36], [-0.4, 29], [0.3, 24.5]] },
  { w: 1.6, pts: [[0.8, 50], [-8, 48], [-17, 44.5], [-26, 42], [-35, 37.5]] },
  { w: 1.6, pts: [[0.8, 50], [9, 47.5], [18, 45], [27, 41], [38, 37.5]] },
  { w: 1.1, pts: [[-17, 44.5], [-20.5, 38.5], [-22.5, 31]] },
  { w: 1.1, pts: [[-26, 42], [-31.5, 44], [-39, 45.2]] },
  { w: 1.1, pts: [[18, 45], [22, 39], [23, 32]] },
  { w: 1.1, pts: [[27, 41], [33, 43], [42, 44.2]] },
  { w: 1.3, pts: [[0.6, 36], [-7, 33], [-12.5, 28.5], [-15, 25]] },
  { w: 1.3, pts: [[-0.6, 43], [7, 39], [12, 33], [15.5, 27.5]] },
  { w: 0.9, pts: [[-0.4, 29], [-6, 26.6], [-10, 25]] },
  { w: 0.8, pts: [[7, 39], [5.5, 33], [6.5, 28]] },
  { w: 0.8, pts: [[-8, 48], [-10.5, 41.5]] },
];
const face = ([x, z]) => at([x, CUT, z]);

function roots() {
  const out = [];
  const tips = [];
  for (const { w, pts } of ROOTS) {
    for (let i = 0; i < pts.length - 1; i++) {
      const width = (w * (1 - (i / (pts.length - 1)) * 0.55)).toFixed(2);
      out.push(`<path class="iso-line rt" data-tone="hi" style="--w:${width}px" d="${k.pathOf([face(pts[i]), face(pts[i + 1])])}"/>`);
    }
    tips.push(face(pts[pts.length - 1]));
  }
  out.push(D(tips, { size: 0.7, tone: "hi" }));
  return `<g data-part="root">${out.join("")}</g>`;
}

function planterFront() {
  const out = [];
  const wall = { x: BOX.x + BOX.w - WALL, y: BOX.y, w: WALL, d: BOX.d, r: 0 };
  out.push(S(k.slabOf(wall, FLOOR_TOP, RIM - FLOOR_TOP, P, 2, 0.4), { tone: "mid" }));
  // Label plate on the outer face of the right wall, with three rule lines for its printed name.
  const x = BOX.x + BOX.w;
  out.push(S(k.slabOf({ x, y: -14, w: 0.8, d: 28, r: 0.3 }, 30, 14, P, 2), { tone: "mid", crease: "none" }));
  const rule = (y0, y1, z) => L(k.segment([x + 0.8, y0, z], [x + 0.8, y1, z], P), { tone: "lo", free: true });
  out.push(rule(-10, 8, 40), rule(-10, 4, 37), rule(-10, 0, 34));
  out.push(D([at([x + 0.8, -12, 42]), at([x + 0.8, 12, 42])], { size: 0.45 }));
  return out.join("");
}

function stake() {
  // A plant label stake pushed into the soil.
  const plan = { x: 34, y: -6, w: 12, d: 1.4, r: 0.3 };
  const out = [S(k.slabOf(plan, SOIL_TOP, 18, P, 2), { tone: "mid", crease: "none" })];
  const y = plan.y + plan.d;
  out.push(L(k.segment([36.5, y, 70], [43.5, y, 70], P) + k.segment([36.5, y, 67], [41.5, y, 67], P), { tone: "lo", free: true }));
  return out.join("");
}

const DROP = (() => {
  const [sx, sy] = at([DROP_AT[0], DROP_AT[1], TIP_Z - 0.6]);
  const r = 2.2;
  const d = `M${sx} ${sy - 1}C${sx + 0.7} ${sy + 0.4} ${sx + r} ${sy + 2} ${sx + r} ${sy + 3.4}A${r} ${r} 0 0 1 ${sx - r} ${sy + 3.4}C${sx - r} ${sy + 2} ${sx - 0.7} ${sy + 0.4} ${sx} ${sy - 1}Z`;
  return { d, fall: k.screenRise(TIP_Z - 0.6 - SOIL_TOP - 3, P) };
})();

function drops() {
  const ring = L(k.ring(DROP_AT[0], DROP_AT[1], 4, SOIL_TOP, P, 24), { tone: "blue" });
  return [0, 1, 2]
    .map((i) => `<g class="pl-drop" data-drop="${i}" opacity="0"><path class="pl-water" d="${DROP.d}"/></g><g class="pl-splash" data-splash="${i}" opacity="0">${ring}</g>`)
    .join("");
}

// One leaf: a pointed lens in plan, from the stem out along direction a.
function leafRing({ a, len, w }, steps = 14) {
  const ux = Math.cos((a * Math.PI) / 180), uy = Math.sin((a * Math.PI) / 180);
  const at2 = (t, side) => {
    const half = w * Math.pow(Math.sin(Math.PI * t), 0.85) * (t < 0.5 ? 1 : 1 - (t - 0.5) * 0.4);
    return [STEM[0] + ux * (1 + t * len) - uy * half * side, STEM[1] + uy * (1 + t * len) + ux * half * side];
  };
  const ring = [];
  for (let i = 0; i <= steps; i++) ring.push(at2(i / steps, 1));
  for (let i = steps - 1; i > 0; i--) ring.push(at2(i / steps, -1));
  return { ring, at2, u: [ux, uy] };
}

function leaf(spec) {
  const { ring, at2 } = leafRing(spec);
  const top = spec.z + 1.2;
  const veins = [];
  for (const t of [0.22, 0.4, 0.58, 0.74]) {
    for (const side of [1, -1]) {
      const from = at2(t, 0);
      const to = at2(Math.min(t + 0.14, 0.9), side);
      veins.push(k.lineOnTop(from, to, top, P));
    }
  }
  const midrib = k.onTop([at2(0, 0), at2(1, 0)], top, P);
  const solid = k.extrude(ring, spec.z, 1.2, P);
  return S(solid, { tone: "hi", crease: "lo", inner: L(midrib, { tone: "mid" }) + L(veins.join(""), { tone: "lo" }) });
}

function stem() {
  const [x, y] = STEM;
  const out = [S(k.cylinder(x, y, STEM_R, SOIL_TOP, STEM_TOP - SOIL_TOP, P, 20), { tone: "hi", crease: "none" })];
  // Nodes: a slightly thicker ring where each leaf grows.
  for (const { z } of LEAVES) out.push(S(k.cylinder(x, y, STEM_R + 0.5, z - 1, 2, P, 20), { tone: "hi", crease: "lo" }));
  return out.join("");
}

function flower() {
  const [x, y] = STEM;
  const z = STEM_TOP;
  const out = [S(k.cylinder(x, y, 4.4, z, 2.4, P, 24), { tone: "hi", crease: "lo" })];
  const petals = Array.from({ length: 6 }, (_, i) => ({ a: i * 60 + 15, len: 16, w: 6 }))
    .map((spec) => ({ spec, key: depth([x + Math.cos((spec.a * Math.PI) / 180) * 7, y + Math.sin((spec.a * Math.PI) / 180) * 7, z]) }))
    .sort((a, b) => a.key - b.key);
  for (const { spec } of petals) {
    const { ring, at2 } = leafRing(spec, 10);
    const lift = z + 2.4;
    out.push(S(k.extrude(ring, lift, 0.8, P), { tone: "hi", crease: "lo", inner: L(k.onTop([at2(0.3, 0), at2(0.85, 0)], lift + 0.8, P), { tone: "faint", free: true }) }));
  }
  out.push(S(k.cylinder(x, y, 5.4, z + 3.2, 1.8, P, 28, 0.4), { tone: "hi", crease: "lo" }));
  const seeds = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    seeds.push(at([x + Math.cos(a) * 3.4, y + Math.sin(a) * 3.4, z + 5]));
  }
  seeds.push(at([x, y, z + 5]));
  out.push(D(seeds, { size: 0.5, tone: "mid" }));
  return out.join("");
}

// The water path: a root tip, up the tap root, up the stem's near side, out along a leaf's midrib.
const STEM_FRONT = (z) => [STEM[0] + TV[0] * (STEM_R + 0.15), STEM[1] + TV[1] * (STEM_R + 0.15), z];
const FLOW_ROOT = [[-35, 37.5], [-26, 42], [-17, 44.5], [-8, 48], [0.8, 50], [0, 56]].map(face);
const FLOW_STEM = [at([0, CUT, SOIL_TOP]), at(STEM_FRONT(SOIL_TOP + 0.5)), at(STEM_FRONT(LEAVES[FLOW_LEAF].z + 1.2))];
const FLOW_LEAF_PTS = (() => {
  const { at2 } = leafRing(LEAVES[FLOW_LEAF]);
  const z = LEAVES[FLOW_LEAF].z + 1.25;
  return [at([STEM[0], STEM[1], z]), ...[0.15, 0.4, 0.7, 1].map((t) => at([...at2(t, 0), z]))];
})();
const flowLine = (points, part) => `<g class="pl-flow" data-flow="${part}">${L(k.pathOf(points), { tone: "blue", flow: true })}</g>`;

function plant() {
  const items = [{ key: depth([STEM[0], STEM[1], 0]), svg: `<g data-part="stem">${stem()}</g>${flowLine(FLOW_STEM, "stem")}` }];
  LEAVES.forEach((spec, index) => {
    const { at2 } = leafRing(spec);
    const key = depth([...at2(0.5, 0), 0]);
    items.push({ key, svg: `<g data-part="leaf">${leaf(spec)}</g>${index === FLOW_LEAF ? flowLine(FLOW_LEAF_PTS, "leaf") : ""}` });
  });
  items.sort((a, b) => a.key - b.key);
  return items.map((item) => item.svg).join("") + `<g data-part="flower">${flower()}</g>`;
}

// Invisible, fat touch targets for the thin parts (roots on the soil face, the stem).
function hits() {
  const soilFace = path3([[INNER.x, CUT, GRAVEL_TOP], [INNER.x + INNER.w, CUT, GRAVEL_TOP], [INNER.x + INNER.w, CUT, SOIL_TOP], [INNER.x, CUT, SOIL_TOP]], true);
  return `<path class="pl-hit" data-hit="root" d="${soilFace}"/>`;
}
const stemHit = `<path class="pl-hit pl-hit-line" data-hit="stem" d="${k.pathOf([at([STEM[0], STEM[1], SOIL_TOP + 4]), at([STEM[0], STEM[1], STEM_TOP - 4])])}"/>`;

const STYLE = `<style>
.iso{--pl-water:#cfe3ff;--pl-glow:rgba(0,0,0,.28)}
.iso[data-theme="dark"]{--pl-water:#1d3557;--pl-glow:rgba(255,255,255,.35)}
.iso-line.rt{stroke-width:var(--w)}
[data-part][data-on] .iso-line.rt{stroke:var(--anatomy-lit);stroke-width:calc(var(--w) * 1.6)}
[data-part][data-on]{filter:drop-shadow(0 0 1.6px var(--pl-glow))}
[data-part][data-on] .iso-solid>.iso-edge{stroke-width:1.3px}
.pl-water{fill:var(--pl-water);stroke:var(--anatomy-blue);stroke-width:.6px}
.pl-flow .iso-line{stroke-width:1.5px}
.pl-hit{fill:transparent;stroke:none;pointer-events:all}
.pl-hit-line{fill:none;stroke:transparent;stroke-width:14px;pointer-events:stroke}
.iso-swatch[data-mark="dashed"] path{stroke:var(--anatomy-blue)}
@media (max-width:560px){.iso-plate{overflow:hidden}.iso-stage .iso-svg{width:128%;margin:-4% -14% -2%}}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
</style>`;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "一个前面切开的花盆，里面种着一棵植物。可以看到泥土里的根、长出泥土的茎、四片叶子和顶上的一朵花。旁边有一个滴管架和一盏太阳灯。",
  body: [
    board(),
    lamp(),
    dropperPost(),
    tray(),
    planterBack(),
    soil(),
    hits(),
    roots(),
    `<g class="pl-flow" data-flow="root">${L(k.pathOf(FLOW_ROOT), { tone: "blue", flow: true })}</g>`,
    stake(),
    dropperArm(),
    drops(),
    planterFront(),
    plant(),
    stemHit,
  ],
});

const PARTS = [
  { id: "root", say: "根：抓紧泥土，还会吸水" },
  { id: "stem", say: "茎：撑起植物，把水送到叶子" },
  { id: "leaf", say: "叶：用阳光制造食物" },
  { id: "flower", say: "花：以后会变成果实和种子" },
];

const live = `
const PARTS = ${JSON.stringify(PARTS)};
const FALL = ${DROP.fall.toFixed(2)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const dropEls = [...svg.querySelectorAll("[data-drop]")];
const splashEls = [...svg.querySelectorAll("[data-splash]")];
const flowEls = ["root", "stem", "leaf"].map((name) => svg.querySelector('[data-flow="' + name + '"]'));
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const ease = (v) => { v = clamp01(v); return v * v * (3 - 2 * v); };

let picked = -1;
function pick(index) {
  if (index === picked) return;
  picked = index;
  PARTS.forEach((part, i) => svg.querySelectorAll('[data-part="' + part.id + '"]').forEach((g) => {
    g.toggleAttribute("data-on", i === index);
    g.querySelectorAll(".iso-solid").forEach((s) => s.toggleAttribute("data-lit", i === index));
  }));
  const text = index < 0 ? "浇水啦，水流进泥土里" : PARTS[index].say;
  readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.max(1, index + 1)));
  stage.setAttribute("aria-valuetext", text);
}

// Idle tour: three drops fall, the water runs root → stem → leaf, then each part is shown for 2.5 s.
const DROPS = [0, 0.7, 1.4], DROP_T = 0.55, SHOW = 2.6, STEP = 2.5, CYCLE = SHOW + STEP * 4 + 0.6;
let clock = 0, touring = !still.matches, frame = 0, last = 0, visible = false, idle = 0;
let flow = [1, 1, 1];
function tourFrame(t) {
  DROPS.forEach((t0, i) => {
    const age = t - t0;
    const falling = age >= 0 && age < DROP_T;
    dropEls[i].setAttribute("opacity", falling ? "1" : "0");
    if (falling) { const f = age / DROP_T; dropEls[i].setAttribute("transform", "translate(0 " + (FALL * f * f).toFixed(2) + ")"); }
    const splash = age - DROP_T;
    splashEls[i].setAttribute("opacity", splash > 0 && splash < 0.6 ? (1 - splash / 0.6).toFixed(2) : "0");
  });
  const out = 1 - ease((t - (CYCLE - 0.6)) / 0.6);
  flow = [1.7, 2.1, 2.5].map((t0) => ease((t - t0) / 0.5) * out);
  pick(t < SHOW ? -1 : Math.min(3, Math.floor((t - SHOW) / STEP)));
}
function draw() { flowEls.forEach((el, i) => el.setAttribute("opacity", flow[i].toFixed(2))); }
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) { clock = (clock + dt) % CYCLE; tourFrame(clock); }
  draw();
  frame = visible && touring ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && touring) { last = 0; frame = requestAnimationFrame(tick); } };
function rest() {
  dropEls.concat(splashEls).forEach((el) => el.setAttribute("opacity", "0"));
  flow = [1, 1, 1];
  draw();
}
function hold() {
  touring = false;
  rest();
  clearTimeout(idle);
  if (!still.matches) idle = setTimeout(() => { touring = true; clock = 0; run(); }, 4000);
}
function choose(index) { hold(); pick((index + PARTS.length) % PARTS.length); }

// Tap a part to show it (tap empty space for the next one); drag sideways to step through.
let press = null;
stage.addEventListener("pointerdown", (event) => {
  const hit = event.target.closest("[data-part],[data-hit]");
  const id = hit && (hit.dataset.part || hit.dataset.hit);
  press = { id: event.pointerId, x: event.clientX, steps: 0, target: id ? PARTS.findIndex((p) => p.id === id) : -1 };
  try { stage.setPointerCapture(event.pointerId); } catch {}
  hold();
});
stage.addEventListener("pointermove", (event) => {
  if (!press || event.pointerId !== press.id) return;
  const steps = Math.trunc((event.clientX - press.x) / 40);
  if (steps !== press.steps) { choose(Math.max(0, Math.min(PARTS.length - 1, Math.max(0, picked) + steps - press.steps))); press.steps = steps; }
});
const release = (event) => {
  if (!press || event.pointerId !== press.id) return;
  if (press.steps === 0 && event.type === "pointerup") choose(press.target >= 0 ? press.target : picked + 1);
  press = null;
  try { stage.releasePointerCapture(event.pointerId); } catch {}
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  const keys = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
  let to = null;
  if (event.key in keys) to = Math.max(0, picked) + keys[event.key];
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = PARTS.length - 1;
  if (to === null) return;
  event.preventDefault();
  choose(Math.max(0, Math.min(PARTS.length - 1, to)));
});
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { rest(); pick(0); } else { tourFrame(0); draw(); }
`;

const plate = k.plateHtml({
  fig: "图 3",
  title: "植物的身体",
  hint: "点一点，看看每个部分",
  readout: PARTS[0].say,
  keys: [
    { mark: "lit", label: "正在看的部分" },
    { mark: "dashed", label: "水从根走到叶子" },
  ],
  caption: "根从泥土里吸水，水沿着茎走到叶子；叶子用阳光、水和空气制造植物的食物。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="slider" aria-label="植物的身体：点一点或按左右键，看看根、茎、叶、花" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" aria-valuetext="${PARTS[0].say}">${svg}</div>`,
});

writeFig("plant", { title: "植物的身体", plate, live });
