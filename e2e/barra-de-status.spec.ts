import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const status = (page: Page) => page.getByRole('status').filter({ hasText: 'UTF-8' });

test.describe('Barra de status', () => {
  // Movimento reduzido: o código aparece pronto, sem a digitação interferir nos cliques.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('mostra o arquivo, UTF-8, Java 21 e main na seção Skills', async ({ page }) => {
    await page.goto('/skills');

    const barra = status(page);

    await expect(barra).toContainText('Skills.java');
    await expect(barra).toContainText('UTF-8');
    await expect(barra).toContainText('Java 21');
    await expect(barra).toContainText('main');
  });

  test('mostra ViniciusMachado.java no Início', async ({ page }) => {
    await page.goto('/');

    await expect(status(page)).toContainText('ViniciusMachado.java');
  });

  test('troca o arquivo ao trocar de seção', async ({ page }) => {
    await page.goto('/sobre-mim');
    await expect(status(page)).toContainText('SobreMim.java');

    await page
      .getByRole('navigation', { name: 'Seções do portfólio' })
      .getByRole('link', { name: 'Eventos' })
      .click();

    await expect(status(page)).toContainText('Eventos.java');
    await expect(status(page)).not.toContainText('SobreMim.java');
  });

  test('a posição acompanha a linha clicada no editor: linha 7 mostra 7:1', async ({ page }) => {
    await page.goto('/sobre-mim');
    const editor = page.locator('main app-editor-de-codigo');
    await expect(editor).toHaveClass(/pronto/);

    await editor.locator('[data-indice="6"]').click();

    await expect(editor.locator('.atual')).toHaveAttribute('data-indice', '6');
    await expect(status(page).locator('.posicao')).toHaveText('7:1');
  });

  test('a posição muda de uma linha clicada para outra', async ({ page }) => {
    await page.goto('/sobre-mim');
    const editor = page.locator('main app-editor-de-codigo');
    await expect(editor).toHaveClass(/pronto/);

    await editor.locator('[data-indice="2"]').click();
    await expect(status(page).locator('.posicao')).toHaveText('3:1');
    await editor.locator('[data-indice="4"]').click();

    await expect(status(page).locator('.posicao')).toHaveText('5:1');
  });

  test('tem o papel status e só o arquivo fica na leitura: a posição é aria-hidden', async ({
    page,
  }) => {
    await page.goto('/sobre-mim');

    await expect(status(page)).toHaveAttribute('role', 'status');
    await expect(status(page).locator('.posicao')).toHaveAttribute('aria-hidden', 'true');
    await expect(status(page).locator('.arquivo')).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('fica no rodapé, abaixo do editor', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/skills');

    const barra = await status(page).boundingBox();
    const editor = await page.getByRole('main').boundingBox();

    expect(barra!.y).toBeGreaterThanOrEqual(editor!.y + editor!.height - 1);
    expect(barra!.y + barra!.height).toBeLessThanOrEqual(1080 + 1);
  });

  test('no celular (390x844) o nome do arquivo continua visível', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/skills');

    await expect(status(page).locator('.arquivo')).toBeVisible();
    await expect(status(page).locator('.arquivo')).toHaveText('Skills.java');
  });
});
