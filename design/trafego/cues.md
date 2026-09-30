# "Meta ou Google? Pergunta errada." — tabela de cues de som

> 94,0 s · 47 compassos · 120 BPM · batida 0,5 s · compasso 2 s · semicolcheia 0,125 s · 60 fps (fotograma = t × 60).
> Tom: Mi maior (Emaj9 · C#m9 · F#m9 · B9sus4; Amaj9 no breakdown e no c42). Indie-electronic / funk moderno.
> Implementação: `design/trafego/ora-trafego-audio.js` → `window.makeAudio(ctx, dest, T0, from)`.
> **Nível** em dB relativos à cama de música no drop (0 dB ≈ −18 LUFS antes do master). A música baixa **−7 dB** sob a voz (ducking por `window.CAPS`; se não existir, pelas CAPS do plano). Os SFX ficam 3–12 dB abaixo da música; só os 3 impactos graves e o Toque ficam acima.
> **Regras:**
> - Os sons repetidos (ticks, clicks, pops, teclas, moedas, swipes, whooshes) variam ±3 % de pitch com hash fixo. As notas musicais (dings, Toque) variam só ±0,6 % para ficarem afinadas.
> - Cada som acompanha um movimento, e cada corte de compasso tem o seu som.
> - Os whooshes fazem pan na direção do movimento.
> - **Impactos graves (sub 130 → 34 Hz): só 3, a 48,0, 80,0 e 88,0.** f0, 14,0 e 26,0 são impactos médios, sem sub profundo.

## Música (estrutura)

| Tempo | c | Secção | O que soa | Nível |
|---|---|---|---|---|
| 0–4 | c1–2 | **Intro filtrada / loop** | Filtro global LPF 650 Hz. Pad Emaj9 → C#m9, hook de clav (pergunta de 2 compassos), chops funk nas semicolcheias 3 e 11, shaker e ar rosa com pan L↔R. **Cópia exata do c46–47** | −12 |
| 4–8 | c3–4 | Intro a abrir | O filtro abre de 650 para 4200 Hz. Chops em 4 tempos. No c4: hats a crescer, pratos invertidos e rufo de palmas 7,5 → 7,875; **vazio de 1 semicolcheia** antes do drop | −10 → −5 |
| 8,0 | c5 | **Drop** | Filtro aberto num salto; crash; entram o kick (em camadas, com sidechain) e o baixo funk (oitavas, quintas e ghost notes) | 0 |
| 8–24 | c5–12 | Drop 1 | Kick 1 · 2a · 3 · 3e, palmas no 2 e 4, ghost snares, hats a 16 com swing de 15 ms, chops (guitarra sintetizada). O hook de clav entra no c7. Pratos invertidos no fim do c12 | 0 |
| 24,0 | c13 | **Tape-stop** | O acorde, o baixo, o lead e o kick abrandam até parar (0,75 s, frequência × 0,04) e o filtro fecha de 20 k para 280 Hz. Depois fica a sala escura: drone Mi1/Mi2, ar grave e prato invertido para a volta | −4 → −20 |
| 26,0 | c14 | **A música volta** | Crash + groove completo (sem hook nos c14–15) | 0 |
| 30–38 | c16–19 | Groove + hook | Volta o hook de clav | 0 |
| 38–40 | c20 | Respiração (ROAS 2,8) | Kick no 1 e no 3, baixo longo, hats leves, rufo de palmas de entrada | −4 |
| 40–48 | c21–24 | **Breakdown** | Sem bateria. Pad a abrir (900 → 3400 Hz), baixo sustentado, plucks de vidro a densificar (2 → 4 → 8 → 16 por compasso), ar. Riser SFX 46–47,8; **vazio 47,75–48** | −6 |
| 48,0 | c25 | **Drop 2** | Crash. **O lead passa a teclas:** piano elétrico FM (comping nas semicolcheias 3, 8, 11 e 15; hook em oitavas a partir do c26) | 0 |
| 48–72 | c25–36 | Drop 2 | Groove completo com teclas. No c36 falta a última semicolcheia (micro-vazio antes do glitch) | 0 |
| 72,0 | c37 | **Glitch + filtro a fechar** | Stutter em fusas (gate) 72,0–72,75; LPF 20 k → 360 Hz com ressonância a subir (Q 0,9 → 5,5) até 73,9 | 0 → −10 |
| 74–80 | c38–40 | **Half-time** | Kick no 1, palma no 3, baixo em mínimas, acordes de teclas longos. Filtro a reabrir 700 → 2600 → 16 k. Riser SFX 78–79,75 e rufo a acelerar; **vazio 79,75–80** | −6 → −2 |
| 80,0 | c41 | **Impacto** | Crash + groove completo com teclas, hook mais presente | +1 |
| 82–84 | c42 | Groove (Amaj9) | Por baixo do cha-ching completo | 0 |
| 84–88 | c43–44 | **Pad** | Sem bateria. Pad F#m9 → B9sus4 a abrir, baixo longo, acordes de teclas, ar. **Vazio a partir de 87,72** | −6 |
| 88,0 | c45 | **Hit** | Pad Emaj9 aberto + baixo longo em Mi, sem bateria. O Toque respira. O filtro fecha para 650 Hz entre 89,55 e 90 | −4 |
| 90–94 | c46–47 | **Cauda = intro** | Cópia exata dos c1–2 (mesmas notas, filtro a 650 Hz e sementes). Liga-se sem costura a 0,0 | −12 |

## SFX

| Tempo (s) | Evento visual | Som | Nível |
|---|---|---|---|
| **0,00** | Ecrã partido a 18° (f0 / loop) | **Impacto médio** (corpo 105 → 46 Hz + ruído grave) + tick de vidro | −3 |
| 0,30–1,70 | A pesquisa escreve "bolo aniv…" | Teclado: 9 teclas (clique + "thock" + retorno), ritmo humano, ±3 % | −14 |
| 2,00–2,50 | As metades aproximam-se | Ar invertido (cresce e corta no choque) | −12 |
| 2,12–2,50 | Metade de cima ←, metade de baixo → | 2 whooshes a convergir (pan −0,7 → 0 e +0,7 → 0) | −11 |
| **2,50–2,57** | Choque + glitch RGB (4 fotogramas) | Glitch digital bitcrushed + dip na música (gate 25 %) | −7 |
| 2,60–3,80 | "?" gigante a rodar em Y | Ar em banda 600 → 1800 Hz, pan L→R | −16 |
| 4,00–4,60 | "?" → cartão de vidro (tilt-reveal) | Ar 500 → 1500 Hz | −14 |
| 4,55 | O cartão assenta | Pop 620 Hz | −8 |
| 5,05 | Chip "Exemplo ilustrativo" (canto superior direito) | Tick de vidro, pan +0,6 | −17 |
| 6,05 / 6,30 | Moedas de 150 € caem (esq. / dir.) | Whoosh descendente, pan −0,5 / +0,5 | −15 |
| 6,35 / 6,60 | Aterram com mola | Tique + tilintar (3 ressaltos a encurtar), pan −0,5 / +0,5 | −12 |
| 7,90–8,10 | A moeda entra no telemóvel | Swipe, pan −0,5 → 0 | −10 |
| **8,00** | **Drop** | Crash + kick + baixo (música) | 0 |
| 8,30–9,60 | Orbit −18 → +6 | Ar, pan −0,6 → +0,4 | −17 |
| 9,20 | O anúncio sobe no feed | Swipe curto | −13 |
| 9,96 | Corte para o mapa | Swipe, pan +0,4 → −0,2 | −15 |
| 10,25 · 10,55 · 10,85 · 11,15 | 4 chips filtram | 4 clicks, pan −0,45 → +0,45 | −11 |
| 11,45–11,60 | Os pontos que ficam acendem | 3 ticks a subir | −20 |
| 12,00 | 3 anúncios entram | Whoosh ascendente, pan −0,7 → +0,3 | −12 |
| 13,55–14,00 | O martelo cai | Whoosh descendente | −11 |
| **14,00** | Martelo de vidro bate | **Impacto médio**: knock 420 → 160 Hz + corpo 150 → 58 Hz + anel de vidro Mi6/Si6 | −4 |
| 15,00 | Ganha o anúncio com o maior anel | Pop + nota Mi6 | −9 |
| 16,00 | Carimbos a fugir em z | Whoosh descendente, ao centro | −12 |
| 16,40–17,20 | Contador 0 → 30.000 | 16 tiques de contador (ease-out, pitch +1,2 % cada) + punch | −16 / −9 |
| 18,00–19,50 | Dolly com parallax | Ar, pan +0,6 → −0,4 | −17 |
| 18,10–18,90 | Os carimbos agrupam-se em cabeças | 8 pops em cascata, pan L→R, a subir | −12 |
| 19,25 | 12.000 assenta | Tap de vidro | −13 |
| 20,00 | Entram 2 pessoas | Swipe | −15 |
| 20,30 · 20,55 | Pessoa 1: 2 marcas | Ding ×2 (Sol#5, Si5), pan −0,4 | −11 |
| 20,90 · 21,10 · 21,30 | Pessoa 2: 3 marcas | Ding ×3 (Sol#5, Si5, Mi6), pan +0,4 | −11 |
| 21,45 | As marcas fundem-se em 2,5 | Sopro invertido curto, pan +0,4 → 0 | −15 |
| 22,00–22,55 | 1.000 pontos compactam-se | Implosão (sopro invertido), pan −0,4 → +0,4 | −13 |
| 22,60 / 23,25 | Cubo assenta / etiqueta 5 € | Click / tick | −9 / −16 |
| **24,00** | O cubo estala → sala noite | Vidro a estalar + **tape-stop** na música | −8 |
| 24,55 · 25,00 | O coração treme | "Lub-dub" grave ×2 | −10 |
| 25,30 | O coração dá glitch | Glitch 0,2 s | −9 |
| 25,50–26,00 | (antecipa a volta) | Ar invertido | −12 |
| 25,85–26,00 | O coração cai | Whoosh descendente | −13 |
| **26,00** | A música volta | **Impacto médio** + crash | −4 |
| 27,00 | Pill-dedo toca em "Saber mais" | Click | −9 |
| 28,00 | 100 pontos passam | Swipe, pan −0,6 → +0,6 | −10 |
| 28,55 | 1 entra | Tick | −13 |
| 29,00–29,60 / 29,25 | Zoom-out até 300 | Ar descendente / tick | −17 / −14 |
| 29,98 | As moedas começam a cair | Whoosh descendente | −16 |
| 30,30 · 30,70 · 31,10 · 31,50 | Moedas de 0,50 € na ranhura | 4 moedas (clink metálico + ranhura), ±3 % | −11 |
| 32,00–32,60 | Entram 300 pontos no funil | Whoosh descendente | −11 |
| 32,90–33,70 | Saem 12 caixas | 12 pops, pan L→R | −12 |
| 34,00–34,50 | A caixa roda em Y | Ar 700 → 2200 Hz, pan L→R | −14 |
| 34,50 / 35,00 / 35,40 | Etiqueta / 12,50 € / chip CPL | Click / ding Mi6 / tick | −9 / −11 / −18 |
| 36,00 | 12 caixas empilham-se | Whoosh ascendente | −14 |
| 36,20–37,00 | Contador amarelo → 420 € | 14 tiques de contador | −17 |
| 37,00 | 420 € assenta | **Cha-ching discreto** ("cha" + Mi7/Sol#7 curto, sala pequena) | −11 |
| 38,00–39,50 | Halo + push-in | Ar grave | −19 |
| 38,10 · 38,35 | ROAS 2,8× | 2 notas ascendentes: Si5 → Mi6 | −10 |
| **40,00** | Balança de vidro aparece | Ding grave (Mi4, cauda 2,6 s) + sub leve | −7 |
| 40,40–41,50 | A balança inclina | Ar, pan −0,4 → +0,4 | −19 |
| 42,00 / 42,60 | Linhas tracejadas 2× / 2,8× | Tick Si6 / Ré7, pan −0,3 / +0,3 | −18 |
| 44,00–45,80 | O pixel viaja pelas encomendas | Ar agudo, pan −0,7 → +0,7 | −20 |
| 44,50 · 45,00 · 45,50 | Anota cada encomenda | Tick | −20 |
| 46,00–46,50 | Acendem pessoas parecidas | 6 pops a subir | −15 |
| 46,00–47,80 | (sobe para o drop 2) | **Riser** (ruído 380 → 6200 Hz + serra Si2 → Mi4) | −10 |
| 47,55–48,15 | **Faixa amarela a 18° (1.ª de 2)** | Whoosh da faixa (passa-banda 300 → 4000 Hz, pan L→R) + corpo grave | −6 |
| **48,00** | **Drop 2** / revela o papel | **Impacto grave #1** (sub 130 → 34 Hz + ar agudo) | +2 |
| 50,10–51,60 | Cursor escreve "encomendar bolo aniversário leiria" | Teclado rápido (22 teclas, ±3 %) | −15 |
| 51,50–52,10 | A porta abre-se ao fundo | Ar suave, pan à direita | −19 |
| 52,10 | As palavras soltam-se | Swipe | −14 |
| 52,50 · 52,90 · 53,30 | Pills encaixam na chave | Click ×3, pan L · C · R | −10 |
| 54,20 | "bolo": fria | Tick grave (Sol6) | −18 |
| 54,80–55,80 | O termómetro aquece | Riser de 1 s | −14 |
| 55,80 | "encomendar…": quente | Nota Mi6 | −13 |
| 56,00 | A página passa a navy | Swipe, pan −0,6 → +0,6 | −10 |
| 56,60 · 56,75 | 2 cartões "Patrocinado" | Pop ×2, pan −0,3 / +0,3 | −10 |
| 58,10–58,49 | Torre do Concorrente X (4 blocos) | 4 tiques, pitch +6 % por bloco, pan −0,45 | −18 |
| 58,75–59,52 | Torre da Bolacha Azul (8 blocos) | 8 tiques, pitch +6 % por bloco, pan +0,45 | −18 |
| 60,00–60,30 | A Bolacha Azul sobe com mola | Whoosh ascendente | −14 |
| 60,30 | Chega ao 1.º lugar | Ding Mi6 + Si6 + sub leve | −8 |
| 62,00 | 5.000 cartões a fugir em z | Whoosh descendente | −12 |
| 62,60–63,40 | 250 acendem | 14 tiques de contador + punch | −16 / −9 |
| 64,00 / 64,40 | Moeda de 0,60 € na ranhura | Swipe / moeda | −15 / −10 |
| 66,00–66,60 | Funil mais largo | Whoosh descendente | −11 |
| 66,80–67,75 | Saem 15 caixas | 15 pops | −13 |
| 68,00 / 68,50 | Caixa roda / 10 € | Ar (pan R→L) / ding Mi6 | −14 / −11 |
| 70,10–70,90 | Contador amarelo 525 € → 3,5× | 14 tiques de contador | −17 |
| 70,95 | 3,5× assenta | **Cha-ching discreto** | −11 |
| 71,60–72,00 | O 3,5× cresce | Mini-riser 0,4 s | −20 |
| **72,00–72,50** | Glitch | Glitch 0,5 s + stutter da música + filtro a fechar | −7 |
| 72,55–73,40 | O 3,5× parte-se | Vidro a estalar + 14 estilhaços a cair (pitch a descer, pan espalhado) | −7 |
| 73,60–74,15 | **Faixa a 18° (2.ª e última)** | Whoosh da faixa, pan L→R | −7 |
| 74,30–75,90 | O "cheiro" ondula para fora do telemóvel | Ar ondulante (pan +0,5 ↔ −0,5, 4 ondas) | −16 |
| 75,20 | As pessoas viram a cabeça | Swipe leve | −16 |
| 76,00 | As pessoas vão à pesquisa | Swipe, pan L→R | −10 |
| 76,30–76,70 | Escrevem | 5 teclas | −19 |
| 76,90 | Entram pela porta em pill | Click | −9 |
| 78,00–79,75 | (sobe para o impacto) | **Riser** (com rufo e filtro na música) | −10 |
| 78,30–79,20 | O cheiro desaparece, a pesquisa esvazia | Sopro invertido, pan −0,3 → +0,3 | −15 |
| **80,00** | Os 2 funis fundem-se num só | **Impacto grave #2** + crash | +1 |
| 80,20–80,90 | Orbit −20 → 0 | Whoosh ascendente, pan +0,6 → −0,1 | −13 |
| **82,00** | 945 € a amarelo | **Cha-ching completo, o único**: roquete + gaveta + "cha" + chuva de 9 moedas + Mi7/Sol#7 com cauda longa | −3 |
| 84,00–84,60 | O "0" de 3,15 vira o "O" da ORA | Sopro ascendente 400 → 2600 Hz | −9 |
| 84,60–85,20 | Íris para a sala navy | Ar descendente | −16 |
| 85,30 | O chip sai | Swipe para a direita | −16 |
| 86,10–86,90 | 9 métricas em onda | 9 tiques: pitch sobe e desce, pan L→R | −18 |
| 86,40–87,70 | → "Está na hORA" | Riser curto (sem tom) | −13 |
| 87,70–88,00 | Íris → "O" | **Sopro ascendente 0,3 s** (brand.json) | −7 |
| **88,00** | O "h" cai | **Impacto grave #3** + acorde de vidro Emaj9 + **Toque ORA: Mi5 a 88,00, Si5 a 88,24**, cauda de 2,4 s | +3 |
| 88,50–89,70 | "ORA" roda em Y + light sweep | Ar agudo 2,5 → 7 kHz, pan L→R | −19 |
| 90,10 | A pill faz morph para o CTA | Click de vidro | −9 |
| 90,15–90,50 | Morph | Whoosh curto | −17 |
| 90,40–91,60 | Push-in 1 → 1,04 | Ar grave (cauda) | −20 |
| 92,00 | "META OU GOOGLE?" volta | Swipe | −16 |
| 93,20–94,00 | → loop | Ar invertido (cresce até ao impacto de 0,00) | −12 |
| 93,50–93,95 | A faixa a 18° volta a partir o ecrã | Whoosh, pan −0,8 → +0,8 | −15 |
