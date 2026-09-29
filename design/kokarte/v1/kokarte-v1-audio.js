/* KOKARTE · vídeo 1 "Uma destas mensagens é tua" — banda sonora sintetizada (Web Audio), SEM voz.
 * Fonte de verdade: briefing/kokarte/02-estudo-viral-e-guiao-v1.md (secções 3, 5 e 6).
 *
 * Grelha: 107,14 BPM = 14 fotogramas por batida a 25 fps (batida 0,56 s, 16.ª 0,14 s).
 * 62 batidas = 868 fotogramas = 34,72 s. As batidas 60–61 são anacruse que resolve no f0 (loop).
 * Tom: Lá maior (o "Toque do sol" = taça ≈ 220 Hz = Lá3 cai sobre Amaj9 no drop).
 * Harmonia (batida: acorde): 0 Amaj9 · 4 F#m9 · 8 Dmaj9 · 12 E9sus4 · 16 Amaj9 · 20 F#m9 · 24 Dmaj9 · 28 E9sus4 ·
 *   32 Amaj9 · 36 Dmaj9 (breakdown) · 40 Bm11 · 44 E9sus4 (compasso de 2) · 46 Amaj9 (DROP) · 50 F#m9 ·
 *   54 Dmaj9 · 58 Bm11 · 60 E9sus4 (anacruse) → f0 Amaj9.
 * Compassos: 0,4,…,40 (4 batidas) · 44 (2 batidas) · 46,50,54,58 (4 batidas) → o drop cai num downbeat
 *   e 46 + 16 = 62 ≡ 0: a frase do drop fecha exatamente no loop.
 *
 * window.kokMakeAudio(ctx, dest, { cycles, stem })
 *   Agenda `cycles` ciclos consecutivos (ciclo k começa em k·DUR). Tudo é determinístico
 *   (acaso = hash do tempo local no ciclo), por isso os ciclos são idênticos: renderizar 2 ciclos
 *   e ficar com o 2.º dá o estado estacionário do loop (caudas do fim entram no início, sem clique).
 *   stem: 'mix' | 'music' | 'sfx'.
 * Sem compressores Web Audio (evita o atraso de look-ahead de 6 ms): a normalização a −14 LUFS e o
 * limitador (circular) ficam em kokarte-v1-audio.html.
 */
(function () {
  'use strict';
  const FPS = 25, BT = 0.56, S16 = BT / 4, NB = 62, DUR = 34.72;
  const F = f => f / FPS, B = b => b * BT;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const db = x => Math.pow(10, x / 20);

  /* Acordes: bass (log drum / raiz), keys (rhodes, sem raiz), pad (5 vozes) — MIDI */
  const CH = {
    A:  { bass: 45, keys: [56, 59, 61, 64], pad: [52, 57, 61, 68, 71] }, // Amaj9
    Fm: { bass: 42, keys: [57, 61, 64, 68], pad: [54, 57, 61, 64, 68] }, // F#m9
    D:  { bass: 38, keys: [54, 57, 61, 64], pad: [50, 57, 61, 64, 66] }, // Dmaj9
    E:  { bass: 40, keys: [57, 59, 62, 66], pad: [52, 57, 59, 62, 66] }, // E9sus4 (E A B D F#)
    Bm: { bass: 35, keys: [57, 62, 64, 66], pad: [47, 54, 57, 62, 64] }, // Bm11
  };
  const TL = [[0, 'A'], [4, 'Fm'], [8, 'D'], [12, 'E'], [16, 'A'], [20, 'Fm'], [24, 'D'], [28, 'E'], [32, 'A'],
    [36, 'D'], [40, 'Bm'], [44, 'E'], [46, 'A'], [50, 'Fm'], [54, 'D'], [58, 'Bm'], [60, 'E']];
  const chordAt = b => { let c = TL[0][1]; for (const [s, k] of TL) if (b >= s - 1e-9) c = k; return c; };
  const BARS = []; for (let b = 0; b < 44; b += 4) BARS.push([b, 4]); BARS.push([44, 2]); for (let b = 46; b < 62; b += 4) BARS.push([b, 4]);
  const section = b => b < 6 ? 'intro' : b < 36 ? 'A' : b < 40 ? 'break' : b < 46 ? 'build' : b < 60 ? 'drop' : 'ana';

  /* Cues SFX (fotograma → evento). Documentados em cues.md */
  const PENT = { A6: 1760, B6: 1975.53, Cs7: 2217.46, E7: 2637.02, Fs7: 2959.96, A7: 3520 };
  const SFX = [
    [14, 'selo', { f: 1318.51, pan: -0.5 }], [28, 'selo', { f: 1760, pan: 0 }], [42, 'selo', { f: 2217.46, pan: 0.5 }],
    [84, 'lacre', { pm: 1.00 }], [88, 'papel', {}],
    [98, 'texto', { f: PENT.E7 }], [126, 'texto', { f: PENT.Fs7 }],
    [168, 'virar', {}], [175, 'pop', { f: 1175 }], [217, 'linha', {}],
    [224, 'lacre', { pm: 1.03 }], [228, 'papel', {}],
    [238, 'texto', { f: PENT.Cs7 }], [252, 'texto', { f: PENT.E7 }], [266, 'texto', { f: PENT.Fs7 }],
    [308, 'virar', {}], [315, 'pop', { f: 1245 }], [357, 'linha', {}],
    [364, 'lacre', { pm: 1.06 }], [368, 'papel', {}],
    [378, 'texto', { f: PENT.Cs7 }], [392, 'texto', { f: PENT.E7 }], [406, 'texto', { f: PENT.Fs7 }],
    [448, 'virar', {}], [455, 'pop', { f: 1110 }],
    [532, 'enviar', {}],
    [560, 'brilhoQuente', { f: 880 }], [588, 'brilhoQuente', { f: 1108.73 }], [616, 'brilhoQuente', { f: 1318.51 }],
    [630, 'sopro', {}], [644, 'toqueDoSol', {}],
    [700, 'tinido', {}], [714, 'fumo', {}], [728, 'contas', {}], [742, 'raspar', {}],
    [749, 'linha', {}], [756, 'selo', { f: 1760, pan: 0 }], [770, 'pop', { f: 1320 }], [784, 'texto', { f: PENT.E7 }],
    [854, 'texto', { f: PENT.Cs7 }],
  ];
  window.KOK1 = { FPS, BT, DUR, NB, TL, SFX, BARS };

  window.kokMakeAudio = function (ctx, dest, opt) {
    opt = opt || {};
    const cycles = opt.cycles || 1, stem = opt.stem || 'mix';
    const sr = ctx.sampleRate;
    let O = 0; const at = t => O + t;
    const rnd = (t, k = 0) => { const x = Math.sin(t * 127.1 + k * 311.7 + 17.13) * 43758.5453; return x - Math.floor(x); };
    const vary = (t, k = 0, a = 0.03) => 1 + (rnd(t, k) * 2 - 1) * a;
    let seed = 0x4B0CA7; const prng = () => { seed = (seed + 0x6D2B79F5) | 0; let z = Math.imul(seed ^ (seed >>> 15), 1 | seed); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };

    /* ruído determinístico (branco/rosa, mono/estéreo) */
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

    /* ---------- nós utilitários ---------- */
    const G = (v, to) => { const g = ctx.createGain(); g.gain.value = v; if (to) g.connect(to); return g; };
    const BQ = (type, f, q, to) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (to) b.connect(to); return b; };
    const PAN = (p, to) => { const s = ctx.createStereoPanner(); s.pan.value = Math.max(-1, Math.min(1, p)); if (to) s.connect(to); return s; };
    const OSC = (type, f, t0, t1) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(t0); o.stop(t1); return o; };
    const noise = (lt, dur, buf) => { const s = ctx.createBufferSource(); s.buffer = buf; const off = rnd(lt, 7.7) * (buf.duration - dur - 0.2); s.start(at(lt), Math.max(0, off), dur + 0.05); return s; };
    const send = (node, amt, to) => { const g = G(amt, to); node.connect(g); return g; };
    const shaper = k => { const w = ctx.createWaveShaper(); const cv = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = i / 1024 - 1; cv[i] = Math.tanh(k * x) / Math.tanh(k); } w.curve = cv; return w; };

    /* ---------- barramentos ---------- */
    const master = G(1); const hp = BQ('highpass', 24, 0.7, dest); master.connect(hp);
    // música
    const musicOut = G(stem === 'sfx' ? 0 : db(-1), master);
    const introLP = BQ('lowpass', 20000, 0.5, musicOut);      // "intro filtrada" e sucção na anacruse
    const musicIn = G(1, introLP);
    const musicNF = G(1); { const nfSh = shaper(1.25); const nfPre = G(0.62); musicNF.connect(nfPre); nfPre.connect(nfSh); nfSh.connect(musicOut); }                            // log drum, bombo, prato invertido: fora do filtro
    const mRev = mkRev(2.6, 3.2, 0.02), mRevIn = G(1); mRevIn.connect(mRev);
    const mRevLP = BQ('lowpass', 5200, 0.6); mRev.connect(mRevLP); mRevLP.connect(G(0.55, introLP));
    // SFX
    const sfxOut = G(stem === 'music' ? 0 : 1, master);
    const sfx = G(1, sfxOut);
    const sRev = mkRev(2.2, 3.0, 0.012), sRevIn = G(1); sRevIn.connect(sRev);
    const sRevHP = BQ('highpass', 280, 0.7); sRev.connect(sRevHP); sRevHP.connect(G(0.6, sfxOut));

    /* ================= MÚSICA ================= */
    // PAD quente: 2 serras desafinadas ±7 cents + triângulo, por voz; LP partilhado com automação
    const padBus = G(1); const padLP = BQ('lowpass', 900, 0.8); padBus.connect(padLP); padLP.connect(musicIn); send(padLP, 0.5, mRevIn);
    function padChord(b0, b1, ch) {
      const t0 = Math.max(0, at(B(b0)) - 0.02), t1 = at(B(b1)); const notes = CH[ch].pad;
      notes.forEach((m, i) => {
        const f = mtof(m), e = G(0), p = PAN((i / (notes.length - 1) * 2 - 1) * 0.55, padBus); e.connect(p);
        const g = 0.031;
        e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(g, t0 + 0.24); e.gain.setValueAtTime(g, t1 - 0.04); e.gain.setTargetAtTime(0, t1 - 0.04, 0.16);
        [['sawtooth', -7, 0.55], ['sawtooth', 7, 0.55], ['triangle', 0, 1.1]].forEach(([ty, dt, a]) => { const o = OSC(ty, f, t0, t1 + 1.6); o.detune.value = dt; o.connect(G(a, e)); });
      });
    }
    // KEYS (rhodes FM): portadora + moduladora 1:1 com índice a cair + "tine" curto
    const keysBus = G(1); const keysPan = PAN(0); keysBus.connect(keysPan); keysPan.connect(musicIn); send(keysPan, 0.28, mRevIn);
    { const lfo = ctx.createOscillator(); lfo.frequency.value = 1 / (2 * BT); const lg = G(0.28); lfo.connect(lg); lg.connect(keysPan.pan); lfo.start(0); } // 31 períodos por ciclo → fase igual no loop
    function rhodes(lt, m, dur, vel, pan) {
      const t = at(lt), f = mtof(m), end = t + dur + 0.7;
      const e = G(0), p = PAN(pan, keysBus); e.connect(p);
      const pk = 0.058 * vel;
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(pk, t + 0.004); e.gain.setTargetAtTime(pk * 0.3, t + 0.004, 0.28); e.gain.setTargetAtTime(0, t + dur, 0.09);
      const car = OSC('sine', f, t, end), mod = OSC('sine', f, t, end), mg = G(0); mod.connect(mg); mg.connect(car.frequency);
      mg.gain.setValueAtTime(f * 1.25 * vel, t); mg.gain.setTargetAtTime(f * 0.1, t, 0.13);
      car.connect(e);
      const tn = OSC('sine', f * 7.02, t, t + 0.25), tg = G(0); tn.connect(tg); tg.connect(e); tg.gain.setValueAtTime(0.1 * vel, t); tg.gain.setTargetAtTime(0, t, 0.02);
    }
    const keysChord = (lt, ch, dur, vel, oct = 0) => CH[ch].keys.forEach((m, i) => rhodes(lt + i * 0.004, m + oct, dur, vel * vary(lt, i, 0.06), (i - 1.5) * 0.18));
    // LOG DRUM: seno + triângulo com queda de afinação, saturação tanh, LP; "knock" curto
    const ldBus = G(1); const ldSh = shaper(1.5); const ldLP = BQ('lowpass', 1100, 0.7); const ldPre = G(0.62); ldBus.connect(ldPre); ldPre.connect(ldSh); ldSh.connect(ldLP); ldLP.connect(musicNF);
    function logDrum(lt, m, vel, len = 0.3, gl = 1.4) {
      const t = at(lt), f = mtof(m);
      const e = G(0, ldBus); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.22 * vel, t + 0.003); e.gain.setTargetAtTime(0, t + 0.003, len / 4.6);
      const o = OSC('sine', f * gl, t, t + len + 0.4); o.frequency.setValueAtTime(f * gl, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.045); o.connect(e);
      const o2 = OSC('triangle', f * 2 * gl, t, t + len + 0.4); o2.frequency.setValueAtTime(f * 2 * gl, t); o2.frequency.exponentialRampToValueAtTime(f * 2, t + 0.045); o2.connect(G(0.2, e));
      const n = noise(lt, 0.015, WN), nb = BQ('bandpass', 1500, 1.4), ng = G(0); n.connect(nb); nb.connect(ng); ng.connect(ldBus);
      ng.gain.setValueAtTime(0.1 * vel, t); ng.gain.setTargetAtTime(0, t, 0.004);
    }
    function kick(lt, vel, f1 = 52, dec = 0.3) {
      const t = at(lt), o = OSC('sine', 150, t, t + dec + 0.3), e = G(0, musicNF);
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.07); o.connect(e);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.3 * vel, t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, dec / 4.6);
    }
    function crash(lt, vel, to) {
      const t = at(lt), n = noise(lt, 2.2, PN2), h = BQ('highpass', 4200, 0.6), e = G(0, to); n.connect(h); h.connect(e);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.09 * vel, t + 0.006); e.gain.setTargetAtTime(0, t + 0.006, 0.42); send(e, 0.3, mRevIn);
    }
    function shaker(lt, vel, dec, pan) {
      const t = at(lt), n = noise(lt, dec + 0.1, WN), bp = BQ('bandpass', 7200, 0.8), h = BQ('highpass', 3600, 0.7), e = G(0), p = PAN(pan, musicIn);
      n.connect(bp); bp.connect(h); h.connect(e); e.connect(p);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.13 * vel, t + 0.005); e.gain.setTargetAtTime(0, t + 0.005, dec / 4);
    }
    function hat(lt, vel) {
      const t = at(lt), n = noise(lt, 0.2, WN), h = BQ('highpass', 8200, 0.7), e = G(0), p = PAN(0.3, musicIn);
      n.connect(h); h.connect(e); e.connect(p); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.07 * vel, t + 0.003); e.gain.setTargetAtTime(0, t + 0.003, 0.025);
    }
    function rim(lt, vel) { // pau/rim macio (amapiano), com um pouco de sala
      const t = at(lt), e = G(0), p = PAN(-0.2, musicIn); e.connect(p); send(p, 0.35, mRevIn);
      [[1180, 1], [2090, 0.5]].forEach(([f, a]) => { const o = OSC('sine', f * vary(lt, 3, 0.01), t, t + 0.12); o.connect(G(a, e)); });
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.045 * vel, t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, 0.012);
    }
    function reverseCym(lt0, lt1, g, to) { // swell invertido que acaba seco no alvo (fecha com rampa de 6 ms)
      const t0 = at(lt0), t1 = at(lt1), d = lt1 - lt0, n = noise(lt0, d + 0.02, PN2), h = BQ('highpass', 6500, 0.6), e = G(0, to);
      n.connect(h); h.connect(e); h.frequency.setValueAtTime(6500, t0); h.frequency.exponentialRampToValueAtTime(1400, t1);
      const N = 64, cv = new Float32Array(N); for (let i = 0; i < N; i++) cv[i] = g * Math.pow(i / (N - 1), 2.6);
      e.gain.setValueCurveAtTime(cv, t0, d - 0.006); e.gain.linearRampToValueAtTime(0, t1);
    }
    function riser(lt0, lt1, g) {
      const t0 = at(lt0), t1 = at(lt1), n = noise(lt0, lt1 - lt0 + 0.1, PN2), bp = BQ('bandpass', 500, 2.2), e = G(0, musicIn);
      n.connect(bp); bp.connect(e); bp.frequency.setValueAtTime(500, t0); bp.frequency.exponentialRampToValueAtTime(3600, t1);
      e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(g * 0.3, t0 + (t1 - t0) * 0.6); e.gain.linearRampToValueAtTime(g, t1 - 0.03); e.gain.linearRampToValueAtTime(0, t1 + 0.06);
    }

    function scheduleMusic() {
      // --- automação por secção (contínua no loop: o fim de um ciclo = início do seguinte)
      const iF = introLP.frequency;
      iF.setValueAtTime(2400, at(0)); iF.exponentialRampToValueAtTime(4000, at(B(5.5))); iF.exponentialRampToValueAtTime(20000, at(B(6)));
      iF.setValueAtTime(20000, at(B(60))); iF.exponentialRampToValueAtTime(2400, at(DUR));
      const pF = padLP.frequency, pQ = padLP.Q;
      pF.setValueAtTime(850, at(0)); pF.exponentialRampToValueAtTime(1500, at(B(6)));
      pF.setValueAtTime(1500, at(B(35.5))); pF.exponentialRampToValueAtTime(1100, at(B(36.5)));
      pF.setValueAtTime(1100, at(F(553))); pF.exponentialRampToValueAtTime(300, at(B(40)));   // escurece com o fade f553–559
      pF.exponentialRampToValueAtTime(5200, at(F(643)));                                         // filtro a abrir f560–643
      pF.exponentialRampToValueAtTime(2600, at(B(46) + 0.15));
      pF.setValueAtTime(2600, at(B(60))); pF.exponentialRampToValueAtTime(850, at(DUR));
      pQ.setValueAtTime(0.8, at(0)); pQ.setValueAtTime(0.8, at(B(40))); pQ.linearRampToValueAtTime(2.2, at(F(643))); pQ.linearRampToValueAtTime(0.8, at(B(46) + 0.15));
      const pG = padBus.gain;
      pG.setValueAtTime(0.95, at(0)); pG.setValueAtTime(0.95, at(B(6))); pG.linearRampToValueAtTime(0.72, at(B(6) + 0.4));
      pG.setValueAtTime(0.72, at(B(36))); pG.linearRampToValueAtTime(1.05, at(B(36) + 0.5));
      pG.setValueAtTime(1.05, at(B(40))); pG.linearRampToValueAtTime(1.08, at(F(643)));
      pG.linearRampToValueAtTime(0.8, at(B(46) + 0.2)); pG.setValueAtTime(0.8, at(B(60))); pG.linearRampToValueAtTime(0.95, at(DUR));

      // --- pad
      TL.forEach(([b, c], i) => padChord(b, i + 1 < TL.length ? TL[i + 1][0] : NB, c));

      // --- padrões por compasso (16.as)
      const LD = { 0: [0, 1, 0.3], 3: [0, 0.55, 0.22], 6: [7, 0.6, 0.25], 10: [0, 0.8, 0.4], 11: [12, 0.35, 0.18], 14: [7, 0.55, 0.25] };
      const KA = { 0: [0.8, 6], 6: [0.6, 4], 10: [0.7, 5] }, KD = { 0: [0.85, 3], 3: [0.5, 3], 6: [0.7, 4], 10: [0.75, 2], 12: [0.55, 4] };
      BARS.forEach(([b0, len], bi) => {
        for (let s = 0; s < len * 4; s++) {
          const beat = b0 + s / 4, lt = B(b0) + s * S16, sec = section(beat), ch = chordAt(beat), sb = s % 4, sw = (sb % 2) ? 0.012 : 0; // swing leve nas 16.as ímpares
          // SHAKER
          if (sec === 'intro' || sec === 'A' || sec === 'drop' || sec === 'ana') {
            let v = [0.3, 0.16, 0.62, 0.22][sb] * vary(lt, 1, 0.12) * (sec === 'A' ? 0.85 : 1), dec = sb === 2 ? 0.085 : 0.045, pan = 0.15;
            const fr = Math.round(lt * FPS);
            if (sb === 2 && (fr === 63 || fr === 77)) { v = 1; dec = 0.15; pan = fr === 63 ? -0.3 : 0.3; } // contratempo f63/f77
            shaker(lt + sw, v, dec, pan);
          } else if (sec === 'build' && beat >= 42) shaker(lt + sw, (0.08 + 0.42 * (beat - 42) / 4) * [1, 0.7, 0.9, 0.7][sb], 0.05, 0.15);
          // BOMBO
          if (sb === 0) {
            if (sec === 'A') kick(lt, beat === 6 ? 0.65 : 0.5);
            else if (sec === 'drop') kick(lt, beat === 46 ? 0.7 : 0.62, beat === 46 ? 55 : 52, beat === 46 ? 0.45 : 0.3);
          }
          // RIM (batidas 2 e 4 no drop; 4 na secção A)
          if ((sec === 'A' && s % 16 === 12) || (sec === 'drop' && s % 8 === 4)) rim(lt, sec === 'drop' ? 0.9 : 0.7);
          // HI-HAT aberto em contratempo (só drop)
          if (sec === 'drop' && sb === 2) hat(lt + sw, 0.8 * vary(lt, 2, 0.1));
          // LOG DRUM
          const root = CH[ch].bass;
          if (b0 === 50) { if (sb === 0) { const k = s / 4; logDrum(lt, [42, 45, 47, 49][k], [0.62, 0.58, 0.58, 0.62][k], 0.34, 1.35); } } // plano 15: um por corte
          else if (b0 === 58 && s >= 8) { const FILL = { 8: [40, 0.45], 10: [42, 0.55], 11: [45, 0.6], 12: [45, 0.68], 13: [47, 0.75], 14: [49, 0.82], 15: [52, 0.9] }; if (FILL[s]) logDrum(lt, FILL[s][0], FILL[s][1], 0.15, 1.25); }
          else if ((sec === 'A' && beat > 6) || sec === 'drop') { const p = LD[s % 16]; if (p) logDrum(lt + sw, root + p[0], p[1] * vary(lt, 4, 0.06) * (sec === 'A' ? 0.85 : 1), p[2]); }
          // KEYS
          if (sec === 'intro' || sec === 'A') { const k = KA[s % 16] || (bi % 2 && s % 16 === 13 ? [0.45, 3] : null); if (k) keysChord(lt + sw, ch, k[1] * S16 - 0.02, k[0] * (sec === 'intro' ? 1.05 : 0.9)); }
          else if (sec === 'break') { if (s % 2 === 0) { const ks = CH[ch].keys, i = (s / 2) % 4; rhodes(lt, ks[i] + (s >= 8 ? 12 : 0), 0.5, 0.5 * vary(lt, 5, 0.08), (i - 1.5) * 0.3); } }
          else if (sec === 'build') { if (s === 0) keysChord(lt, ch, len * BT - 0.05, 0.42); }
          else if (sec === 'drop') { const k = KD[s % 16]; if (k) keysChord(lt + sw, ch, k[1] * S16 - 0.02, k[0] * 0.9); }
          else if (sec === 'ana') { if (s === 8) keysChord(lt, ch, 1.0, 0.6); }
        }
      });
      // entrada do log drum no f84 (b6): nota com glide largo
      logDrum(B(6), CH[chordAt(6)].bass, 0.8, 0.45, 1.9);
      // downbeat f0: bombo afinado em Lá1 + prato suave (passa pelo filtro da intro)
      kick(0, 0.9, 55, 0.5); crash(0, 0.7, musicIn);
      // drop f644: prato suave (fora do filtro)
      crash(B(46), 0.8, musicNF);
      // swell para o breakdown (cartão encolhe f497–503) e para o loop (anacruse f840–867)
      reverseCym(F(490), B(36), 0.10, musicNF);
      reverseCym(B(60), DUR, 0.16, musicNF);
      // subida discreta na quarta mensagem (até ao sopro)
      riser(B(42), F(630), 0.05);
    }

    /* ================= SFX ================= */
    function bell(lt, f, g, dec, pan, rs = 0.35, parts = [[1, 1, 1], [2.76, 0.32, 0.42], [5.4, 0.1, 0.2]]) {
      const t = at(lt), p = PAN(pan, sfx); send(p, rs, sRevIn);
      parts.forEach(([r, a, dm]) => {
        const o = OSC('sine', f * r, t, t + dec * dm * 1.4 + 0.1), e = G(0, p); o.connect(e);
        e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g * a, t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, dec * dm / 5);
      });
    }
    function selo(lt, o) { const v = vary(lt, 11, 0.012); bell(lt, o.f * 0.749 * v, 0.045, 0.25, o.pan, 0.3); bell(lt + 0.028, o.f * v, 0.085, 0.9, o.pan, 0.45); }
    function texto(lt, o) { bell(lt, o.f * vary(lt, 12, 0.015), 0.022 * vary(lt, 13, 0.1), 0.45, (rnd(lt, 14) - 0.5) * 0.6, 0.5, [[1, 1, 1], [2.76, 0.2, 0.35]]); }
    function brilhoQuente(lt, o) { bell(lt, o.f, 0.03, 1.3, (rnd(lt, 15) - 0.5) * 0.4, 0.6, [[1, 1, 1], [2.0, 0.25, 0.6], [3.0, 0.06, 0.3]]); }
    function lacre(lt, o) {
      const pm = o.pm, t = at(lt), p = PAN(0.05, sfx); send(p, 0.14, sRevIn);
      const clk = (dt, g, f, q = 1.2) => { const tt = t + dt, n = noise(lt + dt, 0.006, WN), b = BQ('bandpass', f, q), e = G(0, p); n.connect(b); b.connect(e); e.gain.setValueAtTime(0, tt); e.gain.linearRampToValueAtTime(g, tt + 0.0005); e.gain.setTargetAtTime(0, tt + 0.0005, 0.0012); };
      [[0, 1], [0.006, 0.7], [0.013, 0.85], [0.021, 0.45], [0.034, 0.3]].forEach(([dt, a], i) => clk(dt / pm, 0.42 * a, 2700 * pm * vary(lt, 20 + i, 0.08)));
      [[0.075, 0.16], [0.105, 0.11], [0.15, 0.08]].forEach(([dt, a], i) => clk(dt, a, 3600 * pm * vary(lt, 30 + i, 0.1), 2));   // migalhas de lacre
      { const n = noise(lt, 0.05, WN), b = BQ('bandpass', 1100 * pm, 0.8), e = G(0, p); n.connect(b); b.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.2, t + 0.001); e.gain.setTargetAtTime(0, t + 0.001, 0.008); }
      { const o2 = OSC('sine', 190 * pm, t, t + 0.12), e = G(0, p); o2.frequency.setValueAtTime(190 * pm, t); o2.frequency.exponentialRampToValueAtTime(115 * pm, t + 0.04); o2.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.2, t + 0.001); e.gain.setTargetAtTime(0, t + 0.001, 0.014); }
    }
    function rough(param, t, d, g, lt, shape) { // envelope com textura (fibras de papel)
      const N = 48, cv = new Float32Array(N);
      for (let i = 0; i < N; i++) { const x = i / (N - 1); cv[i] = g * shape(x) * (0.72 + 0.28 * rnd(lt, 40 + i)); }
      cv[N - 1] = 0; param.setValueCurveAtTime(cv, t, d);
    }
    function papel(lt) {
      const t = at(lt), d = 0.4, p = PAN(0, sfx); p.pan.setValueAtTime(-0.1, t); p.pan.linearRampToValueAtTime(0.12, t + d); send(p, 0.12, sRevIn);
      const shp = x => Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, x * 1.15))), 0.7);
      { const n = noise(lt, d, PN), h = BQ('highpass', 500, 0.7), b = BQ('bandpass', 1600, 0.7), e = G(0, p); n.connect(h); h.connect(b); b.connect(e); b.frequency.setValueAtTime(1600, t); b.frequency.exponentialRampToValueAtTime(3200, t + d); rough(e.gain, t, d, 0.5, lt, shp); }
      { const n = noise(lt + 0.5, d, WN), h = BQ('highpass', 5200, 0.7), e = G(0, p); n.connect(h); h.connect(e); rough(e.gain, t, d, 0.05, lt + 0.5, shp); }
    }
    function virar(lt) {
      const t = at(lt), d = 0.32, p = PAN(0, sfx); p.pan.setValueAtTime(-0.5, t); p.pan.linearRampToValueAtTime(0.5, t + d); send(p, 0.18, sRevIn);
      const shp = x => x < 0.38 ? Math.pow(x / 0.38, 1.5) : Math.pow(Math.max(0, 1 - (x - 0.38) / 0.62), 2);
      { const n = noise(lt, d, PN), b = BQ('bandpass', 900, 1.1), e = G(0, p); n.connect(b); b.connect(e); b.frequency.setValueAtTime(900, t); b.frequency.exponentialRampToValueAtTime(2600, t + d * 0.38); b.frequency.exponentialRampToValueAtTime(1100, t + d); rough(e.gain, t, d, 0.55, lt, shp); }
      { const n = noise(lt + 0.3, d, PN), l = BQ('lowpass', 380, 0.7), e = G(0, p); n.connect(l); l.connect(e); rough(e.gain, t, d, 0.5, lt + 0.3, shp); }
    }
    function pop(lt, o) {
      const v = vary(lt, 50, 0.03), f = o.f * v, t = at(lt), p = PAN((rnd(lt, 51) - 0.5) * 0.2, sfx); send(p, 0.2, sRevIn);
      const os = OSC('sine', f * 1.55, t, t + 0.2), e = G(0, p); os.frequency.setValueAtTime(f * 1.55, t); os.frequency.exponentialRampToValueAtTime(f, t + 0.022); os.connect(e);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.14 * vary(lt, 52, 0.08), t + 0.002); e.gain.setTargetAtTime(0, t + 0.002, 0.02);
      const n = noise(lt, 0.006, WN), b = BQ('bandpass', 4200, 1.5), ne = G(0, p); n.connect(b); b.connect(ne); ne.gain.setValueAtTime(0, t); ne.gain.linearRampToValueAtTime(0.05, t + 0.0005); ne.gain.setTargetAtTime(0, t + 0.0005, 0.0015);
    }
    function linha(lt) { // linha dourada: glissando pentatónico L→R + brilho de ar
      const v = vary(lt, 60, 0.015);
      [PENT.A6, PENT.B6, PENT.Cs7, PENT.E7, PENT.Fs7, PENT.A7].forEach((f, i) => bell(lt + i * 0.034, f * v, 0.05 * Math.pow(0.84, i), 0.55, -0.6 + i * 0.24, 0.5, [[1, 1, 1], [2.76, 0.18, 0.3]]));
      const t = at(lt), d = 0.42, n = noise(lt, d, WN2), h = BQ('highpass', 6500, 0.7), e = G(0), p = PAN(0, sfx); n.connect(h); h.connect(e); e.connect(p);
      p.pan.setValueAtTime(-0.6, t); p.pan.linearRampToValueAtTime(0.6, t + d); send(p, 0.3, sRevIn);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.03, t + 0.12); e.gain.linearRampToValueAtTime(0, t + d);
    }
    function enviar(lt) { // whoosh "enviar": sobe e atravessa L→R (avião de papel), fecha com brilho
      const t = at(lt), d = 0.55, n = noise(lt, d, PN2), b = BQ('bandpass', 350, 0.9), e = G(0), p = PAN(0, sfx); n.connect(b); b.connect(e); e.connect(p); send(p, 0.3, sRevIn);
      b.frequency.setValueAtTime(350, t); b.frequency.exponentialRampToValueAtTime(3800, t + d * 0.85);
      p.pan.setValueAtTime(-0.7, t); p.pan.linearRampToValueAtTime(0.7, t + d);
      const N = 48, cv = new Float32Array(N); for (let i = 0; i < N; i++) { const x = i / (N - 1); cv[i] = 0.5 * (x < 0.7 ? Math.pow(x / 0.7, 1.8) : Math.pow(Math.max(0, 1 - (x - 0.7) / 0.3), 1.5)); } e.gain.setValueCurveAtTime(cv, t, d);
      const o = OSC('sine', 480, t, t + d + 0.05), l = BQ('lowpass', 2500, 0.7), og = G(0); o.frequency.setValueAtTime(480, t); o.frequency.exponentialRampToValueAtTime(1500, t + d); o.connect(l); l.connect(og); og.connect(p);
      og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.018, t + d * 0.7); og.gain.linearRampToValueAtTime(0, t + d);
      bell(lt + 0.42, PENT.E7, 0.03, 0.6, 0.6, 0.5, [[1, 1, 1], [2.76, 0.2, 0.3]]);
    }
    function sopro(lt) { // sopro de ar de 0,4 s (com pré-cauda desde f630) que culmina no Toque do sol
      const t = at(lt), d = F(644) - lt, n = noise(lt, d + 0.3, PN2), b = BQ('bandpass', 700, 1.1), e = G(0), p = PAN(0, sfx); n.connect(b); b.connect(e); e.connect(p); send(p, 0.35, sRevIn);
      b.frequency.setValueAtTime(700, t); b.frequency.exponentialRampToValueAtTime(2600, t + d);
      const N = 40, cv = new Float32Array(N); for (let i = 0; i < N; i++) cv[i] = 0.22 * Math.pow(i / (N - 1), 2.4); e.gain.setValueCurveAtTime(cv, t, d); e.gain.setTargetAtTime(0, t + d, 0.05);
      const o = OSC('sine', 440, t, t + d + 0.3), og = G(0, p); o.connect(og); og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.012, t + d); og.gain.setTargetAtTime(0, t + d, 0.06);
    }
    function toqueDoSol(lt) { // taça tibetana ≈ 220 Hz (Lá3): parciais inarmónicos em pares a batimento, cauda ~1,6 s audível
      const t = at(lt), f0 = 220, bus = G(1, sfx); send(bus, 0.55, sRevIn);
      [[1, 0.27, 2.4, 0.9], [2.71, 0.12, 1.5, 1.7], [5.03, 0.07, 0.8, 2.6], [8.12, 0.03, 0.45, 3.3]].forEach(([r, a, t60, beat], i) => {
        [-1, 1].forEach(sd => {
          const o = OSC('sine', f0 * r + sd * beat / 2, t, t + t60 + 0.2), e = G(0), p = PAN(sd * (0.25 + i * 0.1), bus); o.connect(e); e.connect(p);
          e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(a / 2, t + 0.005); e.gain.setTargetAtTime(0, t + 0.005, t60 / 6.9);
        });
      });
      // batente (maço de feltro): pancada curta, grave e abafada
      const n = noise(lt, 0.05, PN), l = BQ('lowpass', 1300, 0.7), e = G(0, bus); n.connect(l); l.connect(e); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.14, t + 0.003); e.gain.setTargetAtTime(0, t + 0.003, 0.01);
    }
    function tinido(lt) { // dois cristais a tocar-se
      const t = [[3140, 1, 0.45], [4710, 0.45, 0.3], [6850, 0.2, 0.14]], t2 = [[3525, 1, 0.35], [5230, 0.4, 0.2]];
      t.forEach(([f, a, d]) => bell(lt, f, 0.07 * a, d, -0.25, 0.4, [[1, 1, 1]]));
      t2.forEach(([f, a, d]) => bell(lt + 0.075, f, 0.035 * a, d, -0.1, 0.4, [[1, 1, 1]]));
    }
    function fumo(lt) {
      const t = at(lt), d = 0.75, n = noise(lt, d, PN2), b = BQ('bandpass', 1400, 0.6), l = BQ('lowpass', 3000, 0.6), e = G(0), p = PAN(0.1, sfx); n.connect(b); b.connect(l); l.connect(e); e.connect(p); send(p, 0.4, sRevIn);
      b.frequency.setValueAtTime(1400, t); b.frequency.exponentialRampToValueAtTime(650, t + d);
      e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.2, t + 0.14); e.gain.setTargetAtTime(0, t + 0.2, 0.14);
    }
    function contas(lt) { // japamala: ~11 contas a cair umas nas outras
      let dt = 0;
      for (let i = 0; i < 11; i++) {
        const tt = lt + dt, t = at(tt), g = (0.55 + 0.45 * rnd(lt, 70 + i)) * (1 - i / 14), p = PAN((rnd(lt, 80 + i) - 0.5) * 0.7, sfx);
        const n = noise(tt, 0.008, WN), b = BQ('bandpass', 1800 + 1600 * rnd(lt, 90 + i), 2.5), e = G(0, p); n.connect(b); b.connect(e);
        e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.5 * g, t + 0.0005); e.gain.setTargetAtTime(0, t + 0.0005, 0.002);
        const o = OSC('sine', 2300 + 900 * rnd(lt, 100 + i), t, t + 0.06), oe = G(0, p); o.connect(oe); oe.gain.setValueAtTime(0, t); oe.gain.linearRampToValueAtTime(0.02 * g, t + 0.001); oe.gain.setTargetAtTime(0, t + 0.001, 0.008);
        dt += 0.018 + 0.028 * rnd(lt, 110 + i);
      }
    }
    function raspar(lt) { // raspar o aro da taça: Lá3 + parcial 2,71 com tremolo de fricção e ruído estreito
      const t = at(lt), d = 0.62, bus = G(0), p = PAN(0.15, sfx); bus.connect(p); send(p, 0.45, sRevIn);
      bus.gain.setValueAtTime(0, t); bus.gain.linearRampToValueAtTime(1, t + 0.2); bus.gain.setValueAtTime(1, t + 0.36); bus.gain.linearRampToValueAtTime(0, t + d);
      const tr = G(1, bus), lfo = OSC('sine', 5.2, t, t + d + 0.05), lg = G(0.3); lfo.connect(lg); lg.connect(tr.gain);
      [[220, 0.09], [596.2, 0.05]].forEach(([f, a]) => { const o = OSC('sine', f, t, t + d + 0.05); o.connect(G(a, tr)); });
      const n = noise(lt, d, WN), b1 = BQ('bandpass', 596, 9), b2 = BQ('bandpass', 1400, 3); n.connect(b1); n.connect(b2); b1.connect(G(0.12, tr)); b2.connect(G(0.025, tr));
    }
    const FX = { selo, texto, brilhoQuente, lacre, papel, virar, pop, linha, enviar, sopro, toqueDoSol, tinido, fumo, contas, raspar };
    const scheduleSfx = () => SFX.forEach(([f, name, o]) => FX[name](F(f), o));

    for (let k = 0; k < cycles; k++) { O = k * DUR; scheduleMusic(); scheduleSfx(); }
    return { DUR };
  };
})();
