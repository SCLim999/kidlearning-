// 图 8 · 除法平分: a pile of cubes is dealt out round by round, one cube to each plate, until the pile is empty.
// 12 ÷ 3: twelve cubes, three plates → after four rounds every plate holds 4, so 12 ÷ 3 = 4.
// Run: node fig/src/divide.mjs  →  fig/divide.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const WIDTH = 600, HEIGHT = 360;
const C = 6, MAX = 20, PILE_COLS = 4, PILE_STEP = 8.6, PILE_X0 = -24, PILE_Y0 = -52;
const PLATES = 5, PLATE_R = 15, PLATE_GAP = 33, PLATE_Y = 26, PLATE_H = 2;
const plateX = (p) => -64 + p * PLATE_GAP;
const BOARD = { x: -84, y: -64, w: 186, d: 116, r: 8 };
const BOARD_H = 8, FOOT_H = 4;
const PROBLEMS = [[12, 3], [8, 2], [15, 5], [10, 2], [12, 4], [20, 5], [9, 3], [16, 4], [6, 3], [18, 3]];

const P = k.fitProjection(
  [...k.boxCorners(BOARD, -BOARD_H - FOOT_H, 0), [PILE_X0, PILE_Y0, C + 4]],
  WIDTH, HEIGHT, { pad: 14, azimuth: 38, elevation: 36 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const pileXY = (i) => [PILE_X0 + (i % PILE_COLS) * PILE_STEP, PILE_Y0 + Math.floor(i / PILE_COLS) * PILE_STEP];
// up to 6 cubes on a plate: 3 across, 2 deep
const slotXY = (p, s) => [plateX(p) - 3 - C / 2 + ((s % 3) - 1) * 7.4 + 3, PLATE_Y - C / 2 + (Math.floor(s / 3) - 0.5) * 7.4];

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BOARD, -BOARD_H - FOOT_H, BOARD_H, P)}"/>`];
  for (const [x, y] of k.corners(BOARD, 14).sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) {
    out.push(S(k.cylinder(x, y, 5.5, -BOARD_H - FOOT_H, FOOT_H, P, 24), { tone: "lo" }));
  }
  out.push(S(k.slabOf(BOARD, -BOARD_H, BOARD_H, P, 8, 1.2), { tone: "mid" }));
  const tray = { x: PILE_X0 - 4, y: PILE_Y0 - 4, w: PILE_COLS * PILE_STEP + 5, d: 5 * PILE_STEP + 5, r: 3 };
  out.push(L(k.planOutline(tray, 0, P, 4), { tone: "lo" }));
  out.push(`<g data-count="pile">${k.faceTextSvg(k.topMatrix([tray.x + tray.w + 6, tray.y + tray.d / 2 + 3], 0, P, "x"), "", { size: 8, tone: "hi", anchor: "start" })}</g>`);
  out.push(D(k.corners(BOARD, 5).map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // plates, back to front
  for (let p = 0; p < PLATES; p++) {
    out.push(`<g class="dv-plate" data-plate="${p}">${S(k.cylinder(plateX(p), PLATE_Y, PLATE_R, 0, PLATE_H, P, 40, 0.4), { tone: "mid" })}${L(k.ring(plateX(p), PLATE_Y, PLATE_R - 3, PLATE_H, P, 32), { tone: "faint" })}
      <g data-count="${p}">${k.faceTextSvg(k.topMatrix([plateX(p), PLATE_Y + PLATE_R + 8], 0, P, "x"), "", { size: 8, tone: "hi", anchor: "middle" })}</g></g>`);
  }
  return out.join("");
}

const cubes = Array.from({ length: MAX }, (_, i) => {
  const [x, y] = pileXY(i);
  return { d: k.depthOf([x + C / 2, y + C / 2, 0], P), svg: `<g class="dv-item" data-cube="${i}">${S(k.slabOf({ x, y, w: C, d: C, r: 0.8 }, 0, C, P, 3, 0.4), { tone: "mid" })}</g>` };
}).sort((a, b) => a.d - b.d);

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "除法平分板：后面是一堆小方块，前面是几个盘子。一轮一轮地分，每个盘子每次放一个，分完了，每个盘子里的个数就是答案。",
  body: [base(), ...cubes.map((c) => c.svg)],
});

// screen offset (SVG units) from each pile slot to each plate slot, lifted onto the plate's top
const MOVE = {};
for (let i = 0; i < MAX; i++) for (let p = 0; p < PLATES; p++) for (let s = 0; s < 6; s++) {
  const [x0, y0] = pileXY(i), [x1, y1] = slotXY(p, s), a = at([x0, y0, 0]), b = at([x1, y1, PLATE_H]);
  MOVE[i + "," + p + "," + s] = [+(b[0] - a[0]).toFixed(1), +(b[1] - a[1]).toFixed(1)];
}

const STYLE = `<style>
@media (max-width:520px){.iso-stage{overflow:hidden;margin:-3% 0 -2%}.iso-stage svg{width:112%;margin:0 -6%}}
.dv-item{transition:transform .6s cubic-bezier(.3,.7,.3,1),opacity .4s}
.dv-item.hide,.dv-plate.hide{opacity:0}
.dv-plate{transition:opacity .4s}
.dv-c0{--anatomy-top:#cfe8ff;--anatomy-face:#e3f2ff;--anatomy-shade-0:#8cc4f2;--anatomy-shade-1:#a0cff5;--anatomy-shade-2:#b4daf7;--anatomy-shade-3:#c8e4fa}
.dv-c1{--anatomy-top:#ffd6e0;--anatomy-face:#ffe6ec;--anatomy-shade-0:#f29bb2;--anatomy-shade-1:#f5adc0;--anatomy-shade-2:#f8bfce;--anatomy-shade-3:#fbd1dc}
.dv-c2{--anatomy-top:#c8f0d2;--anatomy-face:#e0f7e6;--anatomy-shade-0:#7fd197;--anatomy-shade-1:#95d9a8;--anatomy-shade-2:#abe1b9;--anatomy-shade-3:#c1e9cb}
.dv-c3{--anatomy-top:#ffe9a3;--anatomy-face:#fff3cc;--anatomy-shade-0:#f2c94c;--anatomy-shade-1:#f5d36b;--anatomy-shade-2:#f8dd8a;--anatomy-shade-3:#fbe6a8}
.dv-c4{--anatomy-top:#e3d4ff;--anatomy-face:#efe6ff;--anatomy-shade-0:#b49be8;--anatomy-shade-1:#c1aded;--anatomy-shade-2:#cebff1;--anatomy-shade-3:#dbd1f5}
.iso[data-theme="dark"] .dv-c0{--anatomy-top:#24476b;--anatomy-face:#1b3654;--anatomy-shade-0:#12263c;--anatomy-shade-1:#152c45;--anatomy-shade-2:#18324e;--anatomy-shade-3:#1b3857}
.iso[data-theme="dark"] .dv-c1{--anatomy-top:#6b2a3c;--anatomy-face:#52202e;--anatomy-shade-0:#3a1620;--anatomy-shade-1:#421a25;--anatomy-shade-2:#4a1d29;--anatomy-shade-3:#52202e}
.iso[data-theme="dark"] .dv-c2{--anatomy-top:#1f5a32;--anatomy-face:#174426;--anatomy-shade-0:#0e2b18;--anatomy-shade-1:#11321c;--anatomy-shade-2:#143920;--anatomy-shade-3:#174024}
.iso[data-theme="dark"] .dv-c3{--anatomy-top:#6b5514;--anatomy-face:#4d3d0e;--anatomy-shade-0:#3a2e0a;--anatomy-shade-1:#42340c;--anatomy-shade-2:#4a3a0d;--anatomy-shade-3:#52410f}
.iso[data-theme="dark"] .dv-c4{--anatomy-top:#45306b;--anatomy-face:#352452;--anatomy-shade-0:#22173a;--anatomy-shade-1:#281b42;--anatomy-shade-2:#2e1f4a;--anatomy-shade-3:#342352}
[data-count] .iso-face-text{fill:var(--anatomy-strong);font-weight:800}
.sb-step{display:flex;justify-content:center;gap:8px;margin:2px 0 6px}
.sb-step button{font:inherit;font-size:15px;font-weight:700;padding:6px 14px;border-radius:999px;border:1.5px solid var(--anatomy-text);background:var(--anatomy-card);color:var(--anatomy-strong);cursor:pointer;min-height:40px}
@media (prefers-reduced-motion: reduce){.dv-item,.dv-plate{transition:none}}
</style>`;

const plate = k.plateHtml({
  fig: "图 8",
  title: "除法：平分",
  hint: "点一下，分一轮",
  readout: "12 ÷ 3",
  keys: [
    { mark: "raised", label: "后面一堆方块：要分的东西" },
    { mark: "flat", label: "前面的盘子：分给几个人" },
  ],
  caption: "平分就是一轮一轮地分，每个盘子每次放一个，一直分到分完。每个盘子一样多，那个数就是答案。",
  body: `${STYLE}<div class="iso-stage" tabindex="0" role="button" aria-label="除法平分板：按一下或按空格分一轮">${svg}</div><div class="sb-step"><button type="button" data-go="-1">◀ 上一步</button><button type="button" data-go="1">分一轮 ▶</button><button type="button" data-go="new">换一题</button></div>`,
});

const live = `
const MOVE = ${JSON.stringify(MOVE)};
const PROBLEMS = ${JSON.stringify(PROBLEMS)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const cubes = [...svg.querySelectorAll("[data-cube]")].sort((a, b) => a.dataset.cube - b.dataset.cube);
const plates = [...svg.querySelectorAll("[data-plate]")].sort((a, b) => a.dataset.plate - b.dataset.plate);
const pileCount = svg.querySelector('[data-count="pile"] text');
const plateCount = plates.map((p) => p.querySelector("[data-count] text"));
let pi = 0, step = 0, auto = !still.matches, timer = 0, idle = 0, visible = false;
function draw() {
  const [total, n] = PROBLEMS[pi], q = total / n, moved = step * n;
  cubes.forEach((el, i) => {
    el.classList.toggle("hide", i >= total);
    // deal from the top of the pile: cube total-1 goes first
    const order = total - 1 - i, on = i < total && order < moved, p = order % n, s = Math.floor(order / n);
    for (let c = 0; c < 5; c++) el.classList.toggle("dv-c" + c, on && c === p);
    const m = on ? MOVE[i + "," + p + "," + s] : null;
    el.style.transform = m ? "translate(" + m[0] + "px," + m[1] + "px)" : "";
  });
  plates.forEach((el, p) => { el.classList.toggle("hide", p >= n); plateCount[p].textContent = p < n ? String(step) : ""; });
  pileCount.textContent = total - moved > 0 ? String(total - moved) : "0";
  const t = step === 0 ? total + " 个方块，平分给 " + n + " 个盘子" : step < q ? "第 " + step + " 轮：每个盘子放 1 个，已经分了 " + moved + " 个，还剩 " + (total - moved) + " 个" : total + " ÷ " + n + " = " + q + "：分完了，每个盘子 " + q + " 个";
  readout.textContent = t;
  stage.setAttribute("aria-label", "除法平分板：" + t + "。按空格分一轮");
}
function go(d) {
  const [total, n] = PROBLEMS[pi], q = total / n;
  if (d === "new") { pi = (pi + 1) % PROBLEMS.length; step = 0; }
  else { step += d; if (step > q) { pi = (pi + 1) % PROBLEMS.length; step = 0; } if (step < 0) step = 0; }
  draw();
}
function user(d) { auto = false; clearTimeout(idle); idle = setTimeout(() => { auto = !still.matches; loop(); }, 12000); go(d); }
function loop() { clearTimeout(timer); if (!auto || !visible) return; timer = setTimeout(() => { if (auto && visible) { go(1); loop(); } }, 1800); }
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

writeFig("divide", { title: "除法：平分", plate, live });
