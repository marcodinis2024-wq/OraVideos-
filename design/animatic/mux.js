// Encode the soundtrack WAV to Opus via Chromium MediaRecorder, then mux (stream copy) with the VP8 video.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const OUT = path.resolve(__dirname, '../../dist'), FF = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage(); await p.goto('file://' + OUT + '/');
  const wav = fs.readFileSync(path.join(OUT, 'ORA-animatic-banda-sonora.wav')).toString('base64');
  const b64 = await p.evaluate(async (wav) => {
    const bytes = Uint8Array.from(atob(wav), c => c.charCodeAt(0));
    const ctx = new AudioContext({ sampleRate: 48000 }); await ctx.resume();
    const buf = await ctx.decodeAudioData(bytes.buffer);
    const dest = ctx.createMediaStreamDestination(); const src = ctx.createBufferSource(); src.buffer = buf; src.connect(dest);
    const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 256000 });
    const chunks = []; rec.ondataavailable = e => chunks.push(e.data);
    const done = new Promise(r => rec.onstop = r);
    rec.start(); src.start(); await new Promise(r => src.onended = r); await new Promise(r => setTimeout(r, 300)); rec.stop(); await done;
    const ab = await new Blob(chunks, { type: 'audio/webm' }).arrayBuffer(); let s = ''; const u = new Uint8Array(ab);
    for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s);
  }, wav);
  await b.close();
  const aud = path.join(OUT, '_audio.webm'); fs.writeFileSync(aud, Buffer.from(b64, 'base64'));
  for (const [v, o] of [['ORA-animatic-9x16-sem-som.webm', 'ORA-animatic-9x16-com-som.webm'], ['ORA-animatic-9x16-sem-som-leve.webm', 'ORA-animatic-9x16-com-som-leve.webm']]) {
    if (!fs.existsSync(path.join(OUT, v))) continue;
    const r = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(OUT, v), '-i', aud, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-shortest', path.join(OUT, o)], { stdio: 'inherit' });
    console.log(o, r.status);
  }
})();
