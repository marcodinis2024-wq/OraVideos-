/* KOKARTE · anúncio "Mais do que uma loja" (30 s + corte 15 s) — música + SFX sintetizados (Web Audio), SEM voz.
 * Fonte de verdade: briefing/kokarte/03-anuncio-campanha.md §6 (grelha), §8 (guião 30 s), §9 (corte 15 s), §10 (música).
 *
 * Grelha: 125 BPM a 25 fps → 1 batida = 12 fotogramas = 0,48 s; 16.ª = 3 fotogramas = 0,12 s; compasso = 1,92 s.
 *   30 s: 64 batidas = 768 fotogramas = 30,72 s · 15 s: 32 batidas = 384 fotogramas = 15,36 s.
 * Afro-house luminoso em Lá maior: Amaj9 · F#m9 · Dmaj9 · E6/9. O "Toque do sol" (taça 220 Hz = Lá3) é a tónica.
 *
 * window.kokAdAudio(ctx, dest, { cut: 30 | 15, stem: 'mix' | 'music' | 'sfx' })
 *   Tudo determinístico (acaso = hash do tempo). Sem compressores Web Audio: normalização −14 LUFS e
 *   limitador ficam em kokarte-anuncio-audio.html. Cues documentados em cues.md.
 */
(function () {
  'use strict';
  const FPS = 25, BT = 0.48, S16 = BT / 4;
  const B = b => b * BT;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const db = x => Math.pow(10, x / 20);

  /* Acordes (MIDI): bass = raiz do sub · keys = voicing sem raiz (rhodes/stabs) · pad = 5 vozes · chop = notas dos vocal chops */
  const CH = {
    A:  { bass: 33, keys: [61, 64, 68, 71], pad: [45, 56, 59, 61, 64], chop: [69, 73, 76] }, // Amaj9  (A C# E G# B)
    Fm: { bass: 30, keys: [57, 61, 64, 68], pad: [42, 52, 56, 57, 61], chop: [69, 73, 76] }, // F#m9  (F# A C# E G#)
    D:  { bass: 38, keys: [54, 57, 61, 64], pad: [38, 54, 57, 61, 64], chop: [69, 73, 76] }, // Dmaj9  (D F# A C# E)
    E:  { bass: 28, keys: [56, 59, 61, 66], pad: [40, 56, 59, 61, 66], chop: [68, 71, 73] }, // E6/9   (E G# B C# F#)
  };
  // gancho de marimba/kalimba (8 notas por compasso): 6 fixas + 2 de cauda conforme o acorde
  const HOOK_S = [0, 3, 6, 8, 10, 11, 14, 15], HOOK_N = [76, 73, 76, 81, 78, 76];
  const HOOK_T = { A: [73, 71], Fm: [73, 69], D: [81, 78], E: [80, 78] };

  /* Arranjos. SEC: [batida inicial, secção]. SFX: [batida, tipo, opções]. */
  const CUTS = {
    30: {
      NB: 64, DUR: 30.72,
      TL: [[0, 'A'], [4, 'Fm'], [8, 'D'], [12, 'E'], [16, 'A'], [20, 'Fm'], [24, 'D'], [26, 'E'], [28, 'A'], [32, 'Fm'],
        [36, 'D'], [40, 'E'], [44, 'Fm'], [48, 'D'], [52, 'E'], [56, 'A'], [60, 'E'], [62, 'A']],
      SEC: [[0, 'hook'], [8, 'loja'], [28, 'ter'], [48, 'brk'], [56, 'fin'], [62, 'end']],
      FILL: [26, 28], RISE: [[26, 28, 0.8], [45, 48, 1], [52, 56, 1.25]], REV: [[46, 48, 0.8], [54.5, 56, 1]], ROLL: [54, 56],
      CRASH: [[0, 1], [8, 0.55], [28, 1], [48, 0.5], [56, 1], [62, 0.9]], STAB: [0, 1, 2],
      SFX: [
        [0, 'impacto', { heavy: 1 }], [2, 'brilho'], [3, 'sunburst'], [4, 'toqueDoSol'],
        [6, 'pilula', { m: 85 }], [6.5, 'pilula', { m: 88 }], [7, 'pilula', { m: 93 }],
        [8, 'impacto', { heavy: 0 }],
        ...[10, 12, 14, 16, 18, 20, 22, 24].map((b, i) => [b, 'cartao', { i, len: 0.34 }]),
        [28, 'impacto', { heavy: 1 }],
        ...[30, 33, 36, 39, 42].map((b, i) => [b, 'preco', { i }]),
        [45, 'leque'],
        [48, 'impacto', { heavy: 0 }], [48, 'toqueDoSol', { g: 0.8 }], [49, 'brilhos'],
        [56, 'impacto', { heavy: 1 }],
        ...[[57, 76], [58, 81], [59, 85], [60, 83], [61, 80], [62, 81], [63, 88]].map(([b, m]) => [b, 'pluck', { m }]),
        [62, 'toqueDoSol'],
      ],
    },
    15: {
      NB: 32, DUR: 15.36,
      TL: [[0, 'A'], [4, 'Fm'], [8, 'D'], [12, 'E'], [16, 'A'], [20, 'D'], [22, 'E'], [24, 'A'], [28, 'E'], [30, 'A']],
      SEC: [[0, 'hook'], [8, 'loja'], [16, 'ter'], [24, 'fin'], [30, 'end']],
      FILL: [15, 16], RISE: [[14, 16, 0.7], [22, 24, 1]], REV: [[14.5, 16, 0.8], [22.5, 24, 1]], ROLL: [23, 24],
      CRASH: [[0, 1], [8, 0.55], [16, 1], [24, 1], [30, 0.9]], STAB: [0, 1, 2],
      SFX: [
        [0, 'impacto', { heavy: 1 }], [2, 'brilho'], [3, 'sunburst'], [4, 'toqueDoSol'],
        [6, 'pilula', { m: 85 }], [6.5, 'pilula', { m: 88 }], [7, 'pilula', { m: 93 }],
        [8, 'impacto', { heavy: 0 }],
        ...[8, 9, 10, 11, 12, 13, 14, 15].map((b, i) => [b, 'cartao', { i, len: 0.22, dry: 1 }]),
        [16, 'impacto', { heavy: 1 }],
        ...[16, 18, 20].map((b, i) => [b, 'preco', { i }]),
        [22, 'pilula', { m: 88 }], [23, 'pilula', { m: 93 }],
        [24, 'impacto', { heavy: 1 }],
        ...[[25, 76], [26, 81], [27, 85], [28, 83], [29, 80], [30, 81], [31, 88]].map(([b, m]) => [b, 'pluck', { m }]),
        [30, 'toqueDoSol'],
      ],
    },
  };
  window.KOKAD = { FPS, BT, S16, CUTS };

  window.kokAdAudio = function (ctx, dest, opt) {
    opt = opt || {};
    const cut = CUTS[opt.cut || 30], stem = opt.stem || 'mix', sr = ctx.sampleRate;
    const { NB, DUR, TL, SEC } = cut;
    const chordAt = b => { let c = TL[0][1]; for (const [s, k] of TL) if (b >= s - 1e-9) c = k; return c; };
    const secAt = b => { let c = SEC[0][1]; for (const [s, k] of SEC) if (b >= s - 1e-9) c = k; return c; };
    const rnd = (t, k = 0) => { const x = Math.sin(t * 127.1 + k * 311.7 + 17.13) * 43758.5453; return x - Math.floor(x); };
    const vary = (t, k = 0, a = 0.03) => 1 + (rnd(t, k) * 2 - 1) * a;
    let seed = 0x4B0CAD; const prng = () => { seed = (seed + 0x6D2B79F5) | 0; let z = Math.imul(seed ^ (seed >>> 15), 1 | seed); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };

    const mkNoise = (ch, secs, pink) => {
      const b = ctx.createBuffer(ch, sr * secs, sr);
      for (let c = 0; c < ch; c++) {
        const d = b.getChannelData(c);
        if (!pink) { for (let i = 0; i < d.length; i++) d[i] = prng() * 2 - 1; continue; }
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < d.length; i++) { const w = prng() * 2 - 1; b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926; }
      }
      return b;
    };
    const WN = mkNoise(1, 4, false), PN = mkNoise(1, 4, true), WN2 = mkNoise(2, 4, false), PN2 = mkNoise(2, 4, true);
    const mkRev = (secs, decay, pre) => {
      const r = ctx.createConvolver(); r.normalize = true; const ir = ctx.createBuffer(2, Math.ceil(sr * secs), sr);
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); const p = Math.floor(pre * sr); for (let i = p; i < d.length; i++) d[i] = (prng() * 2 - 1) * Math.pow(1 - i / d.length, decay); }
      r.buffer = ir; return r;
    };
    const G = (v, to) => { const g = ctx.createGain(); g.gain.value = v; if (to) g.connect(to); return g; };
    const BQ = (type, f, q, to) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (to) b.connect(to); return b; };
    const PAN = (p, to) => { const s = ctx.createStereoPanner(); s.pan.value = Math.max(-1, Math.min(1, p)); if (to) s.connect(to); return s; };
    const OSC = (type, f, t0, t1) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(t0); o.stop(t1); return o; };
    const noise = (lt, dur, buf) => { const s = ctx.createBufferSource(); s.buffer = buf; const off = rnd(lt, 7.7) * (buf.duration - dur - 0.2); s.start(Math.max(0, lt), Math.max(0, off), dur + 0.05); return s; };
    const send = (node, amt, to) => { const g = G(amt, to); node.connect(g); return g; };
    const shaper = k => { const w = ctx.createWaveShaper(); const cv = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = i / 1024 - 1; cv[i] = Math.tanh(k * x) / Math.tanh(k); } w.curve = cv; return w; };
    const perc = (g, t, pk, tau, a = 0.002) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk, t + a); g.gain.setTargetAtTime(0, t + a, tau); };

    /* ---------- barramentos ---------- */
    const master = G(1); const hp = BQ('highpass', 26, 0.7, dest); master.connect(hp);
    { const g = master.gain; g.setValueAtTime(1, DUR - 0.34); g.linearRampToValueAtTime(0, DUR - 0.004); } // cauda final: desvanece nos últimos 0,34 s
    const musicOut = G(stem === 'sfx' ? 0 : 1); // EQ de mastering da música: menos sub-lama, mais presença
    { const ls = BQ('lowshelf', 110, 0.7), hs = BQ('highshelf', 2400, 0.7); ls.gain.value = -3; hs.gain.value = 5; musicOut.connect(ls); ls.connect(hs); hs.connect(master); }
    const glue = shaper(1.1), glueIn = G(0.8); glueIn.connect(glue); glue.connect(G(1 / 0.8 * 0.95, musicOut));
    const drums = G(1, glueIn);                         // bombo, baixo, percussão (não bombeados)
    const pump = G(1, glueIn);                          // pads, keys, chops, gancho: sidechain do bombo
    const mRev = mkRev(2.2, 3.4, 0.015), mRevIn = G(1); mRevIn.connect(mRev); const mRevLP = BQ('lowpass', 6000, 0.6); mRev.connect(mRevLP); mRevLP.connect(G(0.5, pump));
    // delay ping-pong (colcheia pontuada / colcheia) para chops, gancho e plucks
    const dlyIn = G(1); { const dL = ctx.createDelay(1), dR = ctx.createDelay(1); dL.delayTime.value = 3 * S16; dR.delayTime.value = 2 * S16; const fb = G(0.32), lp = BQ('lowpass', 3800, 0.6), hpd = BQ('highpass', 400, 0.6);
      dlyIn.connect(hpd); hpd.connect(dL); dL.connect(PAN(-0.7, pump)); dL.connect(dR); dR.connect(PAN(0.7, pump)); dR.connect(lp); lp.connect(fb); fb.connect(dL); }
    const sfxOut = G(stem === 'music' ? 0 : 1, master);
    const sfxRoot = G(1, sfxOut); let sfx = sfxRoot;
    const sRev = mkRev(2.0, 3.0, 0.01), sRevRoot = G(1); sRevRoot.connect(sRev); let sRevIn = sRevRoot;
    const sRevHP = BQ('highpass', 260, 0.7); sRev.connect(sRevHP); sRevHP.connect(G(0.6, sfxOut));

    /* ================= INSTRUMENTOS ================= */
    const padBus = G(1.25); const padHP = BQ('highpass', 170, 0.7); const padLP = BQ('lowpass', 1600, 0.7); padBus.connect(padHP); padHP.connect(padLP); padLP.connect(pump); send(padLP, 0.45, mRevIn);
    function padChord(b0, b1, ch) {
      const t0 = Math.max(0, B(b0) - 0.01), t1 = B(b1);
      CH[ch].pad.forEach((m, i) => {
        const f = mtof(m), e = G(0), p = PAN((i / 4 * 2 - 1) * 0.6, padBus); e.connect(p);
        const g = i === 0 ? 0.022 : 0.026;
        e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(g, t0 + 0.06); e.gain.setValueAtTime(g, t1 - 0.03); e.gain.setTargetAtTime(0, t1 - 0.03, 0.12);
        [['sawtooth', -8, 0.5], ['sawtooth', 8, 0.5], ['triangle', 0, 1]].forEach(([ty, dt, a]) => { const o = OSC(ty, f, t0, t1 + 1.2); o.detune.value = dt; o.connect(G(a, e)); });
      });
    }
    const keysBus = G(1); { const kp = PAN(0, pump); keysBus.connect(kp); send(kp, 0.25, mRevIn); }
    function rhodes(t, m, dur, vel, pan) {
      const f = mtof(m), end = t + dur + 0.6, e = G(0), p = PAN(pan, keysBus); e.connect(p);
      const pk = 0.075 * vel; e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(pk, t + 0.003); e.gain.setTargetAtTime(pk * 0.35, t + 0.003, 0.18); e.gain.setTargetAtTime(0, t + dur, 0.06);
      const car = OSC('sine', f, t, end), mod = OSC('sine', f, t, end), mg = G(0); mod.connect(mg); mg.connect(car.frequency);
      mg.gain.setValueAtTime(f * 1.4 * vel, t); mg.gain.setTargetAtTime(f * 0.12, t, 0.1); car.connect(e);
      const tn = OSC('sine', f * 7.02, t, t + 0.2), tg = G(0, e); tn.connect(tg); perc(tg, t, 0.12 * vel, 0.015);
    }
    const keysChord = (t, ch, dur, vel) => CH[ch].keys.forEach((m, i) => rhodes(t + i * 0.003, m, dur, vel * vary(t, i, 0.06), (i - 1.5) * 0.22));
    // stab de acorde (serras desafinadas + filtro com envelope) — as 3 palavras do gancho e o acorde final
    const stabBus = G(1, pump); send(stabBus, 0.4, mRevIn); send(stabBus, 0.25, dlyIn);
    function stab(t, notes, vel, len = 0.34) {
      const lp = BQ('lowpass', 800, 1.6), e = G(0); lp.connect(e); e.connect(stabBus);
      lp.frequency.setValueAtTime(7500, t); lp.frequency.setTargetAtTime(900, t + 0.01, len / 3);
      perc(e, t, 0.075 * vel, len / 2.2, 0.003);
      notes.forEach((m, i) => [-11, 0, 11].forEach(dt => { const o = OSC('sawtooth', mtof(m), t, t + len * 3); o.detune.value = dt; o.connect(PAN((i / (notes.length - 1) - 0.5) * 0.8 + dt / 30, lp)); }));
    }
    function kick(t, vel, dec = 0.3) {
      const o = OSC('sine', 170, t, t + dec + 0.3), e = G(0, drums);
      o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.055); o.frequency.exponentialRampToValueAtTime(44, t + dec); o.connect(e);
      perc(e, t, 0.34 * vel, dec / 4.2, 0.0015);
      const n = noise(t, 0.01, WN), h = BQ('highpass', 2500, 0.7), ne = G(0, drums); n.connect(h); h.connect(ne); perc(ne, t, 0.1 * vel, 0.003, 0.0005);
    }
    // sub baixo sincopado: seno + 2.º harmónico (ouvir em telemóvel), LP e tanh
    const bassBus = G(1); { const s = shaper(1.8), pre = G(0.7), lp = BQ('lowpass', 420, 0.7); bassBus.connect(pre); pre.connect(s); s.connect(lp); lp.connect(G(0.5, drums)); }
    function bass(t, m, len, vel) {
      const f = mtof(m), e = G(0, bassBus), end = t + len + 0.2;
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.42 * vel, t + 0.006); e.gain.setTargetAtTime(0.3 * vel, t + 0.006, 0.08); e.gain.setValueAtTime(0.3 * vel, t + len); e.gain.linearRampToValueAtTime(0, t + len + 0.03);
      const o = OSC('sine', f * 1.06, t, end); o.frequency.setValueAtTime(f * 1.06, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.03); o.connect(e);
      const o2 = OSC('triangle', f * 2, t, end); o2.connect(G(0.22, e));
    }
    function hat(t, vel, open, pan = 0.25) {
      const n = noise(t, open ? 0.3 : 0.06, WN), h = BQ('highpass', open ? 7200 : 9000, 0.7), e = G(0), p = PAN(pan, drums); n.connect(h); h.connect(e); e.connect(p);
      perc(e, t, (open ? 0.1 : 0.055) * vel, open ? 0.05 : 0.012, 0.001);
    }
    function shaker(t, vel, pan) {
      const n = noise(t, 0.09, WN), bp = BQ('bandpass', 7800, 0.9), h = BQ('highpass', 4200, 0.7), e = G(0), p = PAN(pan, drums); n.connect(bp); bp.connect(h); h.connect(e); e.connect(p);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.15 * vel, t + 0.008); e.gain.setTargetAtTime(0, t + 0.008, 0.016);
    }
    // congas / bongós: membrana com queda de afinação + estalo
    const percBus = G(1, drums); send(percBus, 0.12, mRevIn);
    function drum(t, f, vel, pan, slap = 0, dec = 0.07) {
      const e = G(0), p = PAN(pan, percBus); e.connect(p);
      const o = OSC('sine', f * 1.45, t, t + dec * 6); o.frequency.setValueAtTime(f * 1.45, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.018); o.connect(e);
      const o2 = OSC('triangle', f * 1.52, t, t + dec * 3); o2.connect(G(0.25, e));
      perc(e, t, 0.26 * vel, dec, 0.0015);
      const n = noise(t, 0.03, WN), b = BQ('bandpass', slap ? 2600 : 1400, slap ? 0.9 : 1.6), ne = G(0, p); n.connect(b); b.connect(ne); perc(ne, t, (slap ? 0.3 : 0.08) * vel, slap ? 0.012 : 0.005, 0.0008);
    }
    function rim(t, vel) {
      const e = G(0), p = PAN(-0.3, drums); e.connect(p); send(p, 0.25, mRevIn);
      [[1650, 1], [2400, 0.5], [520, 0.6]].forEach(([f, a]) => { const o = OSC(f < 1000 ? 'triangle' : 'sine', f * vary(t, 3, 0.008), t, t + 0.1); o.connect(G(a, e)); });
      perc(e, t, 0.09 * vel, 0.011, 0.001);
    }
    function clap(t, vel, pan = 0) {
      const p = PAN(pan, drums); send(p, 0.35, mRevIn);
      [0, 0.011, 0.022].forEach((dt, i) => { const n = noise(t + dt + i * 0.37, 0.05, WN), b = BQ('bandpass', 1350, 1.1), e = G(0, p); n.connect(b); b.connect(e); perc(e, t + dt, (i === 2 ? 0.44 : 0.32) * vel, i === 2 ? 0.045 : 0.006, 0.001); });
    }
    function tom(t, f, vel, pan) {
      const e = G(0), p = PAN(pan, drums); e.connect(p); send(p, 0.2, mRevIn);
      const o = OSC('sine', f * 1.6, t, t + 0.5); o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05); o.connect(e);
      perc(e, t, 0.32 * vel, 0.09, 0.002);
      const n = noise(t, 0.04, PN), l = BQ('lowpass', 3000, 0.7), ne = G(0, p); n.connect(l); l.connect(ne); perc(ne, t, 0.12 * vel, 0.01, 0.001);
    }
    // gancho: marimba (groove) / kalimba (breakdown)
    const hookBus = G(1, pump); send(hookBus, 0.3, mRevIn); send(hookBus, 0.22, dlyIn);
    function marimba(t, m, vel, pan) {
      const f = mtof(m), p = PAN(pan, hookBus);
      [[1, 1, 0.16], [3.93, 0.28, 0.04], [9.8, 0.06, 0.012]].forEach(([r, a, tau]) => { const o = OSC('sine', f * r, t, t + tau * 7), e = G(0, p); o.connect(e); perc(e, t, 0.15 * vel * a, tau, 0.0015); });
      const n = noise(t, 0.01, PN), l = BQ('bandpass', f * 2.2, 1), ne = G(0, p); n.connect(l); l.connect(ne); perc(ne, t, 0.05 * vel, 0.004, 0.0005);
    }
    function kalimba(t, m, vel, pan) {
      const f = mtof(m), p = PAN(pan, hookBus);
      [[1, 1, 0.42], [5.93, 0.12, 0.05], [2.0, 0.06, 0.2]].forEach(([r, a, tau]) => { const o = OSC('sine', f * r * (r === 1 ? 1 : vary(t, 9, 0.004)), t, t + tau * 7), e = G(0, p); o.connect(e); perc(e, t, 0.14 * vel * a, tau, 0.002); });
      const n = noise(t, 0.012, WN), b = BQ('bandpass', 3000, 2), ne = G(0, p); n.connect(b); b.connect(ne); perc(ne, t, 0.03 * vel, 0.003, 0.0005);
    }
    // vocal chops sintetizados: serra + vibrato → 3 formantes em paralelo
    const FORM = { ah: [[800, 1], [1150, 0.5], [2900, 0.18]], eh: [[530, 1], [1840, 0.45], [2480, 0.2]], oh: [[500, 1], [820, 0.55], [2830, 0.1]] };
    const chopBus = G(1); const chopLP = BQ('lowpass', 12000, 0.7); chopBus.connect(chopLP); chopLP.connect(pump); send(chopLP, 0.35, mRevIn); send(chopLP, 0.4, dlyIn);
    function chop(t, m, vow, len, vel, pan) {
      const f = mtof(m), end = t + len + 0.1, src = OSC('sawtooth', f, t, end), e = G(0), p = PAN(pan, chopBus);
      src.frequency.setValueAtTime(f * 0.94, t); src.frequency.exponentialRampToValueAtTime(f, t + 0.035);
      const lfo = OSC('sine', 5.5, t, end), lg = G(f * 0.008); lfo.connect(lg); lg.connect(src.frequency);
      FORM[vow].forEach(([ff, a]) => { const b = BQ('bandpass', ff, 7); src.connect(b); b.connect(G(a, e)); });
      e.connect(p); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.24 * vel, t + 0.012); e.gain.setValueAtTime(0.24 * vel, t + len); e.gain.linearRampToValueAtTime(0, t + len + 0.05);
    }
    function crash(t, vel) {
      const n = noise(t, 2.2, PN2), h = BQ('highpass', 4500, 0.6), e = G(0, drums); n.connect(h); h.connect(e); send(e, 0.3, mRevIn);
      perc(e, t, 0.085 * vel, 0.45, 0.004);
    }
    function reverseCym(b0, b1, g) {
      const t0 = B(b0), t1 = B(b1), d = t1 - t0, n = noise(t0, d + 0.02, PN2), h = BQ('highpass', 6500, 0.6), e = G(0, drums);
      n.connect(h); h.connect(e); h.frequency.setValueAtTime(6500, t0); h.frequency.exponentialRampToValueAtTime(1500, t1);
      const N = 64, cv = new Float32Array(N); for (let i = 0; i < N; i++) cv[i] = 0.14 * g * Math.pow(i / (N - 1), 2.6);
      e.gain.setValueCurveAtTime(cv, t0, d - 0.006); e.gain.linearRampToValueAtTime(0, t1);
    }
    function riser(b0, b1, g) { // ruído com banda a subir + serra a subir uma oitava e meia
      const t0 = B(b0), t1 = B(b1), n = noise(t0, t1 - t0 + 0.1, PN2), bp = BQ('bandpass', 450, 2.4), e = G(0, pump);
      n.connect(bp); bp.connect(e); bp.frequency.setValueAtTime(450, t0); bp.frequency.exponentialRampToValueAtTime(5200, t1);
      e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(0.12 * g, t0 + (t1 - t0) * 0.6); e.gain.linearRampToValueAtTime(0.3 * g, t1 - 0.02); e.gain.linearRampToValueAtTime(0, t1 + 0.02);
      const o = OSC('sawtooth', mtof(57), t0, t1 + 0.05), l = BQ('lowpass', 2500, 0.8), oe = G(0, pump); o.frequency.setValueAtTime(mtof(57), t0); o.frequency.exponentialRampToValueAtTime(mtof(76), t1); o.connect(l); l.connect(oe); send(oe, 0.4, mRevIn);
      oe.gain.setValueAtTime(0, t0); oe.gain.linearRampToValueAtTime(0.018 * g, t1 - 0.02); oe.gain.linearRampToValueAtTime(0, t1 + 0.01);
    }

    /* ================= MÚSICA ================= */
    function scheduleMusic() {
      const kicks = [];
      // pads (legato por acorde) + automação do filtro (breakdown abre devagar)
      TL.forEach(([b, c], i) => padChord(b, i + 1 < TL.length ? TL[i + 1][0] : NB + 2.5, c));
      const pF = padLP.frequency; pF.setValueAtTime(2200, 0);
      const secStart = s => (SEC.find(x => x[1] === s) || [null])[0];
      const bT = secStart('ter'), bB = secStart('brk'), bF = secStart('fin');
      if (bT != null) { pF.setValueAtTime(2200, B(bT) - 0.01); pF.linearRampToValueAtTime(3200, B(bT) + 0.05); }
      if (bB != null) { pF.setValueAtTime(3200, B(bB)); pF.linearRampToValueAtTime(1400, B(bB) + 0.1); pF.exponentialRampToValueAtTime(6000, B(bF) - 0.02); pF.linearRampToValueAtTime(3200, B(bF) + 0.1); }
      // chops: LP fechado no breakdown, abre com o riser
      if (bB != null) { const cF = chopLP.frequency; cF.setValueAtTime(12000, B(bB) - 0.01); cF.linearRampToValueAtTime(1400, B(bB) + 0.02); cF.setValueAtTime(1400, B(bB + 4)); cF.exponentialRampToValueAtTime(12000, B(bF)); }

      const BASS1 = { 3: [0, 2, 0.9], 6: [0, 1, 0.7], 7: [12, 1, 0.55], 10: [0, 2, 0.85], 14: [7, 1, 0.6] };
      const BASS2 = { 3: [0, 1, 0.9], 5: [0, 1, 0.65], 6: [12, 1, 0.6], 10: [0, 2, 0.85], 13: [7, 1, 0.65], 15: [12, 1, 0.55] };
      const CONGA = { 2: ['h', 0.45], 3: ['h', 0.7], 6: ['l', 0.8], 7: ['h', 0.45], 10: ['s', 0.75], 11: ['h', 0.55], 14: ['l', 0.85], 15: ['l', 0.5] };
      const CHOP = { 2: [0, 'ah', 1], 5: [1, 'eh', 1], 7: [2, 'ah', 1], 10: [1, 'oh', 2], 14: [0, 'eh', 1] };
      for (let s = 0; s < NB * 4; s++) {
        const beat = s / 4, sb = s % 4, s16 = s % 16, bar = Math.floor(s / 16), sec = secAt(beat), ch = chordAt(beat);
        const t = s * S16 + (s % 2 ? 0.009 : 0); // swing leve nas 16.as ímpares
        const groove = sec === 'hook' || sec === 'loja' || sec === 'ter' || sec === 'fin';
        const inFill = beat >= cut.FILL[0] && beat < cut.FILL[1];
        const bright = sec === 'ter' || sec === 'fin';
        if (groove) {
          // BOMBO 4/4 (sai no último tempo do fill)
          if (sb === 0 && !(inFill && beat >= cut.FILL[1] - 1)) { kick(t, beat === 0 ? 1 : 0.92); kicks.push(t); }
          // HATS: aberto no contratempo, fechado nas 16.as pares
          if (sb === 2) hat(t, (bright ? 1 : 0.85) * vary(t, 2, 0.08), true);
          if (sb === 1 || sb === 3) hat(t, 0.5 * vary(t, 21, 0.2), false, -0.15);
          // SHAKER 16.as
          shaker(t, [0.35, 0.5, 0.75, 0.5][sb] * vary(t, 1, 0.15) * (bright ? 1 : 0.85), 0.35);
          // BAIXO
          if (!inFill) { const P = (bright ? BASS2 : BASS1)[s16]; if (P) bass(t, CH[ch].bass + P[0], P[1] * S16 - 0.02, P[2] * vary(t, 4, 0.05)); }
          // CONGAS (+ bongós no brilhante)
          if (!inFill) { const c = CONGA[s16]; if (c && (sec !== 'hook' || s16 >= 6)) drum(t, c[0] === 'l' ? 196 : 262, c[1] * vary(t, 5, 0.1), c[0] === 'l' ? -0.35 : 0.4, c[0] === 's', c[0] === 'l' ? 0.09 : 0.06); }
          if (bright && (s16 === 1 || s16 === 9 || (s16 === 13 && bar % 2))) drum(t, 440, 0.4 * vary(t, 6, 0.1), 0.6, 0, 0.04);
          // RIM sincopado
          if ((s16 === 10 && sec !== 'hook') || (s16 === 3 && bar % 2 === 1)) rim(t, 0.8 * vary(t, 7, 0.1));
          // PALMAS a 2 e 4 (Terapias em diante)
          if (bright && (s16 === 4 || s16 === 12)) clap(t, 0.9 * vary(t, 8, 0.06), (s16 === 4 ? -0.08 : 0.08));
          // RHODES em contratempo (afro-house)
          if ((s16 === 2 || s16 === 10) || (bright && (s16 === 7 || s16 === 13))) keysChord(t, ch, S16 * 1.6, (s16 === 2 || s16 === 10 ? 0.75 : 0.5));
          // GANCHO de marimba (a partir da Loja)
          if (sec !== 'hook') { const hi = HOOK_S.indexOf(s16); if (hi >= 0) { const m = hi < 6 ? HOOK_N[hi] : HOOK_T[ch][hi - 6]; marimba(t, m, (hi === 0 || hi === 3 ? 1 : 0.75) * vary(t, 10, 0.08), (hi % 2 ? 0.3 : -0.2)); } }
          // VOCAL CHOPS (Terapias em diante): compasso completo nos pares, só 2 notas nos ímpares
          if (bright) { const c = CHOP[s16]; if (c && (bar % 2 === 0 || s16 === 2 || s16 === 10)) chop(t, CH[ch].chop[c[0]], c[1], c[2] * S16 - 0.03, 0.9 * vary(t, 11, 0.1), (c[0] - 1) * 0.45); }
        } else if (sec === 'brk') {
          // breakdown: sem bombo nem baixo; kalimba com o gancho, chops filtrados, shaker na 2.ª metade
          const hi = HOOK_S.indexOf(s16); if (hi >= 0) { const m = hi < 6 ? HOOK_N[hi] : HOOK_T[ch][hi - 6]; kalimba(t, m, (hi === 0 || hi === 3 ? 1 : 0.75) * vary(t, 10, 0.08), (hi % 2 ? 0.35 : -0.35)); }
          const c = CHOP[s16]; if (c && (s16 === 2 || s16 === 10)) chop(t, CH[ch].chop[c[0]], c[1], c[2] * S16 - 0.03, 0.8, (c[0] - 1) * 0.45);
          if (beat >= cut.ROLL[0] - 2) shaker(t, [0.3, 0.4, 0.6, 0.4][sb] * (0.4 + 0.6 * (beat - (cut.ROLL[0] - 2)) / 4), 0.35);
          if (s16 === 0 && bar % 1 === 0) keysChord(t, ch, BT * 3.8, 0.45);
          if (sb === 0 && beat === bB) { bass(t, CH[ch].bass + 12, BT * 3.5, 0.6); }
        }
        // ROLO de palmas/rim antes dos drops (16.as → 32.as a crescer)
        if (beat >= cut.ROLL[0] && beat < cut.ROLL[1]) { const x = (beat - cut.ROLL[0]) / (cut.ROLL[1] - cut.ROLL[0]); clap(t, 0.35 + 0.55 * x, (sb % 2 ? 0.2 : -0.2)); if (x >= 0.5) clap(t + S16 / 2, 0.4 + 0.5 * x, 0); }
      }
      // FILL de toms antes do capítulo seguinte
      { const f0 = cut.FILL[0], L = cut.FILL[1] - f0; const TOM = L >= 2 ? [[0, 262, 0.6], [2, 262, 0.7], [3, 220, 0.75], [4, 220, 0.8], [5, 196, 0.8], [6, 165, 0.85], [7, 147, 0.9]] : [[0, 262, 0.7], [1, 220, 0.75], [2, 196, 0.85], [3, 147, 0.9]];
        TOM.forEach(([k, f, v]) => tom(B(f0) + k * S16, f, v, 0.5 - k / 10)); }
      cut.RISE.forEach(([a, b, g]) => riser(a, b, g));
      cut.REV.forEach(([a, b, g]) => reverseCym(a, b, g));
      cut.CRASH.forEach(([b, v]) => crash(B(b), v));
      // stabs nas palavras do gancho (RESPIRA. RECARREGA. BRILHA.)
      const ST = [[57, 61, 64, 68, 76], [57, 61, 66, 69, 78], [61, 64, 68, 71, 81]];
      cut.STAB.forEach((b, i) => stab(B(b), ST[i], i === 2 ? 1.1 : 1, 0.36));
      // acorde final: bombo longo, stab aberto, baixo em Lá, rhodes
      const bE = secStart('end'), tE = B(bE);
      kick(tE, 1, 0.5); kicks.push(tE); stab(tE, [57, 61, 64, 68, 71, 76], 1.1, 0.9); bass(tE, 33, 1.1, 0.9); keysChord(tE, 'A', 1.4, 0.8);
      marimba(tE, 81, 0.9, 0); marimba(tE + BT, 76, 0.55, 0.3);
      // SIDECHAIN (bombeio de pads/keys/chops/gancho a cada bombo)
      const pg = pump.gain; pg.setValueAtTime(1, 0); kicks.sort((a, b) => a - b).forEach(t => { pg.setValueAtTime(1, Math.max(0, t - 0.002)); pg.linearRampToValueAtTime(0.5, t + 0.004); pg.setTargetAtTime(1, t + 0.02, 0.075); });
    }

    /* ================= SFX ================= */
    function bell(t, f, g, dec, pan, rs = 0.35, parts = [[1, 1, 1], [2.76, 0.32, 0.42], [5.4, 0.1, 0.2]]) {
      const p = PAN(pan, sfx); send(p, rs, sRevIn);
      parts.forEach(([r, a, dm]) => { const o = OSC('sine', f * r, t, t + dec * dm * 1.4 + 0.1), e = G(0, p); o.connect(e); perc(e, t, g * a, dec * dm / 5); });
    }
    function woosh(t, d, f0, f1, f2, g, pan0, pan1, peak = 0.6, q = 0.9, buf = PN2) {
      const n = noise(t, d, buf), b = BQ('bandpass', f0, q), e = G(0), p = PAN(pan0, sfx); n.connect(b); b.connect(e); e.connect(p); send(p, 0.18, sRevIn);
      b.frequency.setValueAtTime(f0, t); b.frequency.exponentialRampToValueAtTime(f1, t + d * peak); b.frequency.exponentialRampToValueAtTime(f2, t + d);
      p.pan.setValueAtTime(pan0, t); p.pan.linearRampToValueAtTime(pan1, t + d * peak); p.pan.setValueAtTime(pan1, t + d);
      const N = 48, cv = new Float32Array(N); for (let i = 0; i < N; i++) { const x = i / (N - 1); cv[i] = g * (x < peak ? Math.pow(x / peak, 2) : Math.pow(Math.max(0, 1 - (x - peak) / (1 - peak)), 1.6)); }
      e.gain.setValueCurveAtTime(cv, t, d);
    }
    function impacto(t, o) {
      const H = o.heavy, p = PAN(0, sfx); send(p, H ? 0.3 : 0.2, sRevIn);
      // sub: 62→30 Hz (pesado) · 110→62 Hz com tom em Lá2 (leve, "impacto + tom")
      const f0 = H ? 62 : 110, f1 = H ? 30 : 62, d = H ? 1.1 : 0.5, so = OSC('sine', f0, t, t + d + 0.2), se = G(0, p);
      so.frequency.setValueAtTime(f0, t); so.frequency.exponentialRampToValueAtTime(f1, t + d * 0.8); so.connect(se); perc(se, t, H ? 0.6 : 0.34, d / 3.5, 0.003);
      const sat = shaper(2.5), sg = G(H ? 0.12 : 0.06, p); so.connect(sat); sat.connect(sg);
      const n = noise(t, 0.5, PN), l = BQ('lowpass', H ? 900 : 1800, 0.7), ne = G(0, p); n.connect(l); l.connect(ne); perc(ne, t, H ? 0.5 : 0.35, H ? 0.06 : 0.035, 0.001);
      if (!H) { const to = OSC('triangle', 110, t, t + 0.9), te = G(0, p); to.connect(te); perc(te, t, 0.1, 0.18, 0.003); send(te, 0.5, sRevIn); }
    }
    function brilho(t) { // palavra em ouro: glissando pentatónico L→R + ar
      const PENT = [1760, 1975.53, 2217.46, 2637.02, 2959.96, 3520];
      PENT.forEach((f, i) => bell(t + i * 0.028, f * vary(t, 60, 0.01), 0.045 * Math.pow(0.85, i), 0.5, -0.6 + i * 0.24, 0.5, [[1, 1, 1], [2.76, 0.18, 0.3]]));
      const d = 0.4, n = noise(t, d, WN2), h = BQ('highpass', 6500, 0.7), e = G(0), p = PAN(0, sfx); n.connect(h); h.connect(e); e.connect(p);
      p.pan.setValueAtTime(-0.6, t); p.pan.linearRampToValueAtTime(0.6, t + d); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.035, t + 0.1); e.gain.linearRampToValueAtTime(0, t + d);
    }
    function sunburst(t) { // whoosh ascendente do centro para fora (estéreo a abrir) até ao logótipo em b4
      const d = BT + 0.02;
      [-1, 1].forEach(sd => woosh(t, d, 300, 4200, 3000, 0.34, 0, sd * 0.75, 0.88, 1.0));
      const o = OSC('sine', 330, t, t + d), l = BQ('lowpass', 2500, 0.7), og = G(0), p = PAN(0, sfx); o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(1320, t + d); o.connect(l); l.connect(og); og.connect(p);
      og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.02, t + d * 0.85); og.gain.linearRampToValueAtTime(0, t + d);
    }
    function toqueDoSol(t, o) { // taça tibetana ≈ 220 Hz (Lá3): parciais inarmónicos em pares a batimento + batente de feltro
      const k = (o && o.g) || 1, bus = G(k, sfx); send(bus, 0.5 * k, sRevIn);
      [[1, 0.27, 2.4, 0.9], [2.71, 0.12, 1.5, 1.7], [5.03, 0.07, 0.8, 2.6], [8.12, 0.03, 0.45, 3.3]].forEach(([r, a, t60, beat], i) => {
        [-1, 1].forEach(sd => { const os = OSC('sine', 220 * r + sd * beat / 2, t, t + t60 + 0.2), e = G(0), p = PAN(sd * (0.25 + i * 0.1), bus); os.connect(e); e.connect(p); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(a / 2, t + 0.005); e.gain.setTargetAtTime(0, t + 0.005, t60 / 6.9); });
      });
      const n = noise(t, 0.05, PN), l = BQ('lowpass', 1300, 0.7), e = G(0, bus); n.connect(l); l.connect(e); perc(e, t, 0.14, 0.01, 0.003);
    }
    function pop(t, m, g = 0.13, pan = 0) {
      const f = mtof(m) * vary(t, 50, 0.01), p = PAN(pan, sfx); send(p, 0.25, sRevIn);
      const os = OSC('sine', f * 1.5, t, t + 0.25), e = G(0, p); os.frequency.setValueAtTime(f * 1.5, t); os.frequency.exponentialRampToValueAtTime(f, t + 0.02); os.connect(e); perc(e, t, g * vary(t, 52, 0.08), 0.03);
      const n = noise(t, 0.006, WN), b = BQ('bandpass', 4200, 1.5), ne = G(0, p); n.connect(b); b.connect(ne); perc(ne, t, 0.05, 0.0015, 0.0005);
    }
    const pilula = (t, o) => pop(t, o.m, 0.12, (rnd(t, 51) - 0.5) * 0.5);
    function tique(t, f, g, pan) { // tique de percussão (bloco de madeira)
      const p = PAN(pan, sfx); const o = OSC('sine', f, t, t + 0.06), e = G(0, p); o.connect(e); perc(e, t, g, 0.012, 0.0008);
      const n = noise(t, 0.01, WN), b = BQ('bandpass', f * 2.1, 3), ne = G(0, p); n.connect(b); b.connect(ne); perc(ne, t, g * 0.8, 0.003, 0.0005);
    }
    function cartao(t, o) { // cartão entra da direita: whoosh R→centro com pico na batida + tique ao assentar
      const pre = o.dry ? 0.08 : 0.14, d = o.len, v = vary(t, 30 + o.i, 0.06);
      woosh(t - pre, d + pre, 500 * v, 3800 * v, 1100, o.dry ? 0.46 : 0.4, 0.85, 0.0, pre / (d + pre) + 0.05, 1.1);
      tique(t + (o.dry ? 0.02 : 0.04), 1050 * vary(t, 31 + o.i, 0.05), 0.12, 0.1);
    }
    function preco(t, o) { // swipe (cartão de cima sai para cima) + contagem f+2…f+11 + "ding" em f+12 (preço assenta)
      woosh(t - 0.05, 0.26, 700, 5200, 3000, 0.3, (rnd(t, 40) - 0.5) * 0.3, 0, 0.35, 1.2, WN2);
      for (let k = 0; k < 10; k++) tique(t + (2 + k) / FPS, 1900 + k * 110, 0.05 + 0.004 * k, (k % 2 ? 0.12 : -0.12));
      const td = t + 12 / FPS, v = vary(t, 41 + o.i, 0.008);
      bell(td, mtof(88) * v, 0.075, 0.7, 0.05, 0.4, [[1, 1, 1], [2.76, 0.18, 0.4]]);
      bell(td + 0.07, mtof(93) * v, 0.085, 1.0, -0.05, 0.45, [[1, 1, 1], [2.76, 0.2, 0.4], [5.4, 0.05, 0.2]]);
    }
    function leque(t) { [0, 1, 2].forEach(k => woosh(t + k * 0.06, 0.3, 600, 3000, 1400, 0.16, -0.5 + k * 0.5, -0.3 + k * 0.3, 0.4, 1.3)); }
    function brilhos(t) { [[0, 2637.02, -0.4], [0.12, 3520, 0.35], [0.24, 2959.96, -0.1], [0.42, 4434.92, 0.5]].forEach(([dt, f, p]) => bell(t + dt, f, 0.03, 0.8, p, 0.6, [[1, 1, 1], [2.0, 0.2, 0.5]])); }
    function pluck(t, o) { // pulso do botão: pluck quente (serra + quadrada com LP a fechar) + halo
      const f = mtof(o.m) * vary(t, 70, 0.004), p = PAN((rnd(t, 71) - 0.5) * 0.4, sfx); send(p, 0.35, sRevIn);
      const lp = BQ('lowpass', 6000, 2), e = G(0); lp.connect(e); e.connect(p); lp.frequency.setValueAtTime(6500, t); lp.frequency.setTargetAtTime(700, t + 0.005, 0.06);
      [['sawtooth', 0, 0.6], ['square', 6, 0.35], ['sine', -1200, 0.5]].forEach(([ty, dt, a]) => { const os = OSC(ty, f, t, t + 0.8); os.detune.value = dt; os.connect(G(a, lp)); });
      perc(e, t, 0.1 * vary(t, 72, 0.08), 0.12, 0.002);
    }
    const FX = { impacto, brilho, sunburst, toqueDoSol, pilula, cartao, preco, leque, brilhos, pluck };
    // nível por tipo (dB): SFX 3–6 dB abaixo da música, impactos por cima, taça +3 dB
    const LEV = { impacto: 0, brilho: 5.5, sunburst: 4, toqueDoSol: 4.5, pilula: 7, cartao: 8, preco: 1, leque: 12, brilhos: 5.5, pluck: 10 };
    window.KOKAD.LEV = LEV;
    const scheduleSfx = () => cut.SFX.forEach(([b, name, o]) => { const k = db(LEV[name] || 0); sfx = G(k, sfxRoot); sRevIn = G(k, sRevRoot); FX[name](B(b), o || {}); });

    scheduleMusic(); scheduleSfx();
    return { DUR };
  };
})();
