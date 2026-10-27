import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const publicFiles = new Set(['index.html', 'abrir-site.html', 'styles.css', 'app.js', 'favicon.svg']);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = path.resolve(root, name);
    if ((!publicFiles.has(name) && !name.startsWith('assets/')) || !file.startsWith(root) || !(await stat(file)).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Página não encontrada.');
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(file));
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404);
    res.end('Página não encontrada.');
  }
});
server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`Mr. Big Evolution disponível na porta ${process.env.PORT || 3000}`));
