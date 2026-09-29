# KOKARTE — Brand kit

> **Energia & Espiritualidade.** Luanda, Angola.
> Versão 1 · 29 set 2026 · Fonte de verdade para vídeo, redes e banners. Dados técnicos em `brand.json`.
> **Confirmado** = lido diretamente em kokarte.com ou medido nos ficheiros. **Índice** = visto só no índice de pesquisa (páginas não abertas). **A confirmar** = proposta de trabalho, não oficial.

**Em uma frase:** o verde é a casa, o ouro é a luz. Um sol que nasce, uma linha dourada que corre e uma carta que diz "uma mensagem para ti".

---

## 1. Essência

| | |
|---|---|
| Nome | **KOKARTE** (logótipo e site; confirmado). Variantes em uso: KOK'ARTE (catálogo Kyte), KO K A R T E (perfil Instagram), Kokarte \| Luanda (Facebook). Nas peças novas: **KOKARTE** |
| Assinatura | **Energia & Espiritualidade** (título de kokarte.com; confirmado) |
| Manifesto | "Mais do que uma loja, um espaço para cuidar da sua energia, do seu equilíbrio e do seu crescimento pessoal." (hero do site; confirmado) |
| Setor | Loja esotérica e natural + terapias energéticas + eventos/workshops |
| Local | Estrada da Corimba, Luanda (índice Kyte). Levantamento e entrega; levantamento em 48 h (índice) |
| Público | Sobretudo mulheres adultas em Luanda que procuram equilíbrio emocional e autoconhecimento (o oráculo do site escreve no feminino). Idade e perfil: **a confirmar** |
| Voz | "Nós" quando fala a loja; o oráculo fala contigo |

### Oferta

**Serviços** (kokarte.com/servicos.html; **preços confirmados pela cliente a 29 set 2026**)

| Serviço | Duração | Valor |
|---|---|---|
| Consulta de Mapeamento Energético (perfil energético, emocional, numerológico e kármico + radiestesia) | 60 min | 45.000 Kz |
| Reiki Tibetano (Sessão Completa ou de Manutenção) | 60 min | 59.000 Kz |
| Programa de Transformação Pessoal (pack de 3) | 60–90 min/sessão | 150.000 Kz |
| Massagem Bioenergética com Cristais (com aromaterapia) | 60 min | 38.000 Kz |
| RESET by KOKARTE (grupo: respiração, meditação guiada, visualização, alongamentos) | sessão | 8.500 Kz |

**Produtos** (catálogo Kyte, índice): japamalas, pulseiras, defumação, queimadores, incensos, selenite, cristais, esotéricos, óleos essenciais e aromáticos, candeeiros, produtos naturais, âmbar, taças tibetanas, budas, velas, decoração, livros & oráculos. Exemplos: "Japamala Obsidiana Negra", "Kit 7 chackras bruto grande". Japamalas de 3.500 Kz a 18.900 Kz (índice; **a confirmar**).

**Experiências no site** (confirmado)
- **Oráculo "Uma mensagem para ti"**: carta num envelope com selo de cera "K"; clica-se no selo, sai uma mensagem e pode-se guardar/partilhar a carta em imagem. **É o mecanismo de trend mais forte da marca.**
- **Energia do Mês**: cristal-guia + benefícios + cuidados + afirmação (outubro = Obsidiana, "Energia da Transformação"; novembro = Selenita).
- **Eventos & Workshops**: a secção existe, mas os eventos são guardados em `localStorage` do browser (chave `kokarte_eventos`). Só aparecem no browser onde foram criados; **visitantes veem sempre "Não existem eventos agendados"**. Próximas datas: pedir diretamente à cliente.

### Contactos

| Canal | Valor | Estado |
|---|---|---|
| WhatsApp | **+244 936 676 628** | Confirmado (site + cliente, ativo) |
| Telefone alternativo | +244 936 276 100 | Confirmado ativo pela cliente (29 set 2026) |
| E-mail | kok.arte@outlook.com | Índice Kyte |
| Instagram | @kok.arte | Ligado no site |
| Facebook | facebook.com/kok.arte.ao | Ligado no site (categoria "Beleza, cosmética e cuidado pessoal", ~513 gostos, índice) |
| Site / loja | kokarte.com · kokarte.kyte.site | Confirmado |
| Horário | — | **A confirmar** |

---

## 2. Paleta

### Cores de marca

| Token | HEX | Origem | Papel |
|---|---|---|---|
| `verde` · **primária** | **#334432** | Fundo do logótipo e favicon, pixel medido (exato) | Identidade. Fundo principal |
| `ouro` · **acento** | **#D4AF37** | CSS do site, `kokarteGold` (exato) | Luz: logótipo, linhas, preço, CTA, palavra-chave |
| `ouro-gradiente` | #BE9B47 → #CFAC58 → #F4D47D | Amostrado no sol e nas letras do logótipo (JPEG, aproximado) | Metal do logótipo, brilhos |
| `ouro-claro` / `ouro-hover` | #F0D080 / #E5C158 | CSS do site (exato) | Realces, estados |
| `floresta` · fundo escuro | #0F2017 | CSS `kokarteBg` (exato) | Fundo profundo, vinheta; texto sobre claro |
| `musgo` · superfície | #1D382B | CSS `kokarteCard` (exato) | Cartões em vidro |
| `névoa` · texto | #E8F1EC | CSS `kokarteText` (exato) | Texto sobre verdes |
| `pergaminho` · fundo claro | #F4ECDC | Carta do oráculo (amostrado, aproximado) | Fundo claro, cartas, respiro |
| `ouro-antigo` | #7F6118 | Derivado (proposta) | Texto dourado sobre pergaminho |

### Neutros com viés verde (propostas)

| Token | HEX | Uso |
|---|---|---|
| `neutro-100` | #E9EEE7 | Fundos alternados claros |
| `neutro-200` | #D3DDD2 | Bordas sobre claro |
| `neutro-300` | #B3C2B2 | Texto secundário sobre verde/floresta |
| `neutro-400` | #8A9C89 | Decorativo; títulos grandes sobre verde |
| `neutro-500` | #5E6F5D | Texto secundário sobre pergaminho |
| `neutro-600` | #465545 | Texto de apoio sobre pergaminho |
| `neutro-700` | #2A3A2E | Superfícies intermédias |

**Proporção:** 60 % verdes · 20 % fotografia e pergaminho · 12 % ouro · 8 % névoa e neutros.

### Contraste WCAG 2.x

| Frente → fundo | Rácio | Nível |
|---|---|---|
| Névoa → floresta | 14,71:1 | AAA |
| Floresta → pergaminho | 14,43:1 | AAA |
| Névoa → musgo | 11,03:1 | AAA |
| Branco → verde | 10,43:1 | AAA |
| Névoa → verde | 9,05:1 | AAA |
| Verde → pergaminho | 8,88:1 | AAA |
| Ouro → floresta / floresta → ouro | 8,06:1 | AAA |
| Ouro claro → verde | 6,97:1 | AA |
| Ouro → musgo | 6,04:1 | AA |
| Ouro → verde | 4,96:1 | AA |
| Ouro do logótipo (#CFAC58) → verde | 4,81:1 | AA |
| Ouro antigo → pergaminho | 4,93:1 | AA |
| Neutro-300 → verde | 5,60:1 | AA |
| Neutro-500 → pergaminho | 4,58:1 | AA |
| Neutro-400 → verde | 3,57:1 | Só títulos grandes |
| Ouro → pergaminho | 1,79:1 | **Proibido** |
| Ouro → branco | 2,10:1 | **Proibido** |
| Verde ↔ floresta / musgo | 1,22–1,62:1 | **Proibido para texto** (só camadas) |

Nota: ouro sobre verde passa AA à justa (4,96). Para texto pequeno sobre verde preferir ouro claro #F0D080 ou névoa; ouro puro em títulos, preços e linhas.

---

## 3. Tipografia

Confirmado no CSS do site (Google Fonts, licença SIL OFL):

| Família | Papel no site | Pesos | Papel no kit |
|---|---|---|---|
| **Montserrat** | `display` | 600, 700 | Títulos, kickers em caixa alta |
| **Poppins** | `body` / `sans` | 400, 600 | Corpo, preços, legendas |
| Cormorant Garamond | — | 500 itálico, 600 | **Proposta, a confirmar**: só mensagens do oráculo e afirmações (a carta usa serifa clássica dourada) |

**Logótipo:** sans geométrica em caixa alta, semibold, tracking largo. A fonte original continua desconhecida, mas isso já não importa: o wordmark foi **redesenhado em paths** a partir do JPEG (`assets/kokarte/logotipo-kokarte.svg`; redesenho vetorial fiel, aprovado pela cliente). Nunca compor "KOKARTE" com Montserrat para fazer de logótipo: usar o SVG.

### Escala para 1080 × 1920

| Nível | Fonte | Peso | Tamanho | Entrelinha | Tracking |
|---|---|---|---|---|---|
| H1 · frase-âncora (máx. 6 palavras) | Montserrat | 700 | 112 px | 0,98 | −1 % |
| H2 · serviço/produto | Montserrat | 700 | 84 px | 1,00 | 0 |
| Kicker (caixa alta, ouro) | Montserrat | 600 | 30 px | 1,20 | +18 % |
| Mensagem do oráculo | Cormorant Garamond | 500 itálico | 64 px | 1,20 | 0 |
| Preço | Poppins | 600 | 60 px | 1,00 | 0 |
| Corpo | Poppins | 400 | 40 px | 1,35 | 0 |
| Legenda queimada | Poppins | 600 | 46 px | 1,20 | 0 |
| Nota / contactos | Poppins | 400 | 28 px (mín.) | 1,35 | +2 % |

**Grelha 9:16:** margens de 90 px · zona segura 220 px em cima, 320 px em baixo (UI do Reels) · cartões com raio 32 px. **Números:** `45.000 Kz` (ponto nos milhares, espaço antes de Kz), algarismos tabulares nos preços.

---

## 4. Logótipo

**Ficheiros vetoriais** (redesenho vetorial fiel, aprovado pela cliente — 29 set 2026). Usar estes em todas as peças novas:
- `assets/kokarte/logotipo-kokarte.svg` — símbolo + wordmark; sol em gradiente ouro #BE9B47 → #CFAC58 → #F4D47D (→ #E9C877 na ponta direita, medido), wordmark em ouro liso #D4A847 (medido no JPEG: no original as letras não têm gradiente). Fundo transparente, `viewBox="0 0 343 184"`
- `assets/kokarte/logotipo-kokarte-simbolo.svg` — só o sol com raios e horizonte, `viewBox="0 0 264 110"`
- `assets/kokarte/logotipo-kokarte-mono-claro.svg` — tudo em névoa #E8F1EC (sobre verde, musgo, floresta ou foto escura)
- `assets/kokarte/logotipo-kokarte-mono-escuro.svg` — tudo em floresta #0F2017 (sobre pergaminho, névoa ou ouro)
- `assets/kokarte/logo-comparacao.png` — prova de fidelidade: original e SVG lado a lado, à mesma escala

**Como foi redesenhado:** medido sobre o JPEG no Chromium (canvas, píxel a píxel) e ajustado por iterações até coincidir. O sol é um semicírculo (47,3 × 45,6 px na escala do JPEG) separado dos raios por um anel escuro de ~3,5 px. Tem **15 raios** simétricos: 13 em leque, a alternar longos e curtos (vertical a 0°, curtos a ±14°, longos a ±28°, curtos a ±42°, longos a ±51° e o par inferior quase paralelo: curto a ±69° e longo a ±70,5°), e mais 2 raios horizontais pousados sobre o horizonte. Os raios afilam em lâmina até à ponta. A linha do horizonte é um arco fino (≈3,4 px no centro) que afina até às pontas e desce ligeiramente nas extremidades. O **wordmark foi vetorizado em paths** (não depende de nenhuma fonte): sans geométrica em caixa alta com hastes de 11,7 px, barras de 10,4 px e altura de maiúscula de 46,3 px na escala do JPEG; o "A" tem vértice em bico e o espaçamento entre letras é o do original. Não se acrescentou nenhum elemento. Diferença residual: menos de 1 px, sobretudo nas pontas finas dos raios, que no JPEG estão desfocadas.

**Originais** (descarregados de kokarte.com):
- `assets/kokarte/logotipo-kokarte-500.jpg` — 500 × 500, JPEG, ouro sobre verde #334432 (referência; já não é preciso usá-lo em peças)
- `assets/kokarte/favicon-32.png`
- `assets/kokarte/oraculo-carta-envelope.png` — 3072 × 2048, PNG transparente, carta "UMA MENSAGEM PARA TI" com selo de cera "K"
- `assets/kokarte/site-fundo-motion.mp4` — vídeo de fundo do site (H.264; não pré-visualizado neste ambiente)

**Desenho:** meio sol dourado a nascer sobre uma linha de horizonte, raios em leque; por baixo, o wordmark KOKARTE. Monograma secundário: "K" serifado em selo de cera.

| Versão | Ficheiro | Fundos |
|---|---|---|
| Principal: ouro (gradiente) sobre verde | `logotipo-kokarte.svg` | verde #334432, musgo #1D382B, floresta #0F2017 |
| Símbolo isolado | `logotipo-kokarte-simbolo.svg` | idem; ícone, avatar, transição "nascer do sol" (usar sem wordmark só com OK da cliente) |
| Monocromática clara | `logotipo-kokarte-mono-claro.svg` | verdes e fotos escuras |
| Monocromática escura | `logotipo-kokarte-mono-escuro.svg` | pergaminho #F4ECDC, névoa, ouro |

- **Área de proteção** (proposta): x = altura do "K"; 1x livre em volta.
- **Tamanho mínimo** (proposta): 160 px de largura digital, 25 mm impresso. Com o SVG não há limite de ampliação (1080 px, 4K, impressão).
- **Proibido:** esticar, inclinar, rodar · ouro sobre branco/pergaminho · trocar o verde por preto ou roxo "místico" · separar o sol do wordmark sem aprovação · alterar o número ou o ângulo dos raios, ou refazer o wordmark com uma fonte · sombras duras, contornos, brilhos arco-íris.

---

## 5. Tom de voz

**Personalidade:** acolhedor · sereno · sábio sem distância · íntimo · luminoso.
**Tratamento (confirmado no site):** "tu" no oráculo e nas mensagens emocionais ("Uma mensagem para ti", "Respira fundo"); "você/seu" cortês nas páginas comerciais ("cuidar da sua energia"). **Regra proposta:** "tu" em vídeo, trend e legendas; "você" em preçários e marcações. Nunca os dois na mesma frase.
**Língua:** este documento em PT-PT. A escrita do site já é de norma europeia, coerente com o português de Angola. Em vídeo e voz: **PT de Angola**, calor e ritmo de Luanda; calão ("bué", "mambo", "kota") só se a cliente o usar. Evitar brasileirismos ("celular", "frete").

| Fazemos | Evitamos |
|---|---|
| Frases curtas que tocam num sentimento real | Promessas de cura ou efeitos médicos |
| Falar a uma pessoa, no presente | Promessas de dinheiro, amor ou sorte garantidos |
| Imagens de ciclo: pausa, colheita, transformação, luz | Medo como argumento |
| Convite com gesto: "Clica no selo", "Acende", "Escolhe a tua carta" | Desrespeitar crenças religiosas ou tradições angolanas |
| Preço e forma de marcar sempre claros | "A melhor loja de Luanda" |
| Bem-estar e equilíbrio, não milagre | Mais de 2 emojis por legenda |

**Exemplos**

| Evitamos | Fazemos |
|---|---|
| Esta pedra cura a ansiedade e atrai dinheiro! | Outubro pede transformação. O cristal do mês é a obsidiana. |
| A MELHOR loja esotérica de Luanda!!! | Cristais, incensos, velas e terapias. Na Corimba. |
| Contacte-nos para mais informações. | Marca pelo WhatsApp. Nós preparamos o resto. |
| Proteja-se das energias negativas antes que seja tarde. | Semana pesada? Respira fundo. Há uma mensagem para ti. |
| Reiki que resolve todos os seus problemas. | Reiki Tibetano. 60 minutos para voltares ao teu centro. |

**Frases da marca (confirmadas):** "Energia & Espiritualidade" · "Uma mensagem para ti" · "Respira fundo. Clica no selo para abrir." · "Energia do Mês" · "RESET by KOKARTE".

---

## 6. Motion

O site já anima: o logótipo flutua (6 s, sobe 6 px, brilho dourado 12 → 28 px), uma **linha dourada** corre no cabeçalho (4 s) e os cartões são de vidro. O vídeo herda isto.

- **Curvas:** entrada `cubic-bezier(0.16, 1, 0.3, 1)` · saída `cubic-bezier(0.7, 0, 0.84, 0)` · transição `cubic-bezier(0.65, 0, 0.35, 1)`.
- **Ritmo:** 112 BPM (0,536 s ≈ 13 fotogramas a 25 fps).
- **Assinatura visual — Linha dourada:** fio de ouro de 2–4 px (transparente → #D4AF37 → transparente) corre na horizontal e marca o horizonte onde as cenas assentam.
- **Transição da marca — Nascer do sol:** o meio sol do logótipo sobe da linha dourada; os raios abrem em leque (−90° → 0°, 20 ms por raio) e um recorte radial a partir do sol (0 → 1500 px) revela a cena seguinte em 0,7 s, com brilho dourado a 25 % que se apaga. Máx. 2 por peça.
- **Momento oráculo:** toque no selo "K" → o envelope abre → a carta sobe com luz dourada (usar `oraculo-carta-envelope.png`).
- **Outros:** texto a subir 40 px + blur 10 → 0 (stagger 80 ms) · cartões em vidro musgo 75 % + blur 16 px · partículas douradas ≤ 40 % · luz quente e grão 2 %.

## 7. Som

- **Género:** amapiano / afro-house leve e quente, 112 BPM (licenciado ou áudio em tendência).
- **Som-assinatura — Toque do sol** (proposta, **a confirmar**): pancada de taça tibetana (idealmente gravada com uma taça da loja), fundamental ≈ Lá3 220 Hz, com sopro de ar de 0,4 s a acompanhar o nascer do sol; cauda de 1,6 s.
- **SFX:** selo de cera a partir + papel a deslizar (oráculo) · brilho cristalino curto na linha dourada · respiração antes de "Respira fundo."
- **Voz:** PT de Angola, feminina, calorosa e calma; idealmente a cliente (**a confirmar**). Nunca voz de "vidente".
- **Mistura:** música −18 LUFS sob voz, ducking 6 dB · master −14 LUFS, −1 dBTP.

## 8. Banners

Formatos: 1080×1920 · 1080×1350 · 1080×1080 · 1920×1080 · 820×312 (Facebook). LinkedIn provavelmente não se aplica.
**Receita:** verde #334432 com vinheta floresta · linha dourada no horizonte · logótipo · kicker Montserrat 600 a ouro · título Montserrat 700 névoa com 1 palavra a ouro · preço Poppins 600 a ouro · rodapé: `@kok.arte · WhatsApp 936 676 628 · kokarte.com`.

## 9. Regras

1. Verde é a casa, ouro é a luz: ~60 % verdes, ~12 % ouro.
2. Nunca ouro sobre branco ou pergaminho; texto dourado sobre claro usa #7F6118.
3. Nada de promessas de cura, dinheiro, amor ou sorte: equilíbrio, pausa, bem-estar.
4. Uma ideia por ecrã, máx. 6 palavras em 9:16.
5. Preços em Kz e só depois de confirmados pela cliente para a data.
6. Fechar sempre com como marcar/comprar: WhatsApp + @kok.arte + kokarte.com.
7. Transições nascem do logótipo: nascer do sol ou linha dourada.
8. O logótipo usa-se a partir dos SVG em `assets/kokarte/` (redesenho vetorial fiel, aprovado); nunca se recria com fontes.
9. Nunca misturar identidades: stock ou materiais de outros clientes só entram se licenciados e escolhidos para a KOKARTE, sempre com esta paleta.
10. Cara, voz ou nome da cliente e de clientes finais só com autorização.

---

## 10. Lacunas — pedir à cliente

Confirmado pela cliente a 29 set 2026: **preços corretos**, **os dois telefones ativos**, **autorização escrita** de imagem para todas as pessoas a filmar, **não existe logótipo vetorial** e a cliente **aprovou redesenhá-lo**.

1. **Logótipo:** resolvido. Fez-se o redesenho vetorial fiel em SVG (principal, símbolo, mono claro e mono escuro; ver secção 4). Falta só confirmar com a cliente a área de proteção e o tamanho mínimo propostos.
2. **Fotos e vídeos reais:** o Instagram @kok.arte não abriu neste ambiente (limite de pedidos a visitantes sem sessão). Pedir à cliente 6–9 posts/reels recentes, capas dos destaques e planos da loja (lista R1–R12 em `briefing/kokarte/01-plano-viral.md`).
3. **Eventos e próximas datas do RESET:** o site não os mostra a visitantes (ver secção de serviços); pedir diretamente.
4. **Horário, ponto de referência na Estrada da Corimba, condições e zonas de entrega.**
5. **Cosmética/cuidado pessoal:** vende ou não? (categoria do Facebook).
6. **Voz e cara:** a cliente quer aparecer e/ou fazer a voz-off?
7. **Aprovação** da serifa do oráculo (Cormorant Garamond), da transição "Nascer do sol" e do som "Toque do sol".
8. **Ficheiro de origem** do `fundomotion.mp4` e da carta do oráculo em camadas.

## Fontes

- https://kokarte.com/ (HTML, CSS, `js/app.js`, `js/data.js`, `logo.jpeg`, `cartasemfundo2.png`), https://kokarte.com/servicos.html, https://kokarte.com/eventos.html — lidos em 29 set 2026.
- Índice de pesquisa: https://kokarte.kyte.site/en · https://kokarte.catalog.kyte.site · https://kyte.site/kokarte · https://www.facebook.com/kok.arte.ao/ · https://www.instagram.com/kok.arte/ (não abertos: Cloudflare no Kyte; Instagram: limite de pedidos a visitantes sem sessão, 29 set 2026).
