// Servidor estático dos E2E: imita a Vercel (arquivo pré-renderizado primeiro; o resto cai no
// index.csr.html). O `serve --single` entregaria o index.html da raiz também para /contato.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

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
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
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

// A Vercel entrega texto comprimido (brotli ou gzip); sem isto as medições do Lighthouse
// superestimam o peso do HTML pré-renderizado e do JavaScript.
const COMPRIMIVEIS = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml']);

function comprimir(corpo, aceita, extensao, res) {
  if (!COMPRIMIVEIS.has(extensao)) return corpo;
  if (aceita.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    return brotliCompressSync(corpo);
  }
  if (aceita.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    return gzipSync(corpo);
  }
  return corpo;
}

createServer(async (req, res) => {
  const arquivo = await caminhoDoArquivo(req.url ?? '/');
  const extensao = extname(arquivo);
  res.setHeader('Content-Type', TIPOS[extensao] ?? 'application/octet-stream');
  res.setHeader('Vary', 'Accept-Encoding');
  res.end(
    comprimir(await readFile(arquivo), String(req.headers['accept-encoding'] ?? ''), extensao, res),
  );
}).listen(PORTA, () => console.log(`E2E em http://localhost:${PORTA}`));
