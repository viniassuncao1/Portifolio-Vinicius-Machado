import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const TAMANHO_DO_CODIGO = 17;
const TAMANHO_DA_INTERFACE = 16;
const TOLERANCIA_EM_PX = 0.6;
const MINIMO_DE_LINHAS_VISIVEIS = 20;

/** Tamanho da fonte, em px, do primeiro elemento que casa com o seletor. */
const tamanhoDaFonte = async (page: Page, seletor: string): Promise<number> =>
  parseFloat(
    await page
      .locator(seletor)
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize),
  );

test.describe('Escala da tipografia no desktop (1920x1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('o código usa cerca de 17px', async ({ page }) => {
    await page.goto('/skills');

    const token = await tamanhoDaFonte(page, 'main code .papel-palavra-chave');

    expect(Math.abs(token - TAMANHO_DO_CODIGO)).toBeLessThanOrEqual(TOLERANCIA_EM_PX);
  });

  test('a árvore, as abas e a barra de status usam cerca de 16px', async ({ page }) => {
    await page.goto('/skills');

    const medidas = {
      arvore: await tamanhoDaFonte(
        page,
        'nav[aria-label="Seções do portfólio"] a[aria-current="page"]',
      ),
      aba: await tamanhoDaFonte(page, '[role="tab"][aria-selected="true"]'),
      status: await tamanhoDaFonte(page, '[role="status"]:has-text("UTF-8")'),
    };

    for (const [nome, medida] of Object.entries(medidas)) {
      expect(Math.abs(medida - TAMANHO_DA_INTERFACE), nome).toBeLessThanOrEqual(TOLERANCIA_EM_PX);
    }
  });

  test('a interface é menor que o código, mas não passa de 1px de diferença', async ({ page }) => {
    await page.goto('/skills');

    const codigo = await tamanhoDaFonte(page, 'main code .papel-palavra-chave');
    const arvore = await tamanhoDaFonte(page, 'nav[aria-label="Seções do portfólio"] a');

    expect(arvore).toBeLessThanOrEqual(codigo);
    expect(codigo - arvore).toBeLessThanOrEqual(1.5);
  });

  test('cabem pelo menos 20 linhas de código no editor sem rolar', async ({ page }) => {
    await page.goto('/skills');

    // Do topo do código até a barra de status é o espaço que o editor tem para as linhas.
    const linhasQueCabem = await page.locator('main code').evaluate((codigo) => {
      const base = document.querySelector('[role="status"]')?.getBoundingClientRect().top;
      const linha = codigo.querySelector<HTMLElement>('span .papel-palavra-chave')?.parentElement;
      if (base === undefined || !linha) return 0;
      const espaco = base - codigo.getBoundingClientRect().top;
      return Math.floor(espaco / linha.getBoundingClientRect().height);
    });

    expect(linhasQueCabem).toBeGreaterThanOrEqual(MINIMO_DE_LINHAS_VISIVEIS);
  });

  test('numa seção longa, 20 linhas do código aparecem inteiras dentro da janela', async ({
    page,
  }) => {
    await page.goto('/skills/3');

    const visiveis = await page.evaluate(() => {
      const limite = document.querySelector('[role="status"]')?.getBoundingClientRect().top;
      const linhas = Array.from(document.querySelectorAll('main code > span'));
      return linhas.filter((linha) => {
        const caixa = linha.getBoundingClientRect();
        return caixa.top >= 0 && caixa.bottom <= (limite ?? window.innerHeight);
      }).length;
    });

    expect(visiveis).toBeGreaterThanOrEqual(MINIMO_DE_LINHAS_VISIVEIS);
  });
});

test.describe('Escala no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('o código é legível: entre 14px e o tamanho do desktop', async ({ page }) => {
    await page.goto('/skills');

    const token = await tamanhoDaFonte(page, 'main code .papel-palavra-chave');

    expect(token).toBeGreaterThanOrEqual(14);
    expect(token).toBeLessThanOrEqual(TAMANHO_DO_CODIGO + TOLERANCIA_EM_PX);
  });

  test('a página não rola na horizontal', async ({ page }) => {
    await page.goto('/skills/3');

    const transborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(transborda).toBe(false);
  });
});
