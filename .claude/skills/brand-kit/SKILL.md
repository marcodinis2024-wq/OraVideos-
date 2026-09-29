---
name: brand-kit
description: Procedimento para redigir a identidade de marca de um cliente (paleta, logótipo, tipografia, tom de voz, banners, regras de motion e som) e guardá-la como brand kit reutilizável em `brands/<cliente>/`. Usar antes de qualquer vídeo, post ou design para um cliente novo, ou quando faltar definição de marca.
---

# Brand kit — como redigir a identidade de um cliente

Cada cliente tem identidade própria. O estilo "premium" (skill `motion-premium`) é a *execução*; o brand kit é o *vocabulário*.

## Fontes a recolher (por esta ordem)
1. Logótipo (vetorial se possível: .ai/.pdf/.svg). Um .ai pode ser renderizado com o leitor de PDF do Chromium (ver `video-pipeline`).
2. Fotos reais: fachada, produto, equipa (sem nomes se o cliente o pedir), trabalho feito.
3. Site e redes sociais (tom, cores, fontes em uso).
4. Ficheiros de fonte (.otf/.ttf). Se não houver: propor Google Font com licença aberta e personalidade equivalente.
5. Materiais antigos (flyers, criativos) para perceber o que manter e o que corrigir.

## Como extrair a paleta
- Amostrar cores dominantes com canvas (Chromium) ou ffmpeg; nunca "a olho" quando há ficheiro.
- Separar em papéis: **primária** (identidade), **acento** (ação/destaque), **fundo claro**, **fundo escuro**, **texto**, **neutros com viés da primária**.
- Verificar contraste AA (≥ 4.5:1 texto normal, ≥ 3:1 títulos grandes).
- Registar HEX exatos e marcar os estimados como "a confirmar".

## Estrutura do kit (`brands/<cliente>/brand.md` + `brand.json`)
```json
{
  "nome": "", "assinatura": "", "setor": "", "publico": "",
  "cores": { "primaria": "", "acento": "", "fundoClaro": "", "fundoEscuro": "", "texto": "", "neutros": [] },
  "tipografia": { "display": {"familia": "", "pesos": []}, "texto": {"familia": "", "pesos": []}, "ficheiros": [] },
  "logo": { "ficheiros": [], "areaDeProtecao": "", "tamanhoMinimoPx": 0, "versoes": ["positiva","negativa","monocromatica"], "proibicoes": [] },
  "tom": { "personalidade": [], "fazemos": [], "evitamos": [], "exemplos": [] },
  "motion": { "curvaEntrada": "", "ritmoBPM": 0, "assinaturaVisual": "", "transicaoDaMarca": "" },
  "som": { "genero": "", "bpm": 0, "sfxAssinatura": [], "voz": "" },
  "banners": { "formatos": ["1080x1920","1080x1350","1080x1080","1920x1080","1584x396 (LinkedIn)","820x312 (Facebook)"] },
  "regras": []
}
```

## Entregáveis visuais do kit
- **Folha de identidade** (1 página HTML → PNG): logo nas 3 versões, paleta com HEX e papéis, tipografia com hierarquia, 3 exemplos de aplicação.
- **Banners**: capa LinkedIn (1584×396), capa Facebook (820×312), destaque/story 1080×1920, post 1080×1350 — gerados a partir do mesmo HTML com tokens.
- **Assinatura de motion**: 1 transição própria da marca (ex.: ORA → íris do "O" + faixa amarela diagonal) e 1 som de assinatura.

## Regras
- Nunca misturar identidades: materiais de clientes aparecem dentro de molduras da marca que conta a história.
- Nunca inventar números nem clientes; o que for estimado fica marcado.
- Nomes de pessoas da equipa só se o cliente o autorizar (ORA: **nunca**, falar como coletivo).
