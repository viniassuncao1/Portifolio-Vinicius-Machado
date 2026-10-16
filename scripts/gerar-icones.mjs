// Gera os ícones do site a partir de public/favicon.svg ("VM" em contornos, sem depender de fonte):
// os PNG de 16, 32, 48 e 180 px (renderizados pelo Playwright, como o cartão de compartilhamento),
// public/favicon.ico com 16, 32 e 48 px e public/apple-touch-icon.png com 180 px.
// Uso: node scripts/gerar-icones.mjs
// Rode de novo quando o SVG mudar e confira os ícones antes de commitar.
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const SVG = new URL('../public/favicon.svg', import.meta.url);
const SAIDA = new URL('../public/', import.meta.url);
const TAMANHOS_DO_ICO = [16, 32, 48];
const TAMANHO_DO_APPLE = 180;

/** `.ico` com PNGs embutidos (aceito desde o Windows Vista e por todos os navegadores). */
function montarIco(imagens) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(1, 2); // tipo: ícone
  cabecalho.writeUInt16LE(imagens.length, 4);
  let deslocamento = cabecalho.length + imagens.length * 16;
  const entradas = imagens.map(({ tamanho, png }) => {
    const entrada = Buffer.alloc(16);
    entrada.writeUInt8(tamanho, 0); // largura
    entrada.writeUInt8(tamanho, 1); // altura
    entrada.writeUInt16LE(1, 4); // planos
    entrada.writeUInt16LE(32, 6); // bits por pixel
    entrada.writeUInt32LE(png.length, 8);
    entrada.writeUInt32LE(deslocamento, 12);
    deslocamento += png.length;
    return entrada;
  });
  return Buffer.concat([cabecalho, ...entradas, ...imagens.map(({ png }) => png)]);
}

const svg = await readFile(SVG, 'utf8');
const navegador = await chromium.launch();
try {
  const pagina = await navegador.newPage({ deviceScaleFactor: 1 });
  const renderizar = async (tamanho, desenho = svg) => {
    await pagina.setViewportSize({ width: tamanho, height: tamanho });
    await pagina.setContent(
      `<style>html,body{margin:0;background:transparent}svg{display:block;width:${tamanho}px;height:${tamanho}px}</style>${desenho}`,
    );
    return pagina.screenshot({ type: 'png', omitBackground: true });
  };

  const imagens = [];
  for (const tamanho of TAMANHOS_DO_ICO) imagens.push({ tamanho, png: await renderizar(tamanho) });
  // O iPhone aplica a máscara de cantos arredondados e pinta de preto o que for transparente: o
  // ícone dele é um quadrado cheio, sem cantos.
  const apple = await renderizar(TAMANHO_DO_APPLE, svg.replace('rx="14"', 'rx="0"'));

  await writeFile(new URL('favicon.ico', SAIDA), montarIco(imagens));
  await writeFile(new URL('apple-touch-icon.png', SAIDA), apple);
  console.log(
    `favicon.ico (${TAMANHOS_DO_ICO.join('/')} px) e apple-touch-icon.png (${TAMANHO_DO_APPLE} px) gerados.`,
  );
} finally {
  await navegador.close();
}
