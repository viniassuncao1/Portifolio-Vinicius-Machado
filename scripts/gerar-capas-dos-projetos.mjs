// Gera as capas WebP dos cartões da vitrine de projetos (`public/projetos/*-capa.webp`): a primeira
// dobra do site (1440x900) reduzida a 960x600, até 200 KB (orçamento do E2E `vitrine.spec.ts`).
// Uso: node scripts/gerar-capas-dos-projetos.mjs
// O Chromium do Playwright faz a captura e a conversão para WebP (sem dependência de imagem extra).
// Rode de novo quando os sites mudarem e confira as imagens antes de commitar.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const PASTA_DE_SAIDA = new URL('../public/projetos/', import.meta.url);
const JANELA = { width: 1440, height: 900 };
const CAPA = { width: 960, height: 600 };
const LIMITE_EM_BYTES = 200 * 1024;
const QUALIDADES = [0.82, 0.75, 0.68, 0.6, 0.5];
const BOTOES_DE_BANNER = /^(aceitar|aceito|concordo|entendi|ok|fechar|accept|close)/i;

const SITES = [
  { arquivo: 'dra-juliana-capa.webp', url: 'https://www.drajulianamaluhy.com/' },
  { arquivo: 'watts-company-capa.webp', url: 'https://wattscompany.com.br/' },
];

async function fecharBanners(pagina) {
  for (const botao of await pagina.getByRole('button', { name: BOTOES_DE_BANNER }).all()) {
    if (await botao.isVisible()) await botao.click({ timeout: 2000 }).catch(() => {});
  }
}

/** Reduz o PNG ao tamanho da capa e o codifica em WebP, tentando qualidades até caber no limite. */
async function paraWebp(pagina, png) {
  for (const qualidade of QUALIDADES) {
    const base64 = await pagina.evaluate(
      async ({ dados, capa, q }) => {
        const imagem = new Image();
        await new Promise((resolver) => {
          imagem.onload = resolver;
          imagem.src = `data:image/png;base64,${dados}`;
        });
        const tela = document.createElement('canvas');
        tela.width = capa.width;
        tela.height = capa.height;
        tela.getContext('2d').drawImage(imagem, 0, 0, capa.width, capa.height);
        const blob = await new Promise((resolver) => tela.toBlob(resolver, 'image/webp', q));
        const leitor = new FileReader();
        return new Promise((resolver) => {
          leitor.onload = () => resolver(String(leitor.result).split(',')[1]);
          leitor.readAsDataURL(blob);
        });
      },
      { dados: png.toString('base64'), capa: CAPA, q: qualidade },
    );
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length <= LIMITE_EM_BYTES) return { buffer, qualidade };
  }
  throw new Error('Nenhuma qualidade coube em 200 KB.');
}

await mkdir(PASTA_DE_SAIDA, { recursive: true });
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: JANELA });
for (const { arquivo, url } of SITES) {
  await pagina.goto(url, { waitUntil: 'networkidle' });
  await fecharBanners(pagina);
  await pagina.waitForTimeout(1500);
  const png = await pagina.screenshot({ clip: { x: 0, y: 0, ...JANELA } });
  const { buffer, qualidade } = await paraWebp(pagina, png);
  await writeFile(new URL(arquivo, PASTA_DE_SAIDA), buffer);
  console.log(`${arquivo}: ${(buffer.length / 1024).toFixed(1)} KB (qualidade ${qualidade})`);
}
await navegador.close();
