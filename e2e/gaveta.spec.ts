import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore, arvoreDeSecoes } from './apoio';

const primeiroItem = (page: Page) => arvoreDeSecoes(page).getByRole('treeitem').first();

test.describe('Gaveta de seções no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('começa recolhida, com o botão Projeto fechado', async ({ page }) => {
    await page.goto('/');

    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    await expect(botao).toBeVisible();
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeHidden();
  });

  test('abre pelo botão, leva o foco ao primeiro item e anuncia aria-expanded', async ({
    page,
  }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });

    await botao.click();

    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await expect(primeiroItem(page)).toBeFocused();
    await expect(arvoreDeSecoes(page).locator('[data-pacote=contato]')).toBeVisible();
  });

  test('fecha com Escape e devolve o foco ao botão', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    await botao.click();
    await expect(primeiroItem(page)).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(botao).toBeFocused();
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeHidden();
  });

  test('fecha pelo botão "Fechar seções" e devolve o foco ao botão Projeto', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    await botao.click();

    await page.getByRole('button', { name: 'Fechar seções' }).click();

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(botao).toBeFocused();
  });

  test('fecha ao clicar de novo no botão Projeto', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    await botao.click();

    await botao.click();

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
  });

  test('escolher "Formação" abre a seção e recolhe a gaveta', async ({ page }) => {
    await abrirHidratada(page, '/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    await botao.click();

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Formação').click();

    await expect(page).toHaveURL(/\/formacao$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Formação');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(arquivoDaArvore(page, 'Formação')).toBeHidden();
  });

  test('escolhe uma seção só com o teclado: seta para baixo e Enter', async ({ page }) => {
    await abrirHidratada(page, '/');
    await page.getByRole('button', { name: 'Projeto', exact: true }).click();
    await expect(primeiroItem(page)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(arquivoDaArvore(page, 'Diferenciais')).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/diferenciais$/);
  });

  for (const rota of ['/', '/sobre-mim', '/experiencias', '/contato']) {
    test(`${rota} não rola na horizontal, com a gaveta fechada ou aberta`, async ({ page }) => {
      await page.goto(rota);
      const cabe = () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

      expect(await cabe()).toBe(true);

      await page.getByRole('button', { name: 'Projeto', exact: true }).click();

      expect(await cabe()).toBe(true);
    });
  }
});

test.describe('Gaveta no desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('não mostra o botão Projeto e deixa a árvore sempre visível', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.projeto-celular')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Fechar seções' })).toBeHidden();
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeVisible();
  });

  test('Projeto da faixa esconde e mostra o painel, e o editor ocupa o espaço', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Projeto', exact: true });
    const editor = page.getByRole('main');
    const largura = async () => (await editor.boundingBox())?.width ?? 0;
    const comPainel = await largura();

    await expect(botao).toHaveAttribute('aria-pressed', 'true');
    await botao.click();

    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeHidden();
    expect(await largura()).toBeGreaterThan(comPainel + 200);

    await botao.click();

    await expect(botao).toHaveAttribute('aria-pressed', 'true');
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeVisible();
  });
});
