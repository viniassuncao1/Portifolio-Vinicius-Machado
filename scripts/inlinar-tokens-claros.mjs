// Copia os tokens do tema claro para o CSS crítico inline de cada página pré-renderizada.
// O beasties (CSS crítico do Angular) só inlina regras que casam com o HTML pré-renderizado, que
// não tem `data-tema`; sem isto, o primeiro quadro no tema claro sairia escuro enquanto o
// styles-*.css carrega. O bloco vem de `src/styles/_tokens.scss`, entre os marcadores
// `/*! tokens-claros:inicio */` e `/*! tokens-claros:fim */`, mantidos no CSS final por
// `removeSpecialComments: false` no angular.json.
// Uso: node scripts/inlinar-tokens-claros.mjs (roda depois do `ng build`, pelo script `build`).
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const RAIZ = join(process.cwd(), 'dist/portfolio/browser');
const INICIO = '/*! tokens-claros:inicio */';
const FIM = '/*! tokens-claros:fim */';
const PAGINAS = /^index(\.csr)?\.html$/;
const ABERTURA_DE_ESTILO = '<style';
const ID_DO_ESTILO = 'tokens-claros';

/** Todos os HTML de página (`index.html` e `index.csr.html`) do build, em qualquer pasta. */
async function paginas(pasta) {
  const itens = await readdir(pasta, { withFileTypes: true });
  const filhos = await Promise.all(
    itens.map(async (item) => {
      const caminho = join(pasta, item.name);
      if (item.isDirectory()) return paginas(caminho);
      return PAGINAS.test(item.name) ? [caminho] : [];
    }),
  );
  return filhos.flat();
}

async function tokensClaros() {
  const arquivos = (await readdir(RAIZ)).filter((nome) => /^styles-.*\.css$/.test(nome));
  if (arquivos.length !== 1) throw new Error(`esperava um styles-*.css, achei ${arquivos.length}`);
  const css = await readFile(join(RAIZ, arquivos[0]), 'utf8');
  const de = css.indexOf(INICIO);
  const ate = css.indexOf(FIM);
  if (de === -1 || ate < de) throw new Error('marcadores tokens-claros não achados no CSS');
  return css.slice(de + INICIO.length, ate).trim();
}

try {
  const estilo = `<style id="${ID_DO_ESTILO}">${await tokensClaros()}</style>`;
  const arquivos = await paginas(RAIZ);
  for (const arquivo of arquivos) {
    const html = await readFile(arquivo, 'utf8');
    const posicao = html.includes(ABERTURA_DE_ESTILO)
      ? html.indexOf(ABERTURA_DE_ESTILO)
      : html.indexOf('</head>');
    if (posicao === -1) throw new Error(`sem <style> nem </head> em ${arquivo}`);
    await writeFile(arquivo, html.slice(0, posicao) + estilo + html.slice(posicao));
  }
  console.log(`tokens do tema claro inlinados em ${arquivos.length} páginas.`);
} catch (erro) {
  console.error(`inlinar-tokens-claros: ${erro.message}`);
  process.exit(1);
}
