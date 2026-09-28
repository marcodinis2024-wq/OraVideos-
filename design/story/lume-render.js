// Deterministic renderer for lume-video.html: virtual clock → frame-by-frame screenshots → H.264/AAC MP4.
// Usage: node lume-render.js            (full MP4)
//        node lume-render.js stills 3,12,30   (only JPEG stills at those seconds)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const OUT = path.resolve(__dirname, '../../dist'), FF = process.env.FFMPEG || path.join(process.env.HOME, 'bin/ffmpeg');
const FPS = 25, W = 405, H = 720, DSF = 1080 / W;
const mode = process.argv[2] || 'mp4', stills = (process.argv[3] || '').split(',').filter(Boolean).map(Number);

const VCLOCK = `(() => {
  let vt = 0, id = 1, rid = 1; const timers = new Map(), rafs = new Map(), started = new WeakMap();
  performance.now = () => vt; const base = Date.now(); Date.now = () => base + vt;
  window.setTimeout = (f, ms = 0, ...a) => { const i = id++; timers.set(i, { t: vt + Math.max(0, +ms || 0), f, a }); return i; };
  window.clearTimeout = i => timers.delete(i);
  window.setInterval = (f, ms, ...a) => { const i = id++; timers.set(i, { t: vt + ms, f, a, iv: Math.max(1, ms) }); return i; };
  window.clearInterval = i => timers.delete(i);
  window.requestAnimationFrame = f => { const i = rid++; rafs.set(i, f); return i; };
  window.cancelAnimationFrame = i => rafs.delete(i);
  const flush = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  window.__advance = async ms => {
    const end = vt + ms;
    for (;;) { let nx = null, ni = 0; for (const [i, r] of timers) if (r.t <= end && (!nx || r.t < nx.t)) { nx = r; ni = i; }
      if (!nx) break; vt = Math.max(vt, nx.t); if (nx.iv) nx.t += nx.iv; else timers.delete(ni);
      try { nx.f(...nx.a); } catch (e) { console.error(e); } await flush(); }
    vt = end; const cbs = [...rafs.values()]; rafs.clear(); for (const f of cbs) { try { f(vt); } catch (e) { console.error(e); } } await flush();
    for (const a of document.getAnimations()) { if (!started.has(a)) started.set(a, vt - (a.currentTime || 0)); try { a.pause(); a.currentTime = vt - started.get(a); } catch (e) {} }
    await flush();
  };
})();`;

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files', '--disable-gpu-vsync'] });
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DSF });
  p.on('pageerror', e => console.error('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await p.addInitScript(VCLOCK);
  await p.goto('file://' + path.join(__dirname, 'lume-video.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.evaluate(() => { window.__start(); });
  const raw = path.join(OUT, '_lume_frames.mjpeg'); const fd = mode === 'mp4' ? fs.openSync(raw, 'w') : null;
  let f = 0; const maxF = FPS * 200; let doneAt = null;
  while (f < maxF) {
    await p.evaluate(ms => window.__advance(ms), 1000 / FPS);
    const t = f / FPS; await p.evaluate(() => window.__beforeShot && window.__beforeShot());
    if (mode === 'mp4') fs.writeSync(fd, await p.screenshot({ type: 'jpeg', quality: 90 }));
    else if (stills.some(s => Math.abs(s - t) < .5 / FPS)) await p.screenshot({ path: path.join(OUT, `lume_v_${t.toFixed(1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 75 });
    if (f % 250 === 0) console.log('t', t.toFixed(1));
    if (doneAt === null && await p.evaluate(() => window.__done)) doneAt = f;
    if (doneAt !== null && f >= doneAt) break;
    if (mode !== 'mp4' && stills.length && t > Math.max(...stills)) break;
    f++;
  }
  const dur = (f + 1) / FPS; console.log('duration', dur.toFixed(2));
  if (mode !== 'mp4') { await b.close(); return; }
  fs.closeSync(fd);
  const log = await p.evaluate(() => window.__audioLog);
  fs.writeFileSync(path.join(OUT, 'lume-audio-log.json'), JSON.stringify(log));
  const ap = await b.newPage(); await ap.goto('file://' + path.join(__dirname, 'lume-audio.html'));
  const b64 = await ap.evaluate(([l, d]) => window.renderLog(l, d), [log, dur]);
  const wav = path.join(OUT, 'Lume-banda-sonora.wav'); fs.writeFileSync(wav, Buffer.from(b64, 'base64'));
  await b.close();
  const mp4 = path.join(OUT, 'Lume-0247-9x16.mp4');
  const r = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', raw, '-i', wav,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
  console.log('ffmpeg', r.status); fs.unlinkSync(raw);
})();
