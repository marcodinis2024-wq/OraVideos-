/* ORA "Meta ou Google? Pergunta errada." — banda sonora (música + SFX) sintetizada em Web Audio.
 * 94,0 s = 47 compassos a 120 BPM (batida 0,5 s · compasso 2 s · semicolcheia 0,125 s). Vídeo a 60 fps.
 * Tom: Mi maior (Emaj9 · C#m9 · F#m9 · B9sus4; Amaj9 no breakdown). Indie-electronic / funk moderno.
 *
 * window.makeAudio(ctx, dest, T0, from[, opts])
 *   ctx  — AudioContext ou OfflineAudioContext
 *   dest — nó de destino (normalmente ctx.destination)
 *   T0   — tempo do contexto que corresponde a t = 0 do vídeo
 *   from — segundo de início (playback a meio); só agenda eventos com t >= from
 *   opts — opcional: { stem: 'music' | 'sfx' } para renders de verificação (por omissão: tudo)
 *
 * Determinístico: o "acaso" (pitch ±3 %, glitch, dedilhados, ruído, reverbs) vem de hashes e de um PRNG
 * com semente fixa, por isso o render offline e o playback ao vivo soam iguais. Tempos na grelha de amostras.
 * Master: HPF 28 Hz → compressor suave → limitador → tanh suave (headroom ~−4…−6 dBFS de pico);
 * a normalização final (−14 LUFS, pico < −0,5 dB) é a do __renderAudio da v3.
 * Ducking: −7 dB na música sob a voz (window.CAPS se existir; senão as CAPS do plano, abaixo).
 * Loop: os compassos 46–47 (90–94 s) são cópia exata dos compassos 1–2 (mesmas notas, filtro e sementes).
 */
(function () {
  'use strict';
  const BT = 0.5, BAR = 2, S16 = 0.125, DUR = 94;

  /* CAPS do plano (briefing/08-trafego-pago-conceito.md §5). Usadas no ducking só se não houver window.CAPS. */
  const CAPS_PLANO = [[0.25,1.75,"META OU GOOGLE?"],[2,3,"PERGUNTA ERRADA."],[3,4,"VAMOS POR PARTES."],
    [4,5,"UMA PASTELARIA DE LEIRIA."],[5,6,"INVENTADA."],[6,8,"150 € EM CADA UM."],
    [8,9,"META ADS:"],[9,10,"APARECES A QUEM NÃO PROCUROU."],[10,11,"ESCOLHEMOS O PÚBLICO:"],
    [11,12,"GOSTOS, IDADE, ZONA."],[12,13.5,"CADA SCROLL"],[13.5,14.5,"É UM LEILÃO."],
    [14.5,16,"GANHA O MAIS RELEVANTE."],[16,17.25,"IMPRESSÕES: VEZES QUE APARECEU."],[17.25,18,"30.000."],
    [18,19.25,"ALCANCE: PESSOAS DIFERENTES."],[19.25,20,"12.000."],[20,22,"CADA PESSOA VIU 2,5 VEZES."],
    [22,23.25,"CPM: O PREÇO DE MIL."],[23.25,24,"5 €."],[24,26,"E É AQUI QUE A MAIORIA FALHA…"],
    [26,27,"VER NÃO É COMPRAR."],[27,28,"CONTA O CLIQUE."],[28,29.25,"CTR: 1 EM CADA 100 CLICA."],
    [29.25,30,"300."],[30,32,"CADA CLIQUE: 0,50 €."],[32,33.25,"4 % ENCOMENDAM."],[33.25,34,"12 BOLOS."],
    [34,36,"CADA VENDA CUSTOU 12,50 €."],[36,38,"ISSO DÁ 420 €."],[38,39.5,"ROAS: 2,8."],
    [40,41.5,"ROAS NÃO É LUCRO."],[41.5,43,"COM METADE DE MARGEM,"],[43,44,"EMPATAS NOS 2×."],
    [44,45,"E O PIXEL APRENDE"],[45,46,"COM CADA ENCOMENDA."],[46,48,"ENCONTRA MAIS GENTE PARECIDA."],
    [48,49,"AGORA, GOOGLE ADS."],[49,50,"OUTRO JOGO."],[50,52,"AQUI, A PESSOA JÁ ESTÁ À PROCURA."],
    [52,53,"ESCOLHEMOS AS PALAVRAS"],[53,54,"QUE ELA ESCREVE."],[54,55,"«BOLO» É CURIOSIDADE."],
    [55,56,"«ENCOMENDAR BOLO LEIRIA» É COMPRA."],[56,58,"AQUI O LEILÃO É LANCE × QUALIDADE."],
    [58,59,"ELES LICITAM MAIS."],[59,60,"NÓS, MAIS QUALIDADE."],[60,62,"FICAMOS À FRENTE E PAGAMOS MENOS."],
    [62,63,"5.000 IMPRESSÕES."],[63,64,"5 % CLICAM."],[64,65.25,"250 CLIQUES,"],[65.25,66,"A 0,60 €."],
    [66,67.25,"6 % ENCOMENDAM:"],[67.25,68,"15 BOLOS."],[68,70,"CADA VENDA A 10 €."],[70,71.5,"ROAS: 3,5."],
    [72,73,"ENTÃO, SÓ GOOGLE?"],[73,74,"É AQUI QUE FALHAM."],[74,76,"META CRIA PROCURA."],
    [76,78,"GOOGLE CAPTURA PROCURA."],[78,80,"SEM VONTADE CRIADA, NINGUÉM PESQUISA."],
    [80,81,"JUNTOS: 300 €,"],[81,82,"27 ENCOMENDAS."],[82,84,"945 €."],[84,85,"NÓS JUNTAMOS"],
    [85,86,"CRIATIVO E ESTRATÉGIA."],[86,87,"E MEDIMOS TUDO."],[87,88,"ESTÁ NA HORA…"],
    [88.5,89.5,"ESTÁ NA ORA."],[90,92,"MARCA UMA CONVERSA."],[92,93,"META OU GOOGLE?"],[93,94,"OS DOIS, COM ESTRATÉGIA."]];
  window.ORA_TRAFEGO_CAPS_PLANO = CAPS_PLANO;

  /* Guião de locução (design/trafego/locucao.md): início, fim, texto. Referência para a gravação e o TTS-guia. */
  window.ORA_TRAFEGO_VO = [
    [0.25, 1.60, 'Meta ou Google?'], [2.62, 3.95, 'Pergunta errada. Vamos por partes.'],
    [4.10, 5.95, 'Uma pastelaria de Leiria. Inventada.'], [6.10, 7.85, 'Cento e cinquenta euros em cada um.'],
    [8.10, 9.95, 'Meta Ads: apareces a quem não procurou.'], [10.10, 11.90, 'Público: gostos, idade, zona.'],
    [12.10, 15.70, 'Cada scroll é um leilão. Ganha o mais relevante.'], [16.10, 17.90, 'Impressões: trinta mil vezes.'],
    [18.05, 19.95, 'Alcance: doze mil pessoas diferentes.'], [20.05, 21.90, 'Cada pessoa viu duas vezes e meia.'],
    [22.05, 23.85, 'CPM: cinco euros por mil.'], [24.30, 25.90, 'E é aqui que a maioria falha…'],
    [26.15, 27.90, 'Ver não é comprar. Conta o clique.'], [28.05, 29.90, 'CTR: um em cem. Trezentos.'],
    [30.05, 31.80, 'Cada clique: cinquenta cêntimos.'], [32.05, 33.90, 'Quatro por cento encomendam. Doze bolos.'],
    [34.05, 35.85, 'Cada venda custou doze e cinquenta.'], [36.05, 37.80, 'Isso dá quatrocentos e vinte euros.'],
    [38.10, 39.40, 'ROAS: dois vírgula oito.'], [40.20, 43.90, 'ROAS não é lucro. Com metade de margem, empatas nos dois.'],
    [44.05, 47.50, 'E o pixel aprende com cada encomenda. Encontra mais gente parecida.'],
    [48.20, 49.90, 'Agora, Google Ads. Outro jogo.'], [50.05, 51.90, 'Aqui, a pessoa já está à procura.'],
    [52.05, 53.90, 'Escolhemos as palavras que ela escreve.'], [54.05, 56.35, '«Bolo» é curiosidade. «Encomendar» é compra.'],
    [56.50, 57.95, 'Leilão: lance vezes qualidade.'], [58.05, 59.90, 'Eles licitam mais. Nós, mais qualidade.'],
    [60.35, 61.90, 'Ficamos à frente e pagamos menos.'], [62.05, 63.90, 'Cinco mil impressões. Cinco por cento clicam.'],
    [64.10, 65.80, 'Cada clique: sessenta cêntimos.'], [66.05, 67.90, 'Seis por cento encomendam: quinze bolos.'],
    [68.10, 69.60, 'Cada venda a dez euros.'], [70.10, 71.40, 'ROAS: três e meio.'],
    [72.15, 73.90, 'Então, só Google? É aqui que falham.'], [74.20, 75.70, 'Meta cria procura.'],
    [76.10, 77.60, 'Google captura procura.'], [78.05, 79.70, 'Sem vontade criada, ninguém pesquisa.'],
    [80.20, 81.90, 'Juntos: vinte e sete encomendas.'], [82.35, 83.90, 'Novecentos e quarenta e cinco.'],
    [84.05, 85.90, 'Nós juntamos criativo e estratégia.'], [86.05, 87.65, 'E medimos tudo. Está na hora…'],
    [88.55, 89.45, 'Está na ORA.'], [90.20, 91.50, 'Marca uma conversa.'], [92.40, 93.80, 'Os dois. Com estratégia.'],
  ];

  /* Harmonia (Hz). pad: 5 vozes · stab: tríade de corte (chops) · ep: voicing das teclas · bass: fundamental */
  const CH = {
    E:  { pad: [164.81, 207.65, 246.94, 311.13, 369.99], stab: [415.30, 493.88, 622.25], ep: [207.65, 311.13, 369.99, 493.88], bass: 82.41 }, // Emaj9
    Cm: { pad: [138.59, 164.81, 207.65, 246.94, 311.13], stab: [329.63, 415.30, 493.88], ep: [164.81, 246.94, 311.13, 415.30], bass: 69.30 }, // C#m9
    Fm: { pad: [185.00, 220.00, 277.18, 329.63, 415.30], stab: [369.99, 440.00, 554.37], ep: [220.00, 329.63, 415.30, 554.37], bass: 92.50 }, // F#m9
    B:  { pad: [220.00, 246.94, 277.18, 329.63, 369.99], stab: [329.63, 440.00, 554.37], ep: [220.00, 329.63, 369.99, 554.37], bass: 61.74 }, // B9sus4
    A:  { pad: [164.81, 207.65, 246.94, 277.18, 329.63], stab: [415.30, 493.88, 554.37], ep: [207.65, 277.18, 329.63, 493.88], bass: 55.00 }, // Amaj9
  };
  // Hook (semicolcheia, nota): frase de 2 compassos pergunta (E/C#m) → resposta (F#m/B). Só notas de Mi maior.
  const HOOK = {
    E:  [[0, 493.88], [3, 659.25], [6, 739.99], [8, 830.61], [11, 739.99], [14, 659.25]],
    Cm: [[0, 554.37], [3, 659.25], [6, 493.88], [10, 415.30], [12, 493.88]],
    Fm: [[0, 880.00], [3, 830.61], [6, 739.99], [8, 659.25], [11, 554.37]],
    B:  [[0, 493.88], [3, 554.37], [6, 659.25], [10, 739.99], [12, 659.25]],
    A:  [[0, 659.25], [3, 554.37], [6, 493.88], [8, 415.30], [11, 493.88]],
  };
  //             c1    c2    c3    c4 | c5 ................................................ c12 | c13
  const PROG = ['E', 'Cm', 'Fm', 'B', 'E', 'Cm', 'Fm', 'B', 'E', 'Cm', 'Fm', 'B', 'E',
  //             c14 ............................ c20 | c21 ......... c24
                'E', 'Cm', 'Fm', 'B', 'E', 'Cm', 'B', 'A', 'Cm', 'A', 'B',
  //             c25 ............................................................. c36 | c37
                'E', 'Cm', 'Fm', 'B', 'E', 'Cm', 'Fm', 'B', 'E', 'Cm', 'Fm', 'B', 'E',
  //             c38 c39  c40 | c41 c42 | c43 c44 | c45 | c46 c47 (= c1 c2)
                'Cm', 'A', 'B', 'E', 'A', 'Fm', 'B', 'E', 'E', 'Cm'];

  window.makeAudio = function (ctx, dest, T0, from, opts) {
    from = Math.max(0, +from || 0); opts = opts || {};
    const sr = ctx.sampleRate, at = t => T0 + t, on = t => t >= from - 1e-4;
    const rnd = (t, k = 0) => { const x = Math.sin(t * 127.1 + k * 311.7 + 17.13) * 43758.5453; return x - Math.floor(x); };
    const vary = (t, k = 0, amt = 0.03) => 1 + (rnd(t, k) * 2 - 1) * amt; // ±3 % em sons repetidos
    let seed = 0x5A7C31; const prng = () => { seed = (seed + 0x6D2B79F5) | 0; let z = Math.imul(seed ^ (seed >>> 15), 1 | seed); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };

    /* ruído branco e rosa (determinísticos) */
    const nb = ctx.createBuffer(1, sr * 2, sr), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = prng() * 2 - 1;
    const pb = ctx.createBuffer(1, sr * 4, sr), pd = pb.getChannelData(0);
    { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; for (let i = 0; i < pd.length; i++) { const w = prng() * 2 - 1; b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926; } }
    const mkRev = (secs, decay, pre = 0) => { const r = ctx.createConvolver(); const ir = ctx.createBuffer(2, Math.ceil(sr * secs), sr); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); const p = Math.floor(pre * sr); for (let i = p; i < d.length; i++) d[i] = (prng() * 2 - 1) * Math.pow(1 - i / d.length, decay); } r.buffer = ir; return r; };

    /* master: HPF 28 Hz → compressor suave → limitador → tanh suave */
    const master = ctx.createGain(); master.gain.value = 0.72;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 28; hp.Q.value = 0.7;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = 0.012; comp.release.value = 0.22;
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -9; lim.knee.value = 2; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.09;
    const clip = ctx.createWaveShaper(); { const cv = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = i / 1024 - 1; cv[i] = Math.tanh(1.2 * x) / Math.tanh(1.2); } clip.curve = cv; }
    master.connect(hp); hp.connect(comp); comp.connect(lim); lim.connect(clip); clip.connect(dest);

    /* barramentos
     * música: [drums, pumpB, pumpP, direto, reverbs] → music → gate (stutter) → mlpf (filtro global) → duck → master
     * SFX:    sfx + salas/caudas → sfxOut → master (sem ducking) */
    const duck = ctx.createGain(); duck.connect(master);
    const mlpf = ctx.createBiquadFilter(); mlpf.type = 'lowpass'; mlpf.Q.value = 0.9; mlpf.connect(duck);
    const gate = ctx.createGain(); gate.connect(mlpf);
    const music = ctx.createGain(); music.gain.value = 0.5; music.connect(gate);
    const drums = ctx.createGain(); drums.gain.value = 1; drums.connect(music);
    const pumpB = ctx.createGain(); pumpB.connect(music);  // sidechain do baixo
    const pumpP = ctx.createGain(); pumpP.connect(music);  // sidechain do pad e das teclas (mais leve)
    const revM = mkRev(2.2, 3.2, 0.012), revMG = ctx.createGain(); revMG.gain.value = 0.26; revM.connect(revMG); revMG.connect(music);
    const roomM = mkRev(0.5, 4, 0.004), roomMG = ctx.createGain(); roomMG.gain.value = 0.26; roomM.connect(roomMG); roomMG.connect(music);
    const sfxOut = ctx.createGain(); sfxOut.connect(master);
    const sfx = ctx.createGain(); sfx.gain.value = 0.5; sfx.connect(sfxOut);
    const roomS = mkRev(0.6, 4, 0.006), roomSG = ctx.createGain(); roomSG.gain.value = 0.32; roomS.connect(roomSG); roomSG.connect(sfxOut);
    const revS = mkRev(2.6, 3, 0.015), revSG = ctx.createGain(); revSG.gain.value = 0.34; revS.connect(revSG); revSG.connect(sfxOut);
    const revL = mkRev(2.4, 2.6, 0.018), revLG = ctx.createGain(); revLG.gain.value = 0.42; revL.connect(revLG); revLG.connect(sfxOut); // cauda 2,4 s do Toque ORA
    const send = (node, to, g) => { const s = ctx.createGain(); s.gain.value = g; node.connect(s); s.connect(to); };
    if (opts.stem === 'music') sfxOut.gain.value = 0;
    if (opts.stem === 'sfx') duck.disconnect();

    /* automação por pontos, retomável a meio: [t, v, modo] com modo 'e' (exp, omissão), 'l' (linear), 's' (salto) */
    const autom = (param, pts) => {
      let i = 0; while (i < pts.length && pts[i][0] <= from) i++;
      let v0;
      if (i === 0) v0 = pts[0][1]; else if (i === pts.length) v0 = pts[i - 1][1];
      else { const [ta, va] = pts[i - 1], [tb, vb, m] = pts[i]; const x = (from - ta) / Math.max(1e-6, tb - ta); v0 = m === 's' ? va : m === 'l' ? va + (vb - va) * x : va * Math.pow(vb / va, x); }
      param.setValueAtTime(v0, at(from));
      for (; i < pts.length; i++) { const [t, v, m] = pts[i]; if (m === 's') param.setValueAtTime(v, at(t)); else if (m === 'l') param.linearRampToValueAtTime(v, at(t)); else param.exponentialRampToValueAtTime(v, at(t)); }
    };
    // filtro global da música: intro filtrada · drop aberto · tape-stop fecha · glitch fecha · half-time reabre · cauda = intro
    autom(mlpf.frequency, [[0, 650], [4, 650], [6, 1000], [7.88, 4200], [8, 20000, 's'], [24, 20000], [24.75, 280], [25.98, 280], [26, 20000, 's'],
      [72, 20000], [73.9, 360], [74, 700, 's'], [78, 2600], [79.9, 16000], [80, 20000, 's'], [89.55, 20000], [90, 650], [94, 650]]);
    autom(mlpf.Q, [[0, 0.9], [72, 0.9], [73.9, 5.5], [74, 0.9, 's'], [78, 0.9], [79.9, 2.5], [80, 0.9, 's'], [94, 0.9]]);
    // gate: stutter do glitch (2,50 s: 4 fotogramas; 72,0 s: fatias de fusa) — rampas de 2 ms para não estalar
    { const steps = [[2.5, 0.25], [2.567, 1]];
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0].forEach((v, k) => steps.push([72 + k * S16 / 2, v ? 1 : 0.08]));
      steps.push([72 + 12 * S16 / 2, 1]);
      let v0 = 1; steps.forEach(([t, v]) => { if (t <= from) v0 = v; });
      gate.gain.setValueAtTime(v0, at(from));
      let prev = v0; steps.forEach(([t, v]) => { if (t <= from) return; gate.gain.setValueAtTime(prev, at(t)); gate.gain.linearRampToValueAtTime(v, at(t + 0.002)); prev = v; }); }

    /* ducking −7 dB sob a voz */
    let caps = null;
    try { if (typeof CAPS !== 'undefined' && Array.isArray(CAPS) && CAPS.length) caps = CAPS; } catch (e) { /* sem CAPS global */ }
    if (!caps && Array.isArray(window.CAPS) && window.CAPS.length) caps = window.CAPS;
    if (!caps) caps = CAPS_PLANO;
    const iv = caps.map(c => [+c[0], +c[1]]).filter(c => isFinite(c[0]) && isFinite(c[1]) && c[1] > c[0]).sort((a, b) => a[0] - b[0]);
    const merged = []; iv.forEach(c => { const l = merged[merged.length - 1]; if (l && c[0] - l[1] < 0.35) l[1] = Math.max(l[1], c[1]); else merged.push([c[0], c[1]]); });
    const DUCK = Math.pow(10, -7 / 20);
    duck.gain.setValueAtTime(1, at(from));
    merged.forEach(([a, b]) => { if (b + 0.05 < from) return; duck.gain.setTargetAtTime(DUCK, at(Math.max(a - 0.08, from)), 0.04); duck.gain.setTargetAtTime(1, at(Math.max(b + 0.05, from)), 0.2); });

    /* ---------- primitivas ---------- */
    const q = t => Math.round(t * sr) / sr; // grelha de amostras
    const panner = (p0, p1, t, dur) => { const p = ctx.createStereoPanner(); p.pan.setValueAtTime(p0, at(t)); if (p1 !== p0) p.pan.linearRampToValueAtTime(p1, at(t + dur)); return p; };
    const tone = (t, type, f0, f1, dur, g, out, atk = 0.005, pan = 0) => {
      t = q(t); atk = Math.max(0.002, atk); dur = q(Math.max(dur, atk + 0.012));
      const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, at(t)); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + atk)); e.gain.exponentialRampToValueAtTime(0.0001, at(t + dur));
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      o.connect(e); e.connect(p); p.connect(out); o.start(at(t)); o.stop(at(t + dur + 0.05)); return p;
    };
    const noise = (t, dur, type, f0, f1, g, out, Q = 1, pan0 = 0, pan1 = pan0, shape = 0.5, pink = false) => {
      t = q(t); dur = q(Math.max(dur, 0.016));
      const s = ctx.createBufferSource(); s.buffer = pink ? pb : nb; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = Q; f.frequency.setValueAtTime(f0, at(t)); f.frequency.exponentialRampToValueAtTime(f1, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + q(Math.max(0.004, dur * shape)))); e.gain.exponentialRampToValueAtTime(0.0001, at(t + dur));
      const p = panner(pan0, pan1, t, dur);
      s.connect(f); f.connect(e); e.connect(p); p.connect(out); s.start(at(t), rnd(t, 9) * 1.5); s.stop(at(t + dur + 0.05)); return p;
    };
    const glass = (t, f, g, dur, out, pan = 0, atk = 0.005) => {
      const a = tone(t, 'sine', f, f, dur, g, out, atk, pan);
      tone(t, 'sine', f * 2, f * 2, dur * 0.35, g * 0.22, out, atk, pan);
      tone(t, 'sine', f * 3.01, f * 3.01, dur * 0.12, g * 0.1, out, atk, pan);
      tone(t, 'sine', f * 5.4, f * 5.4, 0.04, g * 0.06, out, 0.003, pan);
      return a;
    };
    // bitcrusher (degraus) para o glitch
    const crush = ctx.createWaveShaper(); { const cv = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = i / 1024 - 1; cv[i] = Math.round(x * 7) / 7; } crush.curve = cv; }
    const crushIn = ctx.createGain(); crushIn.connect(crush); const crushOut = ctx.createGain(); crushOut.gain.value = 0.8; crush.connect(crushOut); crushOut.connect(sfx);

    /* ---------- SFX ---------- */
    const X = {
      air: (t, d, f0, f1, g, p0 = -0.6, p1 = 0.6, Q = 0.9) => { if (on(t)) send(noise(t, d, 'bandpass', f0, f1, g, sfx, Q, p0, p1, 0.5, true), roomS, 0.4); },
      // whoosh: pan acompanha a direção do movimento (p0 → p1)
      whoosh: (t, d, up, g, p0 = -0.8, p1 = 0.8) => { if (!on(t)) return; const v = vary(t, 14, 0.03); send(noise(t, d, 'bandpass', (up ? 350 : 3800) * v, (up ? 3800 : 350) * v, g, sfx, 1.2, p0, p1, 0.55, true), roomS, 0.5); },
      // whoosh da faixa amarela (brand.json): passa-banda 300 → 4000 Hz, pan L→R com a faixa + corpo grave
      stripe: (t, d, g) => { if (!on(t)) return; send(noise(t, d, 'bandpass', 300, 4000, g, sfx, 1.1, -0.9, 0.9, 0.62, true), roomS, 0.6); noise(t + d * 0.3, d * 0.7, 'lowpass', 500, 140, g * 0.7, sfx, 0.7, -0.5, 0.5, 0.4, true); },
      // swipe: curto e agudo (dedo/cartão), mais seco que o whoosh
      swipe: (t, g = 0.12, p0 = -0.5, p1 = 0.5, d = 0.22) => { if (!on(t)) return; const v = vary(t, 15); send(noise(t, d, 'bandpass', 1400 * v, 5200 * v, g, sfx, 1.8, p0, p1, 0.35), roomS, 0.4); noise(t + d * 0.5, 0.012, 'highpass', 6000, 8000, g * 0.3, sfx, 0.7, p1, p1, 0.2); },
      reverse: (t, d, g = 0.2, p0 = 0.5, p1 = -0.3) => { if (on(t)) send(noise(t, d, 'bandpass', 3200, 380, g, sfx, 1.6, p0, p1, 0.92, true), roomS, 0.5); },
      revAir: (t, d, g = 0.12, p0 = 0, p1 = 0) => { if (on(t)) send(noise(t, d, 'bandpass', 500, 3600, g, sfx, 1.1, p0, p1, 0.95, true), revS, 0.5); }, // "ar invertido" (cresce e corta)
      tick: (t, f = 2400, g = 0.12, pan = 0) => { if (!on(t)) return; const v = vary(t, 1); glass(t, f * v, g, 0.05, sfx, pan, 0.003); noise(t, 0.012, 'highpass', 5000, 7000, g * 0.5, sfx, 0.7, pan, pan, 0.2); },
      click: (t, g = 0.2, pan = 0, detune = 0.03) => { if (!on(t)) return; const v = vary(t, 2, detune); noise(t, 0.016, 'highpass', 3200 * v, 5200 * v, g * 0.45, sfx, 0.8, pan, pan, 0.2); send(tone(t, 'sine', 2300 * v, 1750 * v, 0.02, g * 0.5, sfx, 0.002, pan), roomS, 0.6); },
      pop: (t, f = 620, g = 0.3, pan = 0) => { if (!on(t)) return; const v = vary(t, 3); send(tone(t, 'sine', f * 1.7 * v, f * v, 0.09, g, sfx, 0.005, pan), roomS, 0.7); tone(t, 'sine', f * 3.4 * v, f * 2 * v, 0.035, g * 0.2, sfx, 0.003, pan); },
      tap: (t, f = 1760, g = 0.18, pan = 0) => { if (!on(t)) return; const v = vary(t, 4); send(glass(t, f * v, g, 0.22, sfx, pan), roomS, 0.8); noise(t, 0.01, 'bandpass', 3000, 3500, g * 0.6, sfx, 2, pan, pan, 0.2); },
      // nota/ding: afinada (só ±0,6 % para não desafinar)
      note: (t, f, g = 0.18, dur = 0.8, pan = 0, tail = revS) => { if (!on(t)) return; const v = vary(t, 5, 0.006); send(glass(t, f * v, g, dur, sfx, pan), tail, 0.9); },
      sub: (t, g = 0.3, d = 0.9) => { if (on(t)) tone(t, 'sine', 72, 38, d, g, sfx, 0.012); },
      breath: (t, d, g = 0.06, p0 = -0.2, p1 = 0.2) => { if (on(t)) noise(t, d, 'bandpass', 700, 1900, g, sfx, 0.7, p0, p1, 0.7, true); },
      // riser: ruído em banda a subir + seno a subir uma oitava e meia (Si2 → Mi4), corta seco no fim
      riser: (t, d, g = 0.1, tonal = true) => { if (!on(t)) return; send(noise(t, d, 'bandpass', 380, 6200, g, sfx, 1.6, -0.3, 0.3, 0.96, true), revS, 0.4); if (tonal) { tone(t, 'sawtooth', 123.47, 329.63, d, g * 0.12, sfx, d * 0.9, -0.2); tone(t, 'sawtooth', 123.47 * 1.006, 329.63 * 1.006, d, g * 0.12, sfx, d * 0.9, 0.2); } },
      // teclado: tecla (clique agudo + "thock" grave + retorno da tecla), ±3 %
      key: (t, g = 0.08, pan = 0) => { if (!on(t)) return; const v = vary(t, 6); noise(t, 0.009, 'bandpass', 4200 * v, 3600 * v, g, sfx, 1.5, pan, pan, 0.15); tone(t, 'triangle', 190 * v, 120 * v, 0.03, g * 0.55, sfx, 0.001, pan); noise(t + 0.035 + 0.01 * rnd(t, 7), 0.008, 'bandpass', 2600 * v, 2400 * v, g * 0.3, sfx, 1.5, pan, pan, 0.2); },
      typing: (t0, n, step, g = 0.07, pan = 0) => { for (let k = 0, u = t0; k < n; k++) { X.key(u, g * (0.8 + 0.4 * rnd(u, 8)), pan + (rnd(u, 10) - 0.5) * 0.2); u += step * (0.7 + 0.6 * rnd(u, 11)); } },
      // glitch digital: grãos quadrados/serra de 12–34 ms em alturas aleatórias (fixas por hash) → bitcrusher
      glitch: (t, d, g = 0.12) => {
        if (!on(t)) return; let u = t, k = 0;
        while (u < t + d) {
          const r = j => rnd(u, 40 + j + k * 0.37);
          const len = 0.012 + r(1) * 0.022, f = 180 * Math.pow(2, r(2) * 4.5), pan = (r(6) * 2 - 1) * 0.8;
          tone(u, r(3) < 0.5 ? 'square' : 'sawtooth', f, r(4) < 0.3 ? f * 0.5 : f, len, g * (0.4 + 0.6 * r(5)), crushIn, 0.001, pan);
          if (r(7) < 0.5) noise(u, len, 'highpass', 2500, 6000, g * 0.6, crushIn, 0.7, pan, pan, 0.1);
          u += len + r(8) * 0.012; k++;
        }
        send(noise(t, d + 0.1, 'bandpass', 1800, 900, g * 0.25, sfx, 2, 0, 0, 0.1), roomS, 0.6);
      },
      // moeda: clink metálico (parciais inarmónicos) + ranhura (portagem)
      coin: (t, g = 0.13, pan = 0, slot = true) => {
        if (!on(t)) return; const v = vary(t, 12);
        [[1, 1, 0.35], [1.52, 0.6, 0.26], [2.14, 0.4, 0.2], [2.71, 0.25, 0.14]].forEach(([r, a, d]) => tone(t, 'sine', 2900 * v * r, 2900 * v * r, d, g * a, sfx, 0.002, pan));
        noise(t, 0.012, 'highpass', 6000, 8000, g * 0.6, sfx, 0.7, pan, pan, 0.1);
        if (slot) { send(tone(t + 0.09, 'triangle', 240 * v, 140 * v, 0.06, g * 0.5, sfx, 0.002, pan), roomS, 0.6); noise(t + 0.09, 0.05, 'bandpass', 900, 500, g * 0.4, sfx, 1.5, pan, pan, 0.1); }
      },
      // tilintar: moeda de vidro a assentar com mola (3 ressaltos a encurtar)
      jingle: (t, g = 0.08, pan = 0) => { [0, 0.11, 0.18, 0.225].forEach((d, i) => { if (on(t + d)) { const v = vary(t + d, 13); glass(t + d, 3520 * v, g * Math.pow(0.6, i), 0.18, sfx, pan, 0.002); } }); },
      // contador: ticks com ease-out (espaçamento a crescer, pitch a subir) + punch final
      counter: (t0, dur, n, f0 = 2000, g = 0.035, pan = 0, punch = true) => {
        for (let k = 0; k < n; k++) { const x = k / n, t = t0 + dur * (1 - Math.pow(1 - x, 2.2)); X.tick(t, f0 * Math.pow(1.012, k), g, pan); }
        if (punch) X.tap(t0 + dur, f0 * 1.1, g * 2.4, pan);
      },
      pops: (t0, n, span, f0 = 560, g = 0.12, p0 = -0.6, p1 = 0.6, rise = 1.02) => { for (let k = 0; k < n; k++) { const x = n > 1 ? k / (n - 1) : 0; X.pop(t0 + span * Math.pow(x, 0.85), f0 * Math.pow(rise, k), g * (0.8 + 0.2 * rnd(t0 + k, 16)), p0 + (p1 - p0) * x); } },
      // cha-ching (brand.json: tique + Dó7 + Mi7 → transposto para Mi7 + Sol#7 para ficar em Mi maior)
      chaChing: (t, full = false, g = 0.1) => {
        if (!on(t)) return;
        noise(t, 0.05, 'bandpass', 7000, 5200, g * 0.6, sfx, 1.2, -0.2, 0.2, 0.1);                        // "cha"
        if (full) {
          for (let k = 0; k < 6; k++) noise(t - 0.14 + k * 0.02, 0.012, 'bandpass', 2600, 2300, g * 0.5, sfx, 3, -0.25, -0.25, 0.2); // mecanismo (roquete)
          send(tone(t, 'triangle', 180, 90, 0.1, g * 1.4, sfx, 0.002), roomS, 0.7);                       // gaveta
          for (let k = 0; k < 9; k++) { const u = t + 0.08 + k * 0.055 + rnd(t, 30 + k) * 0.03; glass(u, 3000 + 2200 * rnd(t, 40 + k), g * 0.25 * (1 - k / 11), 0.12, sfx, rnd(t, 50 + k) * 1.4 - 0.7, 0.002); } // chuva de moedas
        }
        [[2637.02, -0.15], [3322.44, 0.15]].forEach(([f, p], i) => {                                   // "ching"
          send(glass(t + 0.06 + i * 0.03, f, g * (full ? 1 : 0.7), full ? 1.6 : 0.6, sfx, p, 0.002), full ? revS : roomS, 0.9);
          tone(t + 0.06 + i * 0.03, 'sine', f * 2.76, f * 2.76, 0.12, g * 0.12, sfx, 0.002, p);
        });
      },
      // vidro a estalar / partir
      crack: (t, g = 0.14, shards = 5, fall = 0.12) => {
        if (!on(t)) return;
        send(noise(t, 0.04, 'highpass', 3000, 5000, g, sfx, 0.8, 0, 0, 0.05), roomS, 0.8);
        tone(t, 'triangle', 320, 120, 0.08, g * 0.6, sfx, 0.002);
        for (let k = 0; k < shards; k++) { const u = t + 0.01 + fall * Math.pow(k / shards, 0.8) + rnd(t, 60 + k) * 0.02; glass(u, (2600 + 3400 * rnd(t, 70 + k)) * (1 - 0.3 * k / shards), g * 0.35 * (1 - 0.6 * k / shards), 0.14, sfx, rnd(t, 80 + k) * 1.6 - 0.8, 0.002); }
      },
      heart: (t, g = 0.25) => { if (!on(t)) return; tone(t, 'sine', 68, 44, 0.14, g, sfx, 0.006); tone(t + 0.17, 'sine', 64, 42, 0.12, g * 0.7, sfx, 0.006); },
      // impacto médio (f0, 26 s): corpo 105 → 46 Hz sem sub profundo
      impactM: (t, g = 1) => { if (!on(t)) return; tone(t, 'sine', 105, 46, 0.55, 0.4 * g, sfx, 0.004); tone(t, 'triangle', 220, 80, 0.08, 0.18 * g, sfx, 0.002); send(noise(t, 0.35, 'lowpass', 2600, 300, 0.18 * g, sfx, 0.7, -0.2, 0.2, 0.03), roomS, 0.8); },
      // martelo de vidro (14 s): knock + anel de vidro
      hammer: (t) => { if (!on(t)) return; tone(t, 'triangle', 420, 160, 0.07, 0.24, sfx, 0.002); tone(t, 'sine', 150, 58, 0.35, 0.34, sfx, 0.003); noise(t, 0.04, 'bandpass', 1800, 1400, 0.2, sfx, 1.2, 0, 0, 0.1); send(glass(t + 0.004, 1318.51, 0.08, 0.9, sfx, -0.1), revS, 0.7); send(glass(t + 0.008, 1975.53, 0.04, 0.7, sfx, 0.1), revS, 0.7); },
      // impacto grave (máx. 3: 48, 80, 88 s): sub 130 → 34 Hz + corpo + ar agudo
      impactH: (t, g = 1) => { if (!on(t)) return; tone(t, 'sine', 130, 34, 1.5, 0.72 * g, sfx, 0.006); tone(t, 'triangle', 260, 70, 0.14, 0.22 * g, sfx, 0.003); send(noise(t, 2.0, 'highpass', 3500, 8000, 0.11 * g, sfx, 0.7, -0.5, 0.5, 0.05), revS, 1); send(noise(t, 0.5, 'lowpass', 1800, 160, 0.2 * g, sfx, 0.7, -0.3, 0.3, 0.02), roomS, 0.7); },
      // Toque ORA (aprovado, brand.json): "O" Mi5 (seno + 10 % triângulo) → "RA" Si5 0,24 s depois → cauda 2,4 s
      toqueORA: (t, g = 1) => {
        if (!on(t)) return;
        [[0, 659.25, 1.5, -0.1], [0.24, 987.77, 1.9, 0.1]].forEach(([d, f, len, pan]) => {
          send(tone(t + d, 'sine', f, f, len, 0.22 * g, sfx, 0.005, pan), revL, 1);
          send(tone(t + d, 'triangle', f, f, len, 0.022 * g, sfx, 0.005, pan), revL, 1);
          tone(t + d, 'sine', f * 2, f * 2, 0.25, 0.03 * g, sfx, 0.005, pan);
        });
      },
      hit: (t) => { // 88,00 s: impacto grave + acorde de vidro Emaj9 + Toque ORA
        if (!on(t)) return; X.impactH(t, 1);
        [329.63, 415.30, 493.88, 622.25, 739.99].forEach((f, i) => send(glass(t + i * 0.012, f, 0.06, 2.2, sfx, (i - 2) * 0.25), revS, 0.9));
        X.toqueORA(t, 1);
      },
    };

    /* ---------- música ---------- */
    const pump = (t, dB = 0.28, dP = 0.62) => {
      if (!on(t)) return;
      [[pumpB, dB, 0.26], [pumpP, dP, 0.32]].forEach(([n, depth, rel]) => { n.gain.setValueAtTime(1, at(Math.max(from, t - 0.004))); n.gain.linearRampToValueAtTime(depth, at(t + 0.006)); n.gain.linearRampToValueAtTime(1, at(t + rel)); });
    };
    const kick = (t, g = 0.9, doPump = true) => {
      if (!on(t)) return;
      noise(t, 0.008, 'highpass', 4500, 8000, g * 0.16, drums, 0.7, 0, 0, 0.15);
      tone(t, 'triangle', 240, 95, 0.045, g * 0.22, drums, 0.002);
      tone(t, 'sine', 150, 50, 0.28, g * 0.66, drums, 0.004);
      tone(t + 0.004, 'sine', 50, 44, 0.36, g * 0.26, drums, 0.012);
      if (doPump) pump(t);
    };
    const clap = (t, g = 0.2) => { if (!on(t)) return; [0, 0.009, 0.019].forEach((d, i) => { const p = noise(t + d, i === 2 ? 0.15 : 0.02, 'bandpass', 1500, 1150, g * (i === 2 ? 1 : 0.6), drums, 1.3, 0, 0, 0.06); if (i === 2) send(p, roomM, 1); }); tone(t, 'triangle', 210, 170, 0.07, g * 0.4, drums, 0.002); noise(t, 0.09, 'highpass', 4500, 6000, g * 0.3, drums, 0.7, 0.05, 0.05, 0.08); };
    const ghost = (t, g = 0.05) => { if (on(t)) noise(t, 0.05, 'bandpass', 1900, 1500, g, drums, 1.2, -0.1, -0.1, 0.1); };
    const hat = (t, g = 0.05, open = false) => { if (on(t)) noise(t, open ? 0.2 : 0.035, 'bandpass', 9500, 10500, g, drums, 0.6, 0.28, 0.28, 0.08); };
    const shaker = (t, g = 0.04) => { if (on(t)) noise(t, 0.06, 'bandpass', 6500, 7500, g, drums, 1.2, -0.3, -0.3, 0.55); };
    const crash = (t, g = 0.07) => { if (on(t)) send(noise(t, 1.8, 'highpass', 5500, 7000, g, drums, 0.6, -0.3, 0.3, 0.008), roomM, 0.5); };
    const revCym = (t, d, g = 0.05) => { if (on(t)) noise(t, d, 'highpass', 4000, 9000, g, drums, 0.6, 0.3, -0.3, 0.97); };
    // baixo funk: seno + triângulo + 2.º harmónico, LPF com envelope (ataque "slap" suave), sidechain
    const bass = (t, f, d, g = 0.2) => {
      if (!on(t)) return; t = q(t);
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.005)); e.gain.setTargetAtTime(g * 0.7, at(t + 0.03), 0.08); e.gain.exponentialRampToValueAtTime(0.0001, at(t + d));
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2.4; lp.frequency.setValueAtTime(1100, at(t)); lp.frequency.exponentialRampToValueAtTime(240, at(t + Math.min(d, 0.25)));
      const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f; const g2 = ctx.createGain(); g2.gain.value = 0.7;
      const o3 = ctx.createOscillator(); o3.type = 'sine'; o3.frequency.value = f * 2; const g3 = ctx.createGain(); g3.gain.value = 0.25;
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
    // clav (lead do drop 1): quadrada + serra, LPF ressonante com envelope rápido
    const clav = (t, f, d = 0.16, g = 0.05, pan = 0.25) => {
      if (!on(t)) return; t = q(t);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 5; lp.frequency.setValueAtTime(4200, at(t)); lp.frequency.exponentialRampToValueAtTime(700, at(t + 0.12));
      const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 220;
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.003)); e.gain.exponentialRampToValueAtTime(0.0001, at(t + d));
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      const o1 = ctx.createOscillator(); o1.type = 'square'; o1.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = f * 1.004; const g2 = ctx.createGain(); g2.gain.value = 0.5;
      o1.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(hpf); hpf.connect(e); e.connect(p); p.connect(music); send(p, roomM, 0.5); send(p, revM, 0.12);
      [o1, o2].forEach(o => { o.start(at(t)); o.stop(at(t + d + 0.05)); });
    };
    // chops (guitarra funk sintetizada): tríade em serras → passa-banda → corte curto
    const chop = (t, notes, g = 0.03, d = 0.08, pan = -0.35) => {
      if (!on(t)) return; t = q(t);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9; bp.frequency.setValueAtTime(2200, at(t)); bp.frequency.exponentialRampToValueAtTime(1300, at(t + d));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.003)); e.gain.exponentialRampToValueAtTime(0.0001, at(t + d));
      const p = ctx.createStereoPanner(); p.pan.value = pan; bp.connect(e); e.connect(p); p.connect(music); send(p, roomM, 0.6);
      notes.forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = (i - 1) * 4; o.connect(bp); o.start(at(t)); o.stop(at(t + d + 0.05)); });
    };
    // teclas (drop 2): piano elétrico FM — portadora seno, moduladora 1:1 com índice a cair + "tine" 14:1 curto
    const ep = (t, f, d, g = 0.04, pan = 0, bright = 1, out = pumpP) => {
      if (!on(t)) return; t = q(t);
      const c = ctx.createOscillator(); c.type = 'sine'; c.frequency.value = f;
      const m = ctx.createOscillator(); m.type = 'sine'; m.frequency.value = f;
      const mg = ctx.createGain(); mg.gain.setValueAtTime(f * 1.9 * bright, at(t)); mg.gain.exponentialRampToValueAtTime(f * 0.22, at(t + Math.min(0.45, d)));
      m.connect(mg); mg.connect(c.frequency);
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.004)); e.gain.setTargetAtTime(g * 0.5, at(t + 0.02), 0.25); e.gain.exponentialRampToValueAtTime(0.0001, at(t + d));
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      c.connect(e); e.connect(p); p.connect(out); send(p, roomM, 0.35); send(p, revM, 0.3);
      [c, m].forEach(o => { o.start(at(t)); o.stop(at(t + d + 0.05)); });
      tone(t, 'sine', Math.min(f * 14, 12000), Math.min(f * 14, 12000), 0.03, g * 0.1 * bright, out, 0.001, pan);
    };
    const epChord = (t, notes, d, g = 0.022, bright = 0.8) => notes.forEach((f, i) => ep(t + i * 0.006, f, d, g, (i - 1.5) * 0.3, bright));
    const pluck = (t, f, g = 0.05, pan = 0, dur = 0.32) => { if (!on(t)) return; const p = glass(t, f, g, dur, music, pan); send(p, roomM, 0.8); send(p, revM, 0.25); };
    // ar musical (pink em banda), para a intro/cauda e o breakdown
    const air = (t, dur, g, f0 = 900, f1 = 2400, pl = -0.5, pr = 0.5, fin = 0.08, fout = 0.08) => {
      if (t + dur <= from) return; const s = Math.max(t, from);
      const src = ctx.createBufferSource(); src.buffer = pb; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
      f.frequency.setValueAtTime(f0, at(t)); f.frequency.exponentialRampToValueAtTime(f1, at(t + dur * 0.5)); f.frequency.exponentialRampToValueAtTime(f0 * 1.15, at(t + dur));
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(s)); e.gain.linearRampToValueAtTime(g, at(s + fin)); e.gain.setValueAtTime(g, at(t + dur - fout)); e.gain.linearRampToValueAtTime(0.0001, at(t + dur));
      const p = panner(pl, pr, t, dur);
      src.connect(f); f.connect(e); e.connect(p); p.connect(music); send(p, revM, 0.3);
      src.start(at(s), (1.3 + (s - t)) % 4); src.stop(at(t + dur + 0.05));
    };
    const hook = (t0, c, kind, g = 1) => {
      HOOK[c].forEach(([s, f], i, arr) => {
        const next = i + 1 < arr.length ? arr[i + 1][0] : 16, len = Math.min(next - s, 3) * S16;
        const t = t0 + s * S16 + (s % 2 ? 0.014 : 0);
        if (kind === 'clav') clav(t, f, Math.max(0.1, len * 0.9), 0.045 * g, 0.25);
        else { ep(t, f * 2, len + 0.35, 0.03 * g, 0.2, 1.1, music); ep(t, f, len + 0.2, 0.012 * g, -0.2, 0.6, music); }
      });
    };
    const bassLine = (t0, r, lvl = 1, cut = 16) => {
      // [semicolcheia, multiplicador, duração, ganho]
      [[0, 1, 0.24, 1], [3, 1, 0.1, 0.75], [4, 2, 0.08, 0.55], [6, 1, 0.12, 0.85], [7, 2, 0.05, 0.4], [8, 1, 0.2, 1], [10, 1.5, 0.1, 0.8], [11, 2, 0.08, 0.65], [13, 1, 0.1, 0.8], [14, 1.5, 0.1, 0.7], [15, 2, 0.05, 0.45]]
        .forEach(([s, m, d, g]) => { if (s < cut) bass(t0 + s * S16 + (s % 2 ? 0.012 : 0), r * m, d, 0.2 * g * lvl); });
    };
    const drumsFunk = (t0, lvl = 1, o = {}) => {
      const s = k => t0 + k * S16 + (k % 2 ? 0.015 : 0); // swing leve nas semicolcheias ímpares
      const cut = o.cut || 16;
      [[0, 1], [7, 0.5], [8, 0.9], [10, 0.7]].forEach(([k, g]) => { if (k < cut) kick(s(k), g * 0.9 * lvl, g > 0.6); });
      [4, 12].forEach(k => { if (k < cut) clap(s(k) + 0.004, 0.2 * lvl); });
      [[9, 0.04], [15, 0.05]].forEach(([k, g]) => { if (k < cut) ghost(s(k), g * lvl); });
      for (let k = 0; k < cut; k++) { const acc = k % 4 === 2; hat(s(k), (acc ? 0.05 : 0.02 + 0.01 * rnd(t0 + k, 12)) * lvl, o.openHat && k === 14); }
    };

    // compasso de intro/cauda (c1–c2 e c46–c47 são idênticos: loop). n = 1 ou 2; lt = tempo local
    const introBar = (t0, n) => {
      const c = n === 1 ? 'E' : 'Cm', ch = CH[c];
      pad(t0, BAR, ch.pad, 1500, 1800, 0.018, n === 1 ? 0.015 : 0.04, n === 2 ? 0.04 : 0.04);
      air(t0, BAR, 0.14, 700, 1600, n === 1 ? -0.5 : 0.5, n === 1 ? 0.5 : -0.5, n === 1 ? 0.015 : 0.04, 0.04);
      hook(t0, c, 'clav', 0.9);
      [2, 10].forEach(k => chop(t0 + k * S16, ch.stab, 0.02, 0.07));
      for (let k = 0; k < 8; k++) shaker(t0 + k * BT / 2 + (k % 2 ? 0.02 : 0), k % 2 ? 0.045 : 0.03 + 0.008 * ((k * 7) % 3));
    };

    for (let i = 0; i < 47; i++) {
      const bar = i + 1, t0 = i * BAR, cn = PROG[i], c = CH[cn];
      if (bar === 1 || bar === 46) { introBar(t0, 1); continue; }
      if (bar === 2 || bar === 47) { introBar(t0, 2); continue; }

      if (bar <= 4) { // intro a abrir (filtro global 650 → 4200 Hz)
        pad(t0 - 0.04, BAR + 0.04, c.pad, 1500, 2200, 0.018, 0.04, 0.06);
        hook(t0, cn, 'clav', 0.95);
        [2, 6, 10, 14].forEach(k => chop(t0 + k * S16, c.stab, 0.022, 0.07));
        for (let k = 0; k < 8; k++) shaker(t0 + k * BT / 2 + (k % 2 ? 0.02 : 0), k % 2 ? 0.045 : 0.035);
        if (bar === 4) {
          for (let k = 0; k < 16; k++) hat(t0 + k * S16, 0.012 + 0.03 * k / 15);
          for (let k = 0; k < 6; k++) clap(t0 + 1.5 + k * S16 / 2, 0.04 + 0.025 * k);         // rufo 7,5 → 7,875; vazio até ao drop
          revCym(t0 + 1.0, 0.97, 0.05);
        }
        continue;
      }
      if (bar === 13) { // tape-stop a 24,0 s: acorde, baixo, lead e kick abrandam até parar (0,75 s)
        const t = t0;
        if (on(t)) {
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(5000, at(t)); lp.frequency.exponentialRampToValueAtTime(180, at(t + 0.75)); lp.connect(music);
          [[c.bass, 'triangle', 0.14], [c.bass * 2, 'sine', 0.06], ...c.stab.map(f => [f, 'sawtooth', 0.012]), [659.25, 'square', 0.012], [150, 'sine', 0.25]].forEach(([f, ty, g], k) => {
            const o = ctx.createOscillator(); o.type = ty; o.frequency.setValueAtTime(f, at(t)); o.frequency.linearRampToValueAtTime(f * 0.04, at(t + 0.75));
            const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, at(t)); e.gain.exponentialRampToValueAtTime(g, at(t + 0.006)); e.gain.setValueAtTime(g, at(t + 0.45)); e.gain.linearRampToValueAtTime(0.0001, at(t + 0.75));
            const p = ctx.createStereoPanner(); p.pan.value = k > 1 && k < 5 ? (k - 3) * 0.4 : 0; o.connect(e); e.connect(p); p.connect(lp); o.start(at(t)); o.stop(at(t + 0.8));
          });
          noise(t, 0.75, 'bandpass', 1200, 90, 0.05, music, 1.2, 0, 0, 0.1);                        // "arrasto" da fita
        }
        // sala noite: drone escuro (Mi1 + Mi2) e ar grave, até a música voltar a 26,0
        if (on(t0 + 0.7)) { tone(t0 + 0.7, 'sine', 41.2, 41.2, 1.28, 0.14, music, 0.4); tone(t0 + 0.7, 'triangle', 82.41, 82.41, 1.28, 0.03, music, 0.5); }
        air(t0 + 0.6, 1.4, 0.05, 250, 500, 0.3, -0.3, 0.4, 0.1);
        revCym(t0 + 1.5, 0.5, 0.05);
        continue;
      }
      if (bar >= 21 && bar <= 24) { // breakdown: sem bateria; pad aberto; baixo sustentado; plucks cada vez mais densos
        const k = bar - 21, c0 = 900 * Math.pow(1.4, k), c1 = c0 * 1.4;
        pad(t0 - 0.04, BAR + 0.04, c.pad, c0, c1, 0.02, bar === 21 ? 0.3 : 0.04, bar === 24 ? 0.25 : 0.04);
        if (on(t0)) tone(t0, 'sine', c.bass, c.bass, bar === 24 ? 1.75 : BAR + 0.05, 0.15, music, 0.2);
        const dens = [2, 4, 8, 16][k], arp = c.stab.concat(c.stab.map(f => f * 2));
        for (let s2 = 0; s2 < dens; s2++) {
          const t = t0 + s2 * BAR / dens; if (bar === 24 && t >= t0 + 1.75) break;                 // vazio antes do drop 2
          pluck(t + (s2 % 2 ? 0.012 : 0), arp[(s2 * 2 + k) % arp.length] * (k >= 2 ? 1 : 2) / (k >= 2 ? 1 : 1), 0.035 + 0.01 * k, s2 % 2 ? 0.4 : -0.4, k === 3 ? 0.25 : 0.7);
        }
        air(t0, BAR, 0.06 + 0.02 * k, 800, 2400, -0.5, 0.5);
        if (bar === 24) revCym(t0 + 0.8, 0.95, 0.06);
        continue;
      }
      if (bar >= 38 && bar <= 40) { // half-time: kick no 1, clap no 3, baixo em mínimas, teclas longas; filtro a reabrir
        const s = k => t0 + k * S16;
        pad(t0 - 0.04, BAR + 0.04, c.pad, 1200, 1800, 0.014);
        kick(s(0), 0.9); if (bar !== 40) kick(s(10), 0.55, false);
        clap(s(8) + 0.004, 0.2);
        for (let k = 0; k < 16; k += 2) hat(s(k) + 0.015 * ((k / 2) % 2), k % 4 === 2 ? 0.04 : 0.018);
        bass(s(0), c.bass, 0.9, 0.2); bass(s(8), c.bass, bar === 40 ? 0.5 : 0.9, 0.17);
        epChord(s(0), CH[cn].ep, 1.6, 0.02, 0.6);
        if (bar === 40) { for (let k = 0; k < 12; k++) { const u = t0 + 1.0 + 0.75 * (1 - Math.pow(1 - k / 12, 1.4)); clap(u, 0.03 + 0.012 * k); } } // rufo a acelerar; vazio 79,75 → 80
        continue;
      }
      if (bar === 43 || bar === 44) { // pad (84–88): sem bateria, baixo longo, teclas suaves; vazio antes do Toque
        pad(t0 - 0.04, BAR + 0.04, c.pad, bar === 43 ? 1400 : 2000, bar === 43 ? 2000 : 3200, 0.02, bar === 43 ? 0.12 : 0.04, bar === 44 ? 0.3 : 0.04);
        if (on(t0)) tone(t0, 'sine', c.bass, c.bass, bar === 44 ? 1.72 : BAR + 0.05, 0.14, music, 0.15);
        epChord(t0 + 0.02, c.ep, 1.7, 0.016, 0.5);
        if (bar === 44) epChord(t0 + 1.0, c.ep.map(f => f * 2), 0.7, 0.008, 0.4);
        air(t0, BAR, 0.05, 900, 2600, -0.4, 0.4);
        continue;
      }
      if (bar === 45) { // hit a 88,00: pad Emaj9 aberto + baixo longo; a bateria cala para o Toque ORA respirar
        pad(t0, BAR, c.pad, 2600, 1500, 0.017, 0.01, 0.4);
        bass(t0, c.bass, BAR - 0.1, 0.17); pump(t0);
        continue;
      }

      // grooves: drop 1 (c5–12, c14–20), drop 2 (c25–37), final (c41–42)
      const drop2 = (bar >= 25 && bar <= 37) || bar >= 41, breath = bar === 20;
      pad(t0 - 0.04, BAR + 0.04, c.pad, drop2 ? 2000 : 1600, drop2 ? 2600 : 2100, breath ? 0.014 : 0.011);
      if ([5, 14, 25, 41].includes(bar)) crash(t0, bar === 41 ? 0.08 : 0.065);
      if (breath) { // c20 (ROAS 2,8): respiração — kick no 1 e 3, baixo longo, rufo de entrada no breakdown
        kick(t0, 0.8); kick(t0 + 1.0, 0.6); bass(t0, c.bass, 1.4, 0.17);
        for (let k = 0; k < 16; k += 2) hat(t0 + k * S16, 0.02);
        for (let k = 0; k < 6; k++) clap(t0 + 1.5 + k * S16 / 2, 0.035 + 0.02 * k);
        revCym(t0 + 1.0, 0.98, 0.05);
        continue;
      }
      const cut = (bar === 36) ? 15 : 16;                                   // micro-vazio antes do glitch
      drumsFunk(t0, 1, { openHat: bar % 2 === 0, cut });
      bassLine(t0, c.bass, 1, cut);
      if (!drop2) {
        [[2, 0.03], [6, 0.02], [10, 0.03], [13, 0.018]].forEach(([k, g]) => chop(t0 + k * S16 + (k % 2 ? 0.015 : 0), c.stab, g, 0.075));
        if (bar >= 7 && bar !== 14 && bar !== 15) hook(t0, cn, 'clav', 1);
      } else {
        [[2, 0.34], [7, 0.14], [10, 0.34], [14, 0.14]].forEach(([k, d]) => { if (k < cut) epChord(t0 + k * S16 + (k % 2 ? 0.015 : 0), c.ep, d, 0.02, 0.85); });
        if (bar !== 25 && bar !== 37) hook(t0, cn, 'ep', bar >= 41 ? 1.1 : 1);
      }
      if (bar === 12) revCym(t0 + 1.0, 0.98, 0.04);                         // prepara o tape-stop
      if (bar === 40 - 1) { /* half-time tratado acima */ }
    }

    /* ---------- SFX cues (ver design/trafego/cues.md) ---------- */
    // c1 · ecrã partido; pesquisa a escrever "bolo aniv…"
    X.impactM(0.0, 0.9); X.tick(0.0, 3136, 0.05, 0);                          // impacto em f0 (médio: é também o ponto de loop)
    X.typing(0.30, 9, 0.16, 0.07, 0.1);                                       // teclado: b-o-l-o-␣-a-n-i-v
    // c2 · as metades chocam a 2,5 s, glitch RGB de 4 fotogramas; "?" gigante a rodar em Y
    X.revAir(2.0, 0.5, 0.1);                                                  // ar invertido: cresce e corta no choque
    X.whoosh(2.12, 0.38, false, 0.07, -0.7, 0); X.whoosh(2.12, 0.38, true, 0.07, 0.7, 0); // metade de cima ← / de baixo →, convergem
    X.glitch(2.5, 0.067, 0.12);                                               // glitch 4 fotogramas
    X.air(2.6, 1.2, 600, 1800, 0.05, -0.5, 0.5);                              // "?" a rodar em Y
    // c3 · cartão de vidro: tilt-reveal + chip
    X.air(4.0, 0.6, 500, 1500, 0.06, 0, 0); X.pop(4.55, 620, 0.22, 0);        // o cartão assenta
    X.tick(5.05, 2800, 0.035, 0.6);                                           // chip "Exemplo ilustrativo" (canto superior direito)
    // c4 · duas moedas de 150 € caem com mola (esquerda Meta, direita Google)
    X.whoosh(6.05, 0.3, false, 0.05, -0.5, -0.5); X.tick(6.35, 2637, 0.07, -0.5); X.jingle(6.36, 0.06, -0.5);
    X.whoosh(6.30, 0.3, false, 0.05, 0.5, 0.5); X.tick(6.60, 2960, 0.07, 0.5); X.jingle(6.61, 0.06, 0.5);
    // c5 · DROP: a moeda entra no telemóvel; orbit −18 → +6; o anúncio sobe no feed
    X.swipe(7.9, 0.14, -0.5, 0, 0.2);                                          // moeda (esquerda) → telemóvel, acaba no drop
    X.air(8.3, 1.3, 600, 1800, 0.04, -0.6, 0.4);                              // orbit
    X.swipe(9.2, 0.08, 0, 0, 0.18);                                            // o anúncio sobe no feed
    // c6 · mapa + 4 chips a filtrar
    X.swipe(9.96, 0.06, 0.4, -0.2, 0.16);                                      // transição para o mapa
    [10.25, 10.55, 10.85, 11.15].forEach((t, i) => X.click(t, 0.16, -0.45 + i * 0.3)); // 1 click por chip
    [11.45, 11.52, 11.6].forEach((t, i) => X.tick(t, 3200 + i * 200, 0.025, -0.3 + i * 0.3)); // os pontos que ficam acendem
    // c7–c8 · leilão: 3 anúncios, martelo a 14,0 s, ganha o maior anel
    X.whoosh(12.0, 0.45, true, 0.07, -0.7, 0.3);                              // 3 anúncios entram
    X.whoosh(13.55, 0.45, false, 0.08, 0.1, 0);                               // o martelo cai
    X.hammer(14.0);                                                           // martelo de vidro (impacto médio)
    X.pop(15.0, 700, 0.18, 0.2); X.note(15.05, 1318.51, 0.07, 0.6, 0.2, roomS); // o anúncio vencedor sobe (anel)
    // c9 · impressões: carimbos a fugir em z; contador 0 → 30.000
    X.whoosh(16.0, 0.5, false, 0.07, 0, 0);                                   // grelha foge em z
    X.counter(16.4, 0.8, 16, 2000, 0.03, 0.2);                                // 0,8 s + punch
    // c10 · alcance: carimbos agrupam-se em cabeças; dolly; 12.000
    X.air(18.0, 1.5, 500, 1400, 0.04, 0.6, -0.4);                             // dolly com parallax
    X.pops(18.1, 8, 0.8, 540, 0.1, -0.6, 0.6, 1.025);                         // pops em cascata
    X.tap(19.25, 2217.46, 0.08, 0.2);                                         // 12.000 assenta
    // c11 · frequência: ding ×2 (pessoa 1), ding ×3 (pessoa 2), fundem-se em 2,5
    X.swipe(20.0, 0.05, 0.3, -0.3, 0.18);
    X.note(20.30, 830.61, 0.1, 0.5, -0.4, roomS); X.note(20.55, 987.77, 0.1, 0.5, -0.4, roomS);
    X.note(20.90, 830.61, 0.1, 0.5, 0.4, roomS); X.note(21.10, 987.77, 0.1, 0.5, 0.4, roomS); X.note(21.30, 1318.51, 0.1, 0.6, 0.4, roomS);
    X.reverse(21.45, 0.3, 0.06, 0.4, 0);                                       // as marcas fundem-se em 2,5
    // c12 · CPM: 1.000 pontos compactam-se num cubo
    X.reverse(22.0, 0.55, 0.09, -0.4, 0.4);                                    // implosão
    X.click(22.6, 0.2, 0); X.tick(23.25, 2400, 0.05, 0.1);                     // cubo assenta · etiqueta 5 €
    // c13 · LOOP: o cubo estala (tape-stop na música), sala noite, coração treme e dá glitch
    X.crack(24.0, 0.14, 5, 0.12);
    X.heart(24.55, 0.22); X.heart(25.0, 0.18);                                // coração a tremer
    X.glitch(25.3, 0.2, 0.1);                                                 // glitch no coração
    X.revAir(25.5, 0.5, 0.1, 0.3, 0);                                         // ar invertido → a música volta
    // c14 · o coração cai; a música volta a 26,0; toque em "Saber mais"
    X.whoosh(25.85, 0.35, false, 0.06, 0, 0); X.impactM(26.0, 0.85);
    X.click(27.0, 0.2, 0.15);
    // c15 · CTR: 100 pontos passam, 1 entra; zoom-out até 300
    X.swipe(28.0, 0.12, -0.6, 0.6, 0.3); X.tick(28.55, 2637, 0.06, 0);
    X.air(29.0, 0.6, 1600, 600, 0.04, 0, 0); X.tick(29.25, 2960, 0.05, 0);
    // c16 · CPC: moedas de 0,50 € na ranhura
    X.whoosh(29.98, 0.3, false, 0.04, 0, 0);
    [30.3, 30.7, 31.1, 31.5].forEach((t, i) => X.coin(t, 0.1, -0.15 + i * 0.1));
    // c17 · funil 3D: entram 300 pontos (whoosh descendente), saem 12 caixas (12 pops)
    X.whoosh(32.0, 0.6, false, 0.08, 0, 0);
    X.pops(32.9, 12, 0.8, 520, 0.1, -0.5, 0.5, 1.015);
    // c18 · CPA: caixa roda em Y e mostra a etiqueta
    X.air(34.0, 0.5, 700, 2200, 0.05, -0.5, 0.5); X.click(34.5, 0.18, 0);
    X.note(35.0, 1318.51, 0.1, 0.8, 0, roomS); X.tick(35.4, 3000, 0.03, 0.4); // ding · chip CPL
    // c19 · 12 caixas empilham-se; contador a amarelo 420 €; cha-ching discreto
    X.whoosh(36.0, 0.35, true, 0.05, -0.3, 0.3);
    X.counter(36.2, 0.8, 14, 2200, 0.028, 0, false); X.chaChing(37.0, false, 0.08);
    // c20 · ROAS 2,8: halo e push-in; 2 notas ascendentes
    X.air(38.0, 1.5, 400, 1200, 0.035, 0, 0);
    X.note(38.10, 987.77, 0.1, 0.7, -0.15); X.note(38.35, 1318.51, 0.11, 1.2, 0.15);
    // c21–c22 · breakdown: balança de vidro; ding grave; linhas 2× e 2,8×
    X.note(40.0, 329.63, 0.16, 2.6, 0); X.sub(40.0, 0.12, 1.2);                 // ding grave
    X.air(40.4, 1.1, 500, 1100, 0.035, -0.4, 0.4);                              // a balança inclina
    X.tick(42.0, 1975.53, 0.04, -0.3); X.tick(42.6, 2349.32, 0.04, 0.3);       // linhas tracejadas 2× e 2,8×
    // c23–c24 · pixel: ponto de luz segue as encomendas; acendem pessoas parecidas; riser 46–48
    X.air(44.0, 1.8, 1500, 4200, 0.03, -0.7, 0.7);                              // o pixel viaja
    [44.5, 45.0, 45.5].forEach((t, i) => X.tick(t, 3520, 0.025, -0.4 + i * 0.4)); // anota cada encomenda
    X.pops(46.0, 6, 0.5, 700, 0.07, -0.6, 0.6, 1.03);                          // pessoas parecidas acendem
    X.riser(46.0, 1.8, 0.09);                                                  // riser 46 → 47,8 (vazio curto antes do impacto)
    // c25 · DROP 2: faixa amarela (1.ª de 2) + impacto grave #1
    X.stripe(47.55, 0.6, 0.16); X.impactH(48.0, 0.9);
    // c26 · pesquisa: "encomendar bolo aniversário leiria"; a porta abre-se ao fundo
    X.typing(50.1, 22, 0.068, 0.06, 0);
    X.air(51.5, 0.6, 400, 1000, 0.035, 0.3, 0.5);
    // c27 · palavras soltam-se como pills e encaixam numa chave 3D (click ×3)
    X.swipe(52.1, 0.07, 0, 0, 0.18);
    [52.5, 52.9, 53.3].forEach((t, i) => X.click(t, 0.18, -0.4 + i * 0.4));
    // c28 · intenção: termómetro frio → quente (riser 1 s)
    X.tick(54.2, 1567.98, 0.04, 0); X.riser(54.8, 1.0, 0.06, false); X.note(55.8, 1318.51, 0.07, 0.5, 0, roomS);
    // c29 · a página passa a navy; 2 cartões "Patrocinado"
    X.swipe(56.0, 0.12, -0.6, 0.6, 0.28); X.pop(56.6, 600, 0.16, -0.3); X.pop(56.75, 640, 0.14, 0.3);
    // c30 · torres de blocos: 4 blocos do rival (esq.), 8 nossos (dir.), pitch a subir
    for (let k = 0; k < 4; k++) X.tick(58.1 + k * 0.13, 1318.51 * Math.pow(1.06, k), 0.04, -0.45);
    for (let k = 0; k < 8; k++) X.tick(58.75 + k * 0.11, 1318.51 * Math.pow(1.06, k), 0.04, 0.45);
    // c31 · Bolacha Azul sobe para o 1.º lugar com mola: ding + sub
    X.whoosh(60.0, 0.3, true, 0.06, 0.3, 0.3); X.note(60.3, 1318.51, 0.12, 1.2, 0.2); X.note(60.305, 1975.53, 0.05, 0.9, 0.25); X.sub(60.3, 0.18, 0.8);
    // c32 · CTR: 5.000 cartões a fugir em z; 250 acendem
    X.whoosh(62.0, 0.5, false, 0.07, 0, 0); X.counter(62.6, 0.8, 14, 2000, 0.03, -0.2);
    // c33 · CPC: moeda de 0,60 € na ranhura
    X.swipe(64.0, 0.06, 0.3, -0.3, 0.16); X.coin(64.4, 0.12, 0);
    // c34 · o mesmo funil, mais largo: whoosh + 15 pops
    X.whoosh(66.0, 0.6, false, 0.08, 0, 0); X.pops(66.8, 15, 0.95, 520, 0.09, -0.6, 0.6, 1.012);
    // c35 · CPA: caixa roda, etiqueta 10 €
    X.air(68.0, 0.5, 700, 2200, 0.05, 0.5, -0.5); X.note(68.5, 1318.51, 0.1, 0.8, 0, roomS);
    // c36 · contador a amarelo 525 € → 3,5×; cha-ching discreto
    X.counter(70.1, 0.8, 14, 2200, 0.028, 0, false); X.chaChing(70.95, false, 0.08);
    // c37 · LOOP 2: o 3,5× cresce, dá glitch e parte-se (filtro da música a fechar)
    X.riser(71.6, 0.4, 0.04, false); X.glitch(72.0, 0.5, 0.12); X.crack(72.55, 0.16, 14, 0.8);
    // c38 · faixa a 18° (2.ª e última) + o "cheiro" (linha ondulante) sai do telemóvel
    X.stripe(73.6, 0.55, 0.14);
    if (on(74.3)) { const p = noise(74.3, 1.6, 'bandpass', 700, 1500, 0.05, sfx, 0.9, 0.5, -0.5, 0.5, true); p.pan.setValueAtTime(0.5, at(74.3)); for (let k = 1; k <= 4; k++) p.pan.linearRampToValueAtTime(k % 2 ? -0.5 : 0.5, at(74.3 + k * 0.4)); send(p, roomS, 0.5); } // ar ondulante
    X.swipe(75.2, 0.05, -0.2, 0.3, 0.2);                                        // as cabeças viram
    // c39 · as pessoas escrevem e entram pela porta em pill
    X.swipe(76.0, 0.12, -0.5, 0.5, 0.25); X.typing(76.3, 5, 0.08, 0.04, 0); X.click(76.9, 0.2, 0.2);
    // c40 · split 12.000 × 5.000; o cheiro desaparece, a pesquisa esvazia; riser 78–80
    X.reverse(78.3, 0.9, 0.06, -0.3, 0.3);
    X.riser(78.0, 1.75, 0.09);
    // c41 · os 2 funis fundem-se num só (orbit −20 → 0): impacto grave #2
    X.impactH(80.0, 0.85); X.whoosh(80.2, 0.7, true, 0.06, 0.6, -0.1);
    // c42 · 945 €: o único cha-ching completo
    X.chaChing(82.0, true, 0.12);
    // c43 · o "0" vira o "O" da ORA; íris para a sala navy; o chip sai
    X.air(84.0, 0.6, 400, 2600, 0.08, 0, 0); X.air(84.6, 0.6, 2000, 600, 0.04, -0.3, 0.3); X.swipe(85.3, 0.05, 0.5, 0.9, 0.16);
    // c44 · painel com 9 métricas em onda → "Está na hORA"; riser; sopro ascendente 0,3 s (íris do Toque)
    for (let k = 0; k < 9; k++) X.tick(86.1 + k * 0.1, 1975.53 * Math.pow(1.02, 4 - Math.abs(k - 4)), 0.03, -0.64 + k * 0.16);
    X.riser(86.4, 1.3, 0.06, false);
    X.air(87.7, 0.3, 500, 3000, 0.11, 0, 0);
    // c45 · HIT: o "h" cai a 88,00; Toque ORA (Mi5 88,00 · Si5 88,24) + impacto grave #3; light sweep
    X.hit(88.0);
    X.air(88.5, 1.2, 2500, 7000, 0.035, -0.8, 0.8);
    // c46 · pill faz morph para o CTA; push-in (cauda)
    X.click(90.1, 0.18, 0, 0.01); X.whoosh(90.15, 0.35, true, 0.04, -0.3, 0.3); X.air(90.4, 1.2, 400, 1100, 0.03, 0, 0);
    // c47 · "META OU GOOGLE?"; a faixa a 18° volta a 93,5 s; ar invertido → loop (0,00 = impacto)
    X.swipe(92.0, 0.05, 0, 0, 0.16);
    X.revAir(93.2, 0.8, 0.1, 0, 0); X.whoosh(93.5, 0.45, true, 0.05, -0.8, 0.8);
  };
})();
