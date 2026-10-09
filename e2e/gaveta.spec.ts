import { expect, test } from '@playwright/test';

import { abrirHidratada } from './apoio';

test.describe('Gaveta de seções no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('começa recolhida, com o botão "Seções" fechado', async ({ page }) => {
    await page.goto('/');

    const botao = page.getByRole('button', { name: 'Seções', exact: true });
    await expect(botao).toBeVisible();
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeHidden();
  });

  test('abre pelo botão, leva o foco ao primeiro item e anuncia aria-expanded', async ({
    page,
  }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Seções', exact: true });

    await botao.click();

    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Contato' })).toBeVisible();
  });

  test('fecha com Escape e devolve o foco ao botão', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Seções', exact: true });
    await botao.click();
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(botao).toBeFocused();
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeHidden();
  });

  test('fecha pelo botão "Fechar seções" e devolve o foco ao botão "Seções"', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Seções', exact: true });
    await botao.click();

    await page.getByRole('button', { name: 'Fechar seções' }).click();

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(botao).toBeFocused();
  });

  test('fecha ao clicar de novo no botão "Seções"', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Seções', exact: true });
    await botao.click();

    await botao.click();

    await expect(botao).toHaveAttribute('aria-expanded', 'false');
  });

  test('escolher "Formação" abre a seção e recolhe a gaveta', async ({ page }) => {
    await page.goto('/');
    const botao = page.getByRole('button', { name: 'Seções', exact: true });
    await botao.click();

    await page.getByRole('link', { name: 'Formação' }).click();

    await expect(page).toHaveURL(/\/formacao$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Formação');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('link', { name: 'Formação' })).toBeHidden();
  });

  test('escolhe uma seção só com o teclado: seta para baixo e Enter', async ({ page }) => {
    await abrirHidratada(page, '/');
    await page.getByRole('button', { name: 'Seções', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('link', { name: 'Diferenciais' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/diferenciais$/);
  });

  for (const rota of ['/', '/sobre-mim', '/experiencias', '/contato']) {
    test(`${rota} não rola na horizontal, com a gaveta fechada ou aberta`, async ({ page }) => {
      await page.goto(rota);
      const cabe = () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

      expect(await cabe()).toBe(true);

      await page.getByRole('button', { name: 'Seções', exact: true }).click();

      expect(await cabe()).toBe(true);
    });
  }
});

test.describe('Gaveta no desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('não mostra o botão "Seções" e deixa a árvore sempre visível', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Seções', exact: true })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Fechar seções' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeVisible();
  });
});
