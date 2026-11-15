// Little Toronto: every model is split into puzzle pieces like a laser-cut wooden kit.
// Each piece lists the pieces it snaps onto (needs). Order below is the build order.
import * as THREE from 'three';
import { shape, roundRect, leafPts, cloudPts, blob, grow, edgeWindows } from './builder.js?v=20261115162237';

const PI = Math.PI;
export const K = {
  woodDark: '#b98a5c', woodMid: '#dcb98c', grass: '#adbb6a', grassDark: '#8e9b4e',
  water: '#5fb4d6', waterLight: '#c4e8f2', sand: '#ecd9ae',
  pave: '#d9d2c4', paveLine: '#bfb6a6', curb: '#c4bba9', asphalt: '#5e616b', crossing: '#f3efe6',
  trackBed: '#8d9098', rail: '#c7cdd3', pole: '#4f5a63', wire: '#3b3f46', bird: '#fbf1dc',
  brick: '#b8492f', brick2: '#a63f2c', buff: '#e2bd73', trim: '#f6efe2', stone: '#d8ccb4',
  slate: '#56606e', slate2: '#6b5a6e', teal: '#2f9c95', mustard: '#e7ad3a', plum: '#8e3d63',
  tramRed: '#d8352c', cream: '#f6ecd6', black: '#2a2a30', roofGrey: '#c7c4bf', roofGrey2: '#a9a6a1',
  copper: '#79b7a2', copper2: '#66a690', copperDark: '#4b8573',
  concrete: '#e0ddd6', concrete2: '#c9c4ba', white: '#f7f5f0',
  maple1: '#dc4a2c', maple2: '#f07b2d', maple3: '#f6b23c', trunk: '#7b5233',
  plaza: '#ece2cf', letter: '#fbfaf6', lamp: '#2f4a3e', fence: '#b78c5d', picket: '#f1e6cf',
  raccoon: '#8f8b86', raccoonDark: '#3b3937', raccoonLight: '#dcd7ce', bin: '#2f8452', binLid: '#246a41',
  hat: '#ff7aa8', bikeGreen: '#3aa564', signRed: '#c8322a', board: '#8e2a24', postRed: '#6f2620', lilac: '#b48ad8',
};

export const CHAPTERS = [
  { name: 'Opening the box', fact: 'Every great city starts with a good foundation.', focus: null },
  { name: 'Bloor West Village', fact: 'Runnymede station sits right in the middle of Bloor West Village.', focus: [0, 1.2, 0.4], zoom: 1.7 },
  { name: 'Bay-and-gable row', fact: 'Bay-and-gable houses are a Toronto original, built by the thousands in the late 1800s.', focus: [-0.5, 1.7, -2.8], zoom: 2.0 },
  { name: 'The 506 streetcar', fact: 'The 506 Carlton runs all the way out to High Park.', focus: [0.4, 1.4, 0.5], zoom: 2.1 },
  { name: 'Runnymede Theatre', fact: 'Opened in 1927, the Runnymede was Bloor West Village\'s grand old movie palace.', focus: [4.6, 1.8, -2.5], zoom: 1.9 },
  { name: 'CN Tower', fact: '553 metres of concrete. On a clear day you can see right across Lake Ontario.', focus: null },
  { name: 'The neighbourhood', fact: 'High Park is just two stops away, bison included.', focus: [0.3, 1.0, 2.4], zoom: 1.5 },
  { name: 'Birthday surprise', fact: 'One last piece. It has your name on it.', focus: null },
];

export const PIECES = [];
let CH = 0;
const def = (id, name, needs, make, extra = {}) => PIECES.push({ id, name, ch: CH, needs, make, ...extra });

// ================= 1. Opening the box =================
CH = 0;
def('base1', 'Bottom board', [], b => b.slab(blob(-7.95, -6.05, 7.95, 5.75, 1.5, 0.16, 2.3, 0), -0.75, 0.25, K.woodDark));
def('base2', 'Middle board', ['base1'], b => b.slab(blob(-7.75, -5.85, 7.75, 5.6, 1.35, 0.12, 2.9, 1.7), -0.5, 0.25, K.woodMid));
def('ground', 'Grass board', ['base2'], b => {
  b.slab(blob(-7.55, -5.65, 7.55, 5.4, 1.2), -0.25, 0.25, K.grass);
});
def('lake', 'Lake Ontario', ['ground'], b => {
  b.slab(blob(-7.0, -5.5, 7.0, -4.28, 0.6, 0.06, 5, 0.4), 0, 0.07, K.water, { ch: 'water' });
  b.slab(blob(-7.05, -4.42, 7.05, -4.18, 0.12, 0.04, 6, 1.1), 0, 0.05, K.sand);
  [[-5.2, -6.2, 5.6], [-4.9, -4.8, 6.2], [-4.62, -6.0, 3.0]].forEach(([z, x0, x1], i) => {
    const top = [], bot = [];
    for (let x = x0; x <= x1 + 1e-6; x += 0.25) {
      top.push([x, z + 0.035 * Math.sin(x * 3.1 + i)]);
      bot.push([x, z + 0.075 + 0.035 * Math.sin(x * 3.1 + i + 0.9)]);
    }
    b.slab([...top, ...bot.reverse()], 0.07, 0.022, K.waterLight, { ch: 'water' });
  });
});

// ================= 2. Queen Street =================
CH = 1;
const sidewalk = (b, z, curbZ) => {
  b.box(0, 0, z, 14.9, 0.1, 0.66, K.pave);
  for (let x = -7.0; x <= 7.01; x += 0.7) b.box(x, 0.1, z, 0.03, 0.006, 0.66, K.paveLine);
  b.box(0, 0, curbZ, 14.9, 0.12, 0.06, K.curb);
};
def('sidewalkN', 'North sidewalk', ['ground'], b => sidewalk(b, -1.03, -0.72));
def('road', 'Road', ['ground'], b => {
  b.box(0, 0, 0.5, 14.9, 0.06, 2.36, K.asphalt);
  for (let i = 0; i < 7; i++) b.box(-3.6, 0.06, -0.5 + i * 0.33, 0.7, 0.006, 0.17, K.crossing);
});
def('sidewalkS', 'South sidewalk', ['ground'], b => sidewalk(b, 2.03, 1.72));
def('rails', 'Streetcar tracks', ['road'], b => {
  b.box(0, 0.06, 0.5, 14.9, 0.012, 0.92, K.trackBed);
  for (const z of [0.25, 0.75]) b.box(0, 0.06, z, 14.9, 0.05, 0.07, K.rail);
});
const pole = (b, x) => {
  b.box(x, 0.1, -1.05, 0.3, 0.12, 0.3, K.pole);
  b.cyl(x, 0.1, -1.05, 0.07, 3.4, K.pole, { seg: 8, rt: 0.055 });
  b.box(x, 3.27, -0.25, 0.07, 0.07, 1.7, K.pole);
  b.cyl(x, 3.5, -1.05, 0.08, 0.08, K.pole, { seg: 8 });
  b.box(x, 3.13, 0.5, 0.06, 0.14, 0.06, K.wire);
};
def('poleW', 'West wire pole', ['sidewalkN'], b => pole(b, -6.6));
def('poleE', 'East wire pole', ['sidewalkN'], b => pole(b, 6.6));
const BIRD = [[-0.17, 0.06], [-0.07, 0.03], [0.03, 0], [0.1, 0.03], [0.14, 0.09], [0.12, 0.14], [0.07, 0.15], [0.03, 0.11], [-0.06, 0.1]];
def('wire', 'Overhead wire', ['poleW', 'poleE'], b => {
  b.box(0, 3.1, 0.5, 13.2, 0.035, 0.035, K.wire);
  b.box(0, 3.34, 0.5, 13.25, 0.03, 0.03, K.wire);
  for (let x = -5.5; x <= 5.51; x += 1.1) b.box(x, 3.135, 0.5, 0.015, 0.205, 0.015, K.wire);
  [[0.9, 0], [1.28, 0], [1.8, PI]].forEach(([x, ry]) => b.plate(shape(BIRD), 0.06, x, 3.37, 0.5, K.bird, { ry, sx: 1.3, sy: 1.3 }));
});

// ================= 3. Bay-and-gable row =================
CH = 2;
const HZ0 = -1.75, HZ1 = -3.75, HD = 2.0, HH = 2.6, HR = 3.5, HW = 1.5;
const HOUSES = [
  { x0: -2.8, brick: K.brick, door: K.teal, roof: K.slate, name: 'Red brick house' },
  { x0: -1.25, brick: K.buff, door: K.plum, roof: K.slate2, name: 'Yellow brick house' },
  { x0: 0.3, brick: K.brick2, door: K.mustard, roof: K.slate, name: 'Corner house' },
];
function houseWalls(b, h) {
  const { x0 } = h, xc = x0 + HW / 2, zc = (HZ0 + HZ1) / 2;
  b.box(xc, 0, zc, HW, HH, HD, h.brick, { ch: 'brick' });
  b.box(xc, 0, zc, HW + 0.03, 0.28, HD + 0.03, K.stone);
  b.box(xc, HH - 0.12, zc, HW + 0.04, 0.12, HD + 0.04, K.trim);
  b.box(xc, HH, zc, HW + 0.02, 0.015, HD + 0.02, K.woodMid);
  const dx = x0 + 0.36;
  b.box(dx, 0.28, HZ0, 0.36, 0.78, 0.07, h.door);
  b.box(dx, 1.08, HZ0, 0.34, 0.14, 0.05, 0, { ch: 'glow' });
  b.box(dx, 1.24, HZ0, 0.48, 0.07, 0.1, K.trim);
  b.box(dx, 1.5, HZ0, 0.3, 0.52, 0.05, 0, { ch: 'glow' });
  b.box(dx, 1.45, HZ0, 0.38, 0.05, 0.1, K.trim);
  b.box(dx, 2.04, HZ0, 0.38, 0.07, 0.1, K.trim);
  b.box(dx, 0, HZ0 + 0.16, 0.52, 0.1, 0.3, K.stone);
  b.box(dx, 0, HZ0 + 0.07, 0.46, 0.2, 0.14, K.stone);
  for (const wx of [x0 + 0.4, x0 + 1.1]) for (const wy of [0.55, 1.55]) {
    b.box(wx, wy, HZ1, 0.32, 0.55, 0.05, 0, { ch: 'glow' });
    b.box(wx, wy - 0.05, HZ1, 0.4, 0.05, 0.09, K.trim);
  }
}
function houseBay(b, h) {
  const bx = h.x0 + 1.03, z0 = HZ0, z1 = HZ0 + 0.34;
  const fp = [[bx - 0.38, z0], [bx + 0.38, z0], [bx + 0.24, z1], [bx - 0.24, z1]];
  b.slab(fp, 0, 0.28, K.stone);
  b.slab(fp, 0.28, 2.0, h.brick, { ch: 'brick' });
  b.slab(grow(fp, 0.03), 1.3, 0.06, K.trim);
  b.slab(grow(fp, 0.05), 2.28, 0.1, K.trim);
  b.slab(grow(fp, 0.02), 2.38, 0.08, h.roof);
  for (const [wy, wh] of [[0.55, 0.62], [1.5, 0.6]]) {
    b.box(bx, wy, z1, 0.3, wh, 0.05, 0, { ch: 'glow' });
    b.box(bx, wy - 0.05, z1 + 0.01, 0.4, 0.05, 0.08, K.trim);
    for (const s of [-1, 1]) {
      const ax = bx + s * 0.38, cx = bx + s * 0.24;
      const ry = Math.atan2(-(z1 - z0), cx - ax);
      b.box((ax + cx) / 2 + s * 0.012, wy, (z0 + z1) / 2 + 0.005, 0.16, wh, 0.05, 0, { ch: 'glow', ry });
    }
  }
}
function houseRoof(b, h) {
  const { x0 } = h, xc = x0 + HW / 2, zc = (HZ0 + HZ1) / 2;
  const rise = HR - HH, run = HW / 2, th = Math.atan2(rise, run), L = Math.hypot(rise, run) + 0.16;
  for (const s of [-1, 1]) b.boxC(xc + s * (run / 2 + 0.03), HH + rise / 2 + 0.05, zc, L, 0.08, HD + 0.3, h.roof, { rz: -s * th });
  const tri = shape([[-HW / 2, 0], [HW / 2, 0], [0, rise]]);
  b.plate(tri, 0.1, xc, HH, HZ0 - 0.05, h.brick, { ch: 'brick' });
  b.plate(tri, 0.1, xc, HH, HZ1 + 0.05, h.brick, { ch: 'brick' });
  for (const s of [-1, 1]) b.boxC(xc + s * run / 2, HH + rise / 2 - 0.02, HZ0 + 0.13, L - 0.1, 0.07, 0.05, K.trim, { rz: -s * th });
  b.box(xc, HR - 0.1, HZ0 + 0.13, 0.06, 0.45, 0.06, K.trim);
  b.box(xc, HH + 0.18, HZ0 + 0.06, 0.26, 0.4, 0.05, 0, { ch: 'glow' });
  b.box(xc, HH + 0.14, HZ0 + 0.06, 0.34, 0.05, 0.08, K.trim);
  b.box(xc, HH + 0.58, HZ0 + 0.06, 0.34, 0.05, 0.08, K.trim);
  b.box(x0 + 0.28, HH + 0.3, zc - 0.45, 0.24, 1.0, 0.3, h.brick, { ch: 'brick' });
  b.box(x0 + 0.28, HH + 1.3, zc - 0.45, 0.3, 0.07, 0.36, K.stone);
}
HOUSES.forEach((h, i) => {
  def(`h${i}walls`, h.name, ['sidewalkN'], b => houseWalls(b, h));
  def(`h${i}bay`, 'Bay window', [`h${i}walls`], b => houseBay(b, h));
  def(`h${i}roof`, 'Gable roof', [`h${i}walls`], b => houseRoof(b, h));
});
def('fence', 'Backyard fence', ['h0walls', 'h1walls', 'h2walls'], b => {
  const z = -4.12;
  for (let x = -2.8; x <= 1.81; x += 0.92) b.box(x, 0, z, 0.08, 0.6, 0.08, K.fence);
  b.box(-0.5, 0.16, z, 4.7, 0.06, 0.04, K.fence);
  b.box(-0.5, 0.4, z, 4.7, 0.06, 0.04, K.fence);
  for (let x = -2.74; x <= 1.76; x += 0.15) b.box(x, 0.03, z - 0.035, 0.09, 0.5, 0.025, K.picket);
}, { view: 0.93 * PI });
def('raccoon', 'Raccoon & green bin', ['fence'], b => {
  const bx = -0.45, bz = -3.97, rx = bx, rz = bz, Y = 0.52;
  b.box(bx, 0, bz, 0.36, 0.46, 0.3, K.bin);
  b.box(bx, 0.46, bz, 0.39, 0.06, 0.33, K.binLid);
  b.box(bx, 0.2, bz - 0.155, 0.12, 0.12, 0.01, K.white);
  b.box(rx, Y, rz, 0.26, 0.3, 0.2, K.raccoon);
  b.box(rx, Y + 0.02, rz - 0.1, 0.17, 0.2, 0.03, K.raccoonLight);
  b.box(rx, Y + 0.3, rz, 0.24, 0.2, 0.2, K.raccoon);
  b.box(rx, Y + 0.36, rz - 0.1, 0.25, 0.07, 0.03, K.raccoonDark);
  b.box(rx, Y + 0.31, rz - 0.13, 0.09, 0.06, 0.07, K.raccoonLight);
  b.box(rx, Y + 0.34, rz - 0.17, 0.04, 0.03, 0.02, K.raccoonDark);
  for (const s of [-1, 1]) {
    b.box(rx + s * 0.08, Y + 0.49, rz, 0.06, 0.07, 0.04, K.raccoonDark);
    b.box(rx + s * 0.06, Y + 0.38, rz - 0.118, 0.03, 0.03, 0.01, K.white);
  }
  for (let i = 0; i < 4; i++) b.cyl(rx + 0.16 + i * 0.065, Y + 0.02 - i * 0.07, rz + 0.04, 0.055, 0.075,
    i % 2 ? K.raccoonDark : K.raccoonLight, { c: true, rz: PI / 2 - 0.9, seg: 8 });
  b.cyl(rx, Y + 0.5, rz, 0.075, 0.17, K.hat, { rt: 0.005, seg: 10 });
  b.box(rx, Y + 0.66, rz, 0.04, 0.04, 0.04, K.maple3);
}, { view: 0.96 * PI });

// ================= 4. The 504 streetcar =================
CH = 3;
const TX = 0.4, TZ = 0.5, TL = 4.6, TW = 1.0, TY = 0.11;
def('tram1', 'Wheels & chassis', ['rails'], b => {
  for (const s of [-1, 1]) {
    const bx = TX + s * 1.45;
    b.box(bx, TY + 0.08, TZ, 1.0, 0.2, 0.72, K.black);
    for (const w of [-0.3, 0.3]) for (const z of [0.22, 0.78]) b.cyl(bx + w, TY + 0.15, z, 0.15, 0.07, '#3a3a40', { c: true, rx: PI / 2, seg: 10 });
  }
  b.box(TX, 0.38, TZ, TL - 0.1, 0.1, TW - 0.06, K.black);
});
def('tram2', 'Red body', ['tram1'], b => {
  const y = 0.48;
  b.box(TX, y, TZ, TL, 0.6, TW, K.tramRed);
  b.box(TX, y, TZ, TL + 0.01, 0.09, TW + 0.01, K.black);
  b.box(TX, y + 0.38, TZ, TL + 0.02, 0.09, TW + 0.02, K.cream);
  for (const s of [-1, 1]) {
    b.box(TX + s * (TL / 2 + 0.04), y, TZ, 0.09, 0.16, TW * 0.9, K.black);
    for (const z of [-0.32, 0.32]) b.box(TX + s * (TL / 2 + 0.005), y + 0.22, TZ + z, 0.03, 0.09, 0.14, 0, { ch: s > 0 ? 'light' : 'beacon' });
  }
  b.glow(TX + TL / 2 + 0.1, 0.72, TZ, 1.2, '#ffe2a0');
});
def('tram3', 'Windows', ['tram2'], b => {
  const y = 1.08, h = 0.52, n = 6;
  b.box(TX, y, TZ, TL - 0.06, h, TW - 0.05, 0, { ch: 'glow' });
  for (let k = 0; k <= n; k++) b.box(TX - TL / 2 + 0.05 + k * (TL - 0.1) / n, y, TZ, 0.1, h, TW, K.tramRed);
  for (const s of [-1, 1]) for (const z of [-1, 1]) b.box(TX + s * (TL / 2 - 0.05), y, TZ + z * 0.44, 0.1, h, 0.12, K.tramRed);
  b.glow(TX, 1.35, TZ, 3.2, '#ffcf7a');
});
def('tram4', 'Roof', ['tram3'], b => {
  b.box(TX, 1.6, TZ, TL, 0.12, TW, K.tramRed);
  b.box(TX, 1.72, TZ, TL - 0.35, 0.09, TW - 0.22, K.roofGrey);
  for (const x of [-1.2, 0.2, 1.4]) b.box(TX + x, 1.81, TZ, 0.5, 0.08, 0.4, K.roofGrey2);
});
def('tram5', 'Trolley pole', ['tram4', 'wire'], b => {
  const bx = TX - 0.7, by = 1.81, tx = bx - 1.55, ty = 3.08;
  b.box(bx, by, TZ, 0.36, 0.08, 0.24, K.black);
  const dx = tx - bx, dy = ty - by - 0.06;
  b.cyl(bx, by + 0.06, TZ, 0.028, Math.hypot(dx, dy), K.black, { seg: 6, rz: Math.atan2(-dx, dy) });
  b.box(tx, ty - 0.02, TZ, 0.12, 0.05, 0.05, K.black);
});
def('tram6', 'Route sign', ['tram4'], b => {
  for (const s of [-1, 1]) b.add(new THREE.PlaneGeometry(0.76, 0.16), '#fff',
    { ch: 'tramsign', uv: true, x: TX + s * (TL / 2 + 0.012), y: 1.5, z: TZ, ry: s * PI / 2 });
});

// ================= 5. Gooderham Flatiron =================
CH = 4;
// Runnymede Theatre (Bloor West Village), on the Flatiron's old lot
const TX0 = 2.6, TX1 = 6.6, TZF = -1.8, TZB = -3.7, TXC = (TX0 + TX1) / 2, TZC = (TZF + TZB) / 2, TW_ = TX1 - TX0, TD_ = TZF - TZB;
const CREAM = '#ead9b6', CREAM2 = '#d7c29a', TRIM2 = '#fbf3e1';
def('th1', 'Theatre shopfronts', ['sidewalkN'], b => {
  b.box(TXC, 0, TZC, TW_, 1.0, TD_, CREAM2);
  b.box(TXC, 0, TZC, TW_ + 0.03, 0.18, TD_ + 0.03, K.stone);
  for (const x of [3.05, 3.7, 5.5, 6.15]) {
    b.box(x, 0.24, TZF, 0.5, 0.6, 0.05, 0, { ch: 'glow' });
    b.box(x, 0.86, TZF, 0.58, 0.05, 0.08, TRIM2);
  }
  b.box(TXC, 0.18, TZF, 1.1, 0.72, 0.06, '#6a4228');
  for (const x of [-0.27, 0.27]) b.box(TXC + x, 0.22, TZF + 0.01, 0.42, 0.55, 0.05, 0, { ch: 'glow' });
  for (const z of [-2.3, -3.2]) b.box(TX1, 0.3, z, 0.05, 0.55, 0.4, 0, { ch: 'glow' });
});
def('th2', 'Theatre facade', ['th1'], b => {
  b.box(TXC, 1.0, TZC, TW_ + 0.06, 0.08, TD_ + 0.06, TRIM2);
  b.box(TXC, 1.08, TZC, TW_, 1.52, TD_, CREAM, { ch: 'brick' });
  for (const x of [2.68, 3.65, 4.6, 5.55, 6.52]) b.box(x, 1.08, TZF + 0.02, 0.14, 1.52, 0.06, TRIM2);
  for (const x of [3.13, 4.12, 5.08, 6.04]) {
    b.box(x, 1.28, TZF, 0.46, 0.9, 0.05, 0, { ch: 'glow' });
    b.cyl(x, 2.18, TZF, 0.23, 0.05, 0, { c: true, rx: PI / 2, seg: 14, ch: 'glow' });
    b.box(x, 1.22, TZF + 0.01, 0.56, 0.06, 0.07, TRIM2);
  }
  for (const z of [-2.3, -3.2]) b.box(TX1, 1.45, z, 0.05, 0.75, 0.4, 0, { ch: 'glow' });
});
def('th3', 'Parapet & roof', ['th2'], b => {
  b.box(TXC, 2.6, TZC, TW_ + 0.12, 0.1, TD_ + 0.12, TRIM2);
  b.box(TXC, 2.7, TZC, TW_ - 0.1, 0.04, TD_ - 0.1, '#9a8f84');
  b.box(TXC, 2.7, TZF - 0.02, TW_, 0.22, 0.14, CREAM2);
  b.box(TXC, 2.92, TZF - 0.02, 2.2, 0.22, 0.14, CREAM2);
  b.box(TXC, 3.14, TZF - 0.02, 1.0, 0.26, 0.14, CREAM2);
  b.box(TXC, 3.4, TZF - 0.02, 1.08, 0.06, 0.18, TRIM2);
  b.boxC(TXC, 3.15, TZF + 0.06, 0.2, 0.2, 0.04, '#b8262b', { rz: PI / 4 });
  b.boxC(TXC, 3.15, TZF + 0.08, 0.1, 0.1, 0.04, '#ffd36b', { rz: PI / 4 });
});
def('th4', 'Theatre marquee', ['th2'], b => {
  const y = 1.02, zf = TZF + 0.52;
  b.box(TXC, y, TZF + 0.26, 2.6, 0.24, 0.52, '#24242b');
  b.add(new THREE.PlaneGeometry(2.48, 0.19), '#fff', { ch: 'theatre', uv: true, x: TXC, y: y + 0.12, z: zf + 0.003 });
  let i = 0;
  for (let x = -1.25; x <= 1.26; x += 0.125) b.box(TXC + x, y + 0.24, zf - 0.03, 0.05, 0.04, 0.05, 0, { ch: (i++ % 2) ? 'bulbA' : 'bulbB' });
  for (const s of [-1, 1]) b.boxC(TXC + s * 1.1, y + 0.55, TZF + 0.26, 0.025, 0.7, 0.025, '#24242b', { rx: 0.65 });
  b.glow(TXC, y - 0.1, zf, 2.6, '#ffe2a0');
});
def('th5', 'RUNNYMEDE sign', ['th4'], b => {
  const x = TXC, z = TZF + 0.3, y0 = 1.32, H = 2.3, D = 0.42;
  b.box(x, y0, z, 0.1, H, D + 0.06, '#24242b');
  for (const s of [-1, 1]) b.add(new THREE.PlaneGeometry(D, H - 0.06), '#fff', { ch: 'blade', uv: true, x: x + s * 0.052, y: y0 + H / 2, z, ry: s * PI / 2 });
  b.box(x, y0 + H, z, 0.14, 0.12, D + 0.1, '#ffd36b');
  b.glow(x + 0.2, y0 + H * 0.55, z, 3.0, '#ff7a5a');
});
// ================= 6. CN Tower =================
CH = 5;
const CX = -5.0, CZ = -2.95;
const FIN = [PI / 2, PI / 2 + 2 * PI / 3, PI / 2 + 4 * PI / 3];
def('cn1', 'Tower foundation', ['ground'], b => {
  b.cyl(CX, 0, CZ, 1.3, 0.22, K.concrete2, { seg: 6 });
  b.cyl(CX, 0.22, CZ, 1.0, 0.18, K.concrete, { seg: 6 });
});
def('cn2', 'Tripod legs', ['cn1'], b => {
  for (const a of FIN) b.plate(shape([[0, 0], [1.0, 0], [0.36, 4.0], [0, 4.0]]), 0.22, CX, 0.4, CZ, K.concrete, { ry: a });
  b.cyl(CX, 0.4, CZ, 0.38, 4.0, K.concrete, { seg: 6, rt: 0.33 });
});
def('cn3', 'Main shaft', ['cn2'], b => {
  const y = 4.4, h = 6.2;
  b.cyl(CX, y, CZ, 0.33, h, K.concrete, { seg: 6, rt: 0.25 });
  for (const a of FIN) {
    b.plate(shape([[0, 0], [0.36, 0], [0.24, h], [0, h]]), 0.2, CX, y, CZ, K.concrete, { ry: a });
    b.plate(shape([[0.3, 0.2], [0.385, 0.2], [0.265, h - 0.1], [0.18, h - 0.1]]), 0.21, CX, y, CZ, K.concrete, { ry: a, ch: 'cnled' });
  }
});
def('cn4', 'Main pod', ['cn3'], b => {
  const s = 18, y0 = 10.6;
  b.cyl(CX, y0, CZ, 0.45, 0.4, K.white, { rt: 1.0, seg: s });
  b.cyl(CX, y0 + 0.4, CZ, 1.05, 0.22, K.white, { seg: s });
  b.cyl(CX, y0 + 0.62, CZ, 1.12, 0.3, 0, { seg: s, ch: 'glow' });
  b.cyl(CX, y0 + 0.92, CZ, 1.16, 0.12, K.white, { seg: s });
  b.cyl(CX, y0 + 1.04, CZ, 1.0, 0.26, 0, { seg: s, ch: 'glow' });
  b.cyl(CX, y0 + 1.3, CZ, 1.02, 0.1, K.white, { seg: s });
  b.cyl(CX, y0 + 1.4, CZ, 0.95, 0.25, K.white, { rt: 0.35, seg: s });
  b.glow(CX, y0 + 0.95, CZ, 4.2, '#ffd08a');
});
def('cn5', 'SkyPod', ['cn4'], b => {
  b.cyl(CX, 12.25, CZ, 0.24, 2.3, K.concrete, { seg: 6, rt: 0.21 });
  b.cyl(CX, 14.55, CZ, 0.3, 0.15, K.white, { rt: 0.48, seg: 14 });
  b.cyl(CX, 14.7, CZ, 0.48, 0.2, 0, { seg: 14, ch: 'glow' });
  b.cyl(CX, 14.9, CZ, 0.48, 0.14, K.white, { rt: 0.26, seg: 14 });
  b.glow(CX, 14.8, CZ, 1.8, '#ffd08a');
});
def('cn6', 'Antenna', ['cn5'], b => {
  b.cyl(CX, 15.04, CZ, 0.17, 1.7, K.white, { rt: 0.12, seg: 8 });
  b.cyl(CX, 16.74, CZ, 0.11, 1.5, K.concrete2, { rt: 0.07, seg: 8 });
  b.cyl(CX, 18.24, CZ, 0.06, 0.8, K.white, { rt: 0.03, seg: 6 });
  b.box(CX, 19.04, CZ, 0.1, 0.1, 0.1, 0, { ch: 'beacon' });
  b.glow(CX, 19.09, CZ, 1.1, '#ff5a46');
});

// ================= 7. The neighbourhood =================
CH = 6;
def('plaza', 'Plaza', ['sidewalkS'], b => {
  b.box(0.2, 0, 3.85, 6.5, 0.05, 1.5, K.plaza);
  b.box(0.2, 0, 2.725, 1.2, 0.05, 0.74, K.plaza);
  for (let x = -2.6; x <= 3.01; x += 0.65) b.box(x, 0.05, 3.85, 0.025, 0.005, 1.5, K.paveLine);
  b.box(0.2, 0, 4.74, 6.5, 0.12, 0.24, K.grassDark);
  for (let i = 0; i < 12; i++) b.box(-2.82 + i * 0.55, 0.12, 4.74, 0.16, 0.1, 0.16, [K.maple1, K.maple3, '#c2562a', K.mustard][i % 4]);
});
def('sign', 'TORONTO sign', ['plaza'], b => {
  const H = 0.85, s = 0.17, t = 0.24, w = 0.6, pitch = 0.76, z = 3.75, y = 0.05;
  const o = { ch: 'letters' };
  const x0 = 0.2 - (7 * pitch - 0.16) / 2 + w / 2;
  const T = x => { b.box(x, y + H - s, z, w, s, t, K.letter, o); b.box(x, y, z, s, H - s, t, K.letter, o); };
  const O = x => {
    const sh = roundRect(new THREE.Shape(), w, H, 0.22, 0, H / 2);
    sh.holes.push(roundRect(new THREE.Path(), w - 2 * s, H - 2 * s, 0.08, 0, H / 2));
    b.plate(sh, t, x, y, z, K.letter, o);
  };
  const R = x => {
    b.box(x - w / 2 + s / 2, y, z, s, H, t, K.letter, o);
    const bh = H * 0.56, bc = H - bh / 2;
    const sh = roundRect(new THREE.Shape(), w, bh, 0.16, 0, bc);
    sh.holes.push(roundRect(new THREE.Path(), w - 2 * s, bh - 2 * s, 0.05, 0, bc));
    b.plate(sh, t * 0.96, x, y, z, K.letter, o);
    const lx0 = x - 0.03, ly0 = H * 0.46, lx1 = x + w / 2 - s / 2, ly1 = 0.02;
    b.boxC((lx0 + lx1) / 2, y + (ly0 + ly1) / 2, z, s, Math.hypot(lx1 - lx0, ly0 - ly1), t * 0.92, K.letter, { ...o, rz: Math.atan2(lx1 - lx0, ly0 - ly1) });
  };
  const N = x => {
    b.box(x - w / 2 + s / 2, y, z, s, H, t, K.letter, o);
    b.box(x + w / 2 - s / 2, y, z, s, H, t, K.letter, o);
    b.boxC(x, y + H / 2, z, s, Math.hypot(w - s, H) - 0.05, t * 0.98, K.letter, { ...o, rz: Math.atan2(w - s, H) });
  };
  [T, O, R, O, N, T, O].forEach((f, i) => f(x0 + i * pitch));
});
const TRX = 5.35, TRZ = 3.75;
def('tree1', 'Maple trunk', ['plaza'], b => {
  b.cyl(TRX, 0, TRZ, 0.5, 0.06, K.grassDark, { seg: 10 });
  b.cyl(TRX, 0.05, TRZ, 0.15, 1.55, K.trunk, { rt: 0.09, seg: 7 });
  b.boxC(TRX - 0.22, 1.3, TRZ, 0.07, 0.6, 0.07, K.trunk, { rz: 0.7 });
  b.boxC(TRX + 0.2, 1.45, TRZ + 0.05, 0.07, 0.55, 0.07, K.trunk, { rz: -0.65 });
});
def('tree1top', 'Maple leaves', ['tree1'], b => {
  const cy = 2.25;
  [[K.maple1, 0, 1.05, 0], [K.maple2, PI / 3, 1.0, 0.5], [K.maple3, 2 * PI / 3, 0.95, 1.1]]
    .forEach(([c, ry, R, ph]) => b.plate(shape(cloudPts(R, 7, 0.15, 0.8, ph)), 0.1, TRX, cy, TRZ, c, { ry }));
  b.plate(shape(cloudPts(0.62, 6, 0.16, 0.85, 0.3)), 0.1, TRX + 0.1, cy + 0.62, TRZ - 0.05, K.maple3, { ry: PI / 6 });
  const cols = [K.maple1, K.maple2, K.maple3];
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * PI * 2 + 0.3;
    b.plate(shape(leafPts(0.13)), 0.03, TRX + Math.cos(a) * 0.95, cy - 0.35 + (i % 3) * 0.32, TRZ + Math.sin(a) * 0.95, cols[i % 3], { ry: -a, rz: i * 0.7 });
  }
  for (let i = 0; i < 6; i++) {
    const a = i * 1.7;
    b.plate(shape(leafPts(0.1)), 0.02, TRX + Math.cos(a) * (0.7 + (i % 2) * 0.4), 0.07, TRZ + Math.sin(a) * (0.6 + (i % 3) * 0.2), cols[i % 3], { rx: -PI / 2, rz: a });
  }
});
const smallTree = (b, x, z, c1, c2, R) => {
  b.cyl(x, 0, z, R * 0.45, 0.05, K.grassDark, { seg: 8 });
  b.cyl(x, 0.04, z, 0.08, 1.0, K.trunk, { rt: 0.05, seg: 6 });
  const cy = 0.95 + R * 0.6;
  b.plate(shape(cloudPts(R, 6, 0.16, 0.85, 0.2)), 0.08, x, cy, z, c1, { ry: 0.3 });
  b.plate(shape(cloudPts(R * 0.92, 6, 0.16, 0.85, 0.9)), 0.08, x, cy, z, c2, { ry: 0.3 + PI / 2 });
  b.plate(shape(cloudPts(R * 0.6, 5, 0.18, 0.85, 0.4)), 0.08, x, cy + R * 0.45, z, c1, { ry: 0.3 + PI / 4 });
};
def('trees2', 'Autumn trees', ['tree1top'], b => {
  smallTree(b, -3.3, -3.15, K.maple3, K.maple2, 0.5);
  smallTree(b, -6.7, -1.95, K.maple2, K.maple1, 0.55);
  smallTree(b, 6.85, 2.95, K.maple1, K.maple3, 0.5);
});
const pumpkin = (b, x, y, z, r) => {
  b.cyl(x, y, z, r, r * 1.1, '#e8782a', { seg: 9, rt: r * 0.9 });
  b.cyl(x, y + r * 1.1, z, r * 0.15, r * 0.4, K.trunk, { seg: 5 });
};
def('leaves', 'Fallen leaves & pumpkins', ['plaza', 'h2roof'], b => {
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cols = [K.maple1, K.maple2, K.maple3, '#c2562a'];
  const zones = [ // [x0, x1, z0, z1, y]
    [-7.0, 7.0, 2.4, 2.95, 0.01], [-7.0, -3.2, 3.6, 4.9, 0.01], [3.5, 6.9, 2.5, 5.0, 0.01],
    [-7.2, 7.2, -1.33, -0.75, 0.105], [-7.2, 7.2, 1.75, 2.33, 0.105], [-2.7, 1.8, -4.05, -3.8, 0.01],
  ];
  for (let i = 0; i < 46; i++) {
    const zn = zones[i % zones.length];
    const x = zn[0] + rnd() * (zn[1] - zn[0]), z = zn[2] + rnd() * (zn[3] - zn[2]);
    b.plate(shape(leafPts(0.07 + rnd() * 0.05)), 0.015, x, zn[4], z, cols[i % 4], { rx: -PI / 2, rz: rnd() * 6.28 });
  }
  for (const x0 of [-2.8, -1.25, 0.3]) pumpkin(b, x0 + 0.01, 0, -1.58, 0.075);
  pumpkin(b, 3.3, 0.05, 4.45, 0.11); pumpkin(b, 3.48, 0.05, 4.32, 0.08);
  for (let i = 0; i < 14; i++) {
    const a = rnd() * 6.28, d = rnd() * 0.32;
    b.plate(shape(leafPts(0.09)), 0.02, 4.75 + Math.cos(a) * d, 0.01 + rnd() * 0.12, 4.0 + Math.sin(a) * d * 0.7, cols[i % 4], { rx: -PI / 2 + (rnd() - 0.5) * 0.8, rz: rnd() * 6.28 });
  }
});
const TAN = '#c8833f', TAN2 = '#9a5a2a', WH = '#f7f1e6', BLK = '#2b2522';
def('beagle', 'Lolita the beagle', ['sign'], b => {
  const x = 2.15, z = 4.3, y = 0.05;
  for (const lx of [-0.15, 0.15]) for (const lz of [-0.065, 0.065]) b.box(x + lx, y, z + lz, 0.07, 0.17, 0.07, WH);
  b.box(x, y + 0.15, z, 0.46, 0.19, 0.2, TAN);
  b.box(x - 0.04, y + 0.27, z, 0.3, 0.08, 0.205, BLK);
  b.box(x + 0.12, y + 0.14, z, 0.2, 0.12, 0.21, WH);
  b.box(x + 0.27, y + 0.24, z, 0.2, 0.19, 0.18, TAN);
  b.box(x + 0.375, y + 0.36, z, 0.02, 0.1, 0.05, WH);
  b.box(x + 0.4, y + 0.24, z, 0.12, 0.1, 0.12, WH);
  b.box(x + 0.465, y + 0.31, z, 0.03, 0.04, 0.05, BLK);
  for (const s of [-1, 1]) {
    b.box(x + 0.25, y + 0.15, z + s * 0.1, 0.11, 0.24, 0.025, TAN2);
    b.box(x + 0.378, y + 0.37, z + s * 0.055, 0.02, 0.035, 0.035, BLK);
  }
  b.box(x + 0.2, y + 0.24, z, 0.04, 0.05, 0.215, K.signRed);
  b.box(x + 0.235, y + 0.2, z + 0.11, 0.035, 0.035, 0.01, K.mustard);
  b.boxC(x - 0.27, y + 0.36, z, 0.05, 0.2, 0.05, TAN, { rz: 0.45 });
  b.boxC(x - 0.32, y + 0.47, z, 0.05, 0.06, 0.05, WH, { rz: 0.45 });
});
const lamp = (b, x, z, dir) => {
  b.cyl(x, 0.1, z, 0.07, 0.12, K.lamp, { seg: 8 });
  b.cyl(x, 0.1, z, 0.04, 1.95, K.lamp, { seg: 6 });
  b.box(x, 1.98, z + dir * 0.18, 0.05, 0.05, 0.4, K.lamp);
  b.box(x, 1.82, z + dir * 0.36, 0.18, 0.16, 0.18, K.lamp);
  b.box(x, 1.79, z + dir * 0.36, 0.13, 0.04, 0.13, 0, { ch: 'light' });
  b.glow(x, 1.72, z + dir * 0.36, 1.7, '#ffd27a');
};
def('lamps', 'Lamps & TTC stop', ['sidewalkS', 'sidewalkN'], b => {
  lamp(b, -2.9, 2.1, -1); lamp(b, 3.4, 2.1, -1); lamp(b, -3.9, -1.15, 1);
  b.cyl(-1.4, 0.1, 2.15, 0.03, 1.55, '#aab2ba', { seg: 6 });
  b.box(-1.4, 1.42, 2.15, 0.34, 0.13, 0.03, K.signRed);
  b.box(-1.4, 1.29, 2.15, 0.34, 0.13, 0.03, K.white);
  b.box(-1.4, 1.31, 2.17, 0.2, 0.07, 0.01, K.signRed);
});
def('bench', 'Bench & Bike Share', ['plaza'], b => {
  const bx = 3.95, bz = 4.72;
  for (const s of [-1, 1]) b.box(bx + s * 0.42, 0.05, bz, 0.05, 0.26, 0.32, K.black);
  for (let k = 0; k < 3; k++) b.box(bx, 0.29, bz - 0.1 + k * 0.1, 1.0, 0.04, 0.08, K.trunk);
  for (let k = 0; k < 2; k++) b.box(bx, 0.42 + k * 0.11, bz + 0.15, 1.0, 0.07, 0.03, K.trunk);
  const kx = -2.2, ky = 0.1, kz = 2.2;
  for (const s of [-1, 1]) b.add(new THREE.TorusGeometry(0.17, 0.025, 5, 14), K.black, { x: kx + s * 0.3, y: ky + 0.17, z: kz });
  b.boxC(kx - 0.12, ky + 0.3, kz, 0.36, 0.035, 0.035, K.bikeGreen, { rz: 0.55 });
  b.boxC(kx + 0.05, ky + 0.4, kz, 0.42, 0.035, 0.035, K.bikeGreen);
  b.boxC(kx + 0.25, ky + 0.33, kz, 0.035, 0.38, 0.035, K.bikeGreen, { rz: 0.3 });
  b.boxC(kx - 0.12, ky + 0.46, kz, 0.035, 0.22, 0.035, K.bikeGreen);
  b.box(kx - 0.12, ky + 0.56, kz, 0.15, 0.04, 0.08, K.black);
  b.box(kx + 0.21, ky + 0.56, kz, 0.04, 0.04, 0.3, K.black);
  b.box(kx + 0.36, ky + 0.38, kz, 0.14, 0.12, 0.16, K.bikeGreen);
});
// ---------- Paula's family ----------
function person(b, x, z, o) {
  const y = 0.05, legH = o.legH, torH = o.torH, hw = o.wide ?? 0.24;
  for (const s of [-1, 1]) {
    b.box(x + s * 0.055, y, z + 0.01, 0.085, 0.05, 0.12, '#3a2f2a');
    b.box(x + s * 0.055, y + 0.04, z, 0.08, legH - 0.04, 0.09, o.bottom);
  }
  const ty = y + legH;
  b.box(x, ty, z, hw, torH, 0.16, o.top);
  const hy = ty + torH;
  b.box(x, hy, z, 0.07, 0.04, 0.07, o.skin);
  const hs = 0.19, headY = hy + 0.035;
  b.box(x, headY, z, hs, hs, hs * 0.95, o.skin);
  for (const s of [-1, 1]) b.box(x + s * 0.045, headY + hs * 0.52, z + hs * 0.48, 0.03, 0.035, 0.01, '#2b2522');
  b.box(x, headY + hs * 0.25, z + hs * 0.48, 0.05, 0.015, 0.01, '#c0584a');
  b.box(x, headY + hs - 0.01, z - 0.005, hs + 0.02, 0.06, hs * 0.95 + 0.02, o.hair);
  b.box(x, headY + hs * 0.35, z - hs * 0.47, hs + 0.02, hs * 0.62, 0.04, o.hair);
  if (o.highlight) for (const hx of [-0.06, 0.02, 0.07]) b.box(x + hx, headY + hs - 0.012, z + 0.02, 0.025, 0.064, hs * 0.8, o.highlight);
  if (o.longHair) {
    b.box(x, ty + torH * 0.45, z - 0.1, hs + 0.04, (headY + hs * 0.45) - (ty + torH * 0.45), 0.05, o.hair);
    if (o.highlight) for (const hx of [-0.05, 0.05]) b.box(x + hx, ty + torH * 0.5, z - 0.128, 0.03, hs * 0.8, 0.006, o.highlight);
    for (const s of [-1, 1]) b.box(x + s * (hs / 2 + 0.005), headY - 0.02, z - 0.01, 0.03, hs * 0.85, 0.12, o.hair);
  }
  if (o.baby) {
    for (const s of [-1, 1]) b.boxC(x + s * 0.1, ty + torH * 0.55, z + 0.08, 0.06, 0.2, 0.06, o.top, { rx: -1.1 });
    b.box(x, ty + torH * 0.3, z + 0.14, 0.18, 0.11, 0.12, '#ffc2d6');
    b.box(x + 0.05, ty + torH * 0.3 + 0.07, z + 0.15, 0.08, 0.075, 0.08, o.babySkin);
    b.box(x + 0.05, ty + torH * 0.3 + 0.13, z + 0.15, 0.085, 0.025, 0.085, '#ff8fb3');
  } else if (o.push) {
    for (const s of [-1, 1]) {
      b.box(x + s * (hw / 2 + 0.035), ty + torH - 0.1, z + 0.12, 0.06, 0.06, 0.26, o.top);
      b.box(x + s * (hw / 2 + 0.035), ty + torH - 0.1, z + 0.27, 0.055, 0.055, 0.05, o.skin);
    }
  } else {
    for (const s of [-1, 1]) {
      b.box(x + s * (hw / 2 + 0.035), ty + 0.05, z, 0.06, torH - 0.04, 0.07, o.top);
      b.box(x + s * (hw / 2 + 0.035), ty, z, 0.055, 0.05, 0.06, o.skin);
    }
  }
}
// draw with everything turned by ang around (cx, cz): lets a figure face any direction
function turned(b, cx, cz, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  const tp = (x, z) => [cx + (x - cx) * c + (z - cz) * s, cz - (x - cx) * s + (z - cz) * c];
  const wrap = name => (x, y, z, ...rest) => {
    const o = rest[rest.length - 1] && typeof rest[rest.length - 1] === 'object' && !rest[rest.length - 1].isShape ? rest.pop() : {};
    const [X, Z] = tp(x, z);
    return b[name](X, y, Z, ...rest, { ...o, ry: (o.ry || 0) + ang });
  };
  return { box: wrap('box'), boxC: wrap('boxC'), cyl: wrap('cyl') };
}
function stroller(b, x, z) {
  const y = 0, F = '#2f5f6b';
  for (const wx of [-0.12, 0.12]) for (const wz of [0.36, 0.64]) b.cyl(x + wx, y + 0.065, z + wz, 0.065, 0.03, '#26262b', { c: true, rz: PI / 2, seg: 10 });
  for (const wx of [-0.12, 0.12]) {
    b.boxC(x + wx, y + 0.42, z + 0.3, 0.025, 0.36, 0.025, '#3a3a40', { rx: 0.35 });
    b.boxC(x + wx, y + 0.2, z + 0.5, 0.02, 0.2, 0.3, '#3a3a40');
  }
  b.box(x, y + 0.59, z + 0.24, 0.3, 0.03, 0.03, '#3a3a40');
  b.box(x, y + 0.28, z + 0.5, 0.27, 0.16, 0.36, F);
  b.box(x, y + 0.44, z + 0.55, 0.22, 0.02, 0.22, '#ffc2d6');
  b.box(x, y + 0.42, z + 0.4, 0.09, 0.08, 0.08, '#e6bf9c');
  b.box(x, y + 0.49, z + 0.4, 0.095, 0.025, 0.085, '#ff8fb3');
  b.boxC(x, y + 0.52, z + 0.37, 0.28, 0.02, 0.2, '#ff8fb3', { rx: 0.5 });
}
def('salva', 'Salva & Olivia', ['sign'], b => {
  const t = turned(b, 0.55, 4.3, PI / 2);
  person(t, 0.55, 4.3, { legH: 0.33, torH: 0.3, wide: 0.26, skin: '#f2d2b6', hair: '#a87a4f', top: '#4f7a5a', bottom: '#3d4a63', push: true });
  stroller(t, 0.55, 4.3);
});
def('paula', 'Paula', ['beagle'], b => {
  const px = 1.6, pz = 4.3;
  person(turned(b, px, pz, PI / 2), px, pz, {
    legH: 0.26, torH: 0.26, skin: '#c98f62', hair: '#6a4328', highlight: '#c4935e', top: '#c94a3a', bottom: '#2f3550', longHair: true,
  });
  const hx = px, hy = 0.33, hz = pz + 0.155, cx = 2.35, cy = 0.31, cz = 4.3;
  const dx = cx - hx, dz = cz - hz, L = Math.hypot(dx, dz);
  b.boxC((hx + cx) / 2, (hy + cy) / 2 - 0.03, (hz + cz) / 2, L, 0.015, 0.015, K.signRed, { ry: Math.atan2(-dz, dx) });
});
def('crflag', 'Canada & Costa Rica flags', ['th3'], b => {
  const y = 2.74, CAX = 2.85, CRX = 3.95, pz = -2.6;
  for (const px of [CAX, CRX]) {
    b.cyl(px, y, pz, 0.06, 0.06, '#9a8f84', { seg: 8 });
    b.cyl(px, y, pz, 0.022, 1.45, K.black, { seg: 5 });
  }
  const top = y + 1.42, w = 0.76, h = 0.43;
  b.box(CAX + 0.02 + w * 0.125, top - h, pz, w * 0.25, h, 0.015, K.signRed);
  b.box(CAX + 0.02 + w * 0.5, top - h, pz, w * 0.5, h, 0.015, K.white);
  b.box(CAX + 0.02 + w * 0.875, top - h, pz, w * 0.25, h, 0.015, K.signRed);
  b.plate(shape(leafPts(0.155)), 0.025, CAX + 0.02 + w * 0.5, top - h / 2, pz, K.signRed);
  [['#1f3f8f', 1], ['#ffffff', 1], ['#d22630', 2], ['#ffffff', 1], ['#1f3f8f', 1]].reduce((yy, [c, k]) => {
    const hh = k * h / 6; b.box(CRX + 0.02 + w / 2, yy - hh, pz, w, hh, 0.015, c); return yy - hh;
  }, top);
});

// ---------- West Toronto: Runnymede station, High Park bison, a little Science World ----------
def('subway', 'Jane station sign', ['sidewalkN'], b => {
  const x = -5.4, z = -1.15;
  b.box(x, 0.1, z, 0.16, 0.06, 0.16, K.pole);
  b.cyl(x, 0.1, z, 0.035, 1.5, '#aab2ba', { seg: 6 });
  b.box(x, 1.55, z, 0.62, 0.32, 0.06, '#1b1b1f');
  b.add(new THREE.PlaneGeometry(0.58, 0.28), '#fff', { ch: 'subway', uv: true, x, y: 1.71, z: z + 0.032 });
  b.add(new THREE.PlaneGeometry(0.58, 0.28), '#fff', { ch: 'subway', uv: true, x, y: 1.71, z: z - 0.032, ry: PI });
  b.glow(x, 1.71, z + 0.2, 1.2, '#ffffff');
});
def('bison', 'High Park bison', ['trees2'], b => {
  const x = 6.45, z = 4.3, y = 0, F = '#5a3d27', M = '#7a5636', D = '#2e2018', H = '#efe6d2';
  for (const lx of [-0.13, 0.13]) for (const lz of [-0.07, 0.07]) b.box(x + lx, y, z + lz, 0.07, 0.15, 0.07, D);
  b.box(x - 0.04, y + 0.13, z, 0.36, 0.2, 0.22, F);
  b.box(x + 0.1, y + 0.13, z, 0.2, 0.3, 0.25, M);
  b.box(x + 0.24, y + 0.12, z, 0.14, 0.15, 0.17, M);
  b.box(x + 0.3, y + 0.08, z, 0.06, 0.09, 0.1, D);
  b.box(x + 0.23, y + 0.06, z, 0.06, 0.08, 0.08, M);
  for (const s of [-1, 1]) {
    b.boxC(x + 0.26, y + 0.28, z + s * 0.1, 0.035, 0.07, 0.035, H, { rx: s * 0.6 });
    b.box(x + 0.315, y + 0.21, z + s * 0.055, 0.015, 0.025, 0.02, '#111111');
  }
  b.boxC(x - 0.23, y + 0.24, z, 0.03, 0.14, 0.03, D, { rz: -0.35 });
});
def('scienceworld', 'Mini Science World', ['plaza'], b => {
  const x = -6.45, z = 4.45;
  b.cyl(x, 0, z, 0.56, 0.08, '#b9c0c6', { seg: 16 });
  b.cyl(x, 0.08, z, 0.46, 0.12, '#7d868e', { seg: 16 });
  b.cyl(x, 0.2, z, 0.16, 0.22, '#9aa3ab', { seg: 10, rt: 0.12 });
  for (let i = 0; i < 3; i++) {
    const a = i * PI * 2 / 3 + 0.4;
    b.boxC(x + Math.cos(a) * 0.17, 0.33, z + Math.sin(a) * 0.17, 0.04, 0.26, 0.04, '#9aa3ab', { ry: -a, rz: 0.5 });
  }
  b.add(new THREE.IcosahedronGeometry(0.42, 1), '#eef1f3', { x, y: 0.82, z, ch: 'cnled' });
  b.cyl(x, 1.22, z, 0.018, 0.32, '#9aa3ab', { seg: 5 });
  b.glow(x, 0.82, z, 1.8, '#9fd8ff');
});

def('boat', 'Sailboat', ['lake'], b => {
  const bx = 1.6, bz = -4.88, by = 0.07;
  b.plate(shape([[-0.58, 0.17], [0.66, 0.17], [0.46, 0], [-0.44, 0]]), 0.34, bx, by, bz, K.white);
  b.box(bx, by + 0.17, bz, 1.0, 0.03, 0.28, K.trunk);
  b.cyl(bx - 0.05, by + 0.17, bz, 0.022, 1.45, K.trunk, { seg: 5 });
  b.plate(shape([[0, 0], [0, 1.25], [-0.62, 0]]), 0.025, bx - 0.08, by + 0.3, bz, K.white);
  b.plate(shape([[0, 0], [0, 1.12], [0.5, 0]]), 0.025, bx - 0.02, by + 0.3, bz, K.maple1);
}, { view: 0.98 * PI });

// ================= 8. Birthday surprise =================
CH = 7;
const MX = -5.0, MZ = 3.35;
def('mposts', 'Sign posts', ['plaza'], b => {
  for (const s of [-1, 1]) {
    b.box(MX + s * 1.42, 0, MZ, 0.3, 0.12, 0.3, K.stone);
    b.cyl(MX + s * 1.42, 0.12, MZ, 0.07, 2.3, K.postRed, { seg: 8 });
    b.cyl(MX + s * 1.42, 2.42, MZ, 0.1, 0.1, K.maple3, { seg: 8 });
  }
});
def('billboard', 'Rooftop billboard', [], b => {
  const S = 0.5; // overall size
  const cx = 5.7, cz = -3.0, y0 = 2.74, ry = PI / 4, W = 0.9 * S, H = 0.89 * S;
  const dx = Math.sin(ry), dz = Math.cos(ry), sx = Math.cos(ry), sz = -Math.sin(ry);
  const fy = y0 + 0.5 * S;
  for (const s of [-1, 1]) {
    const lx = cx + sx * s * 0.33 * S, lz = cz + sz * s * 0.33 * S;
    b.box(lx, y0, lz, 0.06 * S, 0.52 * S, 0.06 * S, K.pole);
    b.box(lx - dx * 0.18 * S, y0, lz - dz * 0.18 * S, 0.05 * S, 0.42 * S, 0.05 * S, K.pole);
  }
  b.box(cx + dx * 0.12 * S, y0 + 0.4 * S, cz + dz * 0.12 * S, W + 0.08 * S, 0.03 * S, 0.22 * S, K.pole, { ry });
  b.box(cx, fy - 0.045 * S, cz, W + 0.09 * S, H + 0.09 * S, 0.08 * S, K.black, { ry });
  b.add(new THREE.PlaneGeometry(W, H), '#fff', { ch: 'billboard', uv: true, x: cx + dx * 0.042 * S, y: fy + H / 2, z: cz + dz * 0.042 * S, ry });
  for (const s of [-0.27, 0.27]) {
    const ax = cx + sx * s * S, az = cz + sz * s * S, top = fy + H + 0.045 * S;
    b.box(ax + dx * 0.11 * S, top, az + dz * 0.11 * S, 0.03 * S, 0.03 * S, 0.24 * S, K.pole, { ry });
    b.box(ax + dx * 0.22 * S, top - 0.05 * S, az + dz * 0.22 * S, 0.12 * S, 0.06 * S, 0.08 * S, K.pole, { ry });
    b.box(ax + dx * 0.22 * S, top - 0.062 * S, az + dz * 0.22 * S, 0.09 * S, 0.015 * S, 0.05 * S, 0, { ch: 'light', ry });
    b.glow(ax + dx * 0.3 * S, fy + H * 0.7, az + dz * 0.3 * S, 1.0 * S, '#fff2cf');
  }
}, { secret: true });
def('marquee', 'Birthday sign', [], b => {
  const w = 3.1, h = 1.4, y0 = 0.95, bz = MZ + 0.1;
  b.box(MX, y0, MZ, w, h, 0.16, K.board);
  b.add(new THREE.PlaneGeometry(w - 0.3, h - 0.3), '#fff', { ch: 'marquee', uv: true, x: MX, y: y0 + h / 2, z: MZ + 0.09 });
  let i = 0;
  for (let x = -w / 2 + 0.08; x <= w / 2 - 0.07; x += 0.19)
    for (const yy of [y0 + 0.07, y0 + h - 0.07]) b.box(MX + x, yy - 0.03, bz, 0.06, 0.06, 0.04, 0, { ch: (i++ % 2) ? 'bulbA' : 'bulbB' });
  for (let yy = y0 + 0.26; yy < y0 + h - 0.15; yy += 0.19)
    for (const xx of [-w / 2 + 0.07, w / 2 - 0.07]) b.box(MX + xx, yy - 0.03, bz, 0.06, 0.06, 0.04, 0, { ch: (i++ % 2) ? 'bulbA' : 'bulbB' });
  b.plate(shape(leafPts(0.32)), 0.1, MX, y0 + h + 0.28, MZ, K.maple1);
  b.glow(MX, y0 + h / 2, MZ + 0.5, 4.6, '#ffcf6a');
}, { secret: true });
// the birthday sign goes last
PIECES.find(p => p.id === 'billboard').needs = PIECES.filter(p => p.id !== 'marquee' && p.id !== 'billboard').map(p => p.id);
PIECES.find(p => p.id === 'marquee').needs = PIECES.filter(p => p.id !== 'marquee').map(p => p.id);

export const LAST_ID = 'marquee';
export const TRAM_IDS = ['tram1', 'tram2', 'tram3', 'tram4', 'tram5', 'tram6'];
