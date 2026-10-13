// Gera a imagem de compartilhamento (Open Graph) a partir da página inicial do próprio portfólio.
// Uso: npm run build && node scripts/gerar-imagem-de-compartilhamento.mjs
// Rode de novo quando o visual do Início mudar e confira a imagem antes de commitar.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';

const LARGURA = 1200;
const ALTURA = 630;
const LIMITE_EM_MS = 15000;
const ARQUIVO_DE_SAIDA = new URL('../public/compartilhamento/portfolio.png', import.meta.url);

/** Pede ao sistema uma porta livre. */
function portaLivre() {
  return new Promise((resolver, rejeitar) => {
    const servidor = createServer();
    servidor.once('error', rejeitar);
    servidor.listen(0, () => {
      const { port } = servidor.address();
      servidor.close(() => resolver(port));
    });
  });
}

/** Sobe o servidor estático dos E2E sobre o build e espera ele responder. */
async function subirServidor(porta) {
  const processo = spawn(process.execPath, ['e2e/servidor.mjs', String(porta)], {
    stdio: 'ignore',
  });
  const limite = Date.now() + LIMITE_EM_MS;
  while (Date.now() < limite) {
    const resposta = await fetch(`http://localhost:${porta}/`).catch(() => null);
    if (resposta?.ok) return processo;
    await new Promise((resolver) => setTimeout(resolver, 200));
  }
  processo.kill();
  throw new Error('O servidor do build não respondeu: rode `npm run build` antes.');
}

const porta = await portaLivre();
const servidor = await subirServidor(porta);
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ viewport: { width: LARGURA, height: ALTURA } });
  await pagina.emulateMedia({ reducedMotion: 'reduce' });
  await pagina.goto(`http://localhost:${porta}/`, { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForSelector('main app-editor-de-codigo code', { timeout: LIMITE_EM_MS });
  await pagina.waitForSelector('main app-editor-de-codigo:not(.digitando)', {
    timeout: LIMITE_EM_MS,
  });
  await pagina.waitForTimeout(500);
  const imagem = await pagina.screenshot({ type: 'png' });
  await mkdir(new URL('./', ARQUIVO_DE_SAIDA), { recursive: true });
  await writeFile(ARQUIVO_DE_SAIDA, imagem);
  console.log(`portfolio.png: ${Math.round(imagem.length / 1024)} KB, ${LARGURA}x${ALTURA}`);
} finally {
  await navegador.close();
  servidor.kill();
}
