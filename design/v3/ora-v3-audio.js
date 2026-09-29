/* ORA v3 "Foco." — banda sonora (música + SFX) sintetizada em Web Audio.
 * 57,6 s = 30 compassos a 125 BPM (batida 0,48 s · compasso 1,92 s). Tom: Mi maior.
 * Progressão: Emaj9 · C#m9 · Amaj9 · B9sus4. Paleta "de vidro e ar".
 *
 * window.makeAudio(ctx, dest, T0, from)
 *   ctx  — AudioContext ou OfflineAudioContext
 *   dest — nó de destino (normalmente ctx.destination)
 *   T0   — tempo do contexto que corresponde a t = 0 do vídeo
 *   from — segundo de início (playback a meio); só agenda eventos com t >= from
 *
 * Determinístico: o "acaso" (pitch ±3 %, grãos do shimmer, ruído, reverbs) vem de hashes
 * fixos, por isso o render offline e o playback ao vivo soam iguais.
 * Headroom: o master fica ~−4…−6 dBFS de pico; a normalização final (−14 LUFS, pico < −0,5 dB)
 * fica no pipeline de export.
 * Ducking: −6 dB na música nos intervalos de voz (CAPS se existir; senão VO_V3 abaixo).
 */
(function () {
  'use strict';
  const BT = 0.48, BAR = 1.92, DUR = 57.6;

  /* Intervalos da locução (guião design/v3/locucao.md). Usados só se não houver CAPS. */
  const VO_V3 = [
    [0.30, 1.25, 'Um euro.'],
    [1.75, 4.30, 'Com foco, volta quatro e quarenta e sete.'],
    [4.55, 7.45, 'Publicar mais é luz espalhada. Não ilumina nada.'],
    [8.05, 10.95, 'Nós somos o foco. Estúdio ORA.'],
    [11.60, 13.25, 'Em Leiria, desde 2016.'],
    [13.70, 15.75, 'Sites pensados para converter.'],
    [17.40, 18.85, 'Em qualquer ecrã.'],
    [19.35, 22.30, 'Conteúdo e anúncios, com um só plano.'],
    [23.10, 24.65, 'Um evento em Leiria.'],
    [24.95, 26.80, 'Oitocentos e trinta e cinco euros em anúncios.'],
    [27.05, 28.55, 'Voltaram quatro vírgula quarenta e sete.'],
    [28.90, 30.55, 'A melhor campanha: seis e meio.'],
    [30.80, 32.60, 'Cada contacto passou a custar menos de metade.'],
    [34.60, 36.30, 'E a conversão mais que duplicou.'],
    [36.60, 38.25, 'Medimos, lemos, otimizamos.'],
    [38.60, 41.40, 'De negócios locais a marcas internacionais.'],
    [42.50, 44.70, 'Está na hora…'],
    [46.35, 47.70, 'Está na ORA.'],
    [50.20, 51.80, 'Marca uma conversa.'],
    [52.60, 54.40, 'O resto, focamos nós.'],
  ];
  window.ORA_V3_VO = VO_V3;

  /* Notas (Hz) */
  const CH = {
    E:  { pad: [164.81, 207.65, 246.94, 311.13, 369.99], arp: [659.25, 830.61, 987.77, 1244.51], bass: 82.41 }, // Emaj9
    Cm: { pad: [138.59, 164.81, 207.65, 246.94, 311.13], arp: [554.37, 659.25, 830.61, 987.77], bass: 69.30 },  // C#m9
    A:  { pad: [164.81, 207.65, 246.94, 277.18, 329.63], arp: [554.37, 659.25, 830.61, 987.77], bass: 55.00 },  // Amaj9 (sem fundamental no pad)
    B:  { pad: [185.00, 220.00, 246.94, 277.18, 329.63], arp: [739.99, 880.00, 987.77, 1108.73], bass: 61.74 }, // B9sus4
  };
  //                 c1   c2   c3   c4   c5 ................................................ c20
  const PROG = ['E', 'E', 'Cm', 'B', 'E', 'Cm', 'A', 'B', 'E', 'Cm', 'A', 'B', 'E', 'Cm', 'A', 'B', 'E', 'Cm', 'A', 'B',
  //             c21  c22  c23  c24  c25  c26  c27  c28  c29  c30
                'Cm', 'A', 'Cm', 'A', 'B', 'E', 'Cm', 'A', 'B', 'E'];
  const SHIM = [1318.51, 1479.98, 1661.22, 1975.53, 2217.46, 2637.02]; // Mi maior pentatónica (E6…E7)

  window.makeAudio = function (ctx, dest, T0, from) {
    from = Math.max(0, +from || 0);
    const sr = ctx.sampleRate, at = t => T0 + t, on = t => t >= from - 1e-4;
    const rnd = (t, k = 0) => { const x = Math.sin(t * 127.1 + k * 311.7 + 17.13) * 43758.5453; return x - Math.floor(x); };
    const vary = (t, k = 0, amt = 0.03) => 1 + (rnd(t, k) * 2 - 1) * amt; // ±3 % em sons repetidos
    let seed = 0x2F6B1D; const prng = () => { seed = (seed + 0x6D2B79F5) | 0; let z = Math.imul(seed ^ (seed >>> 15), 1 | seed); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };

    /* ruído branco e rosa (determinísticos) */
    const nb = ctx.createBuffer(1, sr * 2, sr), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = prng() * 2 - 1;
    const pb = ctx.createBuffer(1, sr * 4, sr), pd = pb.getChannelData(0);
    { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; for (let i = 0; i < pd.length; i++) { const w = prng() * 2 - 1; b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926; } }
    const mkRev = (secs, decay, pre = 0) => { const r = ctx.createConvolver(); const ir = ctx.createBuffer(2, Math.ceil(sr * secs), sr); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); const p = Math.floor(pre * sr); for (let i = p; i < d.length; i++) d[i] = (prng() * 2 - 1) * Math.pow(1 - i / d.length, decay); } r.buffer = ir; return r; };

    /* master: HPF 28 Hz → compressor suave → limitador → tanh suave */
    const master = ctx.createGain(); master.gain.value = 0.72;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 28; hp.Q.value = 0.7;
    // cola (compressor lento, suave) → limitador de picos (ataque 1 ms; o Chromium tem 6 ms de look-ahead)
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.012; comp.release.value = 0.22;
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -9; lim.knee.value = 2; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.09;
    const clip = ctx.createWaveShaper(); { const cv = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = i / 1024 - 1; cv[i] = Math.tanh(1.2 * x) / Math.tanh(1.2); } clip.curve = cv; }
    master.connect(hp); hp.connect(comp); comp.connect(lim); lim.connect(clip); clip.connect(dest);

    /* barramentos */
    const duck = ctx.createGain(); duck.connect(master);
    const music = ctx.createGain(); music.gain.value = 0.55; music.connect(duck);
    const drums = ctx.createGain(); drums.gain.value = 1; drums.connect(music);
    const pumpB = ctx.createGain(); pumpB.connect(music);  // sidechain do baixo
    const pumpP = ctx.createGain(); pumpP.connect(music);  // sidechain do pad (mais leve)
    const revM = mkRev(2.2, 3.2, 0.012), revMG = ctx.createGain(); revMG.gain.value = 0.3; revM.connect(revMG); revMG.connect(duck);
    const roomM = mkRev(0.5, 4, 0.004), roomMG = ctx.createGain(); roomMG.gain.value = 0.28; roomM.connect(roomMG); roomMG.connect(duck);
    const sfx = ctx.createGain(); sfx.gain.value = 0.5; sfx.connect(master);
    const roomS = mkRev(0.6, 4, 0.006), roomSG = ctx.createGain(); roomSG.gain.value = 0.32; roomS.connect(roomSG); roomSG.connect(master);
    const revS = mkRev(2.6, 3, 0.015), revSG = ctx.createGain(); revSG.gain.value = 0.34; revS.connect(revSG); revSG.connect(master);
    const revL = mkRev(2.4, 2.6, 0.018), revLG = ctx.createGain(); revLG.gain.value = 0.42; revL.connect(revLG); revLG.connect(master); // cauda 2,4 s do Toque ORA
    const send = (node, to, g) => { const s = ctx.createGain(); s.gain.value = g; node.connect(s); s.connect(to); };

    /* ducking −6 dB sob a voz */
    let caps = null;
    try { if (typeof CAPS !== 'undefined' && Array.isArray(CAPS) && CAPS.length) caps = CAPS; } catch (e) { /* sem CAPS global */ }
    if (!caps && Array.isArray(window.CAPS) && window.CAPS.length) caps = window.CAPS;
    if (!caps) caps = VO_V3;
    const iv = caps.map(c => [+c[0], +c[1]]).filter(c => isFinite(c[0]) && isFinite(c[1]) && c[1] > c[0]).sort((a, b) => a[0] - b[0]);
    const merged = []; iv.forEach(c => { const l = merged[merged.length - 1]; if (l && c[0] - l[1] < 0.35) l[1] = Math.max(l[1], c[1]); else merged.push([c[0], c[1]]); });
    const DUCK = Math.pow(10, -6 / 20);
    duck.gain.setValueAtTime(1, at(from));
    merged.forEach(([a, b]) => { if (b + 0.05 < from) return; duck.gain.setTargetAtTime(DUCK, at(Math.max(a - 0.08, from)), 0.04); duck.gain.setTargetAtTime(1, at(Math.max(b + 0.05, from)), 0.2); });

    /* ---------- primitivas ---------- */
    const panner = (p0, p1, t, dur) => { const p = ctx.createStereoPanner(); p.pan.setValueAtTime(p0, at(t)); if (p1 !== p0) p.pan.linearRampToValueAtTime(p1, at(t + dur)); return p; };
    // oscilador com envelope (ataque ~5 ms, queda exponencial)
    const q = t => Math.round(t * sr) / sr; // tempos na grelha de amostras (evita picos de 1 amostra nas rampas exponenciais)
    const tone = (t, type, f0, f1, dur, g, out, atk = 0.005, pan = 0) => {
      t = q(t); atk = Math.max(0.002, atk); dur = q(Math.max(dur, atk + 0.012));
      const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, at(t)); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + atk)); e.gain.exponentialRampToValueAtTime(0.0001, at(t + dur));
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      o.connect(e); e.connect(p); p.connect(out); o.start(at(t)); o.stop(at(t + dur + 0.05)); return p;
    };
    // ruído filtrado com envelope e pan em movimento
    const noise = (t, dur, type, f0, f1, g, out, Q = 1, pan0 = 0, pan1 = pan0, shape = 0.5, pink = false) => {
      t = q(t); dur = q(Math.max(dur, 0.016));
      const s = ctx.createBufferSource(); s.buffer = pink ? pb : nb; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = Q; f.frequency.setValueAtTime(f0, at(t)); f.frequency.exponentialRampToValueAtTime(f1, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + q(Math.max(0.004, dur * shape)))); e.gain.exponentialRampToValueAtTime(0.0001, at(t + dur));
      const p = panner(pan0, pan1, t, dur);
      s.connect(f); f.connect(e); e.connect(p); p.connect(out); s.start(at(t), rnd(t, 9) * 1.5); s.stop(at(t + dur + 0.05)); return p;
    };
    // "vidro": seno + harmónicos curtos (2.º, 3.º e um parcial inarmónico muito curto)
    const glass = (t, f, g, dur, out, pan = 0, atk = 0.005) => {
      const a = tone(t, 'sine', f, f, dur, g, out, atk, pan);
      tone(t, 'sine', f * 2, f * 2, dur * 0.35, g * 0.22, out, atk, pan);
      tone(t, 'sine', f * 3.01, f * 3.01, dur * 0.12, g * 0.1, out, atk, pan);
      tone(t, 'sine', f * 5.4, f * 5.4, 0.04, g * 0.06, out, 0.003, pan);
      return a;
    };

    /* ---------- SFX (bus sfx; room pequeno; cauda longa só em momentos-chave) ---------- */
    const X = {
      air: (t, d, f0, f1, g, p0 = -0.6, p1 = 0.6, q = 0.9) => { if (on(t)) send(noise(t, d, 'bandpass', f0, f1, g, sfx, q, p0, p1, 0.5, true), roomS, 0.4); },
      whoosh: (t, d, up, g, p0 = -0.8, p1 = 0.8) => { if (on(t)) send(noise(t, d, 'bandpass', up ? 350 : 3800, up ? 3800 : 350, g, sfx, 1.2, p0, p1, 0.55, true), roomS, 0.5); },
      lowAir: (t, d, g) => { if (!on(t)) return; noise(t, d, 'lowpass', 900, 120, g * 0.45, sfx, 0.7, -0.3, 0.3, 0.12, true); tone(t, 'sine', 90, 38, d, g * 0.4, sfx, 0.01); },
      tick: (t, f = 2400, g = 0.12, pan = 0) => { if (!on(t)) return; const v = vary(t, 1); glass(t, f * v, g, 0.05, sfx, pan, 0.003); noise(t, 0.012, 'highpass', 5000, 7000, g * 0.5, sfx, 0.7, pan, pan, 0.2); },
      click: (t, g = 0.2, pan = 0, detune = 0.03) => { if (!on(t)) return; const v = vary(t, 2, detune); noise(t, 0.016, 'highpass', 3200 * v, 5200 * v, g * 0.45, sfx, 0.8, pan, pan, 0.2); send(tone(t, 'sine', 2300 * v, 1750 * v, 0.02, g * 0.5, sfx, 0.002, pan), roomS, 0.6); },
      pop: (t, f = 620, g = 0.3, pan = 0) => { if (!on(t)) return; const v = vary(t, 3); send(tone(t, 'sine', f * 1.7 * v, f * v, 0.09, g, sfx, 0.005, pan), roomS, 0.7); tone(t, 'sine', f * 3.4 * v, f * 2 * v, 0.035, g * 0.2, sfx, 0.003, pan); },
      tap: (t, f = 1760, g = 0.18, pan = 0) => { if (!on(t)) return; const v = vary(t, 4); send(glass(t, f * v, g, 0.22, sfx, pan), roomS, 0.8); noise(t, 0.01, 'bandpass', 3000, 3500, g * 0.6, sfx, 2, pan, pan, 0.2); },
      note: (t, f, g = 0.18, dur = 0.8, pan = 0, tail = revS) => { if (!on(t)) return; const v = vary(t, 5, 0.006); send(glass(t, f * v, g, dur, sfx, pan), tail, 0.9); },
      tink: (t) => { if (!on(t)) return; send(glass(t, 2637.02, 0.3, 0.9, sfx, 0), revS, 1); send(glass(t + 0.004, 3951.07, 0.08, 0.5, sfx, 0.1), revS, 1); tone(t, 'sine', 72, 40, 0.8, 0.2, sfx, 0.008); },
      sub: (t, g = 0.55, d = 1.4) => { if (on(t)) tone(t, 'sine', 68, 32, d, g, sfx, 0.012); },
      scroll: (t, d, g = 0.08) => { if (!on(t)) return; noise(t, d, 'bandpass', 900, 1600, g, sfx, 1.4, 0.2, -0.2, 0.3, true); for (let k = 0, u = t + 0.05; u < t + d - 0.1; k++, u += 0.11 + k * 0.012) X.tick(u, 3200, 0.03, 0.2); },
      swoosh: (t, d, g = 0.14) => { if (!on(t)) return; const p = noise(t, d, 'bandpass', 1200, 4200, g, sfx, 3, -0.7, 0.7, 0.6, true); p.pan.setValueAtTime(-0.7, at(t)); p.pan.linearRampToValueAtTime(0.7, at(t + d * 0.5)); p.pan.linearRampToValueAtTime(-0.4, at(t + d)); send(p, roomS, 0.6); },
      reverse: (t, d, g = 0.2) => { if (on(t)) send(noise(t, d, 'bandpass', 3200, 380, g, sfx, 1.6, 0.5, -0.3, 0.92, true), roomS, 0.5); },
      crowd: (t, d, g = 0.03) => { if (!on(t)) return; for (let i = 0; i < 3; i++) noise(t + i * 0.05, d - i * 0.05, 'bandpass', 500 + i * 300, 700 + i * 400, g, sfx, 1.5, -0.5 + i * 0.5, 0.5 - i * 0.5, 0.3, true); },
      breath: (t, d, g = 0.06) => { if (on(t)) noise(t, d, 'bandpass', 700, 1900, g, sfx, 0.7, -0.2, 0.2, 0.7, true); },
      riser: (t, d, g = 0.1) => { if (!on(t)) return; send(noise(t, d, 'bandpass', 380, 5200, g, sfx, 1.6, -0.3, 0.3, 0.96, true), revS, 0.4); },
      hit: (t) => {
        if (!on(t)) return;
        tone(t, 'sine', 130, 34, 1.5, 0.75, sfx, 0.006);                                   // sub 130 → 34 Hz
        tone(t, 'triangle', 260, 70, 0.14, 0.22, sfx, 0.003);                              // corpo
        send(noise(t, 2.0, 'highpass', 3500, 8000, 0.12, sfx, 0.7, -0.5, 0.5, 0.05), revS, 1); // ar agudo
        [329.63, 415.30, 493.88, 622.25, 739.99].forEach((f, i) => send(glass(t + i * 0.012, f, 0.07, 2.2, sfx, (i - 2) * 0.25), revS, 0.9)); // Emaj9 em vidro
        X.toqueORA(t, 1);
      },
      // Toque ORA (som-assinatura aprovado, brand.json → som): "O" Mi5 (seno + 10 % triângulo) →
      // "RA" Si5 meia batida depois (0,24 s) → cauda de reverb 2,4 s. O sub 130 → 34 Hz e o sopro vêm do hit.
      toqueORA: (t, g = 1) => {
        if (!on(t)) return;
        [[0, 659.25, 1.5, -0.1], [BT / 2, 987.77, 1.9, 0.1]].forEach(([d, f, len, pan]) => {
          send(tone(t + d, 'sine', f, f, len, 0.22 * g, sfx, 0.005, pan), revL, 1);
          send(tone(t + d, 'triangle', f, f, len, 0.022 * g, sfx, 0.005, pan), revL, 1);
          tone(t + d, 'sine', f * 2, f * 2, 0.25, 0.03 * g, sfx, 0.005, pan);        // harmónico curto (vidro)
        });
      },
    };

    /* ---------- música ---------- */
    const pump = (t) => {
      if (!on(t)) return;
      [[pumpB, 0.28, 0.3], [pumpP, 0.62, 0.36]].forEach(([n, depth, rel]) => {
        n.gain.setValueAtTime(1, at(Math.max(from, t - 0.004)));
        n.gain.linearRampToValueAtTime(depth, at(t + 0.006));
        n.gain.linearRampToValueAtTime(1, at(t + rel));
      });
    };
    // kick em camadas: clique + knock + corpo + sub
    const kick = (t, g = 0.9) => {
      if (!on(t)) return;
      noise(t, 0.008, 'highpass', 4500, 8000, g * 0.16, drums, 0.7, 0, 0, 0.15);
      tone(t, 'triangle', 240, 95, 0.045, g * 0.22, drums, 0.002);
      tone(t, 'sine', 155, 50, 0.3, g * 0.66, drums, 0.004);
      tone(t + 0.004, 'sine', 50, 44, 0.42, g * 0.28, drums, 0.012);
      pump(t);
    };
    const snap = (t, g = 0.22) => { if (!on(t)) return; const p = noise(t, 0.13, 'bandpass', 2100, 1500, g, drums, 1.1, 0, 0, 0.06); send(p, roomM, 1); noise(t, 0.05, 'highpass', 5500, 7000, g * 0.35, drums, 0.7, 0.1, 0.1, 0.1); tone(t, 'sine', 200, 150, 0.06, g * 0.35, drums, 0.003); };
    const hat = (t, g = 0.05, open = false) => { if (on(t)) noise(t, open ? 0.17 : 0.035, 'bandpass', 9500, 10500, g, drums, 0.6, 0.28, 0.28, 0.08); };
    const bass = (t, f, d, g = 0.2) => {
      if (!on(t)) return;
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.006)); e.gain.setTargetAtTime(g * 0.7, at(t + 0.03), 0.08); e.gain.exponentialRampToValueAtTime(0.0001, at(t + d));
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(720, at(t)); lp.frequency.exponentialRampToValueAtTime(220, at(t + d));
      const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; const g2 = ctx.createGain(); g2.gain.value = 0.7;
      const o3 = ctx.createOscillator(); o3.type = 'sine'; o3.frequency.value = f * 2; const g3 = ctx.createGain(); g3.gain.value = 0.22;
      o1.connect(lp); o2.connect(g2); g2.connect(lp); o3.connect(g3); g3.connect(lp); lp.connect(e); e.connect(pumpB);
      [o1, o2, o3].forEach(o => { o.start(at(t)); o.stop(at(t + d + 0.05)); });
    };
    // pad: 2 serras desafinadas (L/R) + triângulo ao centro; LPF em movimento; sidechain leve
    const pad = (t, dur, notes, c0, c1, g, fin = 0.08, fout = 0.08) => {
      if (t + dur <= from) return;
      const s = Math.max(t, from), cs = c0 * Math.pow(c1 / c0, (s - t) / dur);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.6;
      lp.frequency.setValueAtTime(cs, at(s)); lp.frequency.exponentialRampToValueAtTime(c1, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(s)); e.gain.linearRampToValueAtTime(g, at(s + fin)); e.gain.setValueAtTime(g, at(t + dur - fout)); e.gain.linearRampToValueAtTime(0.0001, at(t + dur));
      lp.connect(e); e.connect(pumpP); send(e, revM, 0.55);
      notes.forEach((f, i) => {
        [[-9, -0.55, 'sawtooth', 1], [9, 0.55, 'sawtooth', 1], [0, 0, 'triangle', 0.9]].forEach(([det, pn, ty, gv]) => {
          const o = ctx.createOscillator(); o.type = ty; o.frequency.value = f; o.detune.value = det + (i % 2 ? 2 : -2);
          const gg = ctx.createGain(); gg.gain.value = gv; const p = ctx.createStereoPanner(); p.pan.value = pn;
          o.connect(gg); gg.connect(p); p.connect(lp); o.start(at(s)); o.stop(at(t + dur + 0.05));
        });
      });
    };
    const pluck = (t, f, g = 0.05, pan = 0, dur = 0.32) => { if (!on(t)) return; const p = glass(t, f, g, dur, music, pan); send(p, roomM, 0.8); send(p, revM, 0.25); };
    // shimmer granular: grãos de vidro na pentatónica de Mi (determinístico por chave)
    const shimmer = (t0, t1, rate, g, key, conv = 0) => {
      const n = Math.floor((t1 - t0) * rate);
      for (let k = 0; k < n; k++) {
        const r = (j) => rnd(k * 0.731 + key * 13.37, j);
        const t = t0 + (k + r(1) * 0.85) / rate; if (!on(t) || t >= t1) continue;
        const x = conv ? (t - t0) / (t1 - t0) : 0; // convergência: pitch e pan fecham no centro
        const idx = conv ? Math.min(SHIM.length - 1, Math.floor(r(2) * SHIM.length * (1 - x) + x * 5.2)) : Math.floor(r(2) * SHIM.length);
        const f = SHIM[idx] * (1 + (r(3) - 0.5) * 0.006), pan = (r(4) * 1.6 - 0.8) * (1 - x * 0.9), dur = 0.22 + r(5) * 0.5;
        const p = tone(t, 'sine', f, f, dur, g * (0.5 + r(6) * 0.5), music, 0.005 + r(7) * 0.025, pan);
        tone(t, 'sine', f * 2, f * 2, dur * 0.25, g * 0.12, music, 0.005, pan);
        send(p, revM, 0.9);
      }
    };
    // ar: ruído rosa em banda que respira e atravessa o estéreo (nunca parado)
    const air = (t, dur, g, f0 = 900, f1 = 2400, pl = -0.5, pr = 0.5, fin = 0.08, fout = 0.08) => {
      if (t + dur <= from) return; const s = Math.max(t, from);
      const src = ctx.createBufferSource(); src.buffer = pb; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
      f.frequency.setValueAtTime(f0, at(t)); f.frequency.exponentialRampToValueAtTime(f1, at(t + dur * 0.5)); f.frequency.exponentialRampToValueAtTime(f0 * 1.15, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(s)); e.gain.linearRampToValueAtTime(g, at(s + fin)); e.gain.setValueAtTime(g, at(t + dur - fout)); e.gain.linearRampToValueAtTime(0.0001, at(t + dur));
      const p = panner(pl, pr, t, dur);
      src.connect(f); f.connect(e); e.connect(p); p.connect(music); send(p, revM, 0.3);
      src.start(at(s), (rnd(t, 11) * 3 + (s - t)) % 4); src.stop(at(t + dur + 0.05));
    };

    // compasso de abertura (c1) e de fecho (c30) são idênticos → loop perfeito
    const loopBar = (t0, fin, fout) => {
      air(t0, BAR, 0.24, 900, 2400, -0.5, 0.5, fin, fout);
      pad(t0, BAR, CH.E.pad, 560, 820, 0.017, fin, fout);
      shimmer(t0, t0 + BAR, 9, 0.055, 1);
    };

    for (let i = 0; i < 30; i++) {
      const t0 = i * BAR, c = CH[PROG[i]], bar = i + 1;
      const beats = [0, 1, 2, 3].map(b => t0 + b * BT);
      if (bar === 1) { loopBar(t0, 0.015, 0.06); continue; }
      if (bar === 30) { loopBar(t0, 0.08, 0.015); continue; }

      if (bar <= 4) { // intro: ar + shimmer, pad filtrado a abrir
        const cut = [0, 520, 760, 700, 820][bar];
        air(t0 - 0.04, BAR + 0.08, bar === 2 ? 0.24 : 0.2, bar === 2 ? 1100 : 800, bar === 2 ? 3200 : 2000, bar % 2 ? 0.5 : -0.5, bar % 2 ? -0.5 : 0.5);
        pad(t0 - 0.04, BAR + 0.08, c.pad, cut, bar === 4 ? 2400 : cut * 1.4, bar === 4 ? 0.019 : 0.017);
        if (bar === 2) shimmer(t0, t0 + 1.44, 16, 0.045, 2, 1);           // partículas convergem → tink em 3,36
        if (bar === 2) shimmer(t0 + 1.5, t0 + BAR, 5, 0.025, 3);
        if (bar === 3) shimmer(t0, t0 + BAR, 5, 0.022, 4);
        if (bar === 4) { shimmer(t0, t0 + BAR, 7, 0.025, 5); hat(beats[2] + BT * 0.5, 0.02); hat(beats[3], 0.028); hat(beats[3] + BT * 0.25 + 0.022, 0.032); hat(beats[3] + BT * 0.5, 0.036); hat(beats[3] + BT * 0.75 + 0.022, 0.04); }
        continue;
      }

      const breakdown = bar >= 21 && bar <= 24, breath = bar === 15 || bar === 18;
      const pre = bar === 25, hitBar = bar === 26, outro = bar >= 27 && bar <= 29;

      if (breakdown) { // sem percussão; pad a abrir; baixo sustentado; sinos esparsos
        const k = bar - 21; const c0 = 700 * Math.pow(1.45, k), c1 = c0 * 1.45;
        pad(t0 - 0.04, BAR + 0.08, c.pad, c0, c1, 0.019);
        if (on(t0)) { const e = tone(t0, 'sine', c.bass, c.bass, BAR + 0.05, 0.16, music, 0.25); }
        [0, 1, 2, 3].forEach(b => { if (b % 2 === 0 || bar >= 23) pluck(beats[b] + (b % 2 ? 0.02 : 0), c.arp[(b + k) % 4] * (b === 3 ? 2 : 1), 0.045, (b % 2 ? 0.4 : -0.4), 0.9); });
        shimmer(t0, t0 + BAR, 3 + k, 0.022, 20 + bar);
        continue;
      }
      if (pre) { // c25: reentrada com kick nas batidas 1–3, vazio na 4 (prepara o hit)
        pad(t0 - 0.04, BAR - 0.4, c.pad, 2600, 3200, 0.011, 0.08, 0.12);
        [0, 1, 2].forEach(b => { kick(beats[b], 0.8); bass(beats[b], c.bass, 0.38, 0.2); hat(beats[b] + BT / 2, 0.045); hat(beats[b] + BT * 0.75 + 0.022, 0.03); });
        snap(beats[1], 0.18);
        continue;
      }
      if (hitBar) { // c26: o hit respira sozinho com o pad em Emaj9
        pad(t0, BAR + 0.04, c.pad, 1800, 1300, 0.012, 0.01, 0.1);
        bass(t0, c.bass, BAR, 0.16);
        pump(t0);
        continue;
      }

      // drop (c5–c20) e outro (c27–c29)
      const lvl = outro ? 0.78 : 1;
      const cut0 = outro ? 1500 : bar < 9 ? 1300 : 1800, cut1 = cut0 * 1.35;
      pad(t0 - 0.04, BAR + 0.08, c.pad, cut0, cut1, 0.0105 * (breath ? 1.1 : 1));
      if (breath) { // respiração depois do número: só o kick no 1 e baixo longo
        kick(beats[0], 0.7); bass(beats[0], c.bass, BAR - 0.1, 0.17);
        shimmer(t0 + 0.2, t0 + BAR, 4, 0.012, 40 + bar);
        continue;
      }
      const last29 = bar === 29;
      beats.forEach((t, b) => {
        if (last29 && b === 3) return;                                      // respiro antes do loop
        const kOn = outro ? (b % 2 === 0) : true;
        if (kOn) kick(t, (bar === 5 && b === 0 ? 1 : 0.88) * lvl);
        if (b === 1 || b === 3) snap(t + 0.004, (outro ? 0.14 : 0.2));
        // hats com swing leve: colcheias no contratempo + semicolcheias atrasadas 22 ms
        hat(t + BT / 2, (b === 3 ? 0.06 : 0.05) * lvl, b === 3 && bar % 2 === 0);
        if (!outro) { hat(t + BT / 4 + 0.022, 0.022 + 0.01 * rnd(t, 12)); hat(t + BT * 0.75 + 0.022, 0.028 + 0.01 * rnd(t, 13)); }
      });
      // baixo com sidechain: 1 (longo) · 2e · 3 · 3e (oitava) · 4e (quinta)
      const bl = [[0, 1, 0.42], [3, 1, 0.2], [4, 1, 0.22], [5, 2, 0.16], [7, 1.5, 0.16]];
      bl.forEach(([slot, mul, d]) => { const t = t0 + slot * BT / 2; if (last29 && slot >= 6) return; bass(t, c.bass * mul, d, 0.2 * lvl); });
      // arpejo de vidro a partir do c9 (iMac): colcheias, notas do acorde
      if (bar >= 9 || outro) {
        for (let s = 0; s < 8; s++) {
          if (outro && s % 2) continue; if (last29 && s >= 6) continue;
          const t = t0 + s * BT / 2 + (s % 2 ? 0.02 : 0);
          const f = c.arp[[0, 2, 1, 3, 2, 0, 3, 1][s]];
          pluck(t, f, (s % 2 ? 0.026 : 0.036) * lvl, s % 2 ? 0.35 : -0.35);
        }
      }
      if (bar === 20) { X.riser(t0 + BT * 2, BT * 2, 0.06); }
    }

    /* ---------- SFX cues (ver design/v3/cues.md) ---------- */
    // c1–c2 · lente
    X.air(0.0, 1.0, 400, 1400, 0.1, 0, 0);                    // o "O" chega do fundo (z −1200 → 0)
    X.air(1.92, 1.44, 600, 3400, 0.09, -0.7, 0);              // partículas curvam para o "O"
    X.reverse(2.88, 0.48, 0.12);                               // colapso num ponto (0,48 s)
    for (let k = 0; k < 12; k++) X.tick(2.52 + k * 0.07, 1760 * Math.pow(1.03, k), 0.035 + k * 0.003, 0); // contagem 1,00 → 4,47
    X.tink(3.36);                                              // batida 4: "tink" + sub suave
    // c3–c4 · sem estratégia: cliques dispersos, ligeiramente desafinados
    [3.95, 4.3, 4.52, 4.95, 5.4, 5.62, 6.1, 6.33, 6.7].forEach((t, i) => X.click(t, 0.1 + 0.05 * rnd(t, 21), (rnd(t, 22) * 1.6 - 0.8), 0.07));
    [6.9, 6.96, 7.02, 7.08].forEach((t, i) => X.tick(t, 1500 + i * 120, 0.05, -0.3 + i * 0.2)); // cartões alinham-se em grelha
    X.whoosh(7.08, 0.6, true, 0.14, -0.6, 0);                  // voam para dentro do "O"
    // c5 · drop: íris
    X.lowAir(7.68, 0.9, 0.3);                                  // whoosh grave de ar
    X.air(8.5, 0.7, 2500, 7000, 0.05, -0.8, 0.8);             // light sweep na placa
    // c7 · fachada
    X.whoosh(11.52, 0.75, true, 0.09, -0.8, 0.8);              // dolly lateral
    X.pop(11.95, 640, 0.2, 0);                                 // pill de vidro
    // c8–c9 · iMac
    X.whoosh(13.40, 0.5, false, 0.08, 0.3, -0.3);              // montra → ecrã (match cut)
    X.air(13.44, 0.9, 500, 1600, 0.06, 0, 0);                  // tilt-reveal
    X.click(14.88, 0.2, 0.1); X.scroll(15.0, 1.4, 0.06);        // click UI + scroll suave
    X.whoosh(16.85, 0.43, false, 0.08, 0.2, -0.2);             // iMac → telemóvel (morph)
    // c10 · telemóvel
    X.air(17.28, 1.0, 700, 2000, 0.05, 0.6, -0.4);             // orbit
    X.tap(18.24, 1760, 0.14, 0.1);                             // tap de vidro
    // c11–c12 · criativos e funil
    [[19.26, -0.6], [19.38, 0], [19.50, 0.6]].forEach(([t, p]) => { X.whoosh(t, 0.28, true, 0.05, p, p); X.pop(t + 0.22, 560, 0.14, p); });
    [987.77, 1108.73, 1318.51, 1479.98, 1661.22].forEach((f, i) => X.note(21.12 + i * 0.24, f, 0.12, 0.7, -0.4 + i * 0.2, roomS)); // 5 lâminas, ascendente
    X.whoosh(22.56, 0.48, true, 0.07, 0.4, -0.2);              // lâmina de topo → ecrã
    // c13 · Reel POV
    X.crowd(23.04, 1.92, 0.022);                               // ambiente do Reel (placeholder, −18 dB)
    X.click(23.04, 0.16, 0); X.click(24.00, 0.16, 0);           // corte na batida
    X.tick(24.96, 2200, 0.06, 0);                              // congela no plano 3
    // c14 · 835 € → 3.733 €
    X.whoosh(24.96, 0.5, false, 0.07, 0.5, -0.6);              // telemóvel desliza para a esquerda
    for (let k = 0; k < 18; k++) X.tick(25.3 + k * 0.066, 2000 * Math.pow(1.012, k), 0.03, 0.4); // ticks tabulares
    X.tap(26.55, 2217.46, 0.1, 0.4);                           // o contador assenta
    // c15 · 4,47× (respiração)
    X.whoosh(26.70, 0.3, true, 0.06, 0, 0);                    // o 4,47× sai em z para a frente
    X.note(26.88, 659.25, 0.16, 1.8, -0.15); X.note(27.12, 987.77, 0.16, 2.2, 0.15); // acorde ascendente 2 notas
    // c16 · chips
    X.pop(28.92, 700, 0.18, -0.25); X.pop(29.16, 880, 0.18, 0.25);
    X.whoosh(30.40, 0.32, false, 0.05, 0, 0);                  // os chips caem → barras
    // c17 · Labar
    X.reverse(30.95, 1.25, 0.1);                               // whoosh invertido: a barra encolhe
    X.note(32.24, 1318.51, 0.1, 0.6, 0.2, roomS);              // a medida acende a amarelo
    // c18 · −62 %
    X.sub(32.64, 0.3, 1.5); X.air(32.64, 1.6, 500, 1500, 0.05, -0.3, 0.3);
    // c19 · conversão
    X.air(34.56, 0.7, 500, 2200, 0.05, 0, 0);                  // barras sobem
    X.note(34.80, 987.77, 0.1, 0.4, -0.1, roomS); X.note(34.92, 1318.51, 0.13, 1.1, 0.1); // nota ascendente
    X.whoosh(36.05, 0.43, true, 0.05, -0.3, 0.3);              // barras fundem-se num anel
    // c20 · anel
    X.swoosh(36.48, 1.4, 0.07);                                // traço a desenhar o anel
    X.note(37.92, 1318.51, 0.14, 1.4, 0); X.note(37.925, 1975.53, 0.06, 1.0, 0.1); // ding ao fechar
    // c21–c24 · breakdown
    [38.88, 39.84, 40.80, 41.76].forEach((t, i) => X.tap(t, 1480, 0.07, [-0.6, 0.6, -0.3, 0.3][i])); // tiles a passar
    X.whoosh(41.80, 0.5, true, 0.08, 0, 0); X.lowAir(42.24, 0.7, 0.12); // câmara entra no "O"
    X.riser(42.24, 3.6, 0.07);                                 // riser contido
    'Está na hORA'.replace(/ /g, '').split('').forEach((ch, i) => X.tick(42.45 + i * 0.1, 2400 * Math.pow(1.02, i), 0.03, -0.4 + i * 0.08)); // letra a letra
    X.breath(45.2, 0.85, 0.05);                                // respiração
    // c25–c26 · assinatura
    { if (on(46.08)) { X.pop(46.08, 520, 0.2, 0); } X.tap(46.36, 1100, 0.07, 0.1); X.tap(46.50, 1200, 0.04, 0.15); } // o "h" cai e ressalta
    X.air(46.30, 1.5, 900, 5000, 0.05, -0.8, 0.8);             // light sweep durante a rotação do "ORA"
    X.air(47.70, 0.3, 500, 3000, 0.12, 0, 0);                  // sopro ascendente 0,3 s → íris (Toque ORA)
    X.hit(48.00);                                              // HIT + toque ORA (Mi5 → Si5)
    // c27–c29 · CTA
    X.air(49.92, 1.2, 400, 1200, 0.04, 0, 0);                  // push-in
    X.pop(50.40, 600, 0.14, 0);                                // botão pill aparece
    X.click(51.84, 0.18, 0, 0.01); X.toqueORA(51.86, 0.35); X.whoosh(51.9, 0.35, true, 0.04, -0.3, 0.3); // click de vidro + morph → URL
    // c30 · o "O" dissolve-se (o shimmer da música é igual ao de 0,0 s)
    X.whoosh(55.68, 0.7, false, 0.05, 0, 0);
  };
})();
