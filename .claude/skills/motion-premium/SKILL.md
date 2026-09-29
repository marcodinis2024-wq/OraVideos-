---
name: motion-premium
description: Playbook de motion design "nível Apple" (UI limpa, 3D suave, tipografia cinética, glass, luz) adaptado à identidade de cada cliente e ao stack de render deste repo (HTML/CSS/JS determinístico → MP4). Usar sempre que se desenha, anima ou revê um vídeo, frame, styleframe ou transição.
---

# Motion premium — playbook

Referência: o estilo de motion da Apple (keynotes, filmes de produto, UI iOS/Liquid Glass). **Não copiar a identidade da Apple**: copiar o *rigor* (espaço, ritmo, luz, suavidade) e vestir sempre com a identidade do cliente (ver skill `brand-kit`).

## 1. Os 8 princípios (do vídeo de referência + análise)
1. **Cor contida.** Fundo branco, preto ou cinza muito claro/escuro; nunca cores berrantes em competição. Em clientes com cor forte, a cor da marca é *um* acento, não o fundo de tudo. Numa marca com amarelo (ex.: ORA), o amarelo é luz/destaque e o navy/preto é a sala.
2. **Uma família tipográfica, pesos com função.** Bold/Black para títulos, Regular/Medium para apoio. A fonte da marca faz o papel de "SF Pro" (ORA → Rawson).
3. **Formas com cantos arredondados e morph.** Painéis UI (cards, pills) que se transformam uns nos outros (morph de forma com um único layer: largura, altura, raio e cor interpolados).
4. **Espaço a respirar.** Nada apertado nem acidental. Uma ideia por ecrã. Margens ≥ 8 % da largura.
5. **Composição central.** O layout principal quase sempre centrado, para prender o olhar. O descentrado só entra com intenção.
6. **Animação subtil, suave e rápida.** Nada exagerado. Entradas com ease-out, saídas com ease-in, sem linear.
7. **Efeitos com moderação:** bevel/emboss leve em logos/texto; glassmorphism (blur de fundo + stroke branco em overlay a ~30 %); drop shadow **muito** suave.
8. **Som suave para animação suave.** Cada movimento importante tem um som; a qualidade do som é metade da perceção de qualidade.

## 2. Tipografia cinética (receitas)
- **Slide-up com máscara:** a palavra sobe 100 % da sua altura dentro de uma máscara (overflow hidden), ease-out expo, 400–600 ms.
- **Palavra a palavra:** stagger 60–120 ms entre palavras (50–150 ms entre linhas), opacidade 0→1 + translateY 0.6em→0 + blur 8px→0.
- **Equivalente ao "Range Selector ramp-up" do After Effects:** por carácter/palavra, com offset animado e curva ease-high −50 / ease-low 100 (aceleração suave no início, chegada muito amortecida). Em JS: `q = easeOutExpo(clamp((t - t0 - i*stagger)/dur))`.
- **Números:** contagem com algarismos tabulares + micro blur vertical enquanto mudam; ao parar, um "settle" de 1–2 % de escala.
- **Hierarquia:** título ≥ 2,5× o corpo; nunca mais de 6–7 palavras num ecrã vertical.

## 3. Curvas (usar sempre estas)
| Uso | Curva |
|---|---|
| Entrada padrão | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) |
| Saída | `cubic-bezier(0.7, 0, 0.84, 0)` (expo-in) |
| Movimento de câmara / morph | `cubic-bezier(0.65, 0, 0.35, 1)` (in-out suave) |
| Mola tipo iOS (UI a assentar) | amortecimento 0.8–0.9, resposta 0.35–0.5 s, sem overshoot visível > 2 % |
| Proibido | `linear` em qualquer coisa visível (exceto marquees e rotações contínuas) |

Mola determinística: `spring(t, w=2π/0.45, z=0.86) = 1 - exp(-z*w*t)*(cos(wd*t) + z*w/wd*sin(wd*t))`, `wd = w*sqrt(1-z²)`.

## 4. 3D e câmara (sem motor 3D: CSS 3D + camadas)
- `perspective: 1800–2600px` no palco; objetos com `transform-style: preserve-3d`.
- **Movimentos de câmara Apple:** push-in lento (scale 1.00→1.06 em 3–4 s), orbit curto (rotateY −18°→+8°), tilt-reveal (rotateX 25°→0°), dolly lateral com parallax (camadas a 0.6×, 1×, 1.4×).
- **Um movimento por plano.** Nunca combinar mais de 2 eixos no mesmo plano.
- **Profundidade de campo:** camada de fundo com `blur(6–14px)` e ligeiramente mais escura; primeiro plano nítido.
- **Reflexos e luz desenhados:** gradiente especular a atravessar o objeto (faixa branca a 8–15 %, `mix-blend-mode: screen`) sincronizado com a rotação — é o que dá o ar "caro".
- Cards 3D: sombra de contacto (elipse desfocada por baixo) + sombra ambiente muito difusa; a sombra encolhe e escurece quando o objeto desce.

## 5. Luz e cor ("luminosidade")
- Fundo escuro com **key light** suave: gradiente radial muito largo e subtil atrás do sujeito (+6–10 % de luminância).
- **Rim light** em objetos escuros: stroke interior de 1px em branco a 10–20 %.
- Grão fílmico 3–6 % em overlay; vinheta ≤ 20 %.
- Transições de luz (light sweep) em vez de flashes brancos agressivos.
- Glass: `backdrop-filter: blur(24px) saturate(1.4)` + fundo branco a 8–14 % + stroke branco 1px a 25–35 % + sombra suave.

## 6. Transições
- **Match cut** de forma: o elemento do fim de uma cena é o início da seguinte (ex.: o "O" do logo vira a janela da cena seguinte).
- **Morph de card:** um card cresce até ser o ecrã inteiro (raio 40→0, escala para cobrir).
- **Push/slide com parallax** (camadas a velocidades diferentes) em vez de whip-pans agressivos, exceto em cortes rítmicos deliberados.
- Duração típica 400–700 ms; cortes secos só na batida.

## 7. Ritmo e estrutura
- 120–125 BPM para edição rítmica (125 BPM a 25 fps → batida = 12 fotogramas exatos).
- Gancho em ≤ 2 s; uma quebra de padrão a cada 2–3 s; respiração (plano estático de 0,8–1,2 s) depois de cada número importante.
- Fim que faz loop com o início.

## 8. Implementação neste repo
- Render determinístico: `render(t)` puro (ver `design/v2/ora-v2.html`) ou relógio virtual (`design/story/lume-render.js`).
- Nada de CSS transitions dependentes do relógio real nos vídeos lineares — ou usar o relógio virtual, que controla Web Animations.
- Export: frames JPEG → `~/bin/ffmpeg` (libx264 crf 18–20, yuv420p, AAC 192k, `+faststart`). Ver skill `video-pipeline`.

## 9. Checklist de qualidade (antes de exportar)
- [ ] Cada ecrã tem uma ideia e respira
- [ ] Nenhuma animação linear; entradas ease-out, saídas ease-in
- [ ] Máximo 2 eixos de movimento por plano
- [ ] Sombras e glass quase impercetíveis
- [ ] Cada movimento importante tem som; nada de som sem movimento
- [ ] Cores 100 % dentro do brand kit do cliente
- [ ] Texto legível em 1 s; safe zones 9:16 respeitadas (topo 200px, fundo 250px @1080×1920)
