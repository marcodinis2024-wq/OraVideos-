// Render da banda sonora do anúncio KOKARTE em Chromium (Playwright).
// Uso: node design/kokarte/anuncio/kokarte-anuncio-audio-render.js [30|15|all]      → dist/kokarte-anuncio-{30,15}-audio.wav
//      node design/kokarte/anuncio/kokarte-anuncio-audio-render.js stems <30|15> <dir> → <dir>/music.wav + sfx.wav (ganho do master, sem limitador)
//      CEIL=-1.9 (teto de amostra em dBFS) · GR=1 (mostra onde o limitador atua)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'dist');
(async () => {
  const mode = process.argv[2] || 'all';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => console.log('console:', m.text()));
  await p.goto('file://' + path.join(__dirname, 'kokarte-anuncio-audio.html'));
  if (process.env.CEIL) await p.evaluate(c => window.__setCeil(c), +process.env.CEIL);
  if (mode === 'stems') {
    const cut = +process.argv[3], dir = process.argv[4]; fs.mkdirSync(dir, { recursive: true });
    await p.evaluate(c => window.__renderAudio(c), cut); console.log(JSON.stringify(await p.evaluate(() => window.__info)));
    for (const s of ['music', 'sfx']) fs.writeFileSync(path.join(dir, s + '.wav'), Buffer.from(await p.evaluate(([c, s]) => window.__renderStem(c, s), [cut, s]), 'base64'));
    console.log('stems em', dir);
  } else {
    fs.mkdirSync(OUT, { recursive: true });
    for (const cut of mode === 'all' ? [30, 15] : [+mode]) {
      const wav = await p.evaluate(c => window.__renderAudio(c), cut);
      console.log(JSON.stringify(await p.evaluate(() => window.__info))); if (process.env.GR) console.log(JSON.stringify(await p.evaluate(() => window.__grTop)));
      const f = path.join(OUT, `kokarte-anuncio-${cut}-audio.wav`); fs.writeFileSync(f, Buffer.from(wav, 'base64')); console.log('escrito', f);
    }
  }
  await b.close();
})();
