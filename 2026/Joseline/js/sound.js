// Tiny synthesized sounds: wooden knocks, chimes and a music-box birthday tune. No audio files.
const KEY = 'lt.muted';

export class Sound {
  constructor() {
    const q = new URLSearchParams(location.search);
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    // the preview pane used for testing always starts muted
    this.muted = q.has('mute') || /Claude\//.test(navigator.userAgent) || saved === '1';
    this.ctx = null;
  }
  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* ignore */ }
    if (m && this.ctx) this.ctx.suspend();
    if (m && this.tag) this.tag.pause();
  }
  // iPhones mute Web Audio when the ring/silent switch is on. Ask for "playback" audio
  // (Safari 17+), and for older iOS keep a silent media <audio> playing, which does the same.
  unlockIOS() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* ignore */ }
    if (this.tag) { if (this.tag.paused) this.tag.play().catch(() => {}); return; }
    try {
      const rate = 8000, n = rate / 2, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
      const w = (o, str) => [...str].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
      w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true);
      v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate, true);
      v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
      for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
      const tag = document.createElement('audio');
      tag.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
      tag.loop = true; tag.setAttribute('playsinline', ''); tag.setAttribute('x-webkit-airplay', 'deny');
      tag.play().catch(() => {});
      this.tag = tag;
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) tag.pause(); else if (!this.muted) tag.play().catch(() => {});
      });
    } catch { /* ignore */ }
  }
  ensure() {
    if (this.muted) return null;
    this.unlockIOS();
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 0.2, buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = buf;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  env(g, t, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  knock(pitch = 1, vol = 1, delay = 0) {
    const c = this.ensure(); if (!c) return;
    const t = c.currentTime + delay;
    const src = c.createBufferSource(); src.buffer = this.noise;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1500 * pitch; bp.Q.value = 3.5;
    const g = c.createGain(); this.env(g, t, 0.8 * vol, 0.09);
    src.connect(bp).connect(g).connect(this.master); src.start(t); src.stop(t + 0.1);
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(720 * pitch, t); o.frequency.exponentialRampToValueAtTime(240 * pitch, t + 0.07);
    const g2 = c.createGain(); this.env(g2, t, 0.6 * vol, 0.16);
    o.connect(g2).connect(this.master); o.start(t); o.stop(t + 0.18);
  }
  bell(f, t, dur = 1.2, vol = 0.22) {
    const c = this.ctx; if (!c) return;
    [[1, 1], [2, 0.28], [3.01, 0.08]].forEach(([m, a]) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * m;
      const g = c.createGain(); this.env(g, t, vol * a, dur / m);
      o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  tap() { this.knock(1.7, 0.6); }
  place() {
    this.knock(1, 1); this.knock(1.3, 0.5, 0.07);
    const c = this.ctx; if (!c) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const f = scale[(this.step = ((this.step || 0) + 1) % scale.length)], t = c.currentTime + 0.05;
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
    const g = c.createGain(); this.env(g, t, 0.35, 0.45);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.5);
  }
  nope() {
    const c = this.ensure(); if (!c) return;
    const t = c.currentTime, o = c.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.16);
    const g = c.createGain(); this.env(g, t, 0.28, 0.2);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.22);
  }
  chime() {
    const c = this.ensure(); if (!c) return;
    const t = c.currentTime + 0.05;
    this.bell(1046.5, t, 1.0); this.bell(1318.5, t + 0.12, 1.0); this.bell(1568, t + 0.24, 1.3);
  }
  birthday() {
    const c = this.ensure(); if (!c) return;
    const n = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
    const song = [['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3]];
    let t = c.currentTime + 0.3; const beat = 0.36;
    for (const [k, d] of song) { this.bell(n[k] * 2, t, Math.min(1.6, d * beat * 3), 0.2); t += d * beat; }
  }
}
