import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

const TOLERANCIA_EM_PX = 0.5;
const MINIMO_DE_LINHAS_VISIVEIS = 20;

const ARVORE = 'nav[aria-label="Seções do portfólio"] a[aria-current="page"]';
const LINHA_DE_CODIGO = 'main code > span.linha:not(.vazia)';

/** Tamanho da fonte, em px, do primeiro elemento que casa com o seletor. */
const tamanhoDaFonte = async (page: Page, seletor: string): Promise<number> =>
  parseFloat(
    await page
      .locator(seletor)
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize),
  );

/** Largura e altura, em px, do primeiro elemento que casa com o seletor. */
const medidas = async (page: Page, seletor: string): Promise<{ largura: number; altura: number }> =>
  page
    .locator(seletor)
    .first()
    .evaluate((el) => {
      const caixa = el.getBoundingClientRect();
      return { largura: caixa.width, altura: caixa.height };
    });

const quase = (obtido: number, esperado: number, rotulo: string): void =>
  expect(
    Math.abs(obtido - esperado),
    `${rotulo}: ${obtido}px (esperado ${esperado}px)`,
  ).toBeLessThanOrEqual(TOLERANCIA_EM_PX);

test.describe('Escala da tipografia no desktop (1920x1080)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/skills');
  });

  test('o código usa 14px com linhas de 22px', async ({ page }) => {
    quase(await tamanhoDaFonte(page, 'main code .papel-palavra-chave'), 14, 'fonte do código');
    quase((await medidas(page, LINHA_DE_CODIGO)).altura, 22, 'altura da linha do código');
  });

  test('os números de linha usam 13px', async ({ page }) => {
    quase(await tamanhoDaFonte(page, 'main .numeros span'), 13, 'número de linha');
  });

  test('a árvore usa 13px com linhas de 24px', async ({ page }) => {
    quase(await tamanhoDaFonte(page, ARVORE), 13, 'fonte da árvore');
    quase((await medidas(page, ARVORE)).altura, 24, 'altura da linha da árvore');
  });

  test('a aba usa 13px e a barra de status usa 12px', async ({ page }) => {
    quase(await tamanhoDaFonte(page, '[role="tab"][aria-selected="true"]'), 13, 'fonte da aba');
    quase(await tamanhoDaFonte(page, 'app-barra-de-status footer'), 12, 'fonte da barra de status');
  });

  test('o painel lateral tem 280px, a barra superior 40px e a de status 24px', async ({ page }) => {
    quase((await medidas(page, 'app-painel-lateral')).largura, 280, 'largura do painel');
    quase((await medidas(page, 'app-barra-de-ferramentas')).altura, 40, 'barra superior');
    quase((await medidas(page, 'app-barra-de-status footer')).altura, 24, 'barra de status');
  });

  test('a faixa de abas tem 36px e a aba tem a largura do nome, não a do painel', async ({
    page,
  }) => {
    quase((await medidas(page, '[role="tablist"]')).altura, 36, 'faixa de abas');
    const aba = (await medidas(page, '[role="tab"]')).largura;

    expect(aba).toBeGreaterThan(80);
    expect(aba).toBeLessThan(220);
  });

  test('a aba acompanha o tamanho do nome do arquivo', async ({ page }) => {
    await page.goto('/depoimentos');
    const longa = (await medidas(page, '[role="tab"][aria-selected="true"]')).largura;
    await page.goto('/eventos');
    const curta = (await medidas(page, '[role="tab"][aria-selected="true"]')).largura;

    expect(longa).toBeGreaterThan(curta);
  });

  test('a interface (13px) é menor que o código (14px) por 1px', async ({ page }) => {
    const codigo = await tamanhoDaFonte(page, 'main code .papel-palavra-chave');
    const arvore = await tamanhoDaFonte(page, ARVORE);

    quase(codigo - arvore, 1, 'diferença entre código e árvore');
  });

  test('cabem pelo menos 20 linhas de código no editor sem rolar', async ({ page }) => {
    // Do topo do código até a barra de status é o espaço que o editor tem para as linhas.
    const linhasQueCabem = await page.locator('main code').evaluate((codigo) => {
      const base = document
        .querySelector('app-barra-de-status footer')
        ?.getBoundingClientRect().top;
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
      const limite = document
        .querySelector('app-barra-de-status footer')
        ?.getBoundingClientRect().top;
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

  test('o código usa 13px com linhas de 20px', async ({ page }) => {
    await page.goto('/skills');

    quase(await tamanhoDaFonte(page, 'main code .papel-palavra-chave'), 13, 'fonte do código');
    quase((await medidas(page, LINHA_DE_CODIGO)).altura, 20, 'altura da linha do código');
  });

  test('a barra de status tem 28px', async ({ page }) => {
    await page.goto('/skills');

    quase((await medidas(page, 'app-barra-de-status footer')).altura, 28, 'barra de status');
  });

  test('a página não rola na horizontal', async ({ page }) => {
    await page.goto('/skills/3');

    const transborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(transborda).toBe(false);
  });
});
