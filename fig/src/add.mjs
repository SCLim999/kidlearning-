// 图 7 · 双位数加法: tens rods and ones cubes on a place-value board. Step through 27 + 35:
// show 27 → bring in 35 → add the ones (12) → ten ones become one ten (进位) → add the tens → 62.
// Run: node fig/src/add.mjs  →  fig/add.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600, HEIGHT = 360;
const C = 6, G = 1.2; // cube size, gap
const ROD_GAP = 9, RODS = 9, ROD_X0 = -66, ROD_Y0 = -34;
const ONE_X0 = 20, ONE_Y0 = -36, ONE_COLS = 4, ONES = 20, ONE_STEP = 8.6;
const LIFT = 26;
const PLATE = { x: -78, y: -48, w: 150, d: 100, r: 8 };
const PLATE_H = 8, FOOT_H = 4;
const PROBLEMS = [[27, 35], [46, 28], [32, 41], [38, 24], [53, 26], [19, 45], [64, 17], [58, 36]];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [ROD_X0, ROD_Y0, C + LIFT], [ONE_X0 + 30, ONE_Y0, C + LIFT]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 40, elevation: 34 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const rodX = (i) => ROD_X0 + i * ROD_GAP;
const oneXY = (i) => [ONE_X0 + (i % ONE_COLS) * ONE_STEP, ONE_Y0 + Math.floor(i / ONE_COLS) * ONE_STEP];

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of k.corners(PLATE, 14).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) {
    out.push(S(k.cylinder(x, y, 5.5, -PLATE_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.2), { tone: "mid" }));
  // two trays: 十位 (tens) and 个位 (ones)
  const tensTray = { x: ROD_X0 - 4, y: ROD_Y0 - 4, w: RODS * ROD_GAP + 4, d: 10 * (C + G) + 6, r: 3 };
  const onesTray = { x: ONE_X0 - 4, y: ONE_Y0 - 4, w: ONE_COLS * ONE_STEP + 5, d: 5 * ONE_STEP + 5, r: 3 };
  out.push(L(k.planOutline(tensTray, 0, P, 4) + k.planOutline(onesTray, 0, P, 4), { tone: "lo" }));
  out.push(k.faceTextSvg(k.topMatrix([tensTray.x + tensTray.w / 2, tensTray.y + tensTray.d + 7], 0, P, "x"), "十位", { size: 6, tone: "mid", anchor: "middle" }));
  out.push(k.faceTextSvg(k.topMatrix([onesTray.x + onesTray.w / 2, onesTray.y + onesTray.d + 7], 0, P, "x"), "个位", { size: 6, tone: "mid", anchor: "middle" }));
  out.push(`<g data-count="t">${k.faceTextSvg(k.topMatrix([tensTray.x + tensTray.w / 2, tensTray.y + tensTray.d + 15], 0, P, "x"), "", { size: 8, tone: "hi", anchor: "middle" })}</g>`);
  out.push(`<g data-count="o">${k.faceTextSvg(k.topMatrix([onesTray.x + onesTray.w / 2, onesTray.y + onesTray.d + 15], 0, P, "x"), "", { size: 8, tone: "hi", anchor: "middle" })}</g>`);
  out.push(D(k.corners(PLATE, 5).map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

function rod(i) {
  const x = rodX(i), plan = { x, y: ROD_Y0, w: C, d: 10 * (C + G) - G, r: 0.8 };
  let seams = "";
  for (let j = 1; j < 10; j++) seams += k.lineOnTop([x, ROD_Y0 + j * (C + G) - G / 2], [x + C, ROD_Y0 + j * (C + G) - G / 2], C, P);
  return `<g class="sb-item" data-rod="${i}">${S(k.slabOf(plan, 0, C, P, 3, 0.4), { tone: "mid", inner: "" })}${L(seams, { tone: "faint", free: true })}</g>`;
}
function one(i) {
  const [x, y] = oneXY(i);
  return `<g class="sb-item" data-one="${i}">${S(k.slabOf({ x, y, w: C, d: C, r: 0.8 }, 0, C, P, 3, 0.4), { tone: "mid" })}</g>`;
}

const items = [
  ...Array.from({ length: RODS }, (_, i) => ({ d: k.depthOf([rodX(i) + C / 2, ROD_Y0 + 35, 0], P), svg: rod(i) })),
  ...Array.from({ length: ONES }, (_, i) => { const [x, y] = oneXY(i); return { d: k.depthOf([x + C / 2, y + C / 2, 0], P), svg: one(i) }; }),
].sort((a, b) => a.d - b.d);

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "双位数加法板：左边是十位，一条长方块是 1 个十；右边是个位，一个小方块是 1 个一。一步一步看 27 加 35：先加个位，个位满 10 个就换成 1 个十（进位），再加十位。",
  body: [base(), ...items.map((x) => x.svg)],
});

const up = at([0, 0, LIFT]), z0 = at([0, 0, 0]);
const LIFT_PX = [up[0] - z0[0], up[1] - z0[1]];

const STYLE = `<style>
@media (max-width:520px){.iso-stage{overflow:hidden;margin:-3% 0 -2%}.iso-stage svg{width:112%;margin:0 -6%}}
.sb-item{transition:transform .55s cubic-bezier(.3,.7,.3,1),opacity .55s}
.sb-item.hide{opacity:0}
.sb-item.gone{opacity:.18}
.sb-carry{--anatomy-top:#c8f0d2;--anatomy-face:#e0f7e6;--anatomy-shade-0:#7fd197;--anatomy-shade-1:#95d9a8;--anatomy-shade-2:#abe1b9;--anatomy-shade-3:#c1e9cb}
.iso[data-theme="dark"] .sb-carry{--anatomy-top:#1f5a32;--anatomy-face:#174426;--anatomy-shade-0:#0e2b18;--anatomy-shade-1:#11321c;--anatomy-shade-2:#143920;--anatomy-shade-3:#174024}
.sb-new{--anatomy-top:#cfe8ff;--anatomy-face:#e3f2ff;--anatomy-shade-0:#8cc4f2;--anatomy-shade-1:#a0cff5;--anatomy-shade-2:#b4daf7;--anatomy-shade-3:#c8e4fa}
.sb-left{--anatomy-top:#ffe9a3;--anatomy-face:#fff3cc;--anatomy-shade-0:#f2c94c;--anatomy-shade-1:#f5d36b;--anatomy-shade-2:#f8dd8a;--anatomy-shade-3:#fbe6a8}
.iso[data-theme="dark"] .sb-new{--anatomy-top:#24476b;--anatomy-face:#1b3654;--anatomy-shade-0:#12263c;--anatomy-shade-1:#152c45;--anatomy-shade-2:#18324e;--anatomy-shade-3:#1b3857}
.iso[data-theme="dark"] .sb-left{--anatomy-top:#6b5514;--anatomy-face:#4d3d0e;--anatomy-shade-0:#3a2e0a;--anatomy-shade-1:#42340c;--anatomy-shade-2:#4a3a0d;--anatomy-shade-3:#52410f}
[data-count] .iso-face-text{fill:var(--anatomy-strong);font-weight:800}
.sb-step{display:flex;justify-content:center;gap:8px;margin:2px 0 6px}
.sb-step button{font:inherit;font-size:15px;font-weight:700;padding:6px 14px;border-radius:999px;border:1.5px solid var(--anatomy-text);background:var(--anatomy-card);color:var(--anatomy-strong);cursor:pointer;min-height:40px}
@media (prefers-reduced-motion: reduce){.sb-item{transition:none}}
</style>`;

const plate = k.plateHtml({
  fig: "图 7",
  title: "双位数加法",
  hint: "点一下，看下一步",
  readout: "27 + 35",
  keys: [
    { mark: "raised", label: "长条 = 1 个十，小方块 = 1 个一" },
    { mark: "lit", label: "蓝色：加进来的数；绿色：满 10 个一换成的 1 个十；黄色：答案" },
  ],
  caption: "先加个位，再加十位。个位满 10 个，就换成 1 个十，送到十位去（进位）。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="button" aria-label="双位数加法板：按一下或按空格看下一步">${svg}</div><div class="sb-step"><button type="button" data-go="-1">◀ 上一步</button><button type="button" data-go="1">下一步 ▶</button><button type="button" data-go="new">换一题</button></div>`,
});

const live = `
const LIFT_PX = ${JSON.stringify(LIFT_PX)};
const PROBLEMS = ${JSON.stringify(PROBLEMS)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const rods = [...svg.querySelectorAll("[data-rod]")].sort((a, b) => a.dataset.rod - b.dataset.rod);
const ones = [...svg.querySelectorAll("[data-one]")].sort((a, b) => a.dataset.one - b.dataset.one);
const cntT = svg.querySelector('[data-count="t"] text'), cntO = svg.querySelector('[data-count="o"] text');
let pi = 0, step = 0, auto = !still.matches, timer = 0, idle = 0, visible = false;
function plan() {
  const [m, s] = PROBLEMS[pi], mt = Math.floor(m / 10), mo = m % 10, st = Math.floor(s / 10), so = s % 10, carry = mo + so >= 10;
  const steps = ["show", "add", "ones"].concat(carry ? ["carry"] : [], ["tens", "done"]);
  return { m, s, mt, mo, st, so, carry, steps };
}
function set(el, { show, gone, lift, cls }) {
  el.classList.toggle("hide", !show);
  el.classList.toggle("gone", !!gone);
  el.classList.toggle("sb-new", cls === "new");
  el.classList.toggle("sb-left", cls === "left");
  el.classList.toggle("sb-carry", cls === "carry");
  el.style.transform = lift ? "translate(" + LIFT_PX[0] + "px," + LIFT_PX[1] + "px)" : "";
}
function draw() {
  const p = plan(), name = p.steps[step], i = p.steps.indexOf(name), past = (n) => p.steps.indexOf(n) >= 0 && i >= p.steps.indexOf(n);
  const added = past("add"), carried = p.carry && past("carry"), done = name === "done";
  const onesAll = p.mo + (added ? p.so : 0), onesLeft = carried ? onesAll - 10 : onesAll;
  const tensAll = p.mt + (added ? p.st : 0) + (carried ? 1 : 0);
  rods.forEach((el, j) => {
    const fromB = j >= p.mt && j < p.mt + p.st, isCarry = carried && j === p.mt + p.st;
    set(el, { show: j < p.mt || (added && fromB) || isCarry, cls: done ? "left" : isCarry ? "carry" : fromB ? "new" : "" });
  });
  ones.forEach((el, j) => {
    const fromB = j >= p.mo && j < p.mo + p.so, show = j < p.mo || (added && fromB);
    const traded = carried && j >= onesLeft && j < onesAll;
    set(el, { show, gone: traded, lift: traded, cls: done && !traded ? "left" : traded ? "carry" : fromB ? "new" : "" });
  });
  cntT.textContent = String(tensAll); cntO.textContent = String(onesLeft);
  const t = {
    show: p.m + " + " + p.s + "：" + p.m + " 是 " + p.mt + " 个十和 " + p.mo + " 个一",
    add: "加进来 " + p.s + "：" + p.st + " 个十和 " + p.so + " 个一（蓝色）",
    ones: "先加个位：" + p.mo + " + " + p.so + " = " + (p.mo + p.so) + (p.carry ? "，满 10 了！" : ""),
    carry: "10 个一换成 1 个十，送到十位（进位），个位剩 " + (p.mo + p.so - 10),
    tens: "再加十位：" + p.mt + " + " + p.st + (p.carry ? " + 1" : "") + " = " + (p.mt + p.st + (p.carry ? 1 : 0)) + " 个十",
    done: p.m + " + " + p.s + " = " + (p.m + p.s),
  }[name];
  readout.textContent = t;
  stage.setAttribute("aria-label", "双位数加法板，第 " + (i + 1) + " 步，共 " + p.steps.length + " 步：" + t + "。按空格看下一步");
}
function go(d) {
  const p = plan();
  if (d === "new") { pi = (pi + 1) % PROBLEMS.length; step = 0; }
  else { step += d; if (step >= p.steps.length) { pi = (pi + 1) % PROBLEMS.length; step = 0; } if (step < 0) step = 0; }
  draw();
}
function user(d) { auto = false; clearTimeout(idle); idle = setTimeout(() => { auto = !still.matches; loop(); }, 12000); go(d); }
function loop() { clearTimeout(timer); if (!auto || !visible) return; timer = setTimeout(() => { if (auto && visible) { go(1); loop(); } }, 2600); }
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; loop(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("click", () => user(1));
stage.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); user(1); }
  if (e.key === "ArrowLeft") { e.preventDefault(); user(-1); }
});
document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => user(b.dataset.go === "new" ? "new" : +b.dataset.go)));
still.addEventListener("change", () => { if (still.matches) { auto = false; clearTimeout(timer); } });
draw();
`;

writeFig("add", { title: "双位数加法", plate, live });
