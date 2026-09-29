# Estúdio ORA — Brand kit

> **Estúdio de design com estratégia.** Leiria, desde 2016.
> Versão 1 · 29 set 2026 · Fonte de verdade para vídeo, redes, banners e propostas. Dados técnicos em `brand.json`; folha visual em `folha-identidade.png`.
> Tudo o que está marcado **a confirmar** é valor de trabalho, não oficial.

**Em uma frase:** o navy é a sala, o amarelo é a luz. Rigor de execução ao nível Apple (espaço, suavidade, som limpo), mas com vocabulário 100 % ORA: Rawson ExtraBlack, amarelo de placa, a íris do "O" e a faixa a 18°.

---

## 1. Essência

| | |
|---|---|
| Assinatura oficial | **Estúdio de design com estratégia** |
| Linha de campanha | **Está na ORA.** (ORA ≈ hora) |
| Assinatura nas redes | "Marketing para Negócios" (secundária; a oficial prevalece, **a confirmar**) |
| Setor | Design e marketing: branding, redes sociais, tráfego pago, websites, editorial, sinalética |
| Público | Donos e decisores de PME da região Centro que querem marketing com resultados medidos |
| Promessa | Criamos, medimos, corrigimos e crescemos contigo, de perto |
| Voz | Sempre **"nós"**, o coletivo. Nunca nomes da equipa |

---

## 2. Paleta

### Cores de marca

| Token | HEX | RGB | Origem | Papel |
|---|---|---|---|---|
| `ora-navy` · **primária** | **#1B3B72** | 27 59 114 | Logótipo, medido em píxeis (exato) | Identidade. Fundo principal, títulos sobre claro |
| `ora-amarelo` · **acento** | **#F5DF1E** | 245 223 30 | Aprovado pelo cliente | **Resultado**: números-prova, palavra-chave, CTA, faixa de transição |
| `ora-cobalto` · secundária | **#0033A3** | 0 51 163 | Letras da placa (média medida #012F9E) · **a confirmar** | Kickers e destaques sobre claro, logótipo sobre amarelo, dados |
| `papel` · fundo claro | #F4F6FA | | Estúdio/site | Fundos claros, cartões, respiro |
| `branco` | #FFFFFF | | | Texto sobre navy, cartões |
| `tinta` · texto | #0E1A33 | | Derivada do navy | Texto corrido sobre claro e amarelo; caixas de legenda (86 %) |
| `noite` · fundo escuro | #0B1428 | | Derivada do navy | Fundo profundo, molduras de dispositivos |

### Neutros com viés navy (matiz ≈ 220°)

| Token | HEX | Uso |
|---|---|---|
| `neutro-100` | #EEF1F6 | Fundos alternados, divisórias |
| `neutro-200` | #DDE3EE | Cartões secundários, a opção "perdedora" |
| `neutro-300` | #B9C3D6 | Texto secundário sobre navy e noite |
| `neutro-400` | #8A94A8 | Só decorativo ou texto ≥ 48 px sobre navy |
| `neutro-500` | #626C80 | Texto secundário sobre papel/branco (*ajustado de #6A7488, que dava 4,35:1*) |
| `neutro-600` | #4A5670 | Texto de apoio, ícones sobre claro |
| `neutro-700` | #2E3A55 | Superfícies elevadas sobre noite |

**Proporção:** 60 % navy · 25 % papel/branco · 10 % amarelo · 5 % cobalto e neutros.

### Contraste WCAG 2.x (calculado por luminância relativa)

AA = 4,5:1 para texto normal, 3:1 para títulos grandes (≥ 24 px bold / ≥ 32 px normal).

| Frente → fundo | Rácio | Nível |
|---|---|---|
| Navy → branco | 10,97:1 | AAA |
| Navy → papel | 10,13:1 | AAA |
| Amarelo → navy | 8,07:1 | AAA |
| Navy → amarelo | 8,07:1 | AAA |
| Cobalto → amarelo (placa) | 7,72:1 | AAA |
| Cobalto → branco | 10,49:1 | AAA |
| Branco → cobalto | 10,49:1 | AAA |
| Amarelo → tinta | 12,73:1 | AAA |
| Amarelo → noite | 13,50:1 | AAA |
| Tinta → papel | 15,98:1 | AAA |
| Branco → noite | 18,34:1 | AAA |
| Neutro-300 → navy | 6,18:1 | AA |
| Neutro-600 → papel | 6,80:1 | AA |
| Neutro-500 → papel | 4,88:1 | AA |
| Neutro-400 → navy | 3,59:1 | Só títulos grandes |
| Amarelo → branco | 1,36:1 | **Proibido** |
| Amarelo → papel | 1,26:1 | **Proibido** |
| Cobalto → navy | 1,05:1 | **Proibido** |

---

## 3. Tipografia: Rawson

Uma só família. O "ORA" do logótipo é Rawson ExtraBlack.

| Ficheiro | Peso CSS | Papel |
|---|---|---|
| `assets/fonts/Rawson-ExtraBlack.ttf` | 900 | Display: números-herói, H1, H2 |
| `assets/fonts/Rawson-Black.otf` | 800 | H3, kickers, chips, legendas |
| `assets/fonts/Rawson-Medium.otf` | 500 | Corpo, rodapés, CTA secundário |
| `assets/fonts/Rawson-BoldIt.otf` | 700 itálico | Citações de clientes |
| `assets/fonts/Rawson-LightIt.otf` | 300 itálico | Notas pontuais |

*As fontes ficam fora do Git por licença (`.gitignore`).*

### Escala para 1080 × 1920

| Nível | Peso | Tamanho | Entrelinha | Tracking | Uso |
|---|---|---|---|---|---|
| Número-herói | 900 | 280–360 px | 0,90 | −2 % | A prova (4,47×) |
| H1 · palavra-âncora | 900 | 128 px | 0,92 | −1 % | Frase de cena, máx. 6 palavras |
| H2 · título | 900 | 100 px | 0,92 | −1 % | Título de bloco |
| H3 · subtítulo | 800 | 60 px | 1,00 | 0 | Cartões, opções |
| Kicker | 800 caixa alta | 30 px | 1,20 | +18 % | Contexto de secção |
| Lead / corpo | 500 | 42 px | 1,30 | 0 | Texto de apoio |
| Legenda queimada | 800 | 44 px | 1,20 | 0 | Palavra a palavra, caixa tinta 86 % |
| Nota / fonte | 500 | 28 px (mínimo) | 1,35 | +2 % | Fonte e período dos dados |

**Grelha 9:16:** margens laterais de 90 px · zona segura 200 px em cima e 250 px em baixo · cantos de cartão 40 px · chips em pílula.
**Números:** algarismos tabulares nos contadores; formato PT-PT: `4,47×` · `3.733 €` · `−62 %` (sinal de menos verdadeiro, espaço antes de % e €).
**Cor no texto:** kicker amarelo sobre navy, cobalto sobre claro. Uma palavra-chave a amarelo por título.

---

## 4. Logótipo

**Ficheiro:** `assets/marca/logotipo-ora-azul.png` (595 × 368, PNG transparente, navy #1B3B72, com assinatura). **Em falta:** vetorial (.ai/.svg/.pdf) e versão sem assinatura. Pedir ao cliente.

| Versão | Aplicação |
|---|---|
| Positiva | Navy sobre branco ou papel |
| Negativa | Branco sobre navy, cobalto ou noite |
| Placa | Cobalto (ou navy) sobre amarelo, como na montra |
| Monocromática | Preto 100 % ou branco 100 % (gravação, vinil, carimbo) |

- **Área de proteção:** x = altura do "R". Espaço livre de 1x à volta, medido a partir do ® e da assinatura.
- **Tamanho mínimo** (proposta, **a confirmar**): com assinatura, 240 px de largura (digital) ou 40 mm (impresso). Sem assinatura, 96 px ou 15 mm.
- **Proibido:** esticar, inclinar ou rodar · recriar com outra fonte · gradientes, sombras, contornos · amarelo sobre branco · navy sobre cobalto · pousar sobre fotos agitadas sem véu navy · remover o ® · desmontar as letras (a animação usa o "O" como íris, não parte o logótipo).

---

## 5. Tom de voz

**Personalidade:** próximo · confiante · direto · claro · com humor de medida.
**Pessoa:** "nós". **Tratamento:** "tu" nas redes e anúncios; impessoal no LinkedIn B2B e em propostas. **Língua:** PT-PT.

| Fazemos | Evitamos |
|---|---|
| Frases curtas, verbo à cabeça | Jargão: "sinergias", "360°", "disruptivo" |
| Prova antes de promessa (número real, com fonte) | Superlativos vazios: "o melhor", "líder" |
| Benefício para o negócio do cliente | Números inventados ou arredondados para cima |
| O jogo ORA/hora, uma vez por peça | Problemas internos, erros de terceiros |
| Uma ideia por ecrã | Nomes, cargos ou caras da equipa |
| PT-PT limpo | "Você", "time", "celular"; mais de 1 emoji por legenda |

**Exemplos**

| Evitamos | Fazemos |
|---|---|
| Somos uma agência 360° líder em soluções digitais inovadoras. | Design com estratégia. Em Leiria, desde 2016. |
| Oferecemos gestão de redes sociais de excelência. | Não fazemos posts bonitos. Fazemos posts que vendem. |
| Os nossos clientes obtêm resultados incríveis! | Cada euro em anúncios voltou 4,47 vezes. |
| Contacte-nos para mais informações. | Marca uma conversa. Está na ORA. |
| A nossa designer criou… | Criámos a marca, o site e a campanha. |

---

## 6. Assinatura de motion

**Curvas:** entrada `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out) · saída `cubic-bezier(0.55, 0, 1, 0.45)` · transições `cubic-bezier(0.65, 0, 0.35, 1)`. Nada linear.
**Ritmo:** 125 BPM. Uma batida dura 0,48 s (12 fotogramas a 25 fps). Os cortes caem em múltiplos de meia batida.
**Durações:** micro 0,2–0,3 s · texto palavra a palavra 0,4 s com stagger de 60–80 ms (subida de 60 px, blur 8 → 0) · transições 0,6 s · contadores 0,8 s com punch 100 → 106 → 100 %.

### A íris do "O" (transição de revelação)
Um anel navy nasce no centro do "O" e abre de 10 para 2600 px, com o traço a engrossar de 4 para 60 px. Por dentro, a cena seguinte revela-se num `clip-path: circle()` de 0 a 1400 px, em 0,65 s expo-out. O anel desvanece nos últimos 0,3 s. Serve para entrar no mundo ORA: estúdio, placa, caso.

### A faixa amarela diagonal (transição de corte)
Uma barra #F5DF1E de 1100 × 3400 px, rodada **18°** (a inclinação da perna do "A"), atravessa o ecrã da esquerda para a direita (−1700 → +1700 px) em 0,6 s ease-in-out. A cena troca no ponto médio, com o ecrã tapado. Usar no máximo 2 vezes por peça.

**Complementos:** parallax 2.5D nos mockups com sombra suave `0 40px 80px −30px rgba(14,26,51,.55)` · grão fílmico de 2–3 % nas fotos · fecho "Está na hORA": o "h" cai com física no hit e fica **"Está na ORA."**

---

## 7. Assinatura de som

**Música:** indie-electronic / funk moderno, otimista, a 125 BPM, com licença comercial (nunca faixas "trending" nos anúncios).
**Voz:** PT-PT, calorosa e segura, em ritmo de conversa. Fala em nome do coletivo.

**Toque ORA (sonic logo, ~1,4 s, proposta a validar):**
1. Um sopro de ar ascendente (0,3 s) acompanha a abertura da íris.
2. **"O":** Mi5 (659 Hz, seno com 10 % de triângulo) sobre um sub de 130 → 34 Hz.
3. **"RA":** Si5 (988 Hz), meia batida depois (0,24 s).
4. Cauda de reverb de 2,4 s.

A quinta ascendente soa a "positivo", limpa e curta, como pede o rigor premium, mas com o grave da marca.

**SFX da casa:** whoosh grave na faixa amarela (pan L → R, a acompanhar a barra) · ticks de contador + cha-ching discreto **só** quando aparece um resultado real · hit final no assentar do logótipo.
**Mistura:** música a −18 LUFS sob a voz, com ducking de 6–8 dB · SFX 3–6 dB abaixo da música · master a −14 LUFS integrados, −1 dBTP.

---

## 8. Banners e formatos

| Formato | Uso | Zona segura |
|---|---|---|
| 1080 × 1920 | Reels, Stories, TikTok, anúncios | 200 px em cima · 250 px em baixo · 90 px nas laterais |
| 1080 × 1350 | Feed 4:5 (preferido) | 80 px; a grelha do perfil corta ao centro para 1:1 |
| 1080 × 1080 | Post quadrado, carrossel | 80 px |
| 1920 × 1080 | YouTube, website, apresentações | 5 % (96 × 54 px) |
| 1584 × 396 | Capa LinkedIn | Conteúdo à direita de 560 px (o avatar tapa o canto inferior esquerdo) |
| 820 × 312 | Capa Facebook | Faixa central de 640 px (o telemóvel corta as laterais) |

**Receita base:** fundo navy · kicker amarelo · título ExtraBlack a branco com uma palavra a amarelo · logótipo negativo ou foto da placa · `ora.com.pt` em Medium.

---

## 9. Regras de ouro

1. **Amarelo = resultado.** Os números que provam retorno aparecem a amarelo sobre navy. O amarelo não decora.
2. **O navy é a sala, o amarelo é a luz:** cerca de 60 % navy e 10 % amarelo. Nunca amarelo como fundo de texto longo.
3. **Nunca** amarelo sobre branco/papel nem cobalto sobre navy (contraste abaixo de 1,4:1).
4. **Uma só família:** Rawson. ExtraBlack para impacto, Medium para ler.
5. **Uma ideia por ecrã:** no máximo 6 palavras em 9:16, com uma palavra-chave a amarelo.
6. **Nós, sempre.** Nunca nomes, cargos ou caras identificáveis da equipa.
7. **Só números reais**, com fonte e período no rodapé (28 px). As estimativas não se publicam.
8. **O trabalho de clientes aparece dentro de molduras ORA** (telemóvel, ecrã, cartão) e só com autorização.
9. **Todas as transições nascem da marca:** a íris do "O" ou a faixa amarela a 18°. Nada linear, nada gratuito.
10. **Respiro:** composição centrada ou alinhada à margem de 90 px. Se falta espaço, corta-se texto, não margem.
11. **O logótipo não se deforma, não muda de cor e não se desmonta.** Respeita 1x de proteção.
12. **Fecho** com a assinatura e um CTA simples: *Marca uma conversa · ora.com.pt*.

---

## 10. A confirmar com o cliente

- [ ] HEX oficial do cobalto (a fotografia dá #012F9E; o valor de trabalho é #0033A3)
- [ ] Logótipo vetorial e versão sem assinatura
- [ ] Tamanhos mínimos e área de proteção, caso exista manual anterior
- [ ] Toque ORA (sonic logo)
- [ ] Papel da assinatura "Marketing para Negócios" face à oficial
