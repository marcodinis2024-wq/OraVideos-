# v3 "Foco." — tabela de cues de som

> 57,6 s · 125 BPM · batida 0,48 s · compasso 1,92 s · Mi maior (Emaj9 · C#m9 · Amaj9 · B9sus4)
> Implementação: `design/v3/ora-v3-audio.js` → `window.makeAudio(ctx, dest, T0, from)`.
> **Nível** em dB relativos à cama de música no drop (0 dB ≈ −18 LUFS antes do master). A música baixa **−6 dB** sob a voz (ducking automático por `CAPS` ou, se não existir, pelos tempos de `locucao.md`). Os SFX ficam 3–12 dB abaixo da música. Só o hit final (48,00 s) fica acima.
> Paleta "de vidro e ar": senos com harmónicos curtos (2.º, 3.º e um parcial inarmónico de 40 ms), ataques de 5 ms, sala pequena (0,6 s) nos SFX e cauda longa só nos momentos-chave. Os sons repetidos (cliques, ticks, pops, taps) variam ±3 % de pitch. As notas musicais variam só ±0,6 % para ficarem afinadas. Todos os sons acompanham um movimento.

## Música (estrutura)

| Tempo | Compassos | Secção | O que soa | Nível |
|---|---|---|---|---|
| 0,00–1,92 | c1 | Intro / loop | Ar (ruído rosa em banda 900→2400 Hz, pan L→R), pad Emaj9 filtrado (LPF 560→820 Hz), shimmer granular (pentatónica de Mi, E6–E7). **Compasso idêntico ao c30** | −9 |
| 1,92–3,84 | c2 | Intro: convergência | O shimmer acelera (16 grãos/s) e converge em pitch e pan para o centro até ao "tink" | −8 |
| 3,84–7,68 | c3–4 | Intro: "sem estratégia" | Pad C#m9 → B9sus4, ar frio. No c4 o filtro abre (820→2400 Hz) e entram hats a crescer nas últimas 2 batidas | −9 → −6 |
| 7,68–15,36 | c5–8 | **Drop** | Kick em camadas (clique + knock + corpo 155→50 Hz + sub 50 Hz), snap nas batidas 2/4, hats com swing leve (semicolcheias +22 ms), baixo com sidechain (seno + triângulo + 2.º harmónico, LPF 720→220 Hz), pad com sidechain leve | 0 |
| 15,36–26,88 | c9–14 | Drop + arpejo | Entra o arpejo de vidro (colcheias, notas do acorde, pan alternado) | 0 |
| 26,88–28,80 | c15 | Respiração (4,47×) | Só o kick no 1, baixo longo e o pad. Sem hats nem snap | −4 |
| 28,80–32,64 | c16–17 | Drop | Groove completo | 0 |
| 32,64–34,56 | c18 | Respiração (−62 %) | Igual ao c15 | −4 |
| 34,56–38,40 | c19–20 | Drop | Groove completo; riser de 0,96 s no fim do c20 | 0 |
| 38,40–46,08 | c21–24 | **Breakdown** | Sem percussão. O pad abre (700 → 3100 Hz), o baixo fica sustentado sem sidechain, sinos de vidro esparsos (de 2 em 2 batidas, depois a cada batida no c23–24) e shimmer leve | −7 |
| 46,08–48,00 | c25 | Reentrada | Kick + baixo nas batidas 1–3. **Vazio na batida 4** (47,52–48,00) para o hit | −2 |
| 48,00–49,92 | c26 | **Hit** | Pad Emaj9 aberto, baixo longo em Mi, sem bateria: o hit respira | +5 |
| 49,92–55,68 | c27–29 | CTA | Groove leve: kick nas batidas 1 e 3, snap, hats nos contratempos e arpejo a meio. A última batida do c29 fica vazia | −2 |
| 55,68–57,60 | c30 | Cauda / loop | **Cópia exata do c1** (ar + pad Emaj9 filtrado + shimmer com a mesma semente). Loop sem costura | −9 |

## SFX

| Tempo (s) | Evento visual | Som | Nível |
|---|---|---|---|
| 0,00–1,00 | O "O" de vidro chega do fundo (z −1200 → 0) | Sopro de ar em banda 400→1400 Hz, centrado | −12 |
| 1,92–3,36 | As partículas curvam para o "O" | Ar a subir 600→3400 Hz, pan L→centro, mais o shimmer a convergir | −12 |
| 2,52–3,29 | Contagem 1,00 → 4,47 | 12 ticks de vidro a subir (+3 % cada) | −14 |
| 2,88–3,36 | Colapso num ponto (0,48 s) | Sopro invertido (3200→380 Hz) | −12 |
| **3,36** | O ponto flora / o 4,47× assenta (batida 4) | **"Tink"** E7 (2637 Hz) + B7 suave, cauda longa, mais sub 72→40 Hz | −2 |
| 3,95–6,70 | Cartões genéricos à deriva | 9 cliques UI dispersos, pan aleatório, **desafinados ±7 %** | −12 |
| 6,90–7,08 | Os cartões alinham-se em grelha | 4 ticks rápidos, pan L→R | −12 |
| 7,08–7,68 | Os cartões voam para dentro do "O" | Whoosh ascendente (pan L→centro) | −9 |
| **7,68** | Íris do "O" / **drop** | Whoosh grave de ar (LPF 900→120 Hz) + sub 90→38 Hz, e a música entra | −3 |
| 8,50 | Light sweep na placa | Ar agudo 2,5→7 kHz, pan L→R | −14 |
| 11,52 | Dolly lateral na fachada | Whoosh lateral, pan L→R | −10 |
| 11,95 | A pill de vidro entra | Pop de vidro | −9 |
| 13,40 | A montra vira ecrã do iMac | Whoosh descendente curto | −11 |
| 13,44 | Tilt-reveal do iMac | Ar 500→1600 Hz | −13 |
| 14,88 | Click no site | Click UI | −9 |
| 15,00–16,40 | Scroll do site | Ruído rosa filtrado + micro-ticks | −15 |
| 16,85 | O ecrã do iMac encolhe para o telemóvel | Whoosh descendente | −11 |
| 17,28 | Orbit do telemóvel | Ar, pan R→L | −14 |
| 18,24 | Tap no ecrã | Tap de vidro (A6) | −10 |
| 19,26 / 19,38 / 19,50 | 3 criativos saem em z (−200 / 0 / +200) | Whoosh + pop por cartão, pan L / C / R | −12 |
| 21,12–22,08 | 5 lâminas de vidro empilham-se (funil) | **5 notas ascendentes** B5 · C#6 · E6 · F#6 · G#6 (uma por lâmina, a cada 0,24 s) | −8 |
| 22,56 | A lâmina de topo vira ecrã | Whoosh ascendente | −11 |
| 23,04–24,96 | Reel POV | Ambiente do Reel, **placeholder sintetizado** (murmúrio filtrado, a trocar pelo áudio real) | −18 |
| 23,04 / 24,00 | Corte de plano no Reel (na batida) | Clique de corte | −9 |
| 24,96 | O Reel congela no plano 3 | Tick | −14 |
| 24,96 | O telemóvel desliza para a esquerda | Whoosh, pan R→L | −11 |
| 25,30–26,42 | Contador 835 € → 3.733 € | 18 ticks tabulares, pitch a subir 1,2 % por tick | −18 |
| 26,55 | O contador assenta | Tap de vidro (C#7) | −12 |
| 26,70 | O 4,47× sai em z para a frente | Whoosh curto | −12 |
| **26,88 / 27,12** | 4,47× sozinho no ecrã (respiração) | **Acorde ascendente de 2 notas** E5 → B5, cauda longa | −5 |
| 28,92 / 29,16 | Dois chips sobem com mola | Dois pops finos (700 → 880 Hz) | −9 |
| 30,40 | Os chips caem e viram barras | Whoosh descendente | −14 |
| 30,95–32,20 | Labar: a barra encolhe (80,61 → 30,68 €) | Whoosh invertido (3200→380 Hz, a crescer) | −10 |
| 32,24 | A medida final acende a amarelo | Nota de vidro E6 | −10 |
| **32,64** | −62 % (respiração) | Sub suave 68→32 Hz + ar | −6 |
| 34,56 | As barras de conversão sobem | Ar a subir | −14 |
| 34,80 / 34,92 | ×2,3 | Nota ascendente B5 → E6 | −8 |
| 36,05 | As barras fundem-se num anel | Whoosh | −14 |
| 36,48–37,88 | Traço de luz desenha o anel | Swoosh de traço (banda 1,2→4,2 kHz, pan em círculo L→R→L) | −11 |
| 37,92 | O anel fecha | Ding suave E6 + B6, cauda longa | −7 |
| 38,88 / 39,84 / 40,80 / 41,76 | Logótipos em tiles orbitam o "O" | Taps de vidro suaves (pan a alternar, ±3 %) | −14 |
| 41,80 / 42,24 | Os tiles recuam e a câmara entra no "O" | Whoosh + ar grave | −10 |
| 42,24–45,84 | Sala vazia, linha amarela | Riser contido (380→5200 Hz) | −15 |
| 42,45–43,35 | "Está na hORA" letra a letra | 10 ticks a subir 2 % cada | −16 |
| 45,20 | Respiração | Inspiração (ruído em banda) | −16 |
| 46,08 / 46,36 / 46,50 | O "h" cai (batida 1) e ressalta | Pop + dois taps a decrescer | −8 |
| 46,30–47,80 | O "ORA" gira 360° em Y com light sweep | Ar 900→5000 Hz, pan L→R | −15 |
| 47,70–48,00 | Íris / assentar do logo | Sopro ascendente de 0,3 s (Toque ORA) | −10 |
| **48,00** | **"Está na ORA." assenta: HIT** | Sub 130→34 Hz + corpo + ar agudo + Emaj9 em vidro. **Toque ORA**: Mi5 (seno + 10 % triângulo) e Si5 meia batida depois (48,24), reverb de 2,4 s | **+5** |
| 49,92 | Push-in do CTA | Ar grave | −16 |
| 50,40 | O botão pill aparece | Pop | −10 |
| 51,84–51,86 | Click: a pill passa a barra de URL (ora.com.pt) | Click de vidro + **eco do Toque ORA a −9 dB** (Mi5 → Si5, sem sub, cauda de 2,4 s) + whoosh curto | −9 |
| 55,68 | O "O" solta-se e dissolve-se em pontos | Whoosh descendente suave. O shimmer da música é o mesmo de 0,00 s | −14 |

**Impactos graves:** 3 no vídeo, em 7,68 (drop), 32,64 (−62 %) e 48,00 (hit). O sub do "tink" em 3,36 s é suave e não conta como impacto.

## Medições do render de teste (`dist/ORA-v3-banda-sonora-teste.wav`)

Ver o relatório do agente de som. Método: `OfflineAudioContext(2, 48000·57,6, 48000)` → normalização de pico + `tanh` suave (K = 2,2, como na v2) → `ffmpeg volumedetect` / `ebur128`.
