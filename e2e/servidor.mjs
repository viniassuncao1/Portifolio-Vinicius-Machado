// Servidor estático dos E2E: imita a Vercel (arquivo pré-renderizado primeiro; o resto cai no
// index.csr.html). O `serve --single` entregaria o index.html da raiz também para /contato.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const RAIZ = join(process.cwd(), 'dist/portfolio/browser');
const PORTA = Number(process.argv[2] ?? 4300);
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function caminhoDoArquivo(url) {
  const { pathname } = new URL(url, 'http://localhost');
  const relativo = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidatos = [join(RAIZ, relativo), join(RAIZ, relativo, 'index.html')];
  for (const candidato of candidatos) {
    if (!candidato.startsWith(RAIZ)) continue;
    const info = await stat(candidato).catch(() => null);
    if (info?.isFile()) return candidato;
  }
  return join(RAIZ, 'index.csr.html');
}

createServer(async (req, res) => {
  const arquivo = await caminhoDoArquivo(req.url ?? '/');
  res.setHeader('Content-Type', TIPOS[extname(arquivo)] ?? 'application/octet-stream');
  res.end(await readFile(arquivo));
}).listen(PORTA, () => console.log(`E2E em http://localhost:${PORTA}`));
