// 图 2 · 磁铁实验台: a gantry with a hanging bar magnet over six "floating paper clip" stations.
// Iron things on threads rise to the magnet and hover; wood, rubber and plastic never move.
// Run: node fig/src/magnet.mjs  →  fig/magnet.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600, HEIGHT = 330;
const PLATE = { x: -132, y: -44, w: 264, d: 90, r: 8 };
const PLATE_H = 10, FOOT_H = 5;
const POST_X = 116, POST_TOP = 84;
const RAIL = { x: -124, y: -5, w: 248, d: 10, r: 1.2 }, RAIL_Z = POST_TOP, RAIL_TOP = RAIL_Z + 8;
const CB = RAIL_Z - 10; // carriage bottom plate, under the rail
const MAG_H = 10, MAG_Z = CB - 8 - MAG_H, MAG_HALF = 18; // magnet: x ±18, y ±6
const PEG_Y = -10, PEG_TOP = 9, REST_Y = 14;
const XS = [-85, -51, -17, 17, 51, 85];
const RANGE = 15; // pull range: magnet within 15 of a station along the rail
const GAP = 4;
const REACH = [-100, 100];

// The six things. h = height above their tie point (bottom centre).
const THINGS = [
  { name: "回形针", iron: true, h: 1.4 },
  { name: "木块", iron: false, h: 8 },
  { name: "螺丝", iron: true, h: 15 },
  { name: "橡皮擦", iron: false, h: 6 },
  { name: "铁垫圈", iron: true, h: 2 },
  { name: "塑料瓶盖", iron: false, h: 6 },
].map((t, i) => ({ ...t, x: XS[i], len: MAG_Z - PEG_TOP - t.h - GAP })); // thread length: taut right under the magnet leaves GAP of air

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(RAIL, RAIL_Z, RAIL_TOP + 9)],
  WIDTH, HEIGHT, { pad: 26, azimuth: 70 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "faint" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the front: one major tick under each station
  const strip = { x: -100, y: 33, w: 200, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(-96, 96, 4, 5, strip.y, 0.6, [1.8, 3.4], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }));
  // label plate, front left
  const label = { x: -124, y: 18, w: 22, d: 14, r: 1.4 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: "faint" }));
  [[4, 18], [4, 14], [4, 10]].forEach(([x0, w], i) => out.push(L(k.lineOnTop([label.x + x0, label.y + 4 + i * 3], [label.x + x0 + w, label.y + 4 + i * 3], 0.8, P), { tone: "lo", free: true })));
  out.push(D([at([label.x + 2.2, label.y + 2.2, 0.8]), at([label.x + label.w - 2.2, label.y + label.d - 2.2, 0.8])], { size: 0.4 }));
  return out.join("");
}

function post(x) {
  const out = [];
  const foot = { x: x - 9, y: -9, w: 18, d: 18, r: 2 };
  out.push(S(k.slabOf(foot, 0, 4, P, 3, 0.5), { tone: "mid" }));
  out.push(D(k.corners(foot, 2.6).map(([a, b]) => at([a, b, 4])), { size: 0.45 }));
  const col = { x: x - 5, y: -5, w: 10, d: 10, r: 1.4 };
  out.push(S(k.slabOf(col, 4, RAIL_Z - 4 - 4, P, 3), { tone: "mid", inner: L(k.sideSeam(col, 40, P, 3), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(col, -1.4), RAIL_Z - 4, 4, P, 3, 0.4), { tone: "mid" }));
  return out.join("");
}

function railSvg() {
  const out = [S(k.slabOf(RAIL, RAIL_Z, RAIL_TOP - RAIL_Z, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(RAIL, RAIL_Z + 3, P, 3), { tone: "faint" }) })];
  out.push(D([-POST_X - 3, -POST_X + 3, POST_X - 3, POST_X + 3].map((x) => at([x, 0, RAIL_TOP])), { size: 0.45 }));
  for (const x of byDepth([[-106, 0], [102, 0]]).map((p) => p[0])) {
    const stop = { x, y: -6.5, w: 4, d: 13, r: 1 };
    out.push(S(k.slabOf(stop, RAIL_TOP, 6, P, 2, 0.4), { tone: "mid" }));
    out.push(D([at([x + 2, -3.5, RAIL_TOP + 6]), at([x + 2, 3.5, RAIL_TOP + 6])], { size: 0.4 }));
  }
  return out.join("");
}

// Carriage, built at x = 0. Back half (behind/under the rail) and front half (over it), moved together.
function carriageBack() {
  const out = [];
  out.push(S(k.slabOf({ x: -14, y: -10, w: 28, d: 4, r: 1 }, CB, RAIL_TOP - CB, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -14, y: -10, w: 28, d: 20, r: 1.2 }, CB, 4, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(0, 0, 2.2, MAG_Z + MAG_H, CB - MAG_Z - MAG_H, P, 16), { tone: "mid", inner: L(k.sideArc(0, 0, 2.2, CB - 4, P, 10), { tone: "faint" }) }));
  out.push(S(k.cylinder(0, 0, 3.6, MAG_Z + MAG_H, 1.6, P, 20), { tone: "mid" }));
  const halves = [
    { cls: "mg-n", plan: { x: -MAG_HALF, y: -6, w: MAG_HALF, d: 12, r: 0.8 }, txt: "N" },
    { cls: "mg-s", plan: { x: 0, y: -6, w: MAG_HALF, d: 12, r: 0.8 }, txt: "S" },
  ].sort((a, b) => k.depthOf([a.plan.x + 9, 0, 0], P) - k.depthOf([b.plan.x + 9, 0, 0], P));
  for (const h of halves) {
    out.push(`<g class="${h.cls}">${S(k.slabOf(h.plan, MAG_Z, MAG_H, P, 2, 0.5), { tone: "hi", crease: "lo", lit: true })}</g>`);
  }
  for (const h of halves) out.push(k.faceTextSvg(k.topMatrix([h.plan.x + 9, 2], MAG_Z + MAG_H, P, "x"), h.txt, { size: 4.4, tone: "hi", anchor: "middle" }));
  return out.join("");
}

function carriageFront() {
  const out = [];
  out.push(S(k.slabOf({ x: -14, y: 6, w: 28, d: 4, r: 1 }, CB, RAIL_TOP - CB, P, 2), { tone: "mid" }));
  for (const x of [-8, 8]) {
    out.push(L(k.sideRing([x, 10, RAIL_Z + 2], 2.4, "y", P, 18), { tone: "lo" }));
    out.push(D([at([x, 10, RAIL_Z + 2])], { size: 0.5 }));
  }
  const top = { x: -15, y: -10.5, w: 30, d: 21, r: 1.6 };
  out.push(S(k.slabOf(top, RAIL_TOP, 4, P, 3, 0.5), { tone: "mid" }));
  out.push(D(k.corners(top, 2.6).map(([a, b]) => at([a, b, RAIL_TOP + 4])), { size: 0.45 }));
  const kz = RAIL_TOP + 4;
  out.push(S(k.cylinder(0, 0, 3, kz, 2, P, 20), { tone: "mid" }));
  out.push(S(k.cylinder(0, 0, 6, kz + 2, 5, P, 32), { tone: "mid" }));
  out.push(L(k.knurl(0, 0, 6, kz + 2, kz + 7, 36, P), { tone: "lo" }));
  out.push(L(k.ring(0, 0, 2.2, kz + 7, P, 16), { tone: "mid" }));
  return out.join("");
}

// Each thing is built at rest with its tie point at (x, REST_Y, 0).
function thing(t, i) {
  const x = t.x, y = REST_Y, out = [];
  if (i === 0) { // paper clip: a flat wire loop
    const clip = { x: x - 10, y: y - 3.6, w: 20, d: 7.2, r: 3.4 };
    out.push(S(k.slabOf(clip, 0, t.h, P, 6), { tone: "hi", crease: "lo" }));
    out.push(L(k.planOutline(k.insetPlan(clip, 1.4), t.h, P, 6) + k.planOutline({ x: x - 6.4, y: y - 1, w: 12.4, d: 2, r: 1 }, t.h, P, 4), { tone: "lo" }));
  } else if (i === 1) { // wood block with grain
    const b = { x: x - 9, y: y - 6, w: 18, d: 12, r: 0.8 };
    out.push(S(k.slabOf(b, 0, t.h, P, 2, 0.4), { tone: "mid" }));
    out.push(L([-3.4, -0.6, 1.4, 3.8].map((dy) => k.lineOnTop([b.x, y + dy], [b.x + b.w, y + dy + 0.8], t.h, P)).join(""), { tone: "faint" }));
  } else if (i === 2) { // screw: shank with thread, hex head on top
    out.push(S(k.cylinder(x, y, 2, 0, 11, P, 16), { tone: "hi", crease: "lo", inner: L([1.8, 3.6, 5.4, 7.2, 9].map((z) => k.sideArc(x, y, 2, z, P, 10)).join(""), { tone: "lo" }) }));
    const hex = Array.from({ length: 6 }, (_, j) => [x + 4.8 * Math.cos((j * Math.PI) / 3 + 0.3), y + 4.8 * Math.sin((j * Math.PI) / 3 + 0.3)]);
    out.push(S(k.extrude(hex, 11, 4, P, { bevel: 0.4 }), { tone: "hi", crease: "lo" }));
    out.push(L(k.lineOnTop([x - 2.6, y], [x + 2.6, y], 15, P), { tone: "lo", free: true }));
  } else if (i === 3) { // eraser with a paper sleeve
    const e = { x: x - 10, y: y - 4.6, w: 20, d: 9.2, r: 2 };
    out.push(S(k.slabOf(e, 0, t.h, P, 4, 0.4), { tone: "mid" }));
    out.push(S(k.slabOf({ x: x - 1.5, y: y - 5, w: 10, d: 10, r: 0.4 }, -0.01, t.h + 0.4, P, 2), { tone: "lo" }));
  } else if (i === 4) { // iron washer
    out.push(S(k.cylinder(x, y, 6.6, 0, t.h, P, 36, 0.3), { tone: "hi", crease: "lo" }));
    out.push(L(k.ring(x, y, 2.8, t.h, P, 24), { tone: "mid" }));
  } else { // plastic bottle cap, ribbed
    out.push(S(k.cylinder(x, y, 7, 0, t.h, P, 36, 0.4), { tone: "mid", inner: L(k.knurl(x, y, 7, 0, t.h, 36, P, 0.2), { tone: "faint" }) }));
    out.push(L(k.ring(x, y, 5, t.h, P, 28), { tone: "faint" }));
  }
  return out.join("");
}

function peg(x) {
  return [
    S(k.cylinder(x, PEG_Y, 3.2, 0, 1.2, P, 18), { tone: "lo" }),
    S(k.cylinder(x, PEG_Y, 1.1, 1.2, PEG_TOP - 3, P, 12), { tone: "mid", crease: "none" }),
    L(k.sideRing([x, PEG_Y, PEG_TOP - 0.9], 1.6, "y", P, 14), { tone: "mid" }),
  ].join("");
}

const halo = (t) => {
  const pl = { x: t.x - 10, y: REST_Y - 6, w: 20, d: 12, r: 5 };
  return `<path class="iso-halo" data-shadow="${t.x}" d="${k.haloOf(pl, 0, 0.1, P)}" style="filter:blur(2px)"/>`;
};

const stations = byDepth(THINGS.map((t) => [t.x, 0])).map(([x]) => THINGS.findIndex((t) => t.x === x));
const body = [
  base(),
  ...byDepth([[-POST_X, 0], [POST_X, 0]]).map(([x]) => post(x)),
  ...THINGS.map(halo),
  ...stations.map((i) => {
    const t = THINGS[i];
    return `${peg(t.x)}<path class="iso-line" data-tone="mid" data-thread="${i}" d="" style="stroke-width:.8"/>${D([at([t.x, PEG_Y, PEG_TOP])], { size: 0.55, tone: "mid" })}<g data-thing="${i}">${thing(t, i)}</g>`;
  }),
  `<g data-part="back">${carriageBack()}</g>`,
  railSvg(),
  `<g data-part="front">${carriageFront()}</g>`,
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "磁铁实验台：一根横梁架在两根柱子上，滑块下面挂着一块磁铁。下面有六样东西，每样用线绑在小钉上。磁铁移到铁做的东西上面，它就被吸起来，挂在磁铁下面；木块、橡皮擦和塑料瓶盖不会动。",
  body,
});

const STYLE = `<style>
@media (max-width:520px){.iso-stage{overflow:hidden;margin:-4% 0 -2%}.iso-stage svg{width:116%;margin:0 -8%}}
.mg-n{--anatomy-top:#f9dcd9;--anatomy-lit-top:#f9dcd9;--anatomy-face:#fbe6e4;--anatomy-lit-shade:#f0bdb8;--anatomy-shade-0:#e8a49e;--anatomy-shade-1:#edb3ae;--anatomy-shade-2:#f1c2be;--anatomy-shade-3:#f5d0cc}
.mg-s{--anatomy-top:#d9e2f9;--anatomy-lit-top:#d9e2f9;--anatomy-face:#e4eafb;--anatomy-lit-shade:#b9c8f0;--anatomy-shade-0:#9fb3e8;--anatomy-shade-1:#aebfed;--anatomy-shade-2:#bdcbf1;--anatomy-shade-3:#cbd6f5}
.iso[data-theme="dark"] .mg-n{--anatomy-top:#4a2326;--anatomy-lit-top:#5a2a2e;--anatomy-face:#3a1c1e;--anatomy-lit-shade:#3e1d20;--anatomy-shade-0:#2a1314;--anatomy-shade-1:#311618;--anatomy-shade-2:#38191b;--anatomy-shade-3:#401d1f}
.iso[data-theme="dark"] .mg-s{--anatomy-top:#222c4a;--anatomy-lit-top:#29355a;--anatomy-face:#1c233a;--anatomy-lit-shade:#1e2640;--anatomy-shade-0:#13172a;--anatomy-shade-1:#161b31;--anatomy-shade-2:#191f38;--anatomy-shade-3:#1d2440}
</style>`;

const plate = k.plateHtml({
  fig: "图 2",
  title: "磁铁实验台",
  hint: "左右拖动磁铁",
  readout: "移到东西上面看看",
  keys: [
    { mark: "lit", label: "磁铁" },
    { mark: "raised", label: "铁做的东西会被吸起来" },
  ],
  caption: "磁铁会吸铁做的东西，隔着一点空气也能吸起来；木头、橡胶和塑料都不会动。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="slider" aria-label="磁铁：用左右键移到下一样东西" aria-valuemin="1" aria-valuemax="6" aria-valuenow="1" aria-valuetext="移到东西上面看看">${svg}</div>`,
});

const live = `
const P = ${JSON.stringify(P)};
const THINGS = ${JSON.stringify(THINGS)};
const PEG_Y = ${PEG_Y}, PEG_TOP = ${PEG_TOP}, REST_Y = ${REST_Y}, MAG_Z = ${MAG_Z}, RANGE = ${RANGE}, REACH = ${JSON.stringify(REACH)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const back = svg.querySelector('[data-part="back"]'), front = svg.querySelector('[data-part="front"]');
const threads = THINGS.map((_, i) => svg.querySelector('[data-thread="' + i + '"]'));
const groups = THINGS.map((_, i) => svg.querySelector('[data-thing="' + i + '"]'));
const shadows = THINGS.map((t) => svg.querySelector('[data-shadow="' + t.x + '"]'));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
// model: each thing hangs on a thread of fixed length from its peg
const tie = THINGS.map((t) => [t.x, PEG_Y, PEG_TOP]);
const rest = THINGS.map((t) => [t.x, REST_Y, 0]);
const pos = rest.map((p) => [...p]), vel = rest.map(() => [0, 0, 0]);
const over = (x) => THINGS.findIndex((t) => Math.abs(x - t.x) < RANGE);
const pulls = (x, i) => THINGS[i].iron && Math.abs(x - THINGS[i].x) < RANGE;
function targetOf(x, i) {
  if (!pulls(x, i)) return rest[i];
  const d = sub([x, 0, MAG_Z], tie[i]), n = len(d), L = THINGS[i].len;
  return [tie[i][0] + d[0] / n * L, tie[i][1] + d[1] / n * L, tie[i][2] + d[2] / n * L];
}
function step(i, x, dt) {
  const goal = targetOf(x, i), p = pos[i], v = vel[i], L = THINGS[i].len;
  const kk = pulls(x, i) ? 90 : 60, c = pulls(x, i) ? 11 : 9;
  for (let a = 0; a < 3; a++) { v[a] += ((goal[a] - p[a]) * kk - v[a] * c) * dt; p[a] += v[a] * dt; }
  const d = sub(p, tie[i]), n = len(d);
  if (n > L) { for (let a = 0; a < 3; a++) p[a] = tie[i][a] + d[a] / n * L; const r = (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / n; if (r > 0) for (let a = 0; a < 3; a++) v[a] -= r * d[a] / n; }
  if (p[2] < 0) { p[2] = 0; if (v[2] < 0) v[2] *= -0.25; }
}
function threadOf(i) {
  const a = tie[i], b = pos[i], n = len(sub(b, a)), slack = Math.max(0, 1 - n / THINGS[i].len), pts = [];
  for (let s = 0; s <= 10; s++) {
    const t = s / 10, sag = slack * THINGS[i].len * 0.45 * Math.sin(Math.PI * t);
    pts.push(iso([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.max(0.2, a[2] + (b[2] - a[2]) * t - sag)], P));
  }
  return "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L");
}
const sx = (x) => iso([x, 0, MAG_Z], P)[0];
const S0 = sx(REACH[0]), S1 = sx(REACH[1]);
const xs = THINGS.map((t) => t.x);
let x = xs[0], target = x, frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
const PAUSE = 3.2;
const tourAt = (t) => xs[Math.floor(t / PAUSE) % xs.length];
function textOf() {
  const i = over(x);
  if (i < 0) return "移到东西上面看看";
  return THINGS[i].iron ? THINGS[i].name + "：铁做的，被吸起来" : THINGS[i].name + "：不是铁，不会动";
}
function draw() {
  const m = translateAlong(P, [x, 0, 0]);
  back.setAttribute("transform", m); front.setAttribute("transform", m);
  THINGS.forEach((_, i) => {
    groups[i].setAttribute("transform", translateAlong(P, sub(pos[i], rest[i])));
    threads[i].setAttribute("d", threadOf(i));
    const off = sub(pos[i], rest[i]);
    shadows[i].setAttribute("transform", translateAlong(P, [off[0], off[1], 0]));
    shadows[i].setAttribute("opacity", Math.max(0.2, 1 - pos[i][2] / 30).toFixed(2));
  });
  const text = textOf();
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.max(1, over(x) + 1)));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring) { clock += dt; target = tourAt(clock); }
  x = calm ? target : x + (target - x) * (1 - Math.exp(-dt / 0.4));
  if (Math.abs(target - x) < 0.02) x = target;
  let moving = false;
  THINGS.forEach((_, i) => {
    if (calm) { const g = targetOf(x, i); pos[i] = [...g]; vel[i] = [0, 0, 0]; return; }
    for (let s = 0; s < 4; s++) step(i, x, dt / 4);
    if (len(vel[i]) > 0.01 || len(sub(pos[i], targetOf(x, i))) > 0.01) moving = true;
  });
  draw();
  frame = visible && (touring || moving || x !== target) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (next) => {
  touring = false; target = clamp(next, REACH[0], REACH[1]);
  clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = Math.max(0, xs.indexOf(xs.reduce((b, v) => Math.abs(v - x) < Math.abs(b - x) ? v : b))) * PAUSE; run(); }, 4000);
  run();
};
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
const worldX = (clientX) => {
  const pt = svg.createSVGPoint(); pt.x = clientX; pt.y = 0;
  const s = pt.matrixTransform(svg.getScreenCTM().inverse()).x;
  return REACH[0] + (s - S0) / (S1 - S0) * (REACH[1] - REACH[0]);
};
let drag = null;
stage.addEventListener("pointerdown", (e) => { drag = e.pointerId; stage.setPointerCapture(e.pointerId); steer(worldX(e.clientX)); });
stage.addEventListener("pointermove", (e) => { if (drag === e.pointerId) steer(worldX(e.clientX)); });
const end = (e) => { if (drag === e.pointerId) { drag = null; try { stage.releasePointerCapture(e.pointerId); } catch {} } };
stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
const dir = Math.sign(S1 - S0); // screen direction of +x
stage.addEventListener("keydown", (e) => {
  const here = xs.reduce((b, v, j) => (Math.abs(v - target) < Math.abs(xs[b] - target) ? j : b), 0);
  let to = null;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") to = here + dir;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = here - dir;
  if (e.key === "Home") to = 0;
  if (e.key === "End") to = xs.length - 1;
  if (to === null) return;
  e.preventDefault();
  steer(xs[clamp(to, 0, xs.length - 1)]);
});
still.addEventListener("change", () => { touring = !still.matches && touring; run(); });
draw();
`;

writeFig("magnet", { title: "磁铁实验台", plate, live });
