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
  {
    arquivo: 'dra-juliana.jpg',
    url: 'https://www.drajulianamaluhy.com/',
    // O hero usa 100vh: na captura de página inteira a janela fica altíssima e a foto sai do lugar.
    // A coluna da foto entra com animação (slide-up) que a captura de página inteira não completa.
    css: `
      .hero { min-height: ${ALTURA_DA_JANELA}px !important; }
      .hero-image-col, .hero-image-col * {
        opacity: 1 !important; transform: none !important; animation: none !important;
        visibility: visible !important;
      }`,
  },
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

const PASSO_DA_ROLAGEM = 600;
const ESPERA_ENTRE_PASSOS_EM_MS = 400;
const ESPERA_FINAL_EM_MS = 1500;
const LIMITE_PARA_IMAGENS_EM_MS = 15000;

// Os sites carregam imagens e animações conforme a rolagem: desce em passos até o fim, espera as
// imagens terminarem e volta ao topo para a captura de página inteira sair completa.
async function rolarAteOFim(pagina) {
  await pagina.evaluate(
    async ({ passo, espera }) => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += passo) {
        window.scrollTo(0, y);
        await new Promise((resolver) => setTimeout(resolver, espera));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolver) => setTimeout(resolver, espera));
    },
    { passo: PASSO_DA_ROLAGEM, espera: ESPERA_ENTRE_PASSOS_EM_MS },
  );
  await pagina
    .waitForFunction(
      () =>
        [...document.images]
          .filter((img) => img.currentSrc)
          .every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: LIMITE_PARA_IMAGENS_EM_MS },
    )
    .catch(() => console.warn('Aviso: alguma imagem não terminou de carregar a tempo.'));
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForTimeout(ESPERA_FINAL_EM_MS);
}

async function capturar(navegador, { arquivo, url, css }) {
  const pagina = await navegador.newPage({
    viewport: { width: LARGURA, height: ALTURA_DA_JANELA },
  });
  // Movimento reduzido desliga fades e parallax que deixariam imagens do hero invisíveis.
  await pagina.emulateMedia({ reducedMotion: 'reduce' });
  await pagina.goto(url, { waitUntil: 'networkidle' });
  await fecharBanners(pagina);
  if (css) await pagina.addStyleTag({ content: css });
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
