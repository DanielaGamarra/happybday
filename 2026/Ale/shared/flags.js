// Flags of home: simple painted flags for the second flagpole in every city.
// Spec: s = 'h' (horizontal stripes) or 'v' (vertical), c = colours, w = optional stripe weights,
// a = overlays: ['circle', col, x, y, r], ['star', col, x, y, r], ['poly', col, [[x,y],...]],
// ['plus', col, thickness], ['x', col, thickness], ['nordic', col, thickness, x], ['rect', col, x, y, w, h].
// x and w are fractions of the width, y, h and r fractions of the height.

const MAPLE = [[.5, .18], [.54, .3], [.6, .27], [.58, .42], [.68, .36], [.66, .44], [.74, .44], [.66, .56], [.68, .6], [.53, .58], [.53, .78], [.47, .78], [.47, .58], [.32, .6], [.34, .56], [.26, .44], [.34, .44], [.32, .36], [.42, .42], [.4, .27], [.46, .3]];
const usStripes = Array.from({ length: 13 }, (_, i) => i % 2 ? '#ffffff' : '#b22234');

export const FLAGS = {
  ar: ['Argentina', { s: 'h', c: ['#74acdf', '#ffffff', '#74acdf'], a: [['circle', '#f6b40e', .5, .5, .1]] }],
  bd: ['Bangladesh', { s: 'h', c: ['#006a4e'], a: [['circle', '#f42a41', .45, .5, .3]] }],
  br: ['Brazil', { s: 'h', c: ['#009c3b'], a: [['poly', '#ffdf00', [[.5, .1], [.92, .5], [.5, .9], [.08, .5]]], ['circle', '#002776', .5, .5, .22]] }],
  ca: ['Canada', { s: 'v', c: ['#d80621', '#ffffff', '#d80621'], w: [1, 2, 1], a: [['poly', '#d80621', MAPLE]] }],
  cl: ['Chile', { s: 'h', c: ['#ffffff', '#d52b1e'], a: [['rect', '#0039a6', 0, 0, .33, .5], ['star', '#ffffff', .165, .25, .12]] }],
  cn: ['China', { s: 'h', c: ['#de2910'], a: [['star', '#ffde00', .17, .27, .16]] }],
  co: ['Colombia', { s: 'h', c: ['#fcd116', '#003893', '#ce1126'], w: [2, 1, 1] }],
  cr: ['Costa Rica', { s: 'h', c: ['#002b7f', '#ffffff', '#ce1126', '#ffffff', '#002b7f'], w: [1, 1, 2, 1, 1] }],
  cu: ['Cuba', { s: 'h', c: ['#002a8f', '#ffffff', '#002a8f', '#ffffff', '#002a8f'], a: [['poly', '#cf142b', [[0, 0], [.43, .5], [0, 1]]], ['star', '#ffffff', .14, .5, .12]] }],
  de: ['Germany', { s: 'h', c: ['#000000', '#dd0000', '#ffce00'] }],
  dk: ['Denmark', { s: 'h', c: ['#c8102e'], a: [['nordic', '#ffffff', .14, .36]] }],
  do: ['Dominican Republic', { s: 'h', c: ['#ffffff'], a: [['rect', '#002d62', 0, 0, .5, .5], ['rect', '#ce1126', .5, 0, .5, .5], ['rect', '#ce1126', 0, .5, .5, .5], ['rect', '#002d62', .5, .5, .5, .5], ['plus', '#ffffff', .16]] }],
  ec: ['Ecuador', { s: 'h', c: ['#ffdd00', '#034ea2', '#ed1c24'], w: [2, 1, 1], a: [['circle', '#8b5a2b', .5, .5, .13]] }],
  eg: ['Egypt', { s: 'h', c: ['#ce1126', '#ffffff', '#000000'], a: [['circle', '#c09300', .5, .5, .09]] }],
  es: ['Spain', { s: 'h', c: ['#aa151b', '#f1bf00', '#aa151b'], w: [1, 2, 1] }],
  et: ['Ethiopia', { s: 'h', c: ['#078930', '#fcdd09', '#da121a'], a: [['circle', '#0f47af', .5, .5, .22], ['star', '#fcdd09', .5, .5, .15]] }],
  fi: ['Finland', { s: 'h', c: ['#ffffff'], a: [['nordic', '#002f6c', .2, .36]] }],
  fr: ['France', { s: 'v', c: ['#0055a4', '#ffffff', '#ef4135'] }],
  gb: ['United Kingdom', { s: 'h', c: ['#012169'], a: [['x', '#ffffff', .2], ['x', '#c8102e', .07], ['plus', '#ffffff', .3], ['plus', '#c8102e', .18]] }],
  gh: ['Ghana', { s: 'h', c: ['#ce1126', '#fcd116', '#006b3f'], a: [['star', '#000000', .5, .5, .15]] }],
  gr: ['Greece', { s: 'h', c: ['#0d5eaf', '#ffffff', '#0d5eaf', '#ffffff', '#0d5eaf', '#ffffff', '#0d5eaf', '#ffffff', '#0d5eaf'], a: [['rect', '#0d5eaf', 0, 0, .37, .555], ['rect', '#ffffff', .148, 0, .074, .555], ['rect', '#ffffff', 0, .222, .37, .111]] }],
  gt: ['Guatemala', { s: 'v', c: ['#4997d0', '#ffffff', '#4997d0'], a: [['circle', '#5b8c3a', .5, .5, .12]] }],
  gy: ['Guyana', { s: 'h', c: ['#009e49'], a: [['poly', '#ffffff', [[0, 0], [1, .5], [0, 1]]], ['poly', '#fcd116', [[0, .04], [.94, .5], [0, .96]]], ['poly', '#000000', [[0, 0], [.5, .5], [0, 1]]], ['poly', '#ce1126', [[0, .05], [.45, .5], [0, .95]]]] }],
  hn: ['Honduras', { s: 'h', c: ['#0073cf', '#ffffff', '#0073cf'], a: [['star', '#0073cf', .5, .5, .07]] }],
  ht: ['Haiti', { s: 'h', c: ['#00209f', '#d21034'], a: [['rect', '#ffffff', .38, .32, .24, .36]] }],
  ie: ['Ireland', { s: 'v', c: ['#169b62', '#ffffff', '#ff883e'] }],
  in: ['India', { s: 'h', c: ['#ff9933', '#ffffff', '#138808'], a: [['circle', '#000080', .5, .5, .11], ['circle', '#ffffff', .5, .5, .08]] }],
  ir: ['Iran', { s: 'h', c: ['#239f40', '#ffffff', '#da0000'], a: [['circle', '#da0000', .5, .5, .07]] }],
  it: ['Italy', { s: 'v', c: ['#009246', '#ffffff', '#ce2b37'] }],
  jm: ['Jamaica', { s: 'h', c: ['#009b3a'], a: [['poly', '#000000', [[0, 0], [.5, .5], [0, 1]]], ['poly', '#000000', [[1, 0], [.5, .5], [1, 1]]], ['x', '#fed100', .14]] }],
  jp: ['Japan', { s: 'h', c: ['#ffffff'], a: [['circle', '#bc002d', .5, .5, .3]] }],
  ke: ['Kenya', { s: 'h', c: ['#000000', '#ffffff', '#bb0000', '#ffffff', '#006600'], w: [6, 1, 6, 1, 6], a: [['circle', '#bb0000', .5, .5, .2]] }],
  kr: ['South Korea', { s: 'h', c: ['#ffffff'], a: [['circle', '#cd2e3a', .5, .5, .25], ['poly', '#0047a0', [[.36, .5], [.64, .5], [.6, .7], [.5, .76], [.4, .7]]]] }],
  lb: ['Lebanon', { s: 'h', c: ['#ed1c24', '#ffffff', '#ed1c24'], w: [1, 2, 1], a: [['poly', '#00a651', [[.5, .3], [.62, .68], [.38, .68]]]] }],
  lk: ['Sri Lanka', { s: 'v', c: ['#005f56', '#ff7300', '#8d153a'], w: [1, 1, 4], a: [['circle', '#ffbe29', .65, .5, .14]] }],
  ma: ['Morocco', { s: 'h', c: ['#c1272d'], a: [['star', '#006233', .5, .5, .22]] }],
  mx: ['Mexico', { s: 'v', c: ['#006847', '#ffffff', '#ce1126'], a: [['circle', '#8b5a2b', .5, .5, .14], ['circle', '#3f7d3a', .5, .6, .06]] }],
  ng: ['Nigeria', { s: 'v', c: ['#008751', '#ffffff', '#008751'] }],
  ni: ['Nicaragua', { s: 'h', c: ['#0067c6', '#ffffff', '#0067c6'], a: [['circle', '#c8a400', .5, .5, .08]] }],
  nl: ['Netherlands', { s: 'h', c: ['#ae1c28', '#ffffff', '#21468b'] }],
  no: ['Norway', { s: 'h', c: ['#ba0c2f'], a: [['nordic', '#ffffff', .26, .36], ['nordic', '#00205b', .13, .36]] }],
  pa: ['Panama', { s: 'h', c: ['#ffffff'], a: [['rect', '#da121a', .5, 0, .5, .5], ['rect', '#072357', 0, .5, .5, .5], ['star', '#072357', .25, .25, .12], ['star', '#da121a', .75, .75, .12]] }],
  pe: ['Peru', { s: 'v', c: ['#d91023', '#ffffff', '#d91023'] }],
  ph: ['Philippines', { s: 'h', c: ['#0038a8', '#ce1126'], a: [['poly', '#ffffff', [[0, 0], [.44, .5], [0, 1]]], ['circle', '#fcd116', .15, .5, .1]] }],
  pk: ['Pakistan', { s: 'v', c: ['#ffffff', '#01411c'], w: [1, 3], a: [['circle', '#ffffff', .6, .5, .26], ['circle', '#01411c', .64, .45, .23], ['star', '#ffffff', .7, .4, .1]] }],
  pl: ['Poland', { s: 'h', c: ['#ffffff', '#dc143c'] }],
  pr: ['Puerto Rico', { s: 'h', c: ['#ed0000', '#ffffff', '#ed0000', '#ffffff', '#ed0000'], a: [['poly', '#0050f0', [[0, 0], [.43, .5], [0, 1]]], ['star', '#ffffff', .14, .5, .12]] }],
  pt: ['Portugal', { s: 'v', c: ['#006600', '#ff0000'], w: [2, 3], a: [['circle', '#ffcc00', .4, .5, .2], ['circle', '#ff0000', .4, .5, .12]] }],
  qc: ['Québec', { s: 'h', c: ['#003da5'], a: [['plus', '#ffffff', .18]] }],
  se: ['Sweden', { s: 'h', c: ['#006aa7'], a: [['nordic', '#fecc00', .2, .36]] }],
  so: ['Somalia', { s: 'h', c: ['#4189dd'], a: [['star', '#ffffff', .5, .5, .25]] }],
  sv: ['El Salvador', { s: 'h', c: ['#0047ab', '#ffffff', '#0047ab'], a: [['circle', '#e0b000', .5, .5, .08]] }],
  tr: ['Türkiye', { s: 'h', c: ['#e30a17'], a: [['circle', '#ffffff', .38, .5, .28], ['circle', '#e30a17', .42, .5, .22], ['star', '#ffffff', .58, .5, .12]] }],
  tt: ['Trinidad and Tobago', { s: 'h', c: ['#ce1126'], a: [['poly', '#ffffff', [[.05, 0], [.32, 0], [.95, 1], [.68, 1]]], ['poly', '#000000', [[.1, 0], [.27, 0], [.9, 1], [.73, 1]]]] }],
  ua: ['Ukraine', { s: 'h', c: ['#0057b7', '#ffd700'] }],
  us: ['United States', { s: 'h', c: usStripes, a: [['rect', '#3c3b6e', 0, 0, .4, .54]] }],
  uy: ['Uruguay', { s: 'h', c: ['#ffffff', '#0038a8', '#ffffff', '#0038a8', '#ffffff', '#0038a8', '#ffffff', '#0038a8', '#ffffff'], a: [['rect', '#ffffff', 0, 0, .36, .555], ['circle', '#fcd116', .18, .28, .17]] }],
  ve: ['Venezuela', { s: 'h', c: ['#ffcc00', '#00247d', '#cf142b'] }],
  vn: ['Vietnam', { s: 'h', c: ['#da251d'], a: [['star', '#ffff00', .5, .5, .3]] }],
};

export const flagName = code => (FLAGS[code] || [code])[0];
export const flagList = () => Object.entries(FLAGS).map(([code, [name]]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));

function star(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}

// Paint a flag on a 2D canvas context (W x H).
export function drawFlag(g, code, W, H) {
  const spec = (FLAGS[code] || [])[1];
  if (!spec) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H); return false; }
  const ws = spec.w || spec.c.map(() => 1), tot = ws.reduce((a, b) => a + b, 0);
  let off = 0;
  spec.c.forEach((col, i) => {
    g.fillStyle = col;
    const len = ws[i] / tot;
    if (spec.s === 'v') g.fillRect(Math.floor(off * W), 0, Math.ceil(len * W) + 1, H);
    else g.fillRect(0, Math.floor(off * H), W, Math.ceil(len * H) + 1);
    off += len;
  });
  for (const [t, col, ...p] of spec.a || []) {
    g.fillStyle = col; g.strokeStyle = col;
    if (t === 'circle') { g.beginPath(); g.arc(p[0] * W, p[1] * H, p[2] * H, 0, Math.PI * 2); g.fill(); }
    else if (t === 'star') star(g, p[0] * W, p[1] * H, p[2] * H);
    else if (t === 'poly') { g.beginPath(); p[0].forEach(([x, y]) => g.lineTo(x * W, y * H)); g.closePath(); g.fill(); }
    else if (t === 'rect') g.fillRect(p[0] * W, p[1] * H, p[2] * W, p[3] * H);
    else if (t === 'plus') { const th = p[0] * H; g.fillRect(0, H / 2 - th / 2, W, th); g.fillRect(W / 2 - th / 2, 0, th, H); }
    else if (t === 'nordic') { const th = p[0] * H; g.fillRect(0, H / 2 - th / 2, W, th); g.fillRect(p[1] * W - th / 2, 0, th, H); }
    else if (t === 'x') { g.lineWidth = p[0] * H; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke(); }
  }
  return true;
}

// A three.js texture of the flag (pass the THREE namespace).
export function flagTexture(THREE, code) {
  const c = document.createElement('canvas'); c.width = 320; c.height = 180;
  drawFlag(c.getContext('2d'), code, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
