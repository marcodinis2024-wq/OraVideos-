# Vídeo v3 — "Foco." (conceito e storyboard)

> 29 set 2026 · 9:16 · 1080×1920 · 25 fps · **57,6 s = 30 compassos a 125 BPM** (batida = 0,48 s = 12 fotogramas; compasso = 1,92 s)
> Base: `01`–`06`, skills `roteiro-viral` e `motion-premium`. Render: `render(t)` puro, como em `design/v2/ora-v2.html`.
> Regras: sem nomes da equipa ("nós"); só números verificados, com fonte em rodapé; nada operacional.

## 1. Big idea

**O "O" da ORA é uma lente.** O marketing sem estratégia é luz espalhada: muitos pontos amarelos, nenhum sítio iluminado. Quando a luz passa pelo "O", fica focada, e o que ela ilumina são resultados reais.

**Porque retém:** o gancho mostra uma transformação física (luz dispersa → um ponto brilhante → 4,47×) antes de dizer qualquer coisa. A metáfora é uma só e volta em todos os planos: o "O" foca, a câmara atravessa o "O", o vídeo acaba com o "O" a abrir-se de novo para a luz espalhada (loop perfeito). Fica 100 % ORA: a íris é o logótipo, o navy é a sala e o amarelo é a luz (e a luz marca sempre o resultado).

## 2. Ganchos (0–3,84 s)

| | Visual | Texto | Voz / som |
|---|---|---|---|
| **A · Lente** ✅ | Sala navy escura. Centenas de pontos amarelos à deriva, desfocados. Um "O" de vidro entra em profundidade (z −1200 → 0); a luz converge por dentro e fica um ponto que cresce até **4,47×** | "Mesma luz. Outro foco." → "Cada euro voltou 4,47×" | "Um euro. Com foco, volta quatro e quarenta e sete." · SFX: ar/shimmer que converge num "tink" |
| B · Número-choque | Cartão de vidro com "835 €" roda 180° em Y e mostra "3.733 €" | "835 € entraram. 3.733 € voltaram." | "Oitocentos e trinta e cinco euros. Olha o que voltou." |
| C · Hora | Mostrador minimalista feito com o "O"; ponteiros às 02:47 (eco da Lume) disparam | "Ainda à espera de resultados?" | Tique-taque suave → "Está na hora." |

**Escolhido: A.** Faz quebra de padrão só com luz e movimento (funciona sem som), é propriedade da ORA (a íris do "O") e entrega o número mais forte ao segundo 3. B fica como gancho do cut-down de 15 s; C é repetitivo em relação à v1.

## 3. Storyboard

Legenda de câmara: `persp` = perspective do palco; eixos no máximo 2 por plano. Curvas: entrada `cubic-bezier(0.16,1,0.3,1)`, saída `(0.7,0,0.84,0)`, câmara/morph `(0.65,0,0.35,1)`. Legendas palavra a palavra em todos os planos (Rawson Medium, zona 1450–1650 px).

| Tempo (compasso) | Plano & câmara 3D | Composição & luz | Texto no ecrã | Voz PT-PT | SFX | Transição |
|---|---|---|---|---|---|---|
| **0,00–1,92** (c1) | `persp 2200`. Partículas em 3 camadas de profundidade (blur 12/6/0 px). O "O" de vidro chega do fundo, z −1200→0, rotateY 18°→0° | Centro. Key light radial muito larga atrás do "O" (+8 %). Rim light 1 px branco 18 % no aro. Grão 4 % | *Mesma luz.* (slide-up com máscara, 1,0 s) | "Um euro." | Pad de ar + shimmer granular | — |
| **1,92–3,84** (c2) | Push-in 1,00→1,06. As partículas curvam para o "O" e colapsam num ponto (0,48 s) | O ponto flora em amarelo #F5DF1E; tudo o resto escurece 10 % | **4,47×** gigante (ExtraBlack, contagem 1,00→4,47 com blur vertical e settle 2 %) · *Cada euro voltou 4,47×* | "Com foco, volta quatro e quarenta e sete." | "Tink" limpo na batida 4 + sub suave | Corte na batida |
| **3,84–7,68** (c3–4) | Pull-back lento (scale 1,06→0,92). Revela: os pontos eram dezenas de cartões de vidro (posts genéricos, corações, "gosto") a flutuar desfocados em z | Luz fria e plana, sem key light: é a sala "sem estratégia" | *Publicar mais* → *não é estratégia.* | "Publicar mais é luz espalhada. Não ilumina nada." | Cliques UI dispersos, ligeiramente desafinados | Os cartões alinham-se numa grelha e voam para dentro do "O" (morph 0,6 s) |
| **7,68–11,52** (c5–6) · **drop** | Câmara atravessa o "O" (scale 1→14, íris). Do lado de lá: foto da **placa amarela**, tilt-reveal rotateX 12°→0° | Placa a encher 70 % do quadro; light sweep branco 12 % em screen a atravessar as letras | **Estúdio ORA** · *Design com estratégia.* (palavra a palavra, stagger 90 ms) | "Nós somos o foco. Estúdio ORA." | Whoosh grave de ar + **drop** da música (kick entra) | Íris do "O" (match cut) |
| **11,52–13,44** (c7) | Dolly lateral na **fachada** com parallax (3 camadas: montra 1,4×, fachada 1×, céu 0,6×) | Pill de vidro (blur 24 px, stroke 30 %) a entrar por baixo | *Leiria, desde 2016.* | "Em Leiria, desde 2016." | Pop suave da pill | A montra escurece e vira o ecrã do iMac (match cut de retângulo) |
| **13,44–17,28** (c8–9) | **iMac SB Smiles**: tilt-reveal rotateX 25°→0° + orbit curto rotateY −12°→+6° | iMac centrado, sombra de contacto elíptica; reflexo especular sincronizado com a rotação; fundo navy com key light | *Sites que convertem.* | "Sites pensados para converter." | Click UI + scroll suave (ruído rosa filtrado) | O ecrã do iMac encolhe para o ecrã do telemóvel (morph de raio 12→48) |
| **17,28–19,20** (c10) | **Telemóvel Farmácia Moreira Padrão**: orbit rotateY −18°→+8° | Telemóvel a 62 % da altura; profundidade de campo com o iMac desfocado atrás | *Em qualquer ecrã.* | "Em qualquer ecrã." | Tap de vidro | O ecrã do telemóvel passa a feed |
| **19,20–23,04** (c11–12) | Os **criativos CãolorRun** saem do ecrã em z (3 cartões a −200, 0, +200 px), rodam 8° e assentam; depois empilham-se em 5 lâminas de vidro = funil | Lâminas com amarelo crescente de baixo para cima; a última brilha | *Conteúdo e anúncios.* → *Um só plano.* | "Conteúdo e anúncios, com um só plano." | 5 notas ascendentes suaves (uma por lâmina, pitch variado ±3 %) | A lâmina de topo vira ecrã de telemóvel |
| **23,04–24,96** (c13) | Telemóvel de vidro em 3D (rotateY 10°). Dentro: **Reel POV** — labrador → risos → cão rosa, 1 plano a cada 2 batidas | Placa "evento · Leiria" em pill; logótipo CãolorRun | *Um evento. 147 bilhetes.* | "Um evento em Leiria." | Ambiente do Reel a −18 dB + clique de corte na batida | Congela no plano 3 |
| **24,96–26,88** (c14) | Telemóvel desliza para a esquerda (parallax); à direita, contador em cartão de vidro | Números em amarelo sobre navy; rodapé de fonte | **835 € → 3.733 €** | "Oitocentos e trinta e cinco euros em anúncios. Três mil setecentos e trinta e três em bilhetes." | Ticks de contador, suaves e tabulares | O "4,47×" do cartão sai em z para a frente |
| **26,88–28,80** (c15) | Plano estático (respiração 1,2 s). **4,47×** enorme, ligeiro push-in 1,00→1,03 | Único elemento no ecrã; halo amarelo muito largo | **4,47×** · *por cada euro* | "Quatro vírgula quarenta e sete." (e silêncio) | Acorde ascendente de 2 notas (positivo), cauda longa | — |
| **28,80–30,72** (c16) | Dois chips de vidro sobem com mola (z 0,86) | Composição vertical, centrada | **147 bilhetes** · *Melhor campanha: 6,51×* · rodapé *Meta Ads · 27 jul–25 set 2026* | "E a melhor campanha chegou aos seis e meio." | Dois pops finos | Os chips caem e viram duas barras de vidro |
| **30,72–32,64** (c17) | **Labar**: duas barras 3D (prismas CSS de 4 faces) em orbit rotateY −20°→−8°. A barra "antes" 80,61 € encolhe para 30,68 € | Barra em cobalto #0033A3, topo iluminado; a medida final acende a amarelo | *Custo por lead* · **80,61 € → 30,68 €** | "Numa empresa B2B, cada contacto passou a custar menos de metade." | Whoosh invertido (a barra encolhe) | — |
| **32,64–34,56** (c18) | Respiração. Câmara fixa | Só o número | **−62 %** | — | Sub suave + ar | Corte na batida |
| **34,56–36,48** (c19) | Barras de conversão sobem (tilt 10°→0°) | Rodapé de fonte | *Conversão* **1,54 % → 3,51 %** · **×2,3** · *Google Ads · 1–21 set 2026* | "E a conversão mais que duplicou." | Nota ascendente | As barras fundem-se num anel de luz |
| **36,48–38,40** (c20) | Um traço de luz desenha um anel à volta do "O" (stroke-draw) e fecha em loop | Três palavras à volta do anel, a 120° | *Medimos. Lemos. Otimizamos.* | "Medimos, lemos e otimizamos. Até ao fim." | Swoosh de traço + ding suave ao fechar | — |
| **38,40–42,24** (c21–22) | Logótipos em tiles de vidro orbitam o "O" (rotateY contínuo lento; única exceção ao "sem linear") | Kommerling, Labar, Trelas Soltas, CãolorRun; tiles com frosted glass e sombra ambiente | *Confiaram em nós.* | "De negócios locais a marcas internacionais." | Pad a abrir, sem percussão (breakdown) | Os tiles recuam e a câmara entra no "O" |
| **42,24–46,08** (c23–24) | Dentro do "O": sala navy vazia, uma linha amarela horizontal no centro. Riser muito contido | Minimal absoluto: 90 % vazio | *Está na hORA* (entra letra a letra) | "Está na hora…" | Riser suave + respiração | — |
| **46,08–49,92** (c25–26) | O "h" cai com física (queda + rotação 14°) na batida 1; "ORA" gira em Y 0°→360° como objeto 3D extrudido (12 camadas) e assenta | Light sweep a atravessar o logo durante a rotação; reflexo no "chão" a 15 % | **Está na ORA.** | "Está na ORA." | Pop do "h" + **hit** final aos 48,00 s (batida 1 do c26) + cauda de reverb | — |
| **49,92–55,68** (c27–29) | Push-in 1,00→1,04. Botão pill de vidro morph → barra de URL | CTA dentro das safe zones (acima de 1670 px) | *Marca uma conversa.* · **ora.com.pt** · @estudio_ora | "Marca uma conversa." | Click de vidro | — |
| **55,68–57,60** (c30) | O "O" do logo solta-se, cresce e dissolve-se em pontos de luz: igual ao primeiro fotograma | Volta à sala escura inicial | — | — | Shimmer (igual a 0,0 s) | **Loop** sem corte |

**Palavras de voz:** ≈ 115 (cerca de 2 palavras/s, ritmo de conversa). Voz calorosa PT-PT em "tu". Mistura: música −18 LUFS, ducking 6 dB com voz, master −14 LUFS.

**Som (Web Audio sintetizado):** paleta de sons "de vidro": sinusoides com harmónicos curtos, ataques de 5 ms, reverb de sala pequena, variação de pitch ±3 % em sons repetidos. Intervalos ascendentes = resultado positivo. Nenhum som sem movimento; nenhum movimento importante sem som. Música: pad + kick suave + baixo a 125 BPM, drop no c5, breakdown no c21–24, hit no c26.

## 4. Styleframes a produzir (5)

1. **SF-v3-1 · Lente (1,9 s):** partículas em 3 profundidades a convergir no "O" de vidro; key light e rim light. Valida o material de vidro e o grão.
2. **SF-v3-2 · iMac SB Smiles (15 s):** a meio do tilt-reveal (rotateX 10°), com reflexo especular e sombra de contacto. Valida o 3D de dispositivos.
3. **SF-v3-3 · 4,47× (27 s):** número sozinho, halo amarelo e rodapé de fonte. Valida a respiração e a hierarquia tipográfica.
4. **SF-v3-4 · Labar (31 s):** barras-prisma em cobalto com orbit a −14°, número a amarelo. Valida dados em 3D sem perder legibilidade.
5. **SF-v3-5 · "Está na ORA." (48 s):** logo extrudido a 30° de rotação, com light sweep e reflexo no chão. Valida a assinatura.

## 5. O que torna isto "nível Apple" sem parecer Apple

**O que copiamos (o rigor):**
- **Um objeto herói e uma câmara.** Tal como um filme de produto gira à volta de um objeto, aqui o herói é o "O". Todos os planos entram, saem ou giram à volta dele.
- **Um movimento por plano**, no máximo 2 eixos, com as mesmas 3 curvas do princípio ao fim. A suavidade vem da consistência, não de mais efeitos.
- **Luz desenhada, não filtros:** key light radial larga, rim light de 1 px, light sweeps sincronizados com a rotação, sombras de contacto que reagem à altura. O vidro fica quase impercetível (8–14 % de branco, stroke 30 %).
- **Respiração depois de cada número** (4,47× e −62 % sozinhos no ecrã 1,2–1,9 s). O silêncio e o vazio são o que faz parecer caro.
- **Som de materiais:** vidro, ar e notas curtas, sempre ligados a um movimento.

**O que é só ORA (a identidade):**
- **A sala é navy (#1B3B72 → #0E1A33), não preta nem branca.** O cobalto #0033A3 é a cor dos dados e o amarelo #F5DF1E aparece só como luz e como resultado. Nunca como fundo.
- **Rawson em vez de uma sans neutra:** ExtraBlack nos números (mais densa e mais quente do que um SF Pro) e Medium nas legendas. Kickers em caixa alta com tracking +18 %.
- **A íris do "O" é a única transição de marca** (c5, c23 e o loop), e o "Está na hORA → ORA." é a assinatura verbal, com humor português, não um slogan traduzido.
- **Assets reais e locais:** placa amarela, fachada de Leiria, Reel POV verdadeiro e sites de clientes. A Apple mostra um produto; a ORA mostra negócios reais da região.
- **Tom "vizinho do lado":** a voz trata por "tu" e fala como "nós", sem superlativos de keynote.

## 6. Riscos e assets em falta

- **3D só em CSS:** o "O" e o "ORA" são extrudidos com 12–16 camadas de texto Rawson ExtraBlack (translateZ 1 px). Só há logótipo em PNG: pedir o **SVG** ou validar o encaixe da Rawson ao píxel.
- **Vidro:** `backdrop-filter` pesa no Chromium sem GPU. Alternativa: fundo duplicado com `blur()` recortado pela forma. Medir o tempo por fotograma antes de animar tudo.
- **Reel POV:** sem descodificação H.264 aqui; usar as capturas/JPEG dos 3 planos. Confirmar autorização de imagem.
- **Pendentes:** HEX oficial do amarelo; autorizações Trelas Soltas, Labar e logótipos; logótipo CãolorRun '26; locução PT-PT final (TTS só para timing). Labar: amostra de 3 semanas, rodapé obrigatório.
- **Cut-down 15 s:** gancho B → c15–16 → c25–26.
