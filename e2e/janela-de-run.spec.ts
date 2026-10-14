import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const janela = (page: Page) => page.locator('app-janela-de-run');
const log = (page: Page) => page.getByRole('region', { name: /Log de inicialização/ });

test.describe('Janela de Run: primeira visita', () => {
  test('abre sozinha na primeira página, mostra a linha final e não rouba o foco', async ({
    page,
  }) => {
    await page.goto('/skills');

    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(log(page)).toContainText('Started PortfolioApplication in 1.8 seconds');
    await expect(log(page)).toContainText(':: Spring Boot ::');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
  });

  test('as datas do log são geradas no navegador, não no HTML pré-renderizado', async ({
    browser,
  }) => {
    const semJs = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await semJs.newPage();
    await pagina.goto('/skills');

    await expect(pagina.locator('app-janela-de-run')).not.toContainText('Started');
    await expect(pagina.locator('app-janela-de-run section')).toHaveCount(0);
    await semJs.close();
  });

  test('não abre sozinha de novo na mesma sessão', async ({ page }) => {
    await page.goto('/skills');
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });

  test('com movimento reduzido não abre sozinha', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/skills');
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });
});

test.describe('Janela de Run: Executar, fechar e exclusividade', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('o Executar da barra abre a janela com o foco nela, e Esc fecha devolvendo o foco', async ({
    page,
  }) => {
    await page.goto('/skills');
    const executar = page.getByRole('button', { name: 'Executar PortfolioApplication' });

    await executar.click();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(page.getByRole('region', { name: 'Run', exact: false }).first()).toBeFocused();
    await page.keyboard.press('Escape');

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
    await expect(executar).toBeFocused();
  });

  test('o botão de fechar fecha a janela', async ({ page }) => {
    await page.goto('/skills');
    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    await page.getByRole('button', { name: 'Fechar a janela de Run' }).click();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });

  test('o Run e o painel do Git não ficam abertos juntos', async ({ page }) => {
    await page.goto('/skills');
    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');

    await page.getByRole('button', { name: /painel do Git/ }).click();
    await expect(page.locator('app-painel-do-git')).toHaveAttribute('data-aberto', 'true');
    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');

    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(page.locator('app-painel-do-git')).toHaveAttribute('data-aberto', 'false');
  });

  test('o log é texto, com uma só região aria-live que anuncia a linha final', async ({ page }) => {
    await page.goto('/skills');
    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    const viva = janela(page).locator('[aria-live]');

    await expect(viva).toHaveCount(1);
    await expect(viva).toHaveAttribute('aria-live', 'polite');
    await expect(viva).toContainText('Started PortfolioApplication');
  });

  test('nos projetos com site o Executar da barra continua abrindo o preview', async ({ page }) => {
    await page.goto('/projeto-2');

    await page.getByRole('button', { name: 'Executar o projeto' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });
});

for (const [nome, viewport] of [
  ['desktop', { width: 1920, height: 1080 }],
  ['celular', { width: 390, height: 844 }],
] as const) {
  test.describe(`Janela de Run no ${nome}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      test(`passa no axe e não rola a página na horizontal (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.goto('/skills');
        await expect(janela(page)).toHaveCSS('opacity', '1');

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        const { rolagem, largura } = await page.evaluate(() => ({
          rolagem: document.documentElement.scrollWidth,
          largura: document.documentElement.clientWidth,
        }));

        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual(
          [],
        );
        expect(rolagem).toBeLessThanOrEqual(largura);
      });
    }
  });
}

test('no celular a janela não passa de 40% da altura e deixa a barra de status à mostra', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/skills');
  await expect(janela(page)).toHaveCSS('opacity', '1');

  const caixa = (await janela(page).boundingBox())!;
  const status = (await page.getByRole('status').boundingBox())!;

  expect(caixa.height).toBeLessThanOrEqual(844 * 0.4 + 1);
  expect(caixa.y + caixa.height).toBeLessThanOrEqual(status.y + 1);
});
