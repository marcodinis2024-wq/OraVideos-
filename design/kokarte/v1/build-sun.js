// Extrai os <path> do símbolo (sol) para sun-paths.js — raios 0..14, disco 15, horizonte 16
const fs = require('fs'), path = require('path');
const svg = fs.readFileSync(path.resolve(__dirname, '../../../assets/kokarte/logotipo-kokarte-simbolo.svg'), 'utf8');
const d = [...svg.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
fs.writeFileSync(path.join(__dirname, 'sun-paths.js'), '// gerado por build-sun.js a partir de assets/kokarte/logotipo-kokarte-simbolo.svg (viewBox 0 0 264 110)\nwindow.SUN_PATHS=' + JSON.stringify(d) + ';\n');
console.log(d.length, 'paths');
