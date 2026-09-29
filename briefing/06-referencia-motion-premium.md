# Referência: estilo de motion "Apple" (estudo do vídeo enviado + pesquisa)

Fonte principal: https://www.youtube.com/watch?v=5j4HmfgPCDI (transcrição completa lida; o vídeo em si não é descarregável neste ambiente).

## O que o vídeo ensina (resumo fiel)
1. **Origem e porquê:** a identidade da Apple tornou-se referência; o estilo de animação (UI limpa, animações suaves, layouts mínimos) é hoje o estilo nº 1 de anúncios de empresas e criadores.
2. **Cor:** fundos brancos, pretos ou cinza muito claro; nada de cores berrantes ou complementares a competir.
3. **Fonte:** uma família (SF Pro Display). Bold para títulos; Regular/Medium para subtítulos e texto pequeno.
4. **Shape layers:** painéis UI com cantos arredondados, morph de uma forma para outra com um único layer e keyframes; ícones e números controlados por nulls.
5. **Espaço:** deixar respirar; nada apertado nem acidental; reduzir tudo à forma mais simples.
6. **Composição centrada:** prende o olhar; desequilíbrio confunde e mata a atenção.
7. **Animação:** subtil, suave e rápida. Mais comuns:
   - slide-up de texto com máscara e easing no gráfico;
   - palavra a palavra (cada palavra no seu layer, posição + opacidade, stagger);
   - receita rápida: Animate → Opacity + Position (100, 0 %) → Range Selector → Advanced → Based on *Words*, Shape *Ramp Up*, Ease High −50, Ease Low 100 → keyframe do Offset.
8. **Efeitos:** bevel & emboss leve; glassmorphism (blur de fundo + duplicado com stroke branco em overlay a ~30 %; só funciona sobre fundos com textura); drop shadow **muito** subtil.
9. **Som:** efeitos sonoros tornam os visuais vivos; animação suave pede som suave.
10. **3D:** a Apple também usa 3D com movimentos de câmara. Começar simples e ir para o complexo; o que faz parecer premium é cor + espaço + movimento suave + interações subtis.

## Pesquisa complementar
- Filmes de produto 3D: os reflexos são *desenhados* (cartões de luz posicionados onde favorecem cada superfície e fixos enquanto a câmara se move); o orçamento vai para luz, motion design e história.
- Liquid Glass (WWDC25): materiais translúcidos que refratam, camadas que flutuam sobre o conteúdo, movimento com função (feedback, navegação, ênfase), nunca gratuito.
- Tipografia cinética: curvas Bézier "físicas"; ease-out em entradas e ease-in em saídas; stagger de 50–150 ms entre linhas.
- Som Apple: sons curtos e limpos, intervalos ascendentes para "positivo" (tipo Apple Pay); em sons repetidos, variar ligeiramente pitch e volume.

## Como isto passa a ser aplicado
- Skill `motion-premium` (princípios, curvas, 3D, luz, transições, checklist)
- Skill `brand-kit` (identidade própria de cada cliente, para não virar "Apple 100 %")
- Skill `roteiro-viral` (ganchos, ângulos, storyboard, narração)
- Skill `video-pipeline` (ferramentas, render, áudio, export)
- Agentes em `.claude/agents/`: `diretor-criativo`, `motion-3d`, `sound-design`, `identidade-marca`, `revisor-qualidade`

Fontes: [vídeo de referência](https://www.youtube.com/watch?v=5j4HmfgPCDI) · [Meet Liquid Glass — WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/) · [Liquid Glass — Wikipedia](https://en.wikipedia.org/wiki/Liquid_Glass) · [Why Apple Still Launches in 3D — Quince Creative](https://quincemedia.com/2026/09/10/apple-3d-product-launch-videos/) · [Behind the sound of Apple — A Sound Effect](https://www.asoundeffect.com/behind-the-sound-of-apple/) · [Kinetic Typography Guide 2026](https://www.ikagency.com/graphic-design-typography/kinetic-typography/)
