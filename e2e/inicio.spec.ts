import { expect, test } from '@playwright/test';

test.describe('Página inicial', () => {
  test('exibe o título do portfólio', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Vinicius Machado/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
  });

  test('redireciona rotas inexistentes para a página inicial', async ({ page }) => {
    await page.goto('/rota-que-nao-existe');

    await expect(page).toHaveURL('/');
  });
});

test.describe('Pré-renderização', () => {
  test.use({ javaScriptEnabled: false });

  test('entrega o conteúdo no HTML sem depender de JavaScript', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
  });
});
