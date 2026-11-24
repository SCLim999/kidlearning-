// 图 6 · 双位数减法: tens rods and ones cubes on a place-value board. Step through 52 − 27:
// show 52 → the ones are not enough, so one ten is broken into ten ones → take away the ones → take away the tens → 25.
// Run: node fig/src/subtract.mjs  →  fig/subtract.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600, HEIGHT = 360;
const C = 6, G = 1.2; // cube size, gap
const ROD_GAP = 9, RODS = 9, ROD_X0 = -66, ROD_Y0 = -34;
const ONE_X0 = 20, ONE_Y0 = -36, ONE_COLS = 4, ONES = 20, ONE_STEP = 8.6;
const LIFT = 26;
const PLATE = { x: -78, y: -48, w: 150, d: 100, r: 8 };
const PLATE_H = 8, FOOT_H = 4;
const PROBLEMS = [[52, 27], [43, 18], [64, 23], [71, 36], [38, 15], [90, 46], [56, 29], [85, 42]];

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
  label: "双位数减法板：左边是十位，一条长方块是 1 个十；右边是个位，一个小方块是 1 个一。一步一步看 52 减 27：个位不够减，就拆开 1 个十变成 10 个一，再先减个位，后减十位。",
  body: [base(), ...items.map((x) => x.svg)],
});

const up = at([0, 0, LIFT]), z0 = at([0, 0, 0]);
const LIFT_PX = [up[0] - z0[0], up[1] - z0[1]];

const STYLE = `<style>
@media (max-width:520px){.iso-stage{overflow:hidden;margin:-3% 0 -2%}.iso-stage svg{width:112%;margin:0 -6%}}
.sb-item{transition:transform .55s cubic-bezier(.3,.7,.3,1),opacity .55s}
.sb-item.hide{opacity:0}
.sb-item.gone{opacity:.18}
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
  fig: "图 6",
  title: "双位数减法",
  hint: "点一下，看下一步",
  readout: "52 − 27",
  keys: [
    { mark: "raised", label: "长条 = 1 个十，小方块 = 1 个一" },
    { mark: "lit", label: "蓝色：拆开 1 个十变成的 10 个一；黄色：剩下的" },
  ],
  caption: "个位不够减，就向十位借 1 个十，拆成 10 个一。先减个位，再减十位。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="button" aria-label="双位数减法板：按一下或按空格看下一步">${svg}</div><div class="sb-step"><button type="button" data-go="-1">◀ 上一步</button><button type="button" data-go="1">下一步 ▶</button><button type="button" data-go="new">换一题</button></div>`,
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
  const [m, s] = PROBLEMS[pi], mt = Math.floor(m / 10), mo = m % 10, st = Math.floor(s / 10), so = s % 10, borrow = mo < so;
  const steps = ["show"].concat(borrow ? ["break"] : [], ["ones", "tens", "done"]);
  return { m, s, mt, mo, st, so, borrow, steps };
}
function set(el, { show, gone, lift, cls }) {
  el.classList.toggle("hide", !show);
  el.classList.toggle("gone", !!gone);
  el.classList.toggle("sb-new", cls === "new");
  el.classList.toggle("sb-left", cls === "left");
  el.style.transform = lift ? "translate(" + LIFT_PX[0] + "px," + LIFT_PX[1] + "px)" : "";
}
function draw() {
  const p = plan(), name = p.steps[step], i = p.steps.indexOf(name);
  const broke = p.borrow && i >= p.steps.indexOf("break");
  const tensNow = p.mt - (broke ? 1 : 0), onesNow = p.mo + (broke ? 10 : 0);
  const onesOut = i >= p.steps.indexOf("ones"), tensOut = i >= p.steps.indexOf("tens"), done = name === "done";
  rods.forEach((el, j) => {
    const isBroken = broke && j === p.mt - 1;
    const takenAway = tensOut && j >= tensNow - p.st && j < tensNow;
    set(el, { show: j < p.mt && !isBroken, gone: takenAway, lift: takenAway, cls: done && j < tensNow - p.st ? "left" : "" });
    if (isBroken) set(el, { show: false, lift: true });
  });
  ones.forEach((el, j) => {
    const fresh = broke && j >= p.mo && j < p.mo + 10;
    const takenAway = onesOut && j >= onesNow - p.so && j < onesNow;
    set(el, { show: j < onesNow, gone: takenAway, lift: takenAway, cls: done && j < onesNow - p.so ? "left" : fresh && !takenAway ? "new" : "" });
  });
  const leftT = tensOut ? tensNow - p.st : tensNow, leftO = onesOut ? onesNow - p.so : onesNow;
  cntT.textContent = String(leftT); cntO.textContent = String(leftO);
  const t = {
    show: p.m + " − " + p.s + "：" + p.m + " 是 " + p.mt + " 个十和 " + p.mo + " 个一",
    break: "个位 " + p.mo + " 不够减 " + p.so + "，拆开 1 个十 → " + tensNow + " 个十，" + onesNow + " 个一",
    ones: "先减个位：" + onesNow + " − " + p.so + " = " + (onesNow - p.so),
    tens: "再减十位：" + tensNow + " − " + p.st + " = " + (tensNow - p.st) + " 个十",
    done: p.m + " − " + p.s + " = " + (p.m - p.s),
  }[name];
  readout.textContent = t;
  stage.setAttribute("aria-label", "双位数减法板，第 " + (i + 1) + " 步，共 " + p.steps.length + " 步：" + t + "。按空格看下一步");
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

writeFig("subtract", { title: "双位数减法", plate, live });
