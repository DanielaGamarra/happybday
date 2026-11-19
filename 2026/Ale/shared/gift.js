// Gift a Game: reads the gift stored in the link (#g=...) and personalises any city.
// - custom text spots, look, greeting, message and signature
// - unlock date countdown
// - "Report a problem" in the menu
// - "Send one back" on the finale card
// Every city imports this file (same path, so it is one module instance).

export const REPORT_TO = 'hello@giftagame.app';
const params = new URLSearchParams(location.search);
const DEV = params.has('dev') || params.has('preview');

export function encodeGift(g) {
  const bytes = new TextEncoder().encode(JSON.stringify(g));
  let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decodeGift(s) {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
  } catch { return null; }
}
const m = location.hash.match(/[#&]g=([A-Za-z0-9_-]+)/);
const BAKED = {"v": 1, "c": "toronto", "l": "wood", "f": "pe", "to": "Ale", "from": "Daga", "occ": "Merry Christmas", "p": [{"n": "Coco", "c": "#8a5a34", "s": "#5a3620"}, {"n": "Jero", "c": "#9a9894", "s": "#5c5a57"}], "t": {"marquee": "NOW SHOWING ★ ALE, COCO & JERO", "vehicle": "506 TO ALE’S"}}; // Ale's Christmas gift
export const GIFT = (m && decodeGift(m[1])) || BAKED;

// Words for the buttons this file adds, in the city's language (<html lang>)
const LANG = (document.documentElement.lang || 'en').slice(0, 2);
const WORDS = {
  en: { demo: 'Free demo', demoTitle: 'That was the free part!', demoSub: 'The rest of the city, the lights and the final card come with a real gift. Make one with their name on it.', demoGo: 'Make one for someone', demoShop: 'See how it works', back: 'Send one back', report: 'Report a problem', reportIntro: 'Tell us what went wrong. We fix problems the same day.', what: 'What happened? (for example: the screen went black after the bridge piece)', email: 'Your email, if you want a reply (optional)', send: 'Send report', cancel: 'Cancel', hide: 'See the city', show: 'Show the card', eggs: 'See Easter eggs', closing: 'With love,', waiting: 'A gift is waiting', notYet: 'Not yet!', made: ' made you something. ', someone: 'Someone made you something. ', opens: 'It opens on ', hope: 'Hope you like it!' },
  es: { demo: 'Demo gratis', demoTitle: '¡Esa fue la parte gratis!', demoSub: 'El resto de la ciudad, las luces y la tarjeta final vienen con un regalo de verdad. Haz uno con su nombre.', demoGo: 'Hacer uno para alguien', demoShop: 'Ver cómo funciona', back: 'Envía uno de vuelta', report: 'Reportar un problema', reportIntro: 'Cuéntanos qué pasó. Lo arreglamos el mismo día.', what: '¿Qué pasó? (por ejemplo: la pantalla se puso negra)', email: 'Tu correo, si quieres respuesta (opcional)', send: 'Enviar', cancel: 'Cancelar', hide: 'Ver la ciudad', show: 'Ver la tarjeta', eggs: 'Ver las sorpresas', closing: 'Con cariño,', waiting: 'Te espera un regalo', notYet: '¡Todavía no!', made: ' te hizo algo. ', someone: 'Alguien te hizo algo. ', opens: 'Se abre el ', hope: '¡Ojalá te guste!' },
  fr: { demo: 'Démo gratuite', demoTitle: 'C’était la partie gratuite !', demoSub: 'Le reste de la ville, les lumières et la carte finale viennent avec un vrai cadeau. Fais-en un à son nom.', demoGo: 'En faire un pour quelqu’un', demoShop: 'Voir comment ça marche', back: 'Envoie-en un en retour', report: 'Signaler un problème', reportIntro: 'Dis-nous ce qui ne va pas. On corrige le jour même.', what: 'Que s’est-il passé ?', email: 'Ton courriel, pour une réponse (facultatif)', send: 'Envoyer', cancel: 'Annuler', hide: 'Voir la ville', show: 'Voir la carte', eggs: 'Voir les surprises', closing: 'Avec amour,', waiting: 'Un cadeau t’attend', notYet: 'Pas encore !', made: ' t’a préparé quelque chose. ', someone: 'Quelqu’un t’a préparé quelque chose. ', opens: 'Il s’ouvre le ', hope: 'J’espère que tu aimeras !' },
};
const W = WORDS[LANG] || WORDS.en;

const clean = (v, max = 60) => String(v ?? '').replace(/[\u0000-\u001f]/g, '').slice(0, max);

// The top line of the big name sign follows the gift's occasion ("Merry Christmas" -> "M E R R Y   C H R I S T M A S"),
// shrinking to fit the sign. Without an occasion it keeps the city's own words.
export function drawSignTop(g, fallback, w, y) {
  const occ = GIFT && GIFT.occ ? clean(GIFT.occ, 30).replace(/[!¡.,]+/g, '').trim().toUpperCase() : '';
  const text = occ ? occ.split(' ').map(word => [...word].join(' ')).join('   ') : fallback;
  let size = 74;
  do { g.font = `800 ${size}px Nunito, Arial, sans-serif`; size -= 2; } while (g.measureText(text).width > w - 110 && size > 30);
  g.fillText(text, w / 2, y);
}

// Merge the giver's words into a city's TEXT block.
export function applyGift(TEXT) {
  if (!GIFT) return TEXT;
  if (GIFT.to) TEXT.name = clean(GIFT.to, 24);
  if (GIFT.from && 'from' in TEXT) TEXT.from = clean(GIFT.from, 24);
  // the billboard is signed by the giver unless they wrote something else there
  if (GIFT.from && 'billboardName' in TEXT && !(GIFT.t && GIFT.t.billboardName)) TEXT.billboardName = clean(GIFT.from, 24);
  if (GIFT.t) for (const k of Object.keys(GIFT.t)) if (k in TEXT && GIFT.t[k]) TEXT[k] = clean(GIFT.t[k]);
  return TEXT;
}

// Look: the gift's look wins over ?look=
const LOOKS = ['wood', 'memphis', 'noir', 'blueprint', 'sorbet', 'dream', 'pixel'];
if (GIFT && LOOKS.includes(GIFT.l) && document.body) {
  [...document.body.classList].filter(c => c.startsWith('look-')).forEach(c => document.body.classList.remove(c));
  document.body.classList.add('look-' + GIFT.l);
}

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === 'class' ? (e.className = v) : e.setAttribute(k, v);
  kids.forEach(k => e.append(k));
  return e;
}
const isCity = !!document.getElementById('scene');
const root = new URL('../../', location.href); // repo root from cities/<city>/

function personaliseFinale() {
  if (!GIFT) return;
  const card = document.querySelector('#finale .card-box');
  if (!card) return;
  const h1 = card.querySelector('h1'), sub = card.querySelector('.sub'), sign = card.querySelector('.sign');
  const title = () => {
    if (!h1 || !GIFT.to) return;
    const to = clean(GIFT.to, 24);
    const es = /^(feliz|felices)/i.test(GIFT.occ || '');
    let want = GIFT.occ ? `${clean(GIFT.occ, 30)}, ${to}!` : h1.textContent.replace(/,\s*[^,!]+!\s*$/, `, ${to}!`);
    if (es && GIFT.occ && !want.startsWith('¡')) want = '¡' + want;
    if (h1.textContent !== want) h1.textContent = want;
  };
  title();
  // some cities rewrite the title when the finale opens: keep the giver's greeting
  if (h1) new MutationObserver(title).observe(h1, { childList: true, characterData: true, subtree: true });
  if (sub && GIFT.msg) sub.textContent = clean(GIFT.msg, 240);
  // the signature is one line: the giver's closing words + their name ("With love, Daniel")
  const closing = clean(GIFT.cl || W.closing, 40);
  const signIt = () => {
    if (!sign || !GIFT.from) return;
    const name = clean(GIFT.from, 24);
    const slot = sign.querySelector('#finFrom');
    if (slot) {
      const first = sign.querySelector('span:not(#finFrom)');
      if (first && first.textContent !== closing + ' ') first.textContent = closing + ' ';
      sign.querySelectorAll('br').forEach(br => { br.style.display = 'none'; });
      if (slot.textContent !== name) slot.textContent = name;
    } else if (sign.textContent !== `${closing} ${name}`) sign.textContent = `${closing} ${name}`;
  };
  signIt();
  if (sign) new MutationObserver(() => { if (!sign.textContent.includes(closing) || !sign.textContent.includes(clean(GIFT.from, 24))) signIt(); }).observe(sign, { childList: true, characterData: true, subtree: true });
}

// A simpler final card for everyone: greeting, message, signature, one big button and one small row.
function simplifyFinale() {
  const card = document.querySelector('#finale .card-box');
  if (!card || card.dataset.simple) return;
  card.dataset.simple = '1';
  const st = document.createElement('style');
  st.textContent = `#finale .card-box > small, #finLights, #finClose, #finAgain, #finale .eggs { display: none !important; }
    #finale .btns { display: flex; gap: 8px; }
    #finale .btns .btn { flex: 1; }
    #finale .card-box { overflow-wrap: anywhere; }
    #finale .send-back { width: 100%; margin: 6px 0 10px !important; padding: 16px; font-size: 17px; background: #3d2a22 !important; color: #fff8ee !important; box-shadow: inset 0 0 0 3px #e0a43a, 0 4px 0 #1f1410 !important; }
    #finale .btns .btn { font-size: 15px; padding: 13px 8px; line-height: 1.2; }
    #finPhoto svg { width: 18px; height: 18px; vertical-align: -3px; margin-right: 6px; }
    #finale .eggs-btn { position: relative; overflow: hidden; margin: 0; border: 0; color: #fff; font-weight: 900;
      background: linear-gradient(120deg, #f2b544, #e8714a 55%, #e66b9a); box-shadow: inset 0 0 0 3px #fff6, 0 4px 0 #b4482a, 0 8px 18px #e8714a55; text-shadow: 0 1px 0 #0003; }
    #finale .eggs-btn::before { content: '✦'; margin-right: 8px; }
    #finale .eggs-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, #fff8 50%, transparent 70%);
      transform: translateX(-120%); animation: eggShine 2.6s ease-in-out infinite; }
    @keyframes eggShine { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
    @media (prefers-reduced-motion: reduce) { #finale .eggs-btn::after { animation: none; display: none; } }`;
  document.head.append(st);
  const eggs = document.getElementById('finEggs'), btns = card.querySelector('.btns');
  if (eggs && btns) { eggs.classList.remove('small', 'ghost'); eggs.classList.add('eggs-btn'); eggs.textContent = W.eggs; btns.prepend(eggs); }
  // the saved photo centres the city: the apps fit the city to the free space, so free all of it for that one frame
  const photoBtn = document.getElementById('finPhoto');
  if (photoBtn) photoBtn.addEventListener('click', () => {
    const hud = document.getElementById('hud'), hudWas = hud ? hud.hidden : true;
    card.style.transition = 'none'; card.style.transform = 'translateY(200vh)'; if (hud) hud.hidden = true;
    dispatchEvent(new Event('resize'));
    setTimeout(() => { card.style.transform = ''; if (hud) hud.hidden = hudWas; dispatchEvent(new Event('resize')); requestAnimationFrame(() => { card.style.transition = ''; }); }, 0);
  }, true);
  // Save a photo gets a download icon
  const photo = document.getElementById('finPhoto');
  if (photo && !photo.querySelector('svg')) photo.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>');
  // once the city is finished, the top lightbulb switches the lights
  const hint = document.getElementById('btnHint'), lights = document.getElementById('finLights');
  if (hint && lights) hint.addEventListener('click', e => {
    const fin = document.getElementById('finale');
    if (fin && !fin.hidden) { e.stopImmediatePropagation(); e.preventDefault(); lights.click(); }
  }, true);
}

function sendOneBack() {
  const card = document.querySelector('#finale .card-box');
  if (!card || card.querySelector('.send-back')) return;
  const btn = el('button', { class: 'btn send-back', type: 'button' }, W.back);
  btn.style.marginTop = '8px';
  if (params.has('preview')) { btn.disabled = true; btn.style.opacity = '.55'; btn.style.cursor = 'default'; }
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const u = new URL('maker/', root);
    const city = location.pathname.split('/').filter(Boolean).slice(-1)[0];
    if (city) u.searchParams.set('city', city);
    if (GIFT?.from) u.searchParams.set('to', GIFT.from);
    if (GIFT?.to) u.searchParams.set('from', GIFT.to);
    u.searchParams.set('reply', '1');
    location.href = u.toString();
  });
  const row = card.querySelector('.btns');
  row ? card.insertBefore(btn, row) : card.append(btn);
}

// On short screens the finale card can hide the city: a toggle folds it down to its title
function foldToggle() {
  const card = document.querySelector('#finale .card-box');
  if (!card || card.querySelector('.fold')) return;
  const st = document.createElement('style');
  st.textContent = `#finale .card-box { transition: transform .45s cubic-bezier(.3,1.2,.5,1); }
    #finale .card-box.folded { transform: translateY(calc(100% - 96px)); }
    #finale .fold { position: absolute; top: -16px; right: 16px; font: inherit; font-size: 13px; font-weight: 800; border: 0; border-radius: 99px; padding: 7px 14px; background: #fff; color: #2b1e3f; box-shadow: 0 3px 10px rgba(0,0,0,.25); cursor: pointer; z-index: 2; }
    #finale .card-box { position: relative; }`;
  document.head.append(st);
  const b = el('button', { class: 'fold', type: 'button' }, W.hide);
  const refit = () => { const t0 = performance.now(); const step = () => { dispatchEvent(new Event('resize')); if (performance.now() - t0 < 520) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  const setFold = f => { card.classList.toggle('folded', f); b.textContent = f ? W.show : W.hide; refit(); };
  b.addEventListener('click', () => setFold(!card.classList.contains('folded')));
  card.prepend(b);
  // a tap outside the card (not a drag) folds it, so the city is right there
  const scene = document.getElementById('scene'); let down = null;
  scene.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY, Date.now()]; });
  scene.addEventListener('pointerup', e => {
    const fin = document.getElementById('finale');
    if (!down || !fin || fin.hidden || card.classList.contains('folded')) return;
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]), quick = Date.now() - down[2] < 400;
    if (moved < 8 && quick) setFold(true);
    down = null;
  });
}

function reportProblem() {
  const sheet = document.querySelector('#menu .sheet');
  if (!sheet || sheet.querySelector('.report-row')) return;
  const row = el('button', { class: 'row report-row', type: 'button' }, W.report);
  const close = sheet.querySelector('#menuClose');
  close ? sheet.insertBefore(row, close) : sheet.append(row);
  const wrap = el('div', { class: 'sheet-wrap', id: 'reportSheet', hidden: '' });
  const box = el('div', { class: 'sheet ask' });
  const ta = el('textarea', { rows: '4', placeholder: W.what });
  const email = el('input', { type: 'email', placeholder: W.email });
  [ta, email].forEach(f => Object.assign(f.style, { width: '100%', font: 'inherit', fontSize: '15px', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #8a5a3540', background: '#fff', color: '#222', boxSizing: 'border-box' }));
  const send = el('button', { class: 'btn', type: 'button' }, W.send);
  box.append(el('p', {}, W.reportIntro), ta, email, send);
  wrap.append(box); document.body.append(wrap);
  row.addEventListener('click', () => { document.getElementById('menu').hidden = true; wrap.hidden = false; ta.focus(); });
  wrap.addEventListener('click', e => { if (e.target === wrap) wrap.hidden = true; });
  send.addEventListener('click', () => {
    let gl = '';
    try { const c = document.createElement('canvas').getContext('webgl'); const d = c && c.getExtension('WEBGL_debug_renderer_info'); gl = d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : ''; } catch { /* ignore */ }
    const info = [
      `What happened: ${ta.value}`, `Reply to: ${email.value || '(none)'}`, '', '--- device info (added automatically) ---',
      `Page: ${location.pathname}`, `Look: ${[...document.body.classList].find(c => c.startsWith('look-')) || ''}`,
      `Screen: ${screen.width}x${screen.height} @${devicePixelRatio}`, `Browser: ${navigator.userAgent}`, `GPU: ${gl}`,
      `Errors: ${(window.__giftErrors || []).slice(-20).join(' | ')}`,
    ].join('\n');
    location.href = `mailto:${REPORT_TO}?subject=${encodeURIComponent('Gift a Game problem report')}&body=${encodeURIComponent(info)}`;
    wrap.hidden = true;
  });
}
window.__giftErrors = window.__giftErrors || [];
window.addEventListener('error', e => window.__giftErrors.push(String(e.message).slice(0, 120)));

function countdown() {
  if (!GIFT?.u || DEV) return false;
  const when = new Date(GIFT.u);
  if (!(when > new Date())) return false;
  const card = el('div', { class: 'card-box' });
  const title = el('h1', {}, W.notYet);
  const left = el('p', { class: 'sub' });
  const from = GIFT.from ? clean(GIFT.from, 24) + W.made : W.someone;
  card.append(el('small', {}, W.waiting), title, el('p', { class: 'sub' }, from + W.opens + when.toLocaleDateString(LANG, { weekday: 'long', month: 'long', day: 'numeric' }) + '.'), left);
  const scr = el('div', { class: 'screen', id: 'giftLock' }); scr.style.zIndex = '60'; scr.append(card);
  document.body.append(scr);
  const tick = () => {
    const ms = when - new Date();
    if (ms <= 0) { location.reload(); return; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, mi = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    left.textContent = `${d ? d + 'd ' : ''}${h}h ${mi}m ${s}s`;
  };
  tick(); setInterval(tick, 1000);
  return true;
}

// Holiday snow: a light 2D overlay (no extra 3D load). On for Christmas-type greetings, or when the giver asks.
function snow() {
  const festive = /christmas|holiday|navidad|no[eë]l|fiestas/i.test(GIFT?.occ || '');
  if (!(GIFT && (GIFT.s === true || (GIFT.s !== false && festive)))) return;
  const c = document.createElement('canvas');
  Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '5' });
  c.setAttribute('aria-hidden', 'true');
  document.getElementById('scene').after(c);
  const g = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0; const dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; };
  size(); addEventListener('resize', size);
  const flakes = Array.from({ length: reduce ? 30 : 70 }, () => ({ x: Math.random(), y: Math.random(), r: 0.8 + Math.random() * 2.2, v: 0.0006 + Math.random() * 0.0012, d: Math.random() * 6 }));
  let last = 0;
  const draw = t => {
    requestAnimationFrame(draw);
    if (document.hidden || t - last < 33) return; // about 30 fps, paused when hidden
    last = t; g.clearRect(0, 0, W, H); g.fillStyle = 'rgba(255,255,255,.85)';
    for (const f of flakes) {
      if (!reduce) { f.y += f.v; f.x += Math.sin(t / 1500 + f.d) * 0.0004; if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); } }
      g.beginPath(); g.arc(f.x * W, f.y * H, f.r * dpr, 0, Math.PI * 2); g.fill();
    }
  };
  requestAnimationFrame(draw);
}

// Free demo: a sample city opened without a gift link stops after the first few pieces,
// so the full build, the lights and the finale stay part of the paid gift.
const DEMO_PIECES = 8;
function demoLimit() {
  if (GIFT || DEV || params.has('qa')) return;
  const cnt = document.getElementById('count');
  if (!cnt) return;
  let shown = false;
  const wall = () => {
    if (shown) return; shown = true;
    const city = (location.pathname.match(/cities\/([^/]+)/) || [])[1];
    const make = new URL('maker/', root); if (city) make.searchParams.set('city', city);
    const go = el('a', { class: 'btn', href: make.toString() }, W.demoGo);
    const shop = el('a', { class: 'btn ghost', href: new URL('./#how', root).toString() }, W.demoShop);
    shop.style.marginTop = '8px';
    const card = el('div', { class: 'card-box' }, el('small', {}, W.demo), el('h1', {}, W.demoTitle), el('p', { class: 'sub' }, W.demoSub), go, shop);
    const scr = el('div', { class: 'screen', id: 'demoWall' }); scr.style.zIndex = '60'; scr.append(card);
    document.body.append(scr);
  };
  const check = () => { const n = parseInt(cnt.textContent, 10); if (n >= DEMO_PIECES) setTimeout(wall, 1400); };
  new MutationObserver(check).observe(cnt, { childList: true, characterData: true, subtree: true });
  check();
}

function qaAutostart() {
  if (!params.has('qa')) return;
  setTimeout(() => {
    document.querySelector('#introGo, #intro .btn')?.click();
    setTimeout(() => { if (window.__lt) { window.__lt.placeAll(); window.__lt.finale(); } }, 1200);
  }, 2500);
}

if (isCity) {
  const ready = () => { personaliseFinale(); simplifyFinale(); foldToggle(); countdown(); snow(); qaAutostart(); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
}
