// Fig 4 · 泥土 — three funnels on a lab stand: sand, garden soil and clay drain the same 100 ml.
// Run from the repo root: `node fig/src/soil.mjs` (add `--audit` to prove the geometry).
import * as k from "./kit/iso-kit.mjs";
import * as G from "./kit/lathe.mjs";
import { writeFig } from "./page.mjs";

import * as A from "./kit/audit.mjs";

// ---------- the one model: equal 100 ml poured, first-order drainage ----------
// out(t) = most · (1 − e^(−t/τ)), most = 100 · (1 − keep); water still standing on top = 100 · e^(−t/soak).
const SOILS = [
  { name: "沙土", tau: 6, keep: 0.16, soak: 0.4 },
  { name: "园土", tau: 12, keep: 0.3, soak: 1.5 },
  { name: "黏土", tau: 45, keep: 0.55, soak: 9 },
];
function drainOf(s, t) {
  const most = 100 * (1 - s.keep);
  const at = Math.max(0, t);
  return { out: most * (1 - Math.exp(-at / s.tau)), rate: (most / s.tau) * Math.exp(-at / s.tau), pond: 100 * Math.exp(-at / s.soak), most };
}
// Self-check: the figure's numbers, and water never leaves faster than it soaked in.
{
  const end = SOILS.map((s) => drainOf(s, 20).out);
  console.assert(Math.abs(end[0] - 81) < 1.5 && Math.abs(end[1] - 56.8) < 1.5 && Math.abs(end[2] - 16.1) < 1.5, "drain numbers", end);
  console.assert(end[0] > end[1] && end[1] > end[2], "sand > garden > clay");
  for (const s of SOILS) for (let t = 0; t <= 20; t += 0.05) { const d = drainOf(s, t); console.assert(d.out <= 100 - d.pond + 1e-9, "out ≤ soaked", s.name, t); }
}

// ---------- world ----------
const WIDTH = 600, HEIGHT = 400;
const PLATE = { x: -132, y: -46, w: 264, d: 94, r: 7 };
const PLATE_H = 10, FOOT_H = 4;
const XS = [-80, 0, 80];
const Y = 6; // station line
const POSTX = [-118, 118], POSTY = -30;
const BAR = { z: 106, h: 5.2 };
const BLOCK_LOW = 104, BLOCK_TOP = 146; // post clamp blocks, 9 and 10 tall
const GLASS = { r: 9, z0: 3, z1: 71, lip: 2, water: 8.2, floor: 5, perMl: 0.6 }; // 100 ml at z 65
const SPOUT = { z0: 78, z1: 96, r: 1.8 };
const CONE = { z0: 96, r0: 2.4, z1: 122, r1: 20 };
const coneR = (z) => CONE.r0 + ((z - CONE.z0) * (CONE.r1 - CONE.r0)) / (CONE.z1 - CONE.z0);
const RING = { z0: 107.6, z1: 109.6, rOut: 14 };
RING.rIn = coneR(RING.z1);
const RIM = { z: 124, r: 20.8, inner: 19.6 };
const SOIL_Z = 119, SOIL_R = coneR(119) - 0.1;
const PIPE = { y: Y, z: 153.5, r: 3.5, x0: -121, x1: 121 };
const NOZZLE = { r: 1.6, z0: 145, z1: 150.4, tip: 1.4 };
const CUP_X = -40;
const G_FALL = 600; // units / s² for drops and the poured streams

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [POSTX[0], POSTY, 158], [POSTX[1], POSTY, 158], [CUP_X, Y, 171], ...XS.flatMap((x) => [[x - 21, Y - 21, RIM.z], [x + 21, Y + 21, RIM.z]])],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: 64 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const up = (x, y) => G.frameOf([x, y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const pts = (list) => list.map((p) => at(p));
const poly = (list, close = false) => "M" + pts(list).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + (close ? "Z" : "");
const circle3 = (cx, cy, r, z, n = 64) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z]);
const [vx, vy] = k.towardViewer(P);
const FACE = Math.atan2(vy, vx); // angle on a round body that faces the viewer

const R = A.recorder(P);
const put = (centre, svg, shapes, bias = 0) => R.put({ at: centre, bias, svg, shapes: shapes.map((s) => R.solid(s)) });

// ---------- base ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = k.corners(PLATE, 20).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
    R.solid(A.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, { name: "stand.flange" }));
    R.solid(A.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, { name: "stand.foot" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
  R.solid(A.slab(PLATE, -PLATE_H, PLATE_H, { name: "stand.plate" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front right: three rule lines standing for printed text
  const label = { x: 104, y: 22, w: 18, d: 14, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([0, 1, 2].map((i) => k.lineOnTop([label.x + 4, label.y + 4 + i * 3], [label.x + 4 + [10, 7, 9][i], label.y + 4 + i * 3], 0.8, P)).join(""), { tone: "lo", free: true }));
  return out.join("");
}

// ---------- stand: posts, clamp blocks, bar, top arms ----------
function knob(x, y, z, axis) {
  const F = G.frameAlong([x, y, z], axis);
  const shape = A.disc(F, 0, 3.6, 2.6, { name: "stand.knob" });
  return { svg: S(G.disc(0, 3.6, 2.6, F, P), { tone: "mid" }) + L(G.ribsOf(F, 0, 3.6, 2.6, 16, P, { least: 0.2 }), { tone: "lo" }), shape };
}
function stand() {
  for (const x of POSTX) {
    put([x, POSTY, 2], S(k.cylinder(x, POSTY, 5, 0, 4, P, 28), { tone: "mid" }), [A.cylinder(x, POSTY, 5, 0, 4, { name: "post.collar" })]);
    put([x, POSTY, 54], S(k.cylinder(x, POSTY, 3.2, 4, BLOCK_LOW - 4, P, 28), { tone: "mid", crease: "none", inner: L(k.sideArc(x, POSTY, 3.2, 40, P, 16), { tone: "faint" }) }), [A.cylinder(x, POSTY, 3.2, 4, BLOCK_LOW - 4, { name: "post.low" })]);
    for (const [z0, h] of [[BLOCK_LOW, 9], [BLOCK_TOP, 10]]) {
      const plan = { x: x - 6, y: POSTY - 6, w: 12, d: 12, r: 1.6 };
      const out = Math.sign(x);
      const kn = knob(x + out * 6, POSTY, z0 + h / 2, [out, 0, 0]);
      put([x, POSTY, z0 + h / 2], S(k.slabOf(plan, z0, h, P, 3, 0.5), { tone: "mid" }) + D([at([x - 3.5, POSTY - 3.5, z0 + h]), at([x + 3.5, POSTY + 3.5, z0 + h])], { size: 0.45 }), [A.slab(plan, z0, h, { name: "post.block" })]);
      put([x + out * 8, POSTY, z0 + h / 2], kn.svg, [kn.shape]);
    }
    put([x, POSTY, 130], S(k.cylinder(x, POSTY, 3.2, BLOCK_LOW + 9, BLOCK_TOP - BLOCK_LOW - 9, P, 28), { tone: "mid", crease: "none" }), [A.cylinder(x, POSTY, 3.2, BLOCK_LOW + 9, BLOCK_TOP - BLOCK_LOW - 9, { name: "post.mid" })]);
    put([x, POSTY, 157], S(k.cylinder(x, POSTY, 3.8, BLOCK_TOP + 10, 2, P, 28), { tone: "mid" }), [A.cylinder(x, POSTY, 3.8, BLOCK_TOP + 10, 2, { name: "post.cap" })]);
    const arm = { x: x - 3, y: POSTY + 6, w: 6, d: Y + 6 - POSTY - 6, r: 1 };
    put([x, (arm.y + arm.y + arm.d) / 2, 148], S(k.slabOf(arm, 146, 4, P, 3, 0.4), { tone: "mid" }) + D([at([x, arm.y + arm.d - 3, 150])], { size: 0.45 }), [A.slab(arm, 146, 4, { name: "post.arm" })]);
  }
  const bar = { x: -112, y: POSTY - 2.6, w: 224, d: 5.2, r: 0.8 };
  put([0, POSTY, BAR.z + 2.6], S(k.slabOf(bar, BAR.z, BAR.h, P, 2, 0.4), { tone: "mid" }), [A.slab(bar, BAR.z, BAR.h, { name: "bar" })], -0.5);
}

// ---------- watering bar: pipe, feed cup, nozzles ----------
function waterBar() {
  const F = G.frameOf([0, PIPE.y, PIPE.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const bands = [-60, -20, 40].map((s) => G.arcOf(F, s, PIPE.r, P)).join("");
  put([0, PIPE.y, PIPE.z], S(G.disc(PIPE.x0, PIPE.x1, PIPE.r, F, P), { tone: "mid", inner: L(bands, { tone: "faint" }) }), [A.disc(F, PIPE.x0, PIPE.x1, PIPE.r, { name: "pipe" })], -0.3);
  for (const x of XS) {
    put([x, Y, 147], S(k.cylinder(x, Y, NOZZLE.r + 0.6, NOZZLE.z0, NOZZLE.tip, P, 20), { tone: "mid" }) + S(k.cylinder(x, Y, NOZZLE.r, NOZZLE.z0 + NOZZLE.tip, NOZZLE.z1 - NOZZLE.z0 - NOZZLE.tip, P, 20), { tone: "mid" }), [A.cylinder(x, Y, NOZZLE.r, NOZZLE.z0 + NOZZLE.tip, NOZZLE.z1 - NOZZLE.z0 - NOZZLE.tip, { name: "nozzle" }), A.cylinder(x, Y, NOZZLE.r + 0.6, NOZZLE.z0, NOZZLE.tip, { name: "nozzle.tip" })]);
  }
  // feed cup on top of the pipe: fill it with 300 ml and each nozzle gets 100
  const C = up(CUP_X, Y);
  const s0 = PIPE.z + 3;
  const cup = [[s0, 2.2], [s0 + 3, 2.2], [s0 + 3, 3.2], [s0 + 12, 9.4], [s0 + 12, 10.2], [s0 + 13.4, 10.2]];
  const cupInner = L(k.ring(CUP_X, Y, 8.8, s0 + 13.4, P, 48), { tone: "lo" });
  put([CUP_X, Y, s0 + 7], S(G.solidOf(cup, C, P), { tone: "mid", inner: L(G.arcOf(C, s0 + 1.5, 2.2, P), { tone: "faint" }) }) + cupInner, [A.solid(C, cup, { name: "cup" })]);
}

// ---------- one station: cylinder, funnel in its ring clamp, soil ----------
function grainsIn(seed, count, r) {
  const out = [];
  let a = seed;
  const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  while (out.length < count) {
    const x = (rnd() * 2 - 1) * r, y = (rnd() * 2 - 1) * r;
    if (x * x + y * y < r * r) out.push([x, y, rnd()]);
  }
  return out;
}
function soilTop(i, x) {
  const z = SOIL_Z, r = SOIL_R;
  const ell = poly(circle3(x, Y, r, z), true);
  const outline = L(ell + "", { tone: "lo" });
  if (i === 0) {
    // 沙土: big pale grains with gaps
    const g = grainsIn(11, 110, r - 1);
    return `<path class="soil sand" d="${ell}"/>` + D(g.filter((p) => p[2] < 0.5).map(([dx, dy]) => at([x + dx, Y + dy, z])), { size: 1.25, tone: "lo" }) + D(g.filter((p) => p[2] >= 0.5).map(([dx, dy]) => at([x + dx, Y + dy, z])), { size: 0.8, tone: "mid" }) + outline;
  }
  if (i === 2) {
    // 黏土: smooth, fine, with dry cracks that end on each other or the rim
    const c = (p) => [x + p[0], Y + p[1], z];
    const j1 = [-3, -2], j2 = [5, 3];
    const toEdge = (ang) => [r * Math.cos(ang), r * Math.sin(ang)];
    const cracks = [
      [toEdge(3.6), [-9, -4], j1],
      [j1, [1, 0.5], j2],
      [j2, [11, 1], toEdge(0.1)],
      [j2, [6, 9], toEdge(1.25)],
      [j1, [-4, 7], toEdge(1.95)],
      [j1, [0, -9], toEdge(4.9)],
    ];
    return `<path class="soil clay" d="${ell}"/>` + L(cracks.map((list) => poly(list.map(c))).join(""), { tone: "mid" }) + outline;
  }
  // 园土: dark, fine crumbs, a rotted leaf
  const g = grainsIn(29, 140, r - 1);
  const leaf = (s, t) => [x - 6 + s * 9 - t * 3, Y + 3 + s * 5 + t * 5, z];
  const side = (sign) => Array.from({ length: 9 }, (_, n) => { const s = n / 8; return leaf(s, sign * 0.5 * Math.sin(Math.PI * s)); });
  const leafPath = poly([...side(1), ...side(-1).reverse()], true);
  return `<path class="soil loam" d="${ell}"/>` + D(g.map(([dx, dy]) => at([x + dx, Y + dy, z])), { size: 0.6, tone: "mid" }) + `<path class="soil leaf" d="${leafPath}"/>` + L(leafPath, { tone: "mid" }) + L(poly([leaf(0, 0), leaf(1, 0)]), { tone: "mid" }) + outline;
}
function station(i) {
  const x = XS[i];
  const F = up(x, Y);
  // measuring cylinder on a round foot
  const footS = A.cylinder(x, Y, 12, 0, 3, { name: "glass.foot" });
  const glassS = A.cylinder(x, Y, GLASS.r, GLASS.z0, GLASS.z1 - GLASS.z0, { name: "glass" });
  const lipS = A.cylinder(x, Y, GLASS.r + 0.8, GLASS.z1, GLASS.lip, { name: "glass.lip" });
  const spineA = FACE - 0.42;
  const onGlass = (ang, z) => [x + GLASS.r * Math.cos(ang), Y + GLASS.r * Math.sin(ang), z];
  const arc = (a0, a1, z) => poly([onGlass(a0, z), onGlass(a1, z)]);
  let minor = "", major = "";
  for (let ml = 0; ml <= 100; ml += 10) {
    const z = GLASS.floor + ml * GLASS.perMl;
    if (ml % 50 === 0) major += arc(spineA, spineA + 0.44, z);
    else minor += arc(spineA, spineA + 0.26, z);
  }
  const spine = poly([onGlass(spineA, GLASS.z0), onGlass(spineA, GLASS.z1)]);
  const glint = poly([onGlass(FACE + 0.75, GLASS.z0), onGlass(FACE + 0.75, GLASS.z1)]);
  const water = `<g class="iso-solid water" data-lit="" data-part="water"><path class="iso-fill"/><path class="iso-shade" data-shade="0"/><path class="iso-shade" data-shade="1"/><path class="iso-shade" data-shade="2"/><path class="iso-shade" data-shade="3"/><path class="iso-top"/><path class="iso-line iso-crease" data-tone="faint"/><path class="iso-line iso-edge" data-tone="lit"/></g>`;
  const [dx0, dy0] = at([x, Y, SPOUT.z0]);
  const drops = `<g class="iso-dots" data-tone="lit" data-part="drops">${`<circle r="1.5" cx="${dx0.toFixed(1)}" cy="${dy0.toFixed(1)}" style="display:none"/>`.repeat(8)}</g>`;
  const glass =
    S(k.cylinder(x, Y, 12, 0, 3, P, 40, 0.5), { tone: "mid" }) +
    S(k.cylinder(x, Y, GLASS.r, GLASS.z0, GLASS.z1 - GLASS.z0, P, 48), { tone: "hi", crease: "none", className: "glass" }) +
    water +
    L(spine, { tone: "lo" }) + L(minor, { tone: "lo" }) + L(major, { tone: "mid" }) + L(glint, { tone: "faint" }) +
    S(k.cylinder(x, Y, GLASS.r + 0.8, GLASS.z1, GLASS.lip, P, 48), { tone: "hi", className: "glass" }) +
    L(k.ring(x, Y, GLASS.r - 0.7, GLASS.z1 + GLASS.lip, P, 48), { tone: "faint" }) +
    drops;
  put([x, Y, 30], `<g data-station="${i}">${glass}</g>`, [footS, glassS, lipS]);

  // funnel below its ring: spout and lower cone
  const lower = [[SPOUT.z0, SPOUT.r], [SPOUT.z1, SPOUT.r], [CONE.z0, CONE.r0], [RING.z0, coneR(RING.z0)]];
  put([x, Y, 92], S(G.solidOf(lower, F, P), { tone: "hi", crease: "lo" }), [A.solid(F, lower, { name: "funnel.low" })]);
  // ring clamp, its arm back to the bar, and the clamp head with a knurled screw
  const seat = [[RING.z0, coneR(RING.z0)], [RING.z0, RING.rOut], [RING.z1, RING.rOut], [RING.z1, RING.rIn]];
  put([x, Y, RING.z1], S(G.lathe(seat, F, P, { hole: null }), { tone: "mid" }), [A.body(F, seat, { name: "ring" })]);
  const armEnd = Y - Math.sqrt(RING.rOut ** 2 - 4) + 0.1;
  const arm = { x: x - 2, y: POSTY + 2.6, w: 4, d: armEnd - POSTY - 2.6, r: 0.6 };
  put([x, (arm.y + armEnd) / 2, RING.z0 + 1], S(k.slabOf(arm, RING.z0, 2, P, 2), { tone: "mid" }), [A.slab(arm, RING.z0, 2, { name: "ring.arm" })]);
  const head = { x: x - 5, y: POSTY - 3.6, w: 10, d: 7.2, r: 1 };
  const top = BAR.z + BAR.h;
  put([x, POSTY, top + 2], S(k.slabOf(head, top, 3.8, P, 3, 0.4), { tone: "mid" }) + D([at([x - 3, POSTY + 2, top + 3.8]), at([x + 3, POSTY + 2, top + 3.8])], { size: 0.4 }), [A.slab(head, top, 3.8, { name: "ring.head" })]);
  put([x, POSTY, top + 6], S(k.cylinder(x, POSTY, 2.6, top + 3.8, 4, P, 20), { tone: "mid" }) + L(k.knurl(x, POSTY, 2.6, top + 3.8, top + 7.8, 18, P), { tone: "lo" }), [A.cylinder(x, POSTY, 2.6, top + 3.8, 4, { name: "ring.screw" })]);

  // funnel above its ring: upper cone, rim, and what you see inside
  const upper = [[RING.z1, RING.rIn], [CONE.z1, CONE.r1], [CONE.z1, RIM.r], [RIM.z, RIM.r]];
  const clip = poly(circle3(x, Y, RIM.inner, RIM.z, 72), true);
  const inside =
    `<clipPath id="mouth${i}"><path d="${clip}"/></clipPath>` +
    `<path class="mouth" d="${clip}"/>` +
    `<g clip-path="url(#mouth${i})">${soilTop(i, x)}<path class="pond" data-part="pond" d="${poly(circle3(x, Y, SOIL_R, SOIL_Z + 0.2, 64), true)}" fill-opacity="0"/></g>` +
    L(clip, { tone: "lo" });
  const stream = `<path class="iso-line stream" data-tone="lit" data-part="stream" d=""/>`;
  put([x, Y, 116], `<g data-station="${i}">${S(G.solidOf(upper, F, P), { tone: "hi", crease: "lo" })}${inside}${stream}</g>`, [A.solid(F, upper, { name: "funnel.up" })]);

  // sample tag on the bench
  const tag = { x: x - 13, y: 26, w: 26, d: 11, r: 1.4 };
  return S(k.slabOf(tag, 0, 0.8, P, 4), { tone: "lo", crease: "none" }) + L(k.planOutline(k.insetPlan(tag, 1.4), 0.8, P, 3), { tone: "faint" }) + k.faceTextSvg(k.topMatrix([x, 33.4], 0.8, P, "x"), SOILS[i].name, { size: 6.4, tone: "hi", anchor: "middle" });
}

const plateSvg = base();
stand();
waterBar();
const tags = [0, 1, 2].map(station).join("");
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
A.auditOrExit(R, P);

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "一个实验架上挂着三个漏斗，左边装沙土，中间装园土，右边装黏土。上面的水管给每个漏斗倒同样多的水，下面的量筒接住流下来的水。沙土下面的水最多，黏土下面的水最少。",
  body: [plateSvg, tags, ...R.items.map((item) => item.svg)],
});

// ---------- live ----------
const live = `
const P = ${JSON.stringify(P)};
const SOILS = ${JSON.stringify(SOILS)};
const drainOf = ${drainOf.toString()};
const XS = ${JSON.stringify(XS)}, Y = ${Y};
const GLASS = ${JSON.stringify(GLASS)}, SOIL_Z = ${SOIL_Z}, NOZ = ${NOZZLE.z0}, SPOUT_Z = ${SPOUT.z0}, G_FALL = ${G_FALL};
const POUR = 1.2, RATE = 2, HOLD = 3, EMPTY = 1.2, REST = 0.6, END = 20, DV = 1.5;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const parts = [0, 1, 2].map((i) => {
  const g = svg.querySelectorAll('[data-station="' + i + '"]');
  const w = g[0].querySelector('[data-part="water"]');
  return { water: w, paths: [...w.children], drops: [...g[0].querySelectorAll('[data-part="drops"] circle')], pond: g[1].querySelector('[data-part="pond"]'), stream: g[1].querySelector('[data-part="stream"]') };
});
const S = { t: END, pour: 1, empty: 0 };
const fmt = (p) => p.map((v) => v.toFixed(1)).join(" ");
function waterAt(i, h) {
  const w = parts[i];
  if (h < 0.15) { w.water.style.display = "none"; return; }
  w.water.style.display = "";
  const c = cylinder(XS[i], Y, GLASS.water, GLASS.floor, h, P, 48);
  const list = [c.fill, ...c.shades, c.top, c.crease, c.outline];
  list.forEach((d, n) => w.paths[n].setAttribute("d", d || ""));
}
const line = (x, z0, z1) => { const a = iso([x, Y, z0], P), b = iso([x, Y, z1], P); return "M" + fmt(a) + "L" + fmt(b); };
function draw() {
  const cells = SOILS.map((s, i) => {
    const d = drainOf(s, S.pour < 1 ? 0 : S.t);
    const keep = 1 - S.empty;
    const out = S.pour < 1 ? 0 : d.out * keep;
    const pond = (S.pour < 1 ? 100 * S.pour : d.pond) * keep;
    const p = parts[i];
    const top = GLASS.floor + out * GLASS.perMl;
    waterAt(i, out * GLASS.perMl);
    p.pond.setAttribute("fill-opacity", Math.min(1, pond / 60).toFixed(2));
    // poured stream: head falls during the pour, tail falls once it stops
    let st = "";
    if (S.pour > 0 && S.pour < 1) st = line(XS[i], NOZ, Math.max(SOIL_Z, NOZ - 0.5 * G_FALL * (S.pour * POUR) ** 2));
    else if (S.pour >= 1 && S.empty === 0 && S.t < 0.4) { const tail = NOZ - 0.5 * G_FALL * S.t * S.t; if (tail > SOIL_Z) st = line(XS[i], tail, SOIL_Z); }
    p.stream.setAttribute("d", st);
    // drips: drop n leaves the spout when n·DV ml have run out, then falls freely
    let n = 0;
    if (S.pour >= 1 && S.empty === 0) {
      const ran = d.out / DV;
      for (let m = Math.floor(ran); m >= 1 && n < p.drops.length; m--) {
        const tm = -s.tau * Math.log(1 - (m * DV) / d.most);
        const z = SPOUT_Z - 0.5 * G_FALL * (S.t - tm) ** 2;
        if (z <= top) break;
        const [cx, cy] = iso([XS[i], Y, z], P);
        const dot = p.drops[n++];
        dot.setAttribute("cx", cx.toFixed(1)); dot.setAttribute("cy", cy.toFixed(1)); dot.style.display = "";
      }
    }
    for (; n < p.drops.length; n++) p.drops[n].style.display = "none";
    return s.name + " " + Math.round(out) + " ml";
  });
  let text;
  if (S.pour < 1) text = "倒水啦……";
  else if (S.empty > 0) text = "把水倒掉，再来一次";
  else text = "第 " + Math.round(S.t) + " 秒 · " + cells.join(" · ");
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(Math.round(S.t)));
}
function describe() {
  const c = SOILS.map((s) => s.name + Math.round(drainOf(s, S.t).out) + "毫升");
  stage.setAttribute("aria-valuetext", "第" + Math.round(S.t) + "秒：" + c.join("，"));
}
// idle tour: pour, drain 20 s (twice as fast), hold, empty, repeat
const tourLength = POUR + END / RATE + HOLD + EMPTY + REST;
function tourAt(c) {
  c %= tourLength;
  if (c < POUR) return { t: 0, pour: c / POUR, empty: 0 };
  c -= POUR;
  if (c < END / RATE) return { t: c * RATE, pour: 1, empty: 0 };
  c -= END / RATE;
  if (c < HOLD) return { t: END, pour: 1, empty: 0 };
  c -= HOLD;
  if (c < EMPTY) return { t: END, pour: 1, empty: c / EMPTY };
  return { t: 0, pour: 0, empty: 0 };
}
let mode = still.matches ? "still" : "tour", clock = 0, frame = 0, last = 0, visible = false, touched = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (mode === "tour") { clock += dt; Object.assign(S, tourAt(clock)); }
  else if (mode === "run") {
    if (S.pour < 1) S.pour = Math.min(1, S.pour + dt / POUR);
    else S.t = Math.min(END, S.t + dt * RATE);
    if (S.t >= END) { mode = "idle"; touched = now; describe(); }
  } else if (mode === "idle" && !still.matches && now - touched > 4000) { mode = "tour"; clock = 0; }
  draw();
  frame = visible && mode !== "still" ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && mode !== "still") { last = 0; frame = requestAnimationFrame(tick); } };
const hold = () => { touched = performance.now(); if (mode === "tour") mode = "idle"; };
function pour() {
  touched = performance.now();
  Object.assign(S, { t: 0, pour: 0, empty: 0 });
  if (still.matches) { Object.assign(S, { t: END, pour: 1 }); draw(); describe(); return; }
  mode = "run"; run();
}
function scrub(t) {
  if (mode !== "still") mode = "idle";
  touched = performance.now();
  Object.assign(S, { t: Math.max(0, Math.min(END, t)), pour: 1, empty: 0 });
  draw(); run();
}
let down = null;
stage.addEventListener("pointerdown", (e) => { down = { x: e.clientX, t: S.pour < 1 ? 0 : S.t, moved: false, id: e.pointerId }; hold(); });
stage.addEventListener("pointermove", (e) => {
  if (!down || e.pointerId !== down.id) return;
  const dx = e.clientX - down.x;
  if (!down.moved && Math.abs(dx) > 6) { down.moved = true; stage.setPointerCapture(e.pointerId); }
  if (down.moved) scrub(down.t + (dx / stage.getBoundingClientRect().width) * 24);
});
const release = (e) => {
  if (!down || e.pointerId !== down.id) return;
  if (!down.moved && e.type === "pointerup") pour(); else describe();
  if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
  down = null;
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 5 : 1, now = S.pour < 1 ? 0 : S.t;
  let to = null;
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pour(); return; }
  if (e.key === "ArrowRight" || e.key === "ArrowUp") to = now + step;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = now - step;
  if (e.key === "Home") to = 0;
  if (e.key === "End") to = END;
  if (to === null) return;
  e.preventDefault();
  scrub(Math.round(to));
  describe();
});
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
still.addEventListener("change", () => { mode = still.matches ? "still" : "tour"; if (still.matches) Object.assign(S, { t: END, pour: 1, empty: 0 }); draw(); run(); });
draw();
describe();
`;

const css = `<style>
.iso{--soil-sand:#ebe7df;--soil-clay:#d6d1ca;--soil-loam:#77716a;--soil-leaf:#a59d92;--water-top:#e4ecef;--water-side:#d5e0e4;--mouth:#e9e9e7}
.iso[data-theme="dark"]{--soil-sand:#2a2925;--soil-clay:#201f1d;--soil-loam:#0c0c0b;--soil-leaf:#1d1c1a;--water-top:#26303a;--water-side:#1e262e;--mouth:#0e0e0e}
.soil.sand{fill:var(--soil-sand)}.soil.clay{fill:var(--soil-clay)}.soil.loam{fill:var(--soil-loam)}.soil.leaf{fill:var(--soil-leaf)}
.mouth{fill:var(--mouth)}
.pond{fill:var(--water-top)}
.iso-solid.water>.iso-fill,.iso-solid.water>.iso-shade{fill:var(--water-side)}
.iso-solid.water>.iso-top{fill:var(--water-top)}
.iso-line.stream{stroke-width:1.4}
[data-part="drops"] circle{fill:var(--water-top);stroke:var(--anatomy-lit);stroke-width:.5}
.iso-stage{overflow:hidden}
@media (max-width:480px){.iso-stage svg{width:116%;max-width:none;margin:-2% -8% -4%}}
</style>`;

const plate = k.plateHtml({
  fig: "图 4",
  title: "哪一种泥土漏水最快？",
  hint: "点一下倒水，左右拖动看时间",
  readout: "第 20 秒 · " + SOILS.map((s) => `${s.name} ${Math.round(drainOf(s, 20).out)} ml`).join(" · "),
  keys: [
    { mark: "lit", label: "流下来的水" },
    { mark: "raised", label: "沙土、园土、黏土" },
  ],
  caption: "三个漏斗倒进一样多的水。沙土的沙粒大、空隙大，水流得最快；黏土的颗粒很细，会把水留住，流得最慢；园土在中间，最适合种植物。",
  body:
    css +
    `<div class="iso-stage" tabindex="0" role="slider" aria-label="泥土漏水实验：点一下或按回车倒水，左右拖动或按方向键看第几秒" aria-valuemin="0" aria-valuemax="20" aria-valuenow="20">${svg}</div>`,
});

writeFig("soil", { title: "图 4 · 泥土漏水", plate, live });
