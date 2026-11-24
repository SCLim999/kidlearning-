// 图 5 · 乘法积木板: a 10 × 10 board of cubes. Choose 「几排」 × 「每排几个」 and that block of cubes rises,
// with the running total at the end of each row (skip counting: 4, 8, 12 …) — so 3 × 4 is seen as 3 rows of 4.
// Run: node fig/src/times.mjs  →  fig/times.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600, HEIGHT = 380;
const N = 10, CELL = 11, CUBE = 8.4, CUBE_H = 5, RISE = 7;
const X0 = -(N * CELL) / 2, Y0 = -(N * CELL) / 2;
const PLATE = { x: X0 - 15, y: Y0 - 8, w: N * CELL + 23, d: N * CELL + 23, r: 8 };
const PLATE_H = 8, FOOT_H = 4;
const A0 = 3, B0 = 4;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [X0, Y0, CUBE_H + RISE + 6], [X0 + N * CELL, Y0 + N * CELL, CUBE_H + RISE]],
  WIDTH, HEIGHT, { pad: 12, azimuth: 45, elevation: 34 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const cx = (c) => X0 + c * CELL + CELL / 2, cy = (r) => Y0 + r * CELL + CELL / 2;

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 16).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) {
    out.push(S(k.cylinder(x, y, 6, -PLATE_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.2), { tone: "mid" }));
  // the sunken tray the cubes sit in, with its grid lines
  const tray = { x: X0 - 2, y: Y0 - 2, w: N * CELL + 4, d: N * CELL + 4, r: 2 };
  out.push(L(k.planOutline(tray, 0, P, 3), { tone: "lo" }));
  let grid = "";
  for (let i = 1; i < N; i++) {
    grid += k.lineOnTop([X0 + i * CELL, Y0], [X0 + i * CELL, Y0 + N * CELL], 0, P);
    grid += k.lineOnTop([X0, Y0 + i * CELL], [X0 + N * CELL, Y0 + i * CELL], 0, P);
  }
  out.push(L(grid, { tone: "faint" }));
  out.push(D(k.corners(PLATE, 6).map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // numbers 1–10: 「每排几个」 along one edge, 「几排」 along the other
  for (let i = 0; i < N; i++) {
    out.push(`<g class="tm-lab" data-col="${i}">${k.faceTextSvg(k.topMatrix([cx(i), Y0 + N * CELL + 8.5], 0, P, "x"), String(i + 1), { size: 6.5, tone: "mid", anchor: "middle" })}</g>`);
    out.push(`<g class="tm-lab" data-row="${i}">${k.faceTextSvg(k.topMatrix([X0 - 7, cy(i) + 2.2], 0, P, "x"), String(i + 1), { size: 6.5, tone: "mid", anchor: "middle" })}</g>`);
  }
  return out.join("");
}

function cube(r, c) {
  const plan = { x: cx(c) - CUBE / 2, y: cy(r) - CUBE / 2, w: CUBE, d: CUBE, r: 1.2 };
  return `<g data-cell="${r}-${c}">${S(k.slabOf(plan, 0, CUBE_H, P, 3, 0.5), { tone: "mid" })}</g>`;
}

const cells = [];
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) cells.push([r, c]);
cells.sort((a, b) => k.depthOf([cx(a[1]), cy(a[0]), 0], P) - k.depthOf([cx(b[1]), cy(b[0]), 0], P));

const body = [
  base(),
  ...cells.map(([r, c]) => cube(r, c)),
  // running totals at the end of each chosen row (moved by the live code)
  ...Array.from({ length: N }, (_, r) => `<g class="tm-sum" data-sum="${r}" style="display:none">${k.faceTextSvg("", "", { size: 7, tone: "hi", anchor: "start" })}</g>`),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "乘法积木板：十乘十的小方块。选好几排、每排几个，那一块方块就会升起来，每一排后面写着数到这一排一共有几个。",
  body,
});

const STYLE = `<style>
@media (max-width:520px){.iso-stage{overflow:hidden;margin:-3% 0 -2%}.iso-stage svg{width:112%;margin:0 -6%}}
.tm-on{--anatomy-top:#ffe9a3;--anatomy-face:#fff3cc;--anatomy-shade-0:#f2c94c;--anatomy-shade-1:#f5d36b;--anatomy-shade-2:#f8dd8a;--anatomy-shade-3:#fbe6a8}
.iso[data-theme="dark"] .tm-on{--anatomy-top:#6b5514;--anatomy-face:#4d3d0e;--anatomy-shade-0:#3a2e0a;--anatomy-shade-1:#42340c;--anatomy-shade-2:#4a3a0d;--anatomy-shade-3:#52410f}
.tm-lab .iso-face-text{transition:fill .2s}
.tm-lab.on .iso-face-text{fill:var(--anatomy-strong);font-weight:800}
.tm-sum .iso-face-text{fill:var(--anatomy-strong);font-weight:800}
[data-cell]{cursor:pointer}
</style>`;

const plate = k.plateHtml({
  fig: "图 5",
  title: "乘法积木板",
  hint: "点一个方块，或用方向键",
  readout: `${A0} × ${B0} = ${A0 * B0}`,
  keys: [
    { mark: "raised", label: "升起来的方块：几排 × 每排几个（左边的数是几排，前面的数是每排几个）" },
    { mark: "line", label: "每排后面的数：一排一排数" },
  ],
  caption: "3 × 4 就是 3 排，每排 4 个：4、8、12，一共 12 个。转过来看是 4 排、每排 3 个，也是 12 个。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="application" aria-roledescription="乘法积木板" aria-label="乘法积木板：上下键改几排，左右键改每排几个">${svg}</div>`,
});

const live = `
const P = ${JSON.stringify(P)};
const N = ${N}, CELL = ${CELL}, X0 = ${X0}, Y0 = ${Y0}, CUBE_H = ${CUBE_H}, RISE = ${RISE};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const cellEl = {};
svg.querySelectorAll("[data-cell]").forEach((g) => (cellEl[g.dataset.cell] = g));
const cols = [...svg.querySelectorAll("[data-col]")], rows = [...svg.querySelectorAll("[data-row]")];
const sums = [...svg.querySelectorAll("[data-sum]")];
const cx = (c) => X0 + c * CELL + CELL / 2, cy = (r) => Y0 + r * CELL + CELL / 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let a = ${A0}, b = ${B0};
const h = {};
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) h[r + "-" + c] = r < a && c < b ? RISE : 0;
const TOUR = [[3, 4], [4, 3], [2, 5], [5, 2], [2, 2], [3, 3], [4, 5], [5, 4], [2, 10], [10, 2], [5, 5], [3, 6], [6, 3]];
let tour = still.matches ? -1 : 0, frame = 0, last = 0, wait = 0, idle = 0, visible = false;
function text() {
  const n = a * b;
  return a + " × " + b + " = " + n + (a !== b && a <= N && b <= N ? "（" + b + " × " + a + " 也是 " + n + "）" : "");
}
function draw() {
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const key = r + "-" + c, g = cellEl[key], on = r < a && c < b;
    g.setAttribute("transform", translateAlong(P, [0, 0, h[key]]));
    g.classList.toggle("tm-on", on);
  }
  cols.forEach((g, i) => g.classList.toggle("on", i === b - 1));
  rows.forEach((g, i) => g.classList.toggle("on", i === a - 1));
  sums.forEach((g, r) => {
    if (r >= a) { g.style.display = "none"; return; }
    g.style.display = "";
    const t = g.firstChild;
    t.textContent = String((r + 1) * b);
    t.setAttribute("transform", topMatrix([X0 + b * CELL + 2.5, cy(r) + 2], CUBE_H + RISE, P, "x"));
  });
  const tx = text();
  if (readout.textContent !== tx) readout.textContent = tx;
  stage.setAttribute("aria-valuetext", a + " 排，每排 " + b + " 个，一共 " + a * b + " 个");
}
function settle(dt) {
  let moving = false;
  for (const key in h) {
    const [r, c] = key.split("-").map(Number), goal = r < a && c < b ? RISE : 0;
    if (still.matches || dt === 0) { h[key] = goal; continue; }
    const nx = h[key] + (goal - h[key]) * (1 - Math.exp(-dt / 0.09));
    h[key] = Math.abs(goal - nx) < 0.05 ? goal : nx;
    if (h[key] !== goal) moving = true;
  }
  return moving;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (tour >= 0) { wait += dt; if (wait > 2.6) { wait = 0; tour = (tour + 1) % TOUR.length; [a, b] = TOUR[tour]; } }
  const moving = settle(dt);
  draw();
  frame = visible && (moving || tour >= 0) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function pickAB(na, nb) {
  tour = -1; a = clamp(na, 1, N); b = clamp(nb, 1, N);
  clearTimeout(idle); idle = setTimeout(() => { if (!still.matches) { tour = 0; wait = 0; run(); } }, 9000);
  if (still.matches) { settle(0); draw(); } else run();
}
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
const cellAt = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY); const g = el && el.closest("[data-cell]"); return g ? g.dataset.cell.split("-").map(Number) : null; };
let drag = null;
stage.addEventListener("pointerdown", (e) => { const rc = cellAt(e); if (!rc) return; drag = e.pointerId; stage.setPointerCapture(e.pointerId); pickAB(rc[0] + 1, rc[1] + 1); });
stage.addEventListener("pointermove", (e) => { if (drag !== e.pointerId) return; const rc = cellAt(e); if (rc && (rc[0] + 1 !== a || rc[1] + 1 !== b)) pickAB(rc[0] + 1, rc[1] + 1); });
const end = (e) => { if (drag === e.pointerId) { drag = null; try { stage.releasePointerCapture(e.pointerId); } catch {} } };
stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
stage.addEventListener("keydown", (e) => {
  const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
  if (!m) return;
  e.preventDefault();
  pickAB(a + m[0], b + m[1]);
});
still.addEventListener("change", () => { if (still.matches) { tour = -1; settle(0); draw(); } });
settle(0);
draw();
`;

writeFig("times", { title: "乘法积木板", plate, live });
