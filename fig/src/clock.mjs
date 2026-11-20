// Fig 1 「拆开的时钟」: a clock dial beside its motion works (8→24, 8→32 = 12:1) on a bench plate.
// Run: node fig/src/clock.mjs  →  fig/clock.html
import * as k from "./kit/iso-kit.mjs";
import { writeFig } from "./page.mjs";

const { extrude, lineOnTop, ring, solidSvg, lineSvg, iso } = k;

const WIDTH = 600;
const HEIGHT = 345;
const AZ = 45;
const EL = 34;

const PLATE = { x: -124, y: -76, w: 254, d: 148, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

// Dial (left/back)
const DIAL = [-62, -14];
const DIAL_R = 50;
const DIAL_Z = 6;
const DIAL_H = 9;
const DIAL_TOP = DIAL_Z + DIAL_H;

// Motion works (right/front). Module 2.4: 8t r 9.6, 24t r 28.8, 32t r 38.4, centres 38.4 apart.
const MOD = 2.4;
const CD = MOD * (8 + 24) / 2; // driver 8t ↔ 24t wheel
const CD2 = MOD * (8 + 32) / 2; // 8t pinion ↔ 32t hour wheel
const A = [40, 22];
const rad = (deg) => (deg * Math.PI) / 180;
const PHI_B = rad(AZ - 90); // hour wheel to the right of the 24t wheel on screen
const PHI_D = rad(AZ + 180); // driver straight behind it
const B = [A[0] + CD2 * Math.cos(PHI_B), A[1] + CD2 * Math.sin(PHI_B)];
const D = [A[0] + CD * Math.cos(PHI_D), A[1] + CD * Math.sin(PHI_D)];
const MOVE = { x: -4, y: -60, w: 126, d: 120, r: 6 };
const MOVE_H = 3;
const Z = { gear: 10, gearH: 3, pin0: 12.6, pin1: 19, hour: 16, hourH: 3, arbor: 24, knobH: 7 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [D[0], D[1], Z.arbor + Z.knobH + 2], [DIAL[0], DIAL[1] - DIAL_R, DIAL_TOP]],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: AZ, elevation: EL },
);

// 12 o'clock points away from the viewer, so it is "up" on screen. Hand angle t: direction (sin t, −cos t).
const T0 = rad(AZ) - Math.PI / 2;

/** Gear outline: N trapezoid teeth around (cx, cy), turned by `angle` (math angle, x→y). */
function gearRing(cx, cy, n, mod, angle) {
  const r = (mod * n) / 2, ra = r + mod, rf = r - 1.25 * mod, p = (Math.PI * 2) / n, out = [];
  for (let i = 0; i < n; i++) {
    const c = angle + i * p;
    for (const [rr, f] of [[rf, -0.5], [rf, -0.3], [ra, -0.13], [ra, 0.13], [rf, 0.3]]) out.push([cx + rr * Math.cos(c + f * p), cy + rr * Math.sin(c + f * p)]);
  }
  return out;
}
/** Angles of the three wheels from the minute hand angle `t`, phased so teeth mesh at both contacts. */
function gearAngles(t, G) {
  const pd = (Math.PI * 2) / 8, pa = (Math.PI * 2) / 24, pb = (Math.PI * 2) / 32;
  const d = t;
  const a = G.dToA + Math.PI - 0.5 * pa - (d - G.dToA) / 3;
  const pin = a + G.pinPhase;
  const b = G.aToB + Math.PI - 0.5 * pb - (pin - G.aToB) / 4;
  return { d, a, pin, b, pd };
}
function holesOn(cx, cy, count, rr, hr, angle, z, P) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const c = angle + (i * Math.PI * 2) / count + Math.PI / count;
    d += ring(cx + rr * Math.cos(c), cy + rr * Math.sin(c), hr, z, P, 18);
  }
  return d;
}
/** Every wheel of the train at minute angle t, as SVG strings for their groups. */
function trainSvg(t, G, P) {
  const g = gearAngles(t, G);
  const [D, A, B, Z, M] = [G.D, G.A, G.B, G.Z, G.mod];
  const driver = solidSvg(extrude(gearRing(D[0], D[1], 8, M, g.d), Z.gear, Z.gearH, P, { convex: false }), { tone: "mid" });
  const top24 = Z.gear + Z.gearH;
  const wheel24 =
    solidSvg(extrude(gearRing(A[0], A[1], 24, M, g.a), Z.gear, Z.gearH, P, { convex: false }), {
      tone: "hi",
    }) +
    lineSvg(holesOn(A[0], A[1], 5, 18, 4.6, g.a, top24, P), { tone: "faint" }) +
    lineSvg(ring(A[0], A[1], 23, top24, P, 64), { tone: "faint" });
  const pinion = solidSvg(extrude(gearRing(A[0], A[1], 8, M, g.pin), Z.pin0, Z.pin1 - Z.pin0, P, { convex: false }), { tone: "mid" });
  const top32 = Z.hour + Z.hourH;
  const tb = g.b + G.hourMark;
  const wheel32 =
    solidSvg(extrude(gearRing(B[0], B[1], 32, M, g.b), Z.hour, Z.hourH, P, { convex: false }), { tone: "hi" }) +
    lineSvg(holesOn(B[0], B[1], 6, 24, 5.4, g.b, top32, P), { tone: "faint" }) +
    lineSvg(ring(B[0], B[1], 32.4, top32, P, 72), { tone: "faint" }) +
    lineSvg(lineOnTop([B[0], B[1]], [B[0] + 32.4 * Math.cos(tb), B[1] + 32.4 * Math.sin(tb)], top32, P), { tone: "hi" });
  return { driver, wheel24, pinion, wheel32 };
}
/** A hand from the hub toward angle t (clock angle), `len` long. */
function handAt(t, len, tail, c, z, P) {
  const s = Math.sin(t), q = -Math.cos(t);
  return lineOnTop([c[0] - s * tail, c[1] - q * tail], [c[0] + s * len, c[1] + q * len], z, P);
}

const angleTo = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]);
const G = {
  D, A, B, Z, mod: MOD,
  dToA: angleTo(D, A),
  aToB: angleTo(A, B),
  pinPhase: 0,
  hourMark: 0,
};
// The hour wheel's mark must point where the hour hand does: hour clock angle = t/12 + T0·11/12 offset in math angle.
// Clock angle t ↔ math angle t − π/2. Minute clock angle tm drives the driver (math angle tm − π/2).
// hour math angle we want = (T0 + (tm − T0)/12) − π/2; wheel32 math angle b(tm − π/2); set hourMark at tm = T0.
{
  const b0 = gearAngles(T0 - Math.PI / 2, G).b;
  G.hourMark = T0 - Math.PI / 2 - b0;
}
const minuteAngle = (m) => T0 + (Math.PI * 2 * m) / 60;
const hourAngle = (m) => T0 + (Math.PI * 2 * m) / 720;
// self-check: gear ratio and hour mark agree with the hour hand at several times
for (const m of [0, 95, 333, 719]) {
  const g = gearAngles(minuteAngle(m) - Math.PI / 2, G);
  const diff = (g.b + G.hourMark) - (hourAngle(m) - Math.PI / 2);
  const wrap = Math.abs(Math.atan2(Math.sin(diff), Math.cos(diff)));
  if (wrap > 1e-9) throw new Error("hour wheel out of step at " + m + " min: " + wrap);
}

const at = (p) => iso(p, P);
const S = (paths, style) => solidSvg(paths, style);
const L = (d, style) => lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

/** Round screw heads (a short cylinder and a centre dot), back to front. */
function screwHeads(points, z, r) {
  return byDepth(points).map(([x, y]) => S(k.cylinder(x, y, r, z, 0.7, P, 14), { tone: "mid" }) + Dots([at([x, y, z + 0.7])], { size: 0.4, tone: "lo" })).join("");
}

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => ring(x, y, 2.6, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(screwHeads(screws, 0, 1.9));
  // ruler strip along the front edge, under the dial
  const strip = { x: -116, y: PLATE.y + PLATE.d - 16, w: 112, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(Dots([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // label plate, back-left corner
  const label = { x: 0, y: -72, w: 32, d: 10, r: 1.5 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: "faint" }));
  out.push(
    L([[5, 22], [5, 16], [5, 19]].map(([dy, len], i) => lineOnTop([label.x + 5, label.y + 2.8 + i * 2.2], [label.x + 5 + len, label.y + 2.8 + i * 2.2], 0.8, P)).join(""), {
      tone: "lo",
      free: true,
    }),
  );
  out.push(Dots([at([label.x + 2.6, label.y + 5, 0.8]), at([label.x + label.w - 2.6, label.y + 5, 0.8])], { size: 0.4 }));
  return out.join("");
}

function dial() {
  const [x, y] = DIAL;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - DIAL_R, y: y - DIAL_R, w: DIAL_R * 2, d: DIAL_R * 2, r: DIAL_R }, 0, DIAL_TOP, P)}" style="filter:blur(4px);opacity:.7"/>`];
  // base ring with four screws, then the dial puck with its knurled bezel
  out.push(S(k.cylinder(x, y, DIAL_R + 4, 0, DIAL_Z, P, 72, 0.6), { tone: "mid" }));
  const screws = [0, 1, 2, 3].map((i) => [x + (DIAL_R + 2) * Math.cos(rad(45 + 90 * i) + 0.0), y + (DIAL_R + 2) * Math.sin(rad(45 + 90 * i))]);
  out.push(screwHeads(screws, DIAL_Z, 1.4));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 80, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.6, DIAL_TOP, 120, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.6, P, 60), { tone: "faint" }));
  out.push(L(ring(x, y, DIAL_R - 2.4, DIAL_TOP, P, 96), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, DIAL_R - 2.4, 60, 5, DIAL_TOP, [2, 3.4], P, T0);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(ring(x, y, 8, DIAL_TOP, P, 40), { tone: "faint" }));
  // numerals lie flat, upright to the viewer: text x along screen-right, text y toward the viewer
  const u = [Math.sin(rad(AZ)), -Math.cos(rad(AZ))];
  const v = [Math.cos(rad(AZ)), Math.sin(rad(AZ))];
  for (let n = 1; n <= 12; n++) {
    const t = T0 + (Math.PI * 2 * n) / 12;
    const c = [x + Math.sin(t) * (DIAL_R - 13), y - Math.cos(t) * (DIAL_R - 13)];
    const o = at([c[0], c[1], DIAL_TOP]);
    const ex = at([c[0] + u[0], c[1] + u[1], DIAL_TOP]);
    const ey = at([c[0] + v[0], c[1] + v[1], DIAL_TOP]);
    const m = [ex[0] - o[0], ex[1] - o[1], ey[0] - o[0], ey[1] - o[1], o[0], o[1]].map((value) => +value.toFixed(3));
    // nudge the baseline down by ~0.35 em so the glyph is centred on its spot
    const tf = `matrix(${m.join(" ")}) translate(0 3)`;
    out.push(k.faceTextSvg(tf, String(n), { size: 9, tone: n % 3 === 0 ? "hi" : "mid", anchor: "middle" }));
  }
  return out.join("");
}

function hubCap() {
  const [x, y] = DIAL;
  return S(k.cylinder(x, y, 3, DIAL_TOP, 1.6, P, 24), { tone: "mid" }) + Dots([at([x, y, DIAL_TOP + 1.6])], { size: 0.5, tone: "hi" });
}

function movement() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(MOVE, 2), 0, MOVE_H, P)}" style="filter:blur(3px);opacity:.6"/>`];
  out.push(S(k.slabOf(MOVE, 0, MOVE_H, P, 6, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(MOVE, 4), MOVE_H, P, 6), { tone: "faint" }));
  const screws = k.corners(MOVE, 8);
  out.push(screwHeads(screws, MOVE_H, 1.7));
  return out.join("");
}

function post([x, y], top) {
  return (
    S(k.cylinder(x, y, 5.2, MOVE_H, 2.4, P, 24), { tone: "mid" }) +
    S(k.cylinder(x, y, 3.2, MOVE_H + 2.4, top - MOVE_H - 2.4, P, 20), { tone: "mid", crease: "none" }) +
    L(k.sideArc(x, y, 3.2, MOVE_H + 4.4, P, 12), { tone: "faint" })
  );
}

function knob() {
  const [x, y] = D;
  const top = Z.arbor + Z.knobH;
  return (
    S(k.cylinder(x, y, 2.2, Z.gear + Z.gearH, Z.arbor - Z.gear - Z.gearH - 1.2, P, 16), { tone: "mid", crease: "none" }) +
    S(k.cylinder(x, y, 4, Z.arbor - 1.2, 1.2, P, 20), { tone: "mid" }) +
    S(k.cylinder(x, y, 6.6, Z.arbor, Z.knobH, P, 32, 0.4), { tone: "mid" }) +
    L(k.knurl(x, y, 6.6, Z.arbor, top, 30, P), { tone: "lo" }) +
    Dots([at([x, y, top])], { size: 0.5, tone: "hi" })
  );
}
const knobPointer = (t) => lineOnTop([D[0], D[1]], [D[0] + 6.2 * Math.cos(t), D[1] + 6.2 * Math.sin(t)], Z.arbor + Z.knobH, P);

function caps() {
  // arbor caps on the 24t pinion and the hour wheel
  const top = Z.hour + Z.hourH;
  return {
    a: S(k.cylinder(A[0], A[1], 2.6, Z.pin1, 1.4, P, 18), { tone: "mid" }) + Dots([at([A[0], A[1], Z.pin1 + 1.4])], { size: 0.45 }),
    b: S(k.cylinder(B[0], B[1], 5, top, 1.6, P, 24), { tone: "mid" }) + Dots([at([B[0], B[1], top + 1.6])], { size: 0.5 }),
  };
}

const M0 = 180; // 3:00
const tm0 = minuteAngle(M0);
const T = trainSvg(tm0 - Math.PI / 2, G, P);
const C = caps();
const hourW = 3.2;
const minW = 1.7;

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "一个拆开的时钟：左边是钟面，有长针和短针；右边是齿轮。转动旋钮，长针转一圈，短针只走一个数字。",
  body: [
    plate(),
    dial(),
    `<path data-part="hour" class="iso-line" data-tone="hi" data-free="end" d="${handAt(hourAngle(M0), 24, 0, DIAL, DIAL_TOP + 0.3, P)}" style="stroke-width:${hourW};stroke-linecap:round"/>`,
    `<path data-part="minute" class="iso-line" data-tone="lit" data-free="end" d="${handAt(minuteAngle(M0), 44, 2.4, DIAL, DIAL_TOP + 0.5, P)}" style="stroke-width:${minW};stroke-linecap:round"/>`,
    hubCap(),
    movement(),
    post(D, Z.gear),
    post(A, Z.gear),
    `<g data-part="driver">${T.driver}</g>`,
    `<g data-part="wheel24">${T.wheel24}</g>`,
    knob(),
    `<path data-part="knob" class="iso-line" data-tone="hi" data-free="end" d="${knobPointer(tm0 - Math.PI / 2)}"/>`,
    post(B, Z.hour),
    `<g data-part="pinion">${T.pinion}</g>`,
    C.a,
    `<g data-part="wheel32">${T.wheel32}</g>`,
    C.b,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const G = ${JSON.stringify(G)};
const DIAL = ${JSON.stringify(DIAL)}, DIAL_TOP = ${DIAL_TOP}, T0 = ${T0}, D = ${JSON.stringify(D)}, KNOB_TOP = ${Z.arbor + Z.knobH};
const gearRing = ${gearRing.toString()};
const gearAngles = ${gearAngles.toString()};
const holesOn = ${holesOn.toString()};
const trainSvg = ${trainSvg.toString()};
const handAt = ${handAt.toString()};
const minuteAngle = (m) => T0 + Math.PI * 2 * m / 60;
const hourAngle = (m) => T0 + Math.PI * 2 * m / 720;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const el = { hour: part("hour"), minute: part("minute"), knob: part("knob"), driver: part("driver"), wheel24: part("wheel24"), pinion: part("pinion"), wheel32: part("wheel32") };
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");

const say = (m) => {
  const total = ((Math.round(m) % 720) + 720) % 720;
  const h = Math.floor(total / 60) || 12, mm = total % 60;
  return mm === 0 ? h + " 点" : mm === 30 ? h + " 点半" : h + " 点 " + mm + " 分";
};
let m = ${M0}, target = m, drawn = NaN, frame = 0, last = 0, visible = false;
let touring = !still.matches, hold = 0, idleTimer = 0, drag = null;
function draw() {
  if (m === drawn) return;
  drawn = m;
  const tm = minuteAngle(m);
  el.minute.setAttribute("d", handAt(tm, 44, 2.4, DIAL, DIAL_TOP + 0.5, P));
  el.hour.setAttribute("d", handAt(hourAngle(m), 24, 0, DIAL, DIAL_TOP + 0.3, P));
  el.knob.setAttribute("d", lineOnTop([D[0], D[1]], [D[0] + 6.2 * Math.cos(tm - Math.PI / 2), D[1] + 6.2 * Math.sin(tm - Math.PI / 2)], KNOB_TOP, P));
  const t = trainSvg(tm - Math.PI / 2, G, P);
  el.driver.innerHTML = t.driver; el.wheel24.innerHTML = t.wheel24; el.pinion.innerHTML = t.pinion; el.wheel32.innerHTML = t.wheel32;
  const text = say(m);
  if (readout.textContent !== text) readout.textContent = text;
}
const describe = () => { const text = say(target); stage.setAttribute("aria-valuetext", text); stage.setAttribute("aria-valuenow", String(Math.round(target))); };
// Idle tour: about one hour every 6 s, holding a moment on 整点 / 15 分 / 半 / 45 分.
const RATE = 10; // minutes per second
function tour(dt) {
  if (hold > 0) { hold -= dt; return; }
  const next = target + RATE * dt;
  const stop = Math.floor(target / 15 + 1e-9) * 15 + 15;
  if (next >= stop) { target = stop; hold = 1.1; describe(); } else target = next;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) tour(dt);
  m = calm || touring ? target : m + (target - m) * (1 - Math.exp(-dt / (drag ? 0.08 : 0.22)));
  if (Math.abs(target - m) < 0.01) m = target;
  draw();
  const settled = !touring && !drag && m === target;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const pause = () => { touring = false; clearTimeout(idleTimer); };
const resume = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!drag && !still.matches) { touring = true; target = Math.round(m); run(); } }, 4000); };
const snap = (value) => Math.round(value / 5) * 5;
const steer = (next) => { pause(); target = next; describe(); run(); resume(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);

// Drag left/right turns the knob (the whole card width = 3 hours); a tap steps 5 分钟 (right half forward, left half back).
stage.addEventListener("pointerdown", (event) => {
  pause();
  drag = { id: event.pointerId, x: event.clientX, from: target, moved: false };
  stage.setPointerCapture(event.pointerId);
  run();
});
stage.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x;
  if (Math.abs(dx) > 4) drag.moved = true;
  if (drag.moved) { target = drag.from + (dx / svg.getBoundingClientRect().width) * 180; describe(); run(); }
});
const release = (event) => {
  if (!drag || event.pointerId !== drag.id) return;
  if (!drag.moved && event.type === "pointerup") {
    const box = svg.getBoundingClientRect();
    target = snap(drag.from) + (event.clientX - box.left < box.width / 2 ? -5 : 5);
  } else target = snap(target);
  drag = null;
  describe();
  run();
  resume();
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (event) => {
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = snap(target) + 5;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = snap(target) - 5;
  if (event.key === "PageUp") to = snap(target) + 60;
  if (event.key === "PageDown") to = snap(target) - 60;
  if (to === null) return;
  event.preventDefault();
  steer(to);
});
stage.addEventListener("focus", () => { pause(); resume(); });
still.addEventListener("change", () => { if (still.matches) { touring = false; target = snap(target); } run(); });
describe();
`;

const plate_ = k.plateHtml({
  fig: "图 1",
  title: "拆开的时钟",
  hint: "左右拖动，转动旋钮",
  readout: "3 点",
  keys: [
    { mark: "lit", label: "长针（分针）：转一圈 = 1 小时" },
    { mark: "raised", label: "齿轮：长针转 12 圈，短针才转 1 圈" },
  ],
  caption: "旋钮带着小齿轮转；小齿轮推大齿轮，大齿轮上的小齿轮再推最大的齿轮。两次变慢，长针转 12 圈，短针（和最大齿轮上的线一起）才转 1 圈。",
  body: `<div class="iso-stage" tabindex="0" style="user-select:none;-webkit-user-select:none;-webkit-touch-callout:none" role="slider" aria-label="时钟：左右拖动或按方向键，每次走 5 分钟" aria-valuemin="0" aria-valuemax="720" aria-valuenow="${M0}" aria-valuetext="3 点">${svg}</div>`,
});

writeFig("clock", { title: "拆开的时钟", plate: plate_, live });
