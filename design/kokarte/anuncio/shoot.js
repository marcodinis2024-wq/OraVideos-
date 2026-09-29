// Uso: node shoot.js stills <outdir> 28,84,... [cut] [prefixo]  |  node shoot.js video <out.mjpeg> [cut]
// cut = 30 (padrão) ou 15. Espera por window.__ready (fontes + imagens) antes de cada render.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [mode, out, a3, a4, a5] = process.argv.slice(2);
  const cut = (mode === 'stills' ? a4 : a3) || '30', pre = (mode === 'stills' ? a5 : '') || '';
  const SRC = 'file://' + path.join(__dirname, 'kokarte-anuncio.html') + '?export=1' + (cut === '15' ? '&cut=15' : '');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => { if (m.type() !== 'log') console.log('CONSOLE', m.text()); });
  await p.goto(SRC); await p.evaluate(() => window.__ready); await p.evaluate(() => document.fonts.ready);
  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const fr of a3.split(',').map(Number)) { await p.evaluate(t => window.__render(t), fr / 25); await p.screenshot({ path: path.join(out, `${pre}f${String(fr).padStart(3, '0')}.png`) }); }
  } else {
    const N = Math.round(await p.evaluate(() => window.DUR) * 25), fd = fs.openSync(out, 'w');
    for (let i = 0; i < N; i++) { await p.evaluate(t => window.__render(t), i / 25); fs.writeSync(fd, await p.screenshot({ type: 'jpeg', quality: 93 })); if (i % 100 === 0) console.log('frame', i, '/', N); }
    fs.closeSync(fd); console.log('frames', N);
  }
  await b.close();
})();
