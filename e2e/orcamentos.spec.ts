import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from './fixtures';

/** Marca do código da biblioteca `motion` (a máquina de animação), ausente do código do site. */
const MARCA_DA_BIBLIOTECA = /visualElement/i;
const LIMITE_DE_IMAGEM_EM_BYTES = 200 * 1024;

function arquivosDeImagemModerna(pasta: string): string[] {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = join(pasta, item.name);
    if (item.isDirectory()) return arquivosDeImagemModerna(caminho);
    return /\.(webp|avif)$/i.test(item.name) ? [caminho] : [];
  });
}

test.describe('Orçamentos', () => {
  test('o JavaScript inicial não contém a biblioteca de animação', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const iniciais = [
      ...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g),
      ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g),
    ].map((m) => m[1]);
    expect(iniciais.length).toBeGreaterThan(1);

    for (const arquivo of iniciais) {
      const codigo = await (await request.get(`/${arquivo}`)).text();
      expect(codigo, arquivo).not.toMatch(MARCA_DA_BIBLIOTECA);
    }
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce', visao: 'cartao', viewport: { width: 1440, height: 900 } });

    test('a biblioteca de animação nunca é baixada, nem rolando a página toda', async ({
      page,
    }) => {
      const baixados: string[] = [];
      page.on('response', async (resposta) => {
        if (!resposta.url().endsWith('.js')) return;
        const corpo = await resposta.text().catch(() => '');
        if (MARCA_DA_BIBLIOTECA.test(corpo)) baixados.push(resposta.url());
      });

      await page.goto('/');
      await expect(page.locator('.hero .nome')).toBeVisible();
      await page.locator('section.faixa[aria-label="Contato"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);

      expect(baixados).toEqual([]);
    });
  });

  test.describe('com movimento permitido', () => {
    test.use({ visao: 'cartao', viewport: { width: 1440, height: 900 } });

    test('a biblioteca chega depois da hidratação, por import dinâmico', async ({ page }) => {
      const baixados: string[] = [];
      page.on('response', async (resposta) => {
        if (!resposta.url().endsWith('.js')) return;
        const corpo = await resposta.text().catch(() => '');
        if (MARCA_DA_BIBLIOTECA.test(corpo)) baixados.push(resposta.url());
      });

      await page.goto('/');
      await expect(page.locator('.hero .nome')).toBeVisible();

      await expect.poll(() => baixados.length, { timeout: 8000 }).toBeGreaterThan(0);
    });
  });

  test('nenhuma imagem WebP ou AVIF de public/ passa de 200 KB', () => {
    const imagens = arquivosDeImagemModerna('public');

    expect(imagens.length).toBeGreaterThan(0);
    for (const imagem of imagens) {
      expect(statSync(imagem).size, imagem).toBeLessThanOrEqual(LIMITE_DE_IMAGEM_EM_BYTES);
    }
  });
});
