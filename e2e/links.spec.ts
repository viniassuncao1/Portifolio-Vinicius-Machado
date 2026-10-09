import { expect, test } from '@playwright/test';

test.describe('Links no código do editor', () => {
  test('os links externos de Contato abrem em outra aba, com rel seguro', async ({ page }) => {
    await page.goto('/contato');

    const externos = page.locator('main code a[href^="http"]');
    const total = await externos.count();

    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      await expect(externos.nth(i)).toHaveAttribute('target', '_blank');
      await expect(externos.nth(i)).toHaveAttribute('rel', /noopener/);
      await expect(externos.nth(i)).toHaveAttribute('rel', /noreferrer/);
    }
  });

  test('os links são texto comum do código: têm nome acessível e são alcançáveis por Tab', async ({
    page,
  }) => {
    await page.goto('/contato');
    const link = page.locator('main code a').first();

    await link.focus();

    await expect(link).toBeFocused();
    await expect(link).toHaveAccessibleName(/.+/);
    await expect(link).toHaveCSS('outline-style', 'solid');
  });

  test('os links mantêm a cor própria do papel, sem o azul padrão do navegador', async ({
    page,
  }) => {
    await page.goto('/contato');
    const cor = await page
      .locator('main code a')
      .first()
      .evaluate((el) => getComputedStyle(el).color);

    expect(cor).not.toBe('rgb(0, 0, 238)');
  });
});
