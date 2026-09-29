// Recorta o selo "K" de assets/kokarte/oraculo-carta-envelope.png (chave por saturação) -> img/selo-k.png
// Uso: node design/kokarte/v1/prep-assets.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'prep-blank.html'));
  const out = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const S = 420, cx = 1549, cy = 1133, R = 196;
    const c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d');
    g.drawImage(img, cx - S / 2, cy - S / 2, S, S, 0, 0, S, S);
    const d = g.getImageData(0, 0, S, S), a = d.data;
    const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4, r = a[i], gg = a[i + 1], bb = a[i + 2];
      const mx = Math.max(r, gg, bb), mn = Math.min(r, gg, bb), sat = mx ? (mx - mn) / mx : 0;
      const dist = Math.hypot(x - S / 2, y - S / 2);
      let al = sm(0.27, 0.42, sat) * (1 - sm(R - 8, R, dist));
      if (dist < R - 40) al = 1; // interior do selo sempre opaco
      a[i + 3] = Math.round(al * a[i + 3]);
    }
    g.putImageData(d, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, 'file://' + path.join(ROOT, 'assets/kokarte/oraculo-carta-envelope.png'));
  fs.writeFileSync(path.join(__dirname, 'img/selo-k.png'), Buffer.from(out, 'base64'));
  await b.close(); console.log('ok');
})();
