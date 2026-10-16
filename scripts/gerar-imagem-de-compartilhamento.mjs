// Gera a imagem de compartilhamento (Open Graph): renderiza o cartão em IDE de
// scripts/compartilhamento/cartao.html (fonte e ícones do próprio repositório). O layout é de
// 1200x630 e a captura sai em 2400x1260 (deviceScaleFactor 2), para ficar nítida nos cartões
// grandes do LinkedIn e dos outros apps.
// Uso: node scripts/gerar-imagem-de-compartilhamento.mjs
// Rode de novo quando o cartão mudar e confira a imagem antes de commitar.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const LARGURA = 1200;
const ALTURA = 630;
const ESCALA = 2;
const CARTAO = new URL('./compartilhamento/cartao.html', import.meta.url);
const ARQUIVO_DE_SAIDA = new URL('../public/compartilhamento/portfolio.png', import.meta.url);

const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({
    viewport: { width: LARGURA, height: ALTURA },
    deviceScaleFactor: ESCALA,
  });
  await pagina.emulateMedia({ reducedMotion: 'reduce' });
  await pagina.goto(CARTAO.href, { waitUntil: 'load' });
  await pagina.evaluate(() => document.fonts.ready);
  const fonteCarregada = await pagina.evaluate(() =>
    document.fonts.check("700 84px 'JetBrains Mono'"),
  );
  if (!fonteCarregada) throw new Error('A fonte JetBrains Mono não carregou: rode `npm install`.');
  const imagem = await pagina.screenshot({ type: 'png' });
  await mkdir(new URL('./', ARQUIVO_DE_SAIDA), { recursive: true });
  await writeFile(ARQUIVO_DE_SAIDA, imagem);
  console.log(
    `portfolio.png: ${Math.round(imagem.length / 1024)} KB, ${LARGURA * ESCALA}x${ALTURA * ESCALA}`,
  );
} finally {
  await navegador.close();
}
