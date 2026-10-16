import { createHash } from 'node:crypto';

import { SECOES } from '../src/app/core/secoes';
import { expect, test } from './fixtures';

/** MD5 do favicon.ico que o Angular gera por padrão: não pode mais ser o servido. */
const MD5_DO_ICONE_DO_ANGULAR = '05bcfe9a02b93e1c5a5da14bfda8c41f';
const ROTAS = ['/', '/repositorio', ...SECOES.map((secao) => `/${secao.slug}`)];

const md5 = (corpo: Buffer): string => createHash('md5').update(corpo).digest('hex');

test.describe('Ícone do site no HTML pré-renderizado', () => {
  for (const rota of ROTAS) {
    test(`${rota}: tem o ícone SVG, o ICO de reserva e o apple-touch-icon`, async ({ request }) => {
      const html = await (await request.get(rota)).text();

      expect(html, 'ícone SVG').toMatch(
        /<link rel="icon" type="image\/svg\+xml" href="favicon\.svg"\s*\/?>/,
      );
      expect(html, 'ICO de reserva').toMatch(
        /<link rel="icon" href="favicon\.ico" sizes="any"\s*\/?>/,
      );
      expect(html, 'ícone do iPhone').toMatch(
        /<link rel="apple-touch-icon" href="apple-touch-icon\.png"\s*\/?>/,
      );
    });
  }

  test('os links ficam no <head>, sem JavaScript, e o ícone do Angular não é mais citado', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/');

    await expect(pagina.locator('head link[rel="icon"]')).toHaveCount(2);
    await expect(pagina.locator('head link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
      'href',
      'favicon.svg',
    );
    await expect(pagina.locator('head link[rel="icon"][sizes="any"]')).toHaveAttribute(
      'href',
      'favicon.ico',
    );
    await expect(pagina.locator('head link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      'apple-touch-icon.png',
    );
    await contexto.close();
  });
});

test.describe('Arquivos de ícone servidos', () => {
  test('/favicon.svg é SVG com as iniciais VM', async ({ request }) => {
    const resposta = await request.get('/favicon.svg');
    const texto = await resposta.text();

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toContain('image/svg+xml');
    expect(texto).toContain('<svg');
    expect(texto).toContain('VM');
  });

  test('/favicon.ico é um ICO de verdade com 16, 32 e 48 px, e não é o do Angular', async ({
    request,
  }) => {
    const resposta = await request.get('/favicon.ico');
    const corpo = await resposta.body();

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toMatch(/^image\/(x-icon|vnd\.microsoft\.icon)/);
    // ICONDIR: reservado 0, tipo 1 (ícone), quantidade de imagens; depois uma entrada de 16 bytes cada.
    expect(corpo.readUInt16LE(0)).toBe(0);
    expect(corpo.readUInt16LE(2)).toBe(1);
    const quantidade = corpo.readUInt16LE(4);
    const lados = Array.from({ length: quantidade }, (_, i) => corpo[6 + i * 16] || 256).sort(
      (a, b) => a - b,
    );
    expect(lados).toEqual(expect.arrayContaining([16, 32, 48]));
    expect(md5(corpo), 'não é mais o ícone padrão do Angular').not.toBe(MD5_DO_ICONE_DO_ANGULAR);
  });

  test('/apple-touch-icon.png é um PNG de 180x180', async ({ request }) => {
    const resposta = await request.get('/apple-touch-icon.png');
    const corpo = await resposta.body();

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toContain('image/png');
    expect([...corpo.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    // IHDR: largura e altura em 4 bytes cada, logo depois de "IHDR".
    expect(corpo.subarray(12, 16).toString('ascii')).toBe('IHDR');
    expect(corpo.readUInt32BE(16)).toBe(180);
    expect(corpo.readUInt32BE(20)).toBe(180);
  });

  test('os três ícones têm conteúdo diferente entre si e nenhum está vazio', async ({
    request,
  }) => {
    const [svg, ico, png] = await Promise.all(
      ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png'].map(async (caminho) =>
        (await request.get(caminho)).body(),
      ),
    );

    for (const corpo of [svg, ico, png]) expect(corpo.length).toBeGreaterThan(200);
    expect(new Set([md5(svg), md5(ico), md5(png)]).size).toBe(3);
  });

  test('o navegador carrega o ícone SVG da aba sem erro', async ({ page }) => {
    const falhas: string[] = [];
    page.on('response', (resposta) => {
      if (/favicon|apple-touch-icon/.test(resposta.url()) && resposta.status() >= 400) {
        falhas.push(`${resposta.status()} ${resposta.url()}`);
      }
    });
    await page.goto('/');
    const href = await page
      .locator('head link[rel="icon"][type="image/svg+xml"]')
      .evaluate((el: HTMLLinkElement) => el.href);

    const resposta = await page.request.get(href);

    expect(resposta.ok()).toBe(true);
    expect(falhas).toEqual([]);
  });
});
