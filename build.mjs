import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const mediaTypes = { '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const assets = new Map();
async function embedAsset(name) {
  if (!assets.has(name)) {
    const mime = mediaTypes[path.extname(name)];
    if (!mime) throw new Error(`Tipo de recurso não suportado: ${name}`);
    const data = await readFile(path.join(root, name));
    assets.set(name, `data:${mime};base64,${data.toString('base64')}`);
  }
  return assets.get(name);
}

let html = await readFile(path.join(root, 'index.html'), 'utf8');
let css = await readFile(path.join(root, 'styles.css'), 'utf8');
const js = await readFile(path.join(root, 'app.js'), 'utf8');

for (const match of [...css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)]) {
  const name = path.posix.normalize(path.posix.join('assets', '..', match[1]));
  css = css.replace(match[0], `url('${await embedAsset(name)}')`);
}
html = html.replace(/\s*<link rel="preload"[^>]*>/g, '');
html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
html = html.replace('<script src="app.js" defer></script>', '');
for (const match of [...html.matchAll(/\b(?:src|href|data-image)="((?:assets\/[^" ]+)|favicon\.svg)"/g)]) {
  html = html.replace(match[0], match[0].replace(match[1], await embedAsset(match[1])));
}
html = html.replace('</body>', `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n</script>\n</body>`);
await writeFile(path.join(root, 'abrir-site.html'), html.replace(/[\t ]+$/gm, ''));
console.log('Criado abrir-site.html: imagens, fontes, estilos e JavaScript incluídos num único ficheiro.');
