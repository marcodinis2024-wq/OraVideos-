// Usage: node tools.js stills 1,3.5,6.5  |  node tools.js video  |  node tools.js audio  |  node tools.js standalone
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(ROOT, 'dist');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file://' + path.join(__dirname, 'animatic.html') + '?export=1';
const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
async function page(b, dsf = 1) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: dsf }); p.on('pageerror', e => console.error('PAGEERR', e.message)); await p.goto(URL); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500); return p; }
(async () => {
  const mode = process.argv[2]; const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  if (mode === 'stills') {
    const p = await page(b); const ts = (process.argv[3] || '1,3.5,6.5,10,12,18,21.8,24.5,28,30,36.5,40,42.5,44.5').split(',').map(Number);
    for (const t of ts) { await p.evaluate(t => window.__render(t), t); await p.screenshot({ path: path.join(OUT, `still_${t.toFixed(1).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 70 }); }
  } else if (mode === 'video') {
    const p = await page(b); const fps = 25, N = Math.round(46 * fps);
    const raw = path.join(OUT, '_frames.mjpeg'); const fd = fs.openSync(raw, 'w');
    for (let i = 0; i < N; i++) { await p.evaluate(t => window.__render(t), i / fps); fs.writeSync(fd, await p.screenshot({ type: 'jpeg', quality: 88 })); if (i % 100 === 0) console.log('frame', i, '/', N); }
    fs.closeSync(fd);
    const ff = spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', raw, '-c:v', 'libvpx', '-b:v', '8M', '-qmin', '4', '-qmax', '30', '-deadline', 'good', '-cpu-used', '4', '-an', path.join(OUT, 'ORA-animatic-9x16-sem-som.webm')], { stdio: ['ignore', 'ignore', 'inherit'] });
    await new Promise(r => ff.on('close', r)); fs.unlinkSync(raw);
  } else if (mode === 'audio') {
    const p = await page(b); const b64 = await p.evaluate(() => window.__renderAudio()); fs.writeFileSync(path.join(OUT, 'ORA-animatic-banda-sonora.wav'), Buffer.from(b64, 'base64'));
  } else if (mode === 'standalone') {
    let html = fs.readFileSync(path.join(__dirname, 'animatic.html'), 'utf8');
    const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', otf: 'font/otf', ttf: 'font/ttf' };
    html = html.replace(/\.\.\/\.\.\/(assets\/[^)"']+)/g, (m, rel) => { const f = path.join(ROOT, rel); return `data:${mime[path.extname(f).slice(1)]};base64,` + fs.readFileSync(f).toString('base64'); });
    fs.writeFileSync(path.join(OUT, 'ORA-animatic.html'), html); console.log('standalone', (html.length / 1e6).toFixed(1), 'MB');
    // Artifact variant: the publisher adds its own doctype/html/head/body skeleton
    const title = '<title>Animatic ORA</title>\n';
    const art = title + html.replace(/<!doctype html>\s*<html[^>]*>\s*<head>/i, '').replace(/<meta[^>]*>\s*/gi, '').replace(/<title>.*?<\/title>\s*/i, '')
      .replace(/<\/head>\s*<body>/i, '').replace(/<\/body>\s*<\/html>\s*$/i, '');
    fs.writeFileSync(path.join(OUT, 'animatic-ora-artifact.html'), art); console.log('artifact', (art.length / 1e6).toFixed(1), 'MB');
  }
  await b.close();
})();
