# KOKARTE · vídeo 1 "Uma destas mensagens é tua" — cues de áudio (sem voz)

Fonte de verdade: `briefing/kokarte/02-estudo-viral-e-guiao-v1.md` §3, §5 e §6 · som da marca: `brands/kokarte/brand.json` → `som`.
Ficheiros: `kokarte-v1-audio.js` (síntese e cues), `kokarte-v1-audio.html` (render offline, normalização e limitador, botão para ouvir em loop), `kokarte-v1-audio-render.js` (Playwright → `dist/kokarte-v1-audio.wav`).

```
node design/kokarte/v1/kokarte-v1-audio-render.js          # → dist/kokarte-v1-audio.wav
node design/kokarte/v1/kokarte-v1-audio-render.js loop     # verificação do loop
GR=1 node design/kokarte/v1/kokarte-v1-audio-render.js     # + onde o limitador atua
```

## Master (medido com ~/bin/ffmpeg)
| | valor |
|---|---|
| Formato | WAV PCM 24-bit, 48 kHz, estéreo, **1 666 560 amostras = 34,720 s** (868 fotogramas a 25 fps) |
| Loudness integrada (ebur128) | **−14,0 LUFS** · LRA 1,8 LU |
| True peak | **−1,4 dBTP** (pico de amostra −1,7 dBFS) |
| volumedetect | média −16,1 dB · máximo −1,7 dB |
| Limitador | brickwall circular (look-ahead 1,5 ms, release 120 ms). Máx. −5,5 dB só em transientes isolados (lacre, taça, cortes do plano 15); nos downbeats normais ≈ −2 a −3 dB |
| Loop | junção fim→início: salto de 0,00063, abaixo do passo mediano entre amostras (0,00157) → **sem clique**. As caudas do fim (anacruse, reverbs) já estão dobradas no início. |

## Música: amapiano suave, 107,14 BPM (14 fotogramas por batida), Lá maior
Pads quentes (2 serras ±7 cents + triângulo, LP), rhodes FM com auto-pan de 2 batidas, shaker em 16.as com swing leve, log drum (seno + triângulo com glide e tanh), bombo suave, rim nas batidas 2 e 4, hi-hat aberto em contratempo só no drop.
Harmonia: Amaj9 · F#m9 · Dmaj9 · E9sus4 (×2) → Amaj9 → **Dmaj9 (breakdown)** → Bm11 → E9sus4 (compasso de 2 batidas, b44–45) → **Amaj9 (drop, a taça em Lá3 é a nota do acorde)** · F#m9 · Dmaj9 · Bm11 → E9sus4 (anacruse) → Amaj9 no f0.
Os compassos de 4 batidas partem do b46: 46 + 16 = 62 ≡ 0, por isso a frase do drop fecha exatamente no loop.

| Secção | Batidas | Fotogramas | Tempo (s) | Arranjo |
|---|---|---|---|---|
| Intro filtrada | b0–b5 | 0–83 | 0,00–3,36 | Downbeat: bombo em Lá1 + prato suave; pad, keys, shaker. LP de música a 2,4 kHz, abre até 20 kHz no f84 |
| Groove A | b6–b35 | 84–503 | 3,36–20,16 | + log drum (entrada no f84 com glide largo), bombo em cada batida, rim na 4 |
| Breakdown | b36–b39 | 504–559 | 20,16–22,40 | Sem percussão; pad Dmaj9 sobe; rhodes em arpejo de colcheias; escurece com o fade f553–559 |
| Quarta mensagem | b40–b45 | 560–643 | 22,40–25,76 | Pad Bm11 → E9sus4 com LP a abrir 300 Hz → 5,2 kHz (Q ressonante 0,8 → 2,2); shaker em crescendo a partir do b42; riser discreto até ao f630 |
| Drop | b46–b59 | 644–839 | 25,76–33,60 | Groove completo + hi-hat; no b50–53 um log drum por corte (F#–A–B–C#, a subir) |
| Anacruse | b60–b61 | 840–867 | 33,60–34,72 | Percussão sai; rhodes E9sus4; fill de log drum em 16.as a subir (Mi2 → Mi3); prato invertido que acaba seco no f868 = f0; o LP de música fecha 20 kHz → 2,4 kHz (sucção para a intro) |

## Tabela de cues

Nível: diferença entre a loudness momentânea dos SFX e a da música (janela de 0,4 s) na mistura final. Os transientes curtos (cliques, pops) medem 4–8 dB abaixo do que se ouve nesta janela, por isso aparecem negativos. Pan: − = esquerda, + = direita.

| Tempo (s) | Fotograma | Evento visual | Som | Nível |
|---|---|---|---|---|
| 0,00 | 0 | Gancho; 3 envelopes assentes | Downbeat: bombo Lá1 + prato suave filtrado + pad/keys/shaker | música ≈ −15 LUFS M |
| 0,56 / 1,12 / 1,68 | 14 / 28 / 42 | Selos acendem 1-2-3 | Brilhos cristalinos ascendentes (Mi6 → Lá6 → Dó#7, com apogiatura a 4.ª abaixo), pan −0,5 / 0 / +0,5 | −0,6 / +0,3 / +1,1 dB |
| 2,52 / 3,08 | 63 / 77 | Envelopes flutuam | Shaker em contratempo acentuado (pan −0,3 / +0,3) | música |
| 3,36 | 84 | Envelope 1: selo estala | **Log drum entra** (glide) + estalo de lacre (5 micro-estalos + corpo + "toc" grave + migalhas) | lacre −3 dB (transiente) |
| 3,52 | 88 | Aba abre, carta sobe | Papel a deslizar (rosa, BP 1,6 → 3,2 kHz, textura de fibras), pan −0,1 → +0,1 | −3 dB |
| 3,92 / 5,04 | 98 / 126 | Blocos A/B da carta 1 | Brilho de texto (Mi7 / Fá#7), curto | ≈ −24 dB face ao brilho dos selos |
| 6,72 | 168 | Carta vira 180° | Virar de página (flap BP 0,9 → 2,6 → 1,1 kHz + ar grave), pan −0,5 → +0,5 | −3 dB |
| 7,00 | 175 | Preço 45.000 Kz | "Pop" fino (seno com queda de afinação 1,55× → 1175 Hz + clique) | −2 dB (transiente) |
| 8,68 | 217 | Linha dourada | Glissando pentatónico Lá6 → Lá7, L → R + brilho de ar | −2,5 dB |
| 8,96 / 9,12 | 224 / 228 | Envelope 2 | Lacre **+3 %** / papel | −2 dB |
| 9,52 / 10,08 / 10,64 | 238 / 252 / 266 | Blocos A/B/C da carta 2 | Brilhos de texto (Dó#7, Mi7, Fá#7) | subtil |
| 12,32 / 12,60 | 308 / 315 | Virar / 38.000 Kz | Virar / pop (1245 Hz) | como acima |
| 14,28 | 357 | Linha dourada | Linha dourada (pitch ±1,5 %) | como acima |
| 14,56 / 14,72 | 364 / 368 | Envelope 3 | Lacre **+6 %** / papel | −2 dB |
| 15,12 / 15,68 / 16,24 | 378 / 392 / 406 | Blocos da carta 3 | Brilhos de texto | subtil |
| 17,92 / 18,20 | 448 / 455 | Virar / 59.000 Kz | Virar / pop (1110 Hz) | como acima |
| 19,60–20,16 | 490–504 | Cartão encolhe | Swell invertido para o breakdown | música |
| 20,16 | 504 | 3 cartas: "Qual te saiu?" | **Breakdown** | música ≈ −15 LUFS M |
| 21,28 | 532 | Ícone "enviar" desenha-se | Whoosh "enviar" (BP 350 → 3800 Hz, L → R) + brilho Mi7 no fim (+0,42 s) | −0,6 dB |
| 22,40 / 23,52 / 24,64 | 560 / 588 / 616 | Blocos da 4.ª mensagem | Brilhos quentes (Lá5, Dó#6, Mi6), longos, a subir | −6,7 dB |
| 22,40–25,76 | 560–643 | "Talvez seja este." | Pad com filtro a abrir + riser discreto | música |
| 25,20 | 630 | O sol começa a subir | Sopro de ar (swell em x^2,4, cresce nos últimos 0,4 s até ao f644), BP 700 → 2600 Hz | −1 dB |
| **25,76** | **644** | **NASCER DO SOL** | **TOQUE DO SOL**: taça 220 Hz (parciais 1 · 2,71 · 5,03 · 8,12 em pares com batimento 0,9–3,3 Hz, T60 2,4 s → cauda audível ≈ 1,6 s) + maço de feltro + **drop** (bombo, prato e 1.º log drum baixados para a taça ficar à frente) | **+3,7 dB** |
| 28,00 | 700 | Cristais | Tinido de cristal (dois cristais, 3,1–6,9 kHz) + log drum Fá#2 | −3 dB |
| 28,56 | 714 | Incensos | Fumo (ar rosa BP 1400 → 650 Hz) + log drum Lá2 | −5 dB |
| 29,12 | 728 | Japamalas | Contas (11 cliques de madeira/pedra, pan disperso) + log drum Si2 | −5 dB |
| 29,68 | 742 | Taças tibetanas | Raspar de taça (Lá3 + parcial 596 Hz, tremolo de fricção 5,2 Hz) + log drum Dó#3 | −1,5 dB |
| 29,96 | 749 | Linha dourada revela o verde | Linha dourada | −1,4 dB |
| 30,24 | 756 | CTA "Marca pelo WhatsApp" | Brilho (Lá6 com apogiatura) | −1,4 dB |
| 30,80 | 770 | Número de telefone | Pop (1320 Hz) | −3 dB (transiente) |
| 31,36 | 784 | @kok.arte · kokarte.com | Brilho de texto | subtil |
| 33,60–34,72 | 840–867 | CTA desce; envelopes voltam | Anacruse: fill de log drum + prato invertido + LP a fechar | música |
| 34,16 | 854 | "Uma destas mensagens é tua." | Brilho de texto (Dó#7) | subtil |
| 34,72 ≡ 0,00 | 868 ≡ 0 | Loop | Resolve no downbeat do f0 | — |

Sons repetidos variam ±1,5–3 % de afinação e ±8–10 % de volume (hash determinístico). Nada de sons sem movimento: os fades f553–559 e f497–503 têm apenas o escurecer/swell da música.

## Decisões
- **Tom de Lá maior** para que o Toque do sol (Lá3, 220 Hz, aprovado) seja a nota do acorde do drop, e não um som "colado" por cima.
- **Loop em estado estacionário:** renderizam-se 2 ciclos idênticos e fica o 2.º, por isso a cauda da anacruse e as reverbs já estão no início. O limitador também é circular. Na 1.ª reprodução o f0 já traz a cauda das reverbs do fim, mascarada pelo downbeat. Os ciclos 1 e 2 de um render de 3 ciclos diferem no máximo −35 dB (arredondamento sub-amostra dos eventos), sem efeito na junção.
- **Log drum só a partir do f84:** no f0 o downbeat é um bombo afinado em Lá1 (não um log drum), para respeitar a entrada no f84.
- **Impactos graves: 3** (f0 downbeat, f84 entrada do log drum, f644 taça + drop). No f644 o grave do drop foi baixado para que a taça fique 3–4 dB acima da música, como pede o kit (+2–3 dB).
- **Música sintetizada:** serve de guia fiel ao corte. Para publicar, o guião prevê uma faixa amapiano licenciada ou da Biblioteca Comercial do TikTok; os SFX e o Toque do sol mantêm-se.
