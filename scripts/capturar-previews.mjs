// Gera as capturas de página inteira usadas na janela de preview dos projetos.
// Uso: node scripts/capturar-previews.mjs
// Rode de novo quando os sites mudarem e confira as imagens antes de commitar.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const LARGURA = 1440;
const ALTURA_DA_JANELA = 900;
const LIMITE_EM_BYTES = 400 * 1024;
const QUALIDADES = [80, 70, 60, 50, 40, 30];
const PASTA_DE_SAIDA = new URL('../public/projetos/', import.meta.url);

const SITES = [
  { arquivo: 'dra-juliana.jpg', url: 'https://www.drajulianamaluhy.com/' },
  { arquivo: 'watts-company.jpg', url: 'https://wattscompany.com.br/' },
];

// Textos comuns de botões que fecham banners de cookies ou avisos.
const BOTOES_DE_BANNER = /^(aceitar|aceito|concordo|entendi|ok|fechar|accept|close)/i;

async function fecharBanners(pagina) {
  const botoes = pagina.getByRole('button', { name: BOTOES_DE_BANNER });
  for (const botao of await botoes.all()) {
    if (await botao.isVisible()) {
      await botao.click({ timeout: 2000 }).catch(() => {});
    }
  }
}

// Páginas com animação ao rolar só mostram o conteúdo depois que a rolagem passa por ele.
async function rolarAteOFim(pagina) {
  await pagina.evaluate(async () => {
    const PASSO = 600;
    for (let y = 0; y < document.body.scrollHeight; y += PASSO) {
      window.scrollTo(0, y);
      await new Promise((resolver) => setTimeout(resolver, 150));
    }
    window.scrollTo(0, 0);
  });
}

async function capturar(navegador, { arquivo, url }) {
  const pagina = await navegador.newPage({
    viewport: { width: LARGURA, height: ALTURA_DA_JANELA },
  });
  await pagina.goto(url, { waitUntil: 'networkidle' });
  await fecharBanners(pagina);
  await rolarAteOFim(pagina);
  await pagina.waitForLoadState('networkidle');

  let imagem;
  for (const quality of QUALIDADES) {
    imagem = await pagina.screenshot({ fullPage: true, type: 'jpeg', quality });
    if (imagem.length <= LIMITE_EM_BYTES) break;
  }
  await writeFile(new URL(arquivo, PASTA_DE_SAIDA), imagem);
  const { width, height } = await pagina.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  console.log(`${arquivo}: ${Math.round(imagem.length / 1024)} KB, ${width}x${height}`);
  await pagina.close();
}

await mkdir(PASTA_DE_SAIDA, { recursive: true });
const navegador = await chromium.launch();
try {
  for (const site of SITES) await capturar(navegador, site);
} finally {
  await navegador.close();
}
