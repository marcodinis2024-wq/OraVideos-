# KOKARTE · anúncio "Mais do que uma loja" — cues de áudio (30 s + corte 15 s, sem voz)

Fonte de verdade: `briefing/kokarte/03-anuncio-campanha.md` §6, §8, §9 e §10 · som da marca: `brands/kokarte/brand.md` §7.
Ficheiros: `kokarte-anuncio-audio.js` (síntese, arranjos 30/15 e cues), `kokarte-anuncio-audio.html` (render offline, −14 LUFS, limitador, botões para ouvir), `kokarte-anuncio-audio-render.js` (Playwright → WAV).

```
node design/kokarte/anuncio/kokarte-anuncio-audio-render.js              # → dist/kokarte-anuncio-30-audio.wav + dist/kokarte-anuncio-15-audio.wav
node design/kokarte/anuncio/kokarte-anuncio-audio-render.js 15           # só um corte
node design/kokarte/anuncio/kokarte-anuncio-audio-render.js stems 30 DIR # music.wav + sfx.wav (ganho do master, sem limitador)
GR=1 CEIL=-1.9 node design/kokarte/anuncio/kokarte-anuncio-audio-render.js   # mostra onde o limitador atua / muda o teto
```

Grelha: **125 BPM, 1 batida = 12 fotogramas = 0,48 s**, 16.ª = 3 fotogramas. Batida b → fotograma 12·b → tempo 0,48·b s.

## Master (medido com ~/bin/ffmpeg ebur128=peak=true)

| | 30 s | 15 s |
|---|---|---|
| Ficheiro | `dist/kokarte-anuncio-30-audio.wav` | `dist/kokarte-anuncio-15-audio.wav` |
| Formato | WAV PCM 24-bit · 48 kHz · estéreo | idem |
| Duração | **1 474 560 amostras = 30,720 s** (768 fotogramas) | **737 280 amostras = 15,360 s** (384 fotogramas) |
| Loudness integrada | **−14,0 LUFS** | **−14,0 LUFS** |
| True peak | **−1,4 dBTP** | **−1,5 dBTP** |
| LRA | 1,4 LU | 1,5 LU |
| Limitador | brickwall, look-ahead de 1,5 ms, release de 120 ms, teto de amostra −1,9 dBFS. Chega a −4,3 dB só nos 3 impactos pesados (b0, b28, b56); no groove fica entre −1 e −1,5 dB | máx. −3,9 dB (b0, b16, b24) |

Cadeia da música: bombo, baixo e percussão → saturação `tanh` suave ("glue"); pads, keys, stabs, gancho e chops → **sidechain do bombo** (bombeio de −6 dB, recuperação de 75 ms); reverb de sala de 2,2 s; delay ping-pong (colcheia pontuada / colcheia) nos chops, no gancho e nos stabs; EQ de mastering da música com low-shelf −3 dB a 110 Hz e high-shelf +5 dB a 2,4 kHz (o mix era escuro demais para telemóvel). Desvanecimento só nos últimos 0,34 s.

## Música: afro-house luminoso, 125 BPM, Lá maior

Instrumentos (todos sintetizados): bombo 4/4 redondo (170→52 Hz + clique), **sub baixo sincopado** (seno com 2.º harmónico e tanh para se ouvir em telemóvel, fora dos bombos: 16.as 3·6·7·10·14 → variação 3·5·6·10·13·15 a partir das Terapias), hats abertos no contratempo e fechados nas 16.as, shaker em 16.as com swing leve (9 ms), **congas** (262/196 Hz, slap na 16.ª 10), bongós (440 Hz) a partir das Terapias, rim sincopado, **palmas nos tempos 2 e 4** a partir das Terapias, rhodes FM em contratempo, pads quentes (serras ±8 cents), **gancho de marimba** com 8 notas por compasso (E5 C#5 E5 A5 F#5 E5 + cauda conforme o acorde; passa a **kalimba** no breakdown), **vocal chops** (serra → 3 formantes "ah/eh/oh" com vibrato), stabs de acorde (serras desafinadas com filtro), risers (ruído + serra a subir), pratos invertidos, toms de fill.

Harmonia (batida: acorde), sempre Amaj9 · F#m9 · Dmaj9 · E6/9:

- **30 s:** b0 A · b4 F#m · b8 D · b12 E · b16 A · b20 F#m · b24 D · b26 E (fill) · **b28 A** (Terapias arrancam na tónica) · b32 F#m · b36 D · b40 E · b44 F#m · **b48 D** (breakdown) · b52 E · **b56 A** (drop final) · b60 E · **b62 A + taça**.
- **15 s:** b0 A · b4 F#m · b8 D · b12 E · **b16 A** · b20 D · b22 E · **b24 A** · b28 E · **b30 A + taça**.

| Secção | 30 s | 15 s | Arranjo |
|---|---|---|---|
| Gancho + marca (C1–2) | b0–b7 | b0–b7 | **Drop imediato em f0**: bombo, baixo, hats, shaker, congas desde a 16.ª 6, rhodes. Stabs nas 3 palavras (b0 Amaj9 · b1 A6 · b2 Amaj9 uma oitava acima) |
| A Loja (C3–7) | b8–b27 | b8–b15 | Groove completo + **gancho de marimba** + rim |
| Fill | b26–b27: toms (8 golpes a descer), sem bombo no b27, riser | b15: 4 toms, riser b14–16 | Prato invertido até ao capítulo |
| Terapias (C8–12) | b28–b47 | b16–b23 | Groove brilhante: **palmas 2/4, vocal chops, bongós**, variação do baixo, rhodes extra, pad mais aberto |
| Pré-breakdown | b45–b48: riser + prato invertido | b22–b24: riser + rolo de palmas | |
| **Breakdown** (C13–14) | b48–b55 | — | Sai o bombo, o baixo e a percussão; pad aberto, **kalimba** com o gancho, chops filtrados a 1,4 kHz; shaker a crescer desde b52; riser b52–56 com filtro do pad a abrir (1,4 → 6 kHz); **rolo de palmas** b54–56 (16.as → 32.as) |
| **Drop final** (C15–16) | b56–b61 | b24–b29 | Tudo de volta (groove brilhante + marimba) |
| Final | b62 | b30 | Bombo longo, stab aberto de Amaj9, baixo em Lá, rhodes, marimba A5→E5; cauda e desvanecimento até ao fim |

## Tabela de cues — 30 s

Nível = diferença de loudness curta (K-weighted, janela de 0,3 s) SFX − música no momento do cue, medida nos stems.

| Tempo | Batida / fotograma | Evento visual | Som | Nível |
|---|---|---|---|---|
| 0,00 | b0 · f0 | Linha dourada + slam **RESPIRA.** | **Drop imediato** (bombo, baixo, hats) + stab 1 + **impacto pesado** (sub 62→30 Hz) + prato | impacto +4,8 dB |
| 0,48 | b1 · f12 | Slam **RECARREGA.** | stab 2 (A6, nota de cima F#5) | música |
| 0,96 | b2 · f24 | Slam **BRILHA.** a ouro + light sweep | stab 3 (oitava acima) + **brilho** (glissando pentatónico L→R + ar) | −5,3 dB |
| 1,44 | b3 · f36 | **Sunburst** | **whoosh ascendente** estéreo do centro para fora (300 Hz → 4,2 kHz) que culmina no b4; prato no groove | −3,4 dB |
| 1,92 | b4 · f48 | Logótipo assenta | **Toque do sol** (taça 220 Hz) por cima do groove | −0,7 dB (taça +3 dB) |
| 2,88 · 3,12 · 3,36 | b6 · b6,5 · b7 | 3 pílulas LOJA · TERAPIAS · EXPERIÊNCIA | 3 pops afinados C#6 · E6 · A6 (pitch ±1 %) | −7 a −8 dB |
| 3,84 | b8 · f96 | "01 A LOJA" | **impacto leve + tom** (110→62 Hz + Lá2) + prato suave; entra a marimba | +0,3 dB |
| 4,80 → 11,52 | b10, 12, 14, 16, 18, 20, 22, 24 | Carrossel: 8 cartões entram da direita | **whoosh R → centro** (arranca 0,14 s antes, pico na batida, pitch ±6 % por cartão) + **tique de madeira** ao assentar (+40 ms) | −5 a −6 dB |
| 12,48 | b26 · f312 | Mosaico 2×4 | fill de toms + riser + prato invertido | música |
| 13,44 | b28 · f336 | Sunburst + pergaminho "02 TERAPIAS" | **impacto pesado** + prato; entram palmas e vocal chops | +5,1 dB |
| 14,40 | b30 · f360 | Cartão Reiki (59.000 Kz) | **swipe** (sobe) + **contagem** f368–f377 (10 tiques a subir 1,9 → 2,9 kHz) + **"ding"** de dois tons ascendentes E6→A6 em **f378** (preço assenta; a = f362) | −5 dB |
| 15,84 | b33 · f396 | Massagem (38.000 Kz) | idem (contagem f402–411, ding f412) | −5,4 dB |
| 17,28 | b36 · f432 | Mapeamento (45.000 Kz) | idem (contagem f438–447, ding f448) | −7 dB |
| 18,72 | b39 · f468 | Programa (150.000 Kz) | idem (contagem f474–483, ding f484) | −6,9 dB |
| 20,16 | b42 · f504 | RESET (8.500 Kz) | idem (contagem f510–519, ding f520) | −7 dB |
| 21,60 | b45 · f540 | 5 cartões em leque | 3 whooshes suaves em cascata L→R; riser + prato invertido na música até ao b48 | −8,7 dB |
| 23,04 | b48 · f576 | Floresta + partículas "03 A EXPERIÊNCIA" | **breakdown** (sai o bombo) + **impacto leve + tom** + **taça** (80 %) | impacto +1,2 · taça −2 dB |
| 23,52 | b49 · f588 | Carta do oráculo sobe | kalimba (música) + **brilhos** (4 sinos agudos espalhados no estéreo) | −8,8 dB |
| 24,96 → 26,88 | b52–b55 | Vela em ecrã inteiro, "Mais do que uma loja." | pad a abrir + riser + shaker a crescer + rolo de palmas b54–56 | música |
| 26,88 | b56 · f672 | Sunburst → sala verde + logótipo | **drop de volta** + **impacto pesado** + prato | +4,6 dB |
| 27,36 → 30,24 | b57 … b63 | Botão CTA a pulsar em cada batida | **pluck** por pulso: E5 · A5 · C#6 · B5 · G#5 · A5 · E6 (segue o acorde; pan e pitch variam ligeiramente) | −3 a −6 dB |
| 29,76 | b62 · f744 | Brilho final no sol | acorde final + **Toque do sol** | −2,3 dB |
| 30,38 → 30,72 | f760–768 | Tudo assente | cauda + desvanecimento de 0,34 s | — |

Impactos graves (sub): **3 pesados** (b0, b28, b56). Os de b8 e b48 são leves (tom afinado sem sub), para marcar o capítulo sem gastar o peso.

## Tabela de cues — 15 s

Níveis medidos no 15 s: impactos pesados +4,8 / +5,6 / +5 dB · whooshes secos ≈ −6 dB · pops b22–23 −10 dB (por baixo do riser) · plucks −4,7 dB · taça final −2,3 dB.

| Tempo | Batida / fotograma | Evento visual | Som |
|---|---|---|---|
| 0,00 → 3,36 | b0–b7 | Igual ao 30 s (gancho + marca) | Igual: drop, stabs, impacto pesado, brilho, sunburst, taça no b4, 3 pops |
| 3,84 | b8 · f96 | A LOJA | impacto leve + tom; marimba entra |
| 3,84 → 7,20 | b8 … b15 (1 por batida) | 8 produtos, entradas secas | whoosh **curto** (0,22 s, pré-roll de 80 ms) R → centro + tique |
| 7,20 | b15 | — | 4 toms + riser + prato invertido |
| 7,68 | b16 · f192 | Sunburst + pergaminho, TERAPIAS, Reiki | **impacto pesado** + prato; palmas e chops entram; swipe + contagem f196–204 + ding **f205** (a = f194) |
| 8,64 | b18 · f216 | Massagem | swipe + contagem f218–226 + ding f227 |
| 9,60 | b20 · f240 | Mapeamento | swipe + contagem f242–250 + ding f251 |
| 10,56 · 11,04 | b22 · b23 | Pílulas "+ Programa · RESET" | 2 pops E6 · A6; riser e rolo de palmas até ao b24 |
| 11,52 | b24 · f288 | CTA (= b56 do 30 s) | **drop final** + **impacto pesado** + prato |
| 12,00 → 14,88 | b25 … b31 | Botão a pulsar | plucks E5 · A5 · C#6 · B5 · G#5 · A5 · E6 |
| 14,40 | b30 · f360 | Brilho final no sol | acorde final + **Toque do sol** |
| 15,02 → 15,36 | — | — | cauda + desvanecimento |

## Notas para o motion

- **Preços** (sincronizado com `kokarte-anuncio.html`; a = fotograma da batida do cartão, **+2 no 1.º cartão**, o Reiki): swipe na batida do cartão. **30 s:** 10 tiques em a+6…a+15, ding em a+16 (a contagem visual corre de a+6 a a+16). **15 s:** 9 tiques em a+2…a+10, ding em a+11. Os valores estão em `c0`/`c1`/`set` (e `a`) nas entradas `preco` dos arranjos em `kokarte-anuncio-audio.js`.
- **Cartões do carrossel:** o pico do whoosh e o tique coincidem com a batida de entrada. O ataque expo-out do cartão encaixa aí.
- Os níveis por tipo estão em `LEV` (dB) em `kokarte-anuncio-audio.js`. Depois de mudar um nível, basta voltar a correr o render: a normalização a −14 LUFS é automática.
