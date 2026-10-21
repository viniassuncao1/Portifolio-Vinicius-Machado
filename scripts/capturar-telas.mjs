// Captura as telas principais do site em vários tamanhos e nos dois temas, para o diário e para
// comparar a olho antes e depois de uma mudança visual (regressão visual leve, sem baseline que
// quebre entre máquinas).
// Uso: node scripts/capturar-telas.mjs [url-base]   (padrão: http://localhost:4300 do `npm run e2e`)
// Antes: `npm run build` e `node e2e/servidor.mjs 4300`.
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://localhost:4300';
const SAIDA = new URL('../docs/diario/imagens/0023/', import.meta.url);

const TELAS = [
  { nome: 'inicio-1440', url: '/', largura: 1440, altura: 900 },
  { nome: 'inicio-1024', url: '/', largura: 1024, altura: 768 },
  { nome: 'inicio-768', url: '/', largura: 768, altura: 1024 },
  { nome: 'inicio-390', url: '/', largura: 390, altura: 844 },
  { nome: 'vitrine-1440', url: '/projetos', largura: 1440, altura: 900 },
  { nome: 'projeto-1440', url: '/projetos/dra-juliana', largura: 1440, altura: 900 },
  { nome: 'skills-1440', url: '/skills', largura: 1440, altura: 900 },
];
const TEMAS = ['escuro', 'claro'];

await mkdir(SAIDA, { recursive: true });
const navegador = await chromium.launch();
for (const tema of TEMAS) {
  for (const { nome, url, largura, altura } of TELAS) {
    const contexto = await navegador.newContext({
      viewport: { width: largura, height: altura },
      colorScheme: tema === 'claro' ? 'light' : 'dark',
      reducedMotion: 'reduce',
    });
    await contexto.addInitScript(() => {
      sessionStorage.setItem('abertura-exibida', '1');
      localStorage.setItem('visao-do-conteudo', 'cartao');
    });
    const pagina = await contexto.newPage();
    await pagina.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready.then(() => undefined));
    await pagina.waitForTimeout(500);
    await pagina.screenshot({
      path: new URL(`${nome}-${tema}.jpg`, SAIDA).pathname,
      type: 'jpeg',
      quality: 80,
    });
    await contexto.close();
  }
}
await navegador.close();
console.log(`Capturas em docs/diario/imagens/0023/ (${TEMAS.length * TELAS.length} imagens)`);
