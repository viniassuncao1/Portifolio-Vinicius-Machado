import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirHidratada } from './apoio';

import { SECOES } from '../src/app/core/secoes';

const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const item = (page: Page, titulo: string) =>
  arvore(page).getByRole('link', { name: titulo, exact: true });

// Movimento reduzido: o código aparece pronto, sem a digitação interferir.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('Árvore navegável por setas', () => {
  test('só um item entra na ordem de Tab: o da seção aberta', async ({ page }) => {
    await abrirHidratada(page, '/diferenciais');

    const focaveis = await arvore(page)
      .getByRole('link')
      .evaluateAll((links) =>
        links.filter((l) => l.getAttribute('tabindex') === '0').map((l) => l.textContent?.trim()),
      );

    expect(focaveis).toEqual(['Diferenciais']);
  });

  test('seta para baixo vai de "Diferenciais" a "Como uso a IA"', async ({ page }) => {
    await abrirHidratada(page, '/diferenciais');
    await item(page, 'Diferenciais').focus();

    await page.keyboard.press('ArrowDown');

    await expect(item(page, 'Como uso a IA')).toBeFocused();
    await expect(item(page, 'Como uso a IA')).toHaveAttribute('tabindex', '0');
    await expect(item(page, 'Diferenciais')).toHaveAttribute('tabindex', '-1');
  });

  test('seta para cima sobe um item', async ({ page }) => {
    await abrirHidratada(page, '/diferenciais');
    await item(page, 'Diferenciais').focus();

    await page.keyboard.press('ArrowUp');

    await expect(item(page, 'Sobre Mim')).toBeFocused();
  });

  test('as setas param nas pontas, sem dar a volta', async ({ page }) => {
    await abrirHidratada(page, '/');
    await item(page, 'Sobre Mim').focus();
    await page.keyboard.press('ArrowUp');
    await expect(item(page, 'Sobre Mim')).toBeFocused();

    await page.keyboard.press('End');
    await page.keyboard.press('ArrowDown');

    await expect(item(page, 'Contato')).toBeFocused();
  });

  test('Home e End vão ao primeiro e ao último item', async ({ page }) => {
    await abrirHidratada(page, '/eventos');
    await item(page, 'Eventos').focus();

    await page.keyboard.press('End');
    await expect(item(page, SECOES.at(-1)!.titulo)).toBeFocused();

    await page.keyboard.press('Home');
    await expect(item(page, SECOES[0].titulo)).toBeFocused();
  });

  test('Enter abre a seção do item focado', async ({ page }) => {
    await abrirHidratada(page, '/');
    await item(page, 'Sobre Mim').focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/como-uso-ia$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como uso a IA');
  });

  test('o foco visível acompanha as setas', async ({ page }) => {
    await abrirHidratada(page, '/');
    await item(page, 'Sobre Mim').focus();

    await page.keyboard.press('ArrowDown');

    const focado = item(page, 'Diferenciais');
    await expect(focado).toHaveCSS('outline-style', 'solid');
    await expect(focado).not.toHaveCSS('outline-width', '0px');
  });

  test('percorre as 15 seções de cima a baixo na ordem da árvore', async ({ page }) => {
    await abrirHidratada(page, '/');
    await item(page, 'Sobre Mim').focus();
    const visitados: (string | undefined)[] = [];

    await SECOES.reduce(async (anterior) => {
      await anterior;
      visitados.push(await page.evaluate(() => document.activeElement?.textContent?.trim()));
      await page.keyboard.press('ArrowDown');
    }, Promise.resolve());

    expect(visitados).toEqual(SECOES.map((secao) => secao.titulo));
  });
});
