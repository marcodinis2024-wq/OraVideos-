---
name: video-pipeline
description: Como produzir vídeos MP4 neste repo — setup de ferramentas no ambiente cloud (ffmpeg completo, yt-dlp), render determinístico em Chromium, áudio sintetizado com Web Audio, mistura e export H.264/AAC. Usar sempre que for preciso gerar, converter ou verificar um vídeo.
---

# Pipeline de vídeo

## Setup (ambiente cloud; os registos npm/pypi/apt estão bloqueados)
- **ffmpeg completo** (libx264 + AAC): `curl -sSL -o ffb.tar.xz https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz && tar -xJf ffb.tar.xz --wildcards '*/bin/ffmpeg' '*/bin/ffprobe'` → copiar para `~/bin/`.
- **yt-dlp** (legendas/metadata de referências): `https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux`. O vídeo em si (googlevideo) está bloqueado; as legendas funcionam.
- **Chromium/Playwright**: `/opt/pw-browsers/chromium`, Playwright em `/opt/node22/lib/node_modules/playwright`.
- Fotos stock: Unsplash (`images.unsplash.com` permitido); registar créditos em `assets/stock/unsplash/CREDITOS.md`; evitar fotos com marcas de terceiros visíveis.
- Nunca matar processos com `pkill -f` usando um padrão que apareça no próprio comando (mata a shell). Usar `pkill -f "nome[x]"` com o padrão fora da linha de comando atual ou matar por PID.

## Dois modelos de render
1. **`render(t)` puro** (vídeos de motion puro): `design/v2/ora-v2.html` + `design/animatic/tools.js` (`SRC=… NAME=… node tools.js stills|video|audio|standalone`).
2. **Relógio virtual** (histórias com UI, timers e Web Animations): `design/story/lume-render.js` injeta um relógio virtual (setTimeout, rAF, performance.now, Date.now, Web Animations) e avança 40 ms por fotograma. Arrancar com `p.evaluate(() => { window.__start(); })` — **não** devolver a promise (deadlock).

## Áudio
- Música e SFX sintetizados em Web Audio; em vídeo, **registar eventos** (`{t, name, args}`) durante o render e sintetizar depois com `OfflineAudioContext` (`design/story/lume-audio.html`).
- Mistura: música ~−18 LUFS por baixo de voz (ducking 6–8 dB), SFX 3–6 dB abaixo da música exceto impactos; saturação suave `tanh` e normalização → ~−14 LUFS, pico < −0,5 dB.
- Voz: TTS do browser só serve de guia. Para final: locução PT-PT gravada (ou TTS profissional), alinhada às legendas (`CAPS`).

## Export
```
~/bin/ffmpeg -y -f image2pipe -framerate 25 -c:v mjpeg -i frames.mjpeg -i audio.wav \
  -c:v libx264 -preset slow -crf 19 -profile:v high -level 4.1 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out.mp4
```
Verificar sempre: `ffprobe` (h264 + aac, 1080×1920, 25 fps), `volumedetect` (média −13…−16 dB, pico < −0,5 dB), folha de contactos (`fps=1/6,scale=180:320,tile=8x2`). Limite de envio ao utilizador: 30 MB (senão re-encode a crf 23–26).
