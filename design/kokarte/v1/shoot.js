// Uso: node shoot.js stills <outdir> 28,140,...   |   node shoot.js video <out.mjpeg>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const SRC = 'file://' + path.join(__dirname, 'kokarte-v1.html') + '?export=1';
(async () => {
  const [mode, out, list] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => { if (m.type() !== 'log') console.log('CONSOLE', m.text()); });
  await p.goto(SRC); await p.evaluate(() => window.__ready); await p.evaluate(() => document.fonts.ready);
  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const fr of list.split(',').map(Number)) { await p.evaluate(t => window.__render(t), fr / 25); await p.screenshot({ path: path.join(out, `f${String(fr).padStart(3, '0')}.png`) }); }
  } else {
    const N = Math.round(await p.evaluate(() => window.DUR) * 25), fd = fs.openSync(out, 'w');
    for (let i = 0; i < N; i++) { await p.evaluate(t => window.__render(t), i / 25); fs.writeSync(fd, await p.screenshot({ type: 'jpeg', quality: 92 })); if (i % 100 === 0) console.log('frame', i, '/', N); }
    fs.closeSync(fd); console.log('frames', N);
  }
  await b.close();
})();
