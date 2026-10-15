// Gera o sitemap.xml a partir das páginas pré-renderizadas do build (uma por seção: os endereços antigos
// de página, como /skills/2, só redirecionam e não são pré-renderizados).
// Uso: node scripts/gerar-sitemap.mjs (roda depois do `ng build`, pelo script `build`).
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DOMINIO = 'https://portfolio-vinicius-machado.vercel.app';
const RAIZ = join(process.cwd(), 'dist/portfolio/browser');
const PAGINA = 'index.html';

/** Caminhos (como `skills`, ou vazio para a raiz) das pastas que têm um `index.html`. */
async function caminhosDasPaginas(pasta) {
  const itens = await readdir(pasta, { withFileTypes: true });
  const aqui = itens.some((item) => item.isFile() && item.name === PAGINA)
    ? [relative(RAIZ, pasta).split(sep).join('/')]
    : [];
  const filhas = await Promise.all(
    itens
      .filter((item) => item.isDirectory())
      .map((item) => caminhosDasPaginas(join(pasta, item.name))),
  );
  return [...aqui, ...filhas.flat()];
}

const urlDe = (caminho) => (caminho === '' ? `${DOMINIO}/` : `${DOMINIO}/${caminho}`);

const caminhos = (await caminhosDasPaginas(RAIZ)).sort((a, b) => a.localeCompare(b));
const dataDoBuild = new Date().toISOString().slice(0, 10);
const entradas = caminhos.map(
  (caminho) =>
    `  <url>\n    <loc>${urlDe(caminho)}</loc>\n    <lastmod>${dataDoBuild}</lastmod>\n  </url>`,
);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entradas.join('\n')}\n</urlset>\n`;

await writeFile(join(RAIZ, 'sitemap.xml'), xml);
console.log(`sitemap.xml gerado com ${caminhos.length} URLs.`);
