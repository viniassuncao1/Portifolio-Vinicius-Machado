// Galeria de revisão: captura todas as rotas do site em 4 larguras e nos dois temas e monta um
// `index.html` local para o Vinicius revisar. Usa o build de produção (`dist/`), servido pelo mesmo
// servidor dos E2E, numa porta própria (4310), sem tocar no `ng serve` (4200).
//
//   node scripts/capturar-revisao.mjs                 # gera tudo (builda se não houver dist/)
//   node scripts/capturar-revisao.mjs --build         # força um build novo antes
//   node scripts/capturar-revisao.mjs --rota=/skills  # só uma rota (repetível), para conferir rápido
//
// Saída: .maestri/capturas/revisao/ (ignorada pelo git). Abra o index.html no navegador.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

const PORTA = 4310;
const ORIGEM = `http://localhost:${PORTA}`;
const SAIDA = join(process.cwd(), '.maestri/capturas/revisao');
const LARGURAS = [
  { largura: 320, altura: 700 },
  { largura: 768, altura: 1024 },
  { largura: 1024, altura: 768 },
  { largura: 1440, altura: 900 },
];
const TEMAS = [
  { nome: 'claro', esquema: 'light' },
  { nome: 'escuro', esquema: 'dark' },
];
/** Chave que marca a sessão como já aberta: sem a abertura de ~12 s cobrindo a primeira rota. */
const CHAVE_DA_ABERTURA = 'abertura-exibida';

const argumentos = process.argv.slice(2);
const rotasPedidas = argumentos.filter((a) => a.startsWith('--rota=')).map((a) => a.slice(7));
const forcarBuild = argumentos.includes('--build');

/** `slug: '...'` de cada seção, lido de `core/secoes.ts` e de `core/projetos.ts` (são TypeScript). */
async function slugsDe(arquivo) {
  const texto = await readFile(arquivo, 'utf8');
  return [...texto.matchAll(/^\s+slug: '([^']+)'/gm)].map((m) => m[1]);
}

async function listarRotas() {
  const secoes = await slugsDe('src/app/core/secoes.ts');
  const projetos = await slugsDe('src/app/core/projetos.ts');
  const todas = [
    '/',
    ...secoes.map((slug) => `/${slug}`),
    '/projetos',
    `/projetos/${projetos[0]}`,
    '/repositorio',
  ];
  return rotasPedidas.length ? todas.filter((rota) => rotasPedidas.includes(rota)) : todas;
}

const nomeDaPasta = (rota) => (rota === '/' ? 'inicio' : rota.slice(1).replaceAll('/', '--'));

async function responde() {
  try {
    return (await fetch(ORIGEM)).ok;
  } catch {
    return false;
  }
}

async function garantirBuild() {
  if (!forcarBuild && existsSync('dist/portfolio/browser/index.html')) return;
  console.log('Buildando o site (npm run build)…');
  const resultado = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
  if (resultado.status !== 0) throw new Error('O build falhou.');
}

async function subirServidor() {
  if (await responde()) return null;
  const servidor = spawn('node', ['e2e/servidor.mjs', String(PORTA)], { stdio: 'ignore' });
  for (let i = 0; i < 50 && !(await responde()); i++) await new Promise((r) => setTimeout(r, 100));
  if (!(await responde())) throw new Error(`O servidor não subiu na porta ${PORTA}.`);
  return servidor;
}

async function capturar(rotas) {
  const navegador = await chromium.launch();
  const registros = [];
  try {
    for (const tema of TEMAS) {
      for (const { largura, altura } of LARGURAS) {
        const contexto = await navegador.newContext({
          viewport: { width: largura, height: altura },
          colorScheme: tema.esquema,
          reducedMotion: 'reduce',
        });
        await contexto.addInitScript((chave) => {
          try {
            sessionStorage.setItem(chave, '1');
          } catch {
            // Sem armazenamento a abertura aparece; a captura segue.
          }
        }, CHAVE_DA_ABERTURA);
        const pagina = await contexto.newPage();
        for (const rota of rotas) {
          const pasta = join(SAIDA, nomeDaPasta(rota));
          await mkdir(pasta, { recursive: true });
          const arquivo = `${tema.nome}-${largura}.png`;
          try {
            await pagina.goto(`${ORIGEM}${rota}`, { waitUntil: 'load' });
            await pagina.locator('main').first().waitFor({ state: 'attached' });
            await pagina.evaluate(() => document.fonts.ready);
            await pagina.waitForTimeout(450);
            await pagina.screenshot({ path: join(pasta, arquivo), animations: 'disabled' });
            registros.push({
              rota,
              tema: tema.nome,
              largura,
              arquivo: `${nomeDaPasta(rota)}/${arquivo}`,
            });
            console.log(`ok   ${rota}  ${tema.nome}  ${largura}px`);
          } catch (erro) {
            console.warn(
              `FALHOU ${rota} ${tema.nome} ${largura}px: ${erro.message.split('\n')[0]}`,
            );
          }
        }
        await contexto.close();
      }
    }
  } finally {
    await navegador.close();
  }
  return registros;
}

const escapar = (texto) =>
  texto.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function montarIndice(rotas, registros, commit) {
  const grupos = rotas
    .map((rota) => {
      const doGrupo = registros.filter((r) => r.rota === rota);
      const linhas = TEMAS.map(
        (tema) => `
        <div class="linha">
          <h3>${tema.nome}</h3>
          <div class="trilha">${LARGURAS.map(({ largura }) => {
            const r = doGrupo.find((x) => x.tema === tema.nome && x.largura === largura);
            return r
              ? `<figure><a href="${escapar(r.arquivo)}" target="_blank" rel="noopener"><img loading="lazy" src="${escapar(r.arquivo)}" alt="${escapar(rota)} em ${largura}px, tema ${tema.nome}" /></a><figcaption>${largura}px</figcaption></figure>`
              : `<figure class="falhou"><figcaption>${largura}px: sem captura</figcaption></figure>`;
          }).join('')}</div>
        </div>`,
      ).join('');
      return `<section id="${nomeDaPasta(rota)}"><h2><code>${escapar(rota)}</code></h2>${linhas}</section>`;
    })
    .join('\n');
  const menu = rotas
    .map((rota) => `<a href="#${nomeDaPasta(rota)}"><code>${escapar(rota)}</code></a>`)
    .join('');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Galeria de revisão do portfólio</title>
<style>
  :root { color-scheme: light dark; --fundo: #f4f4f6; --texto: #1c1c1c; --borda: #c9c9cf; --cartao: #fff; --acento: #c2328f; }
  @media (prefers-color-scheme: dark) { :root { --fundo: #1c1c1c; --texto: #ececec; --borda: #3b3b40; --cartao: #2b2b2b; --acento: #de60d2; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--fundo); color: var(--texto); font: 15px/1.5 system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 2; padding: 12px 20px; background: var(--cartao); border-bottom: 1px solid var(--borda); }
  header h1 { margin: 0 0 6px; font-size: 18px; }
  header p { margin: 0 0 8px; opacity: 0.75; font-size: 13px; }
  nav { display: flex; flex-wrap: wrap; gap: 6px; }
  nav a { padding: 2px 8px; border: 1px solid var(--borda); border-radius: 6px; color: inherit; text-decoration: none; font-size: 13px; }
  nav a:hover, nav a:focus-visible { border-color: var(--acento); outline: none; }
  main { padding: 20px; display: grid; gap: 28px; }
  section { scroll-margin-top: 110px; padding: 16px; background: var(--cartao); border: 1px solid var(--borda); border-radius: 14px; }
  h2 { margin: 0 0 12px; font-size: 17px; }
  h3 { margin: 0 0 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.7; }
  .linha { margin-bottom: 14px; }
  .trilha { display: flex; gap: 12px; overflow-x: auto; align-items: flex-start; padding-bottom: 6px; }
  figure { margin: 0; flex: none; }
  figure img { display: block; max-height: 360px; width: auto; border: 1px solid var(--borda); border-radius: 8px; background: #888; }
  figcaption { margin-top: 4px; font-size: 12px; opacity: 0.7; text-align: center; }
  .falhou { padding: 20px; border: 1px dashed var(--borda); border-radius: 8px; }
</style>
</head>
<body>
<header>
  <h1>Galeria de revisão do portfólio</h1>
  <p>${rotas.length} rotas × ${LARGURAS.length} larguras × ${TEMAS.length} temas, do build de produção (${escapar(commit)}). Clique numa imagem para ver em tamanho real.</p>
  <nav aria-label="Rotas">${menu}</nav>
</header>
<main>
${grupos}
</main>
</body>
</html>
`;
}

const rotas = await listarRotas();
if (!rotas.length) throw new Error('Nenhuma rota casou com --rota.');
await garantirBuild();
const servidor = await subirServidor();
try {
  await rm(SAIDA, { recursive: true, force: true });
  await mkdir(SAIDA, { recursive: true });
  const registros = await capturar(rotas);
  const commit = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
    encoding: 'utf8',
  }).stdout.trim();
  await writeFile(
    join(SAIDA, 'index.html'),
    montarIndice(rotas, registros, commit || 'sem commit'),
  );
  console.log(`\n${registros.length} capturas. Abra ${join(SAIDA, 'index.html')}`);
} finally {
  servidor?.kill();
}
