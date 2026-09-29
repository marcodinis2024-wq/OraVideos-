// Render da banda sonora KOKARTE v1 em Chromium (Playwright).
// Uso: node design/kokarte/v1/kokarte-v1-audio-render.js            → dist/kokarte-v1-audio.wav
//      node design/kokarte/v1/kokarte-v1-audio-render.js stems <dir> → <dir>/music.wav + <dir>/sfx.wav (ganho do master, sem limitador)
//      node design/kokarte/v1/kokarte-v1-audio-render.js loop        → verificação do estado estacionário do loop
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'dist');
(async () => {
  const mode = process.argv[2] || 'mix';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => console.log('console:', m.text()));
  await p.goto('file://' + path.join(__dirname, 'kokarte-v1-audio.html'));
  if (mode === 'mix' || mode === 'stems') {
    const wav = await p.evaluate(() => window.__renderAudio());
    console.log(JSON.stringify(await p.evaluate(() => window.__info)));
    if (mode === 'mix') { fs.mkdirSync(OUT, { recursive: true }); const f = path.join(OUT, 'kokarte-v1-audio.wav'); fs.writeFileSync(f, Buffer.from(wav, 'base64')); console.log('escrito', f); }
    else { const dir = process.argv[3]; fs.mkdirSync(dir, { recursive: true }); for (const s of ['music', 'sfx']) fs.writeFileSync(path.join(dir, s + '.wav'), Buffer.from(await p.evaluate(s => window.__renderStem(s), s), 'base64')); console.log('stems em', dir); }
  } else if (mode === 'loop') console.log(JSON.stringify(await p.evaluate(() => window.__loopCheck())));
  await b.close();
})();
