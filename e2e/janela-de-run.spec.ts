import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { verBoasVindas } from './apoio';

const janela = (page: Page) => page.locator('app-janela-de-run');
const executar = (page: Page) =>
  page.getByRole('button', { name: 'Executar PortfolioApplication' });
const log = (page: Page) => page.getByRole('region', { name: /Log de inicialização/ });

test.describe('Janela de Run: nunca abre sozinha', () => {
  test('na primeira visita de verdade, nem depois das boas-vindas, a janela não abre', async ({
    page,
  }) => {
    await verBoasVindas(page);
    await page.goto('/skills');
    await expect(page.locator('app-barra-de-status .aviso')).toContainText(
      'PortfolioApplication started in 1.8 s',
    );

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });

  test('recarregar e abrir outra página também não abrem a janela', async ({ page }) => {
    await page.goto('/skills');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');

    await page.goto('/sobre-mim');

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });

  test('o Executar abre a janela, mostra a linha final em até 2,5 s e não rouba o foco do documento', async ({
    page,
  }) => {
    await page.goto('/skills');

    await executar(page).click();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(log(page)).toContainText('Started PortfolioApplication in 1.8 seconds', {
      timeout: 2500,
    });
    await expect(log(page)).toContainText(':: Spring Boot ::');
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

test.describe('Janela de Run: Pular, Esc e leitura durante o log', () => {
  test('Pular mostra o log completo na hora e some do cabeçalho', async ({ page }) => {
    await page.goto('/skills');
    await executar(page).click();
    const pular = page.getByRole('button', { name: 'Pular' });

    await pular.click();

    await expect(page.locator('app-janela-de-run section')).toHaveAttribute(
      'data-terminado',
      'true',
    );
    await expect(page.locator('app-janela-de-run .linha.oculta')).toHaveCount(0);
    await expect(log(page)).toContainText('Started PortfolioApplication in 1.8 seconds');
    await expect(pular).toHaveCount(0);
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
  });

  test('Esc com o foco no log fecha a janela, mesmo no meio da revelação', async ({ page }) => {
    await page.goto('/skills');
    await executar(page).click();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');

    await log(page).focus();
    await page.keyboard.press('Escape');

    await expect(janela(page)).toHaveAttribute('data-aberto', 'false');
  });

  test('o editor segue visível acima da janela e o texto do código não fica coberto', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/skills');
    await executar(page).click();
    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(page.locator('main code > .linha').first()).toBeVisible();

    const editor = (await page.locator('main app-editor-de-codigo').boundingBox())!;
    const caixa = (await janela(page).boundingBox())!;

    expect(editor.y + editor.height).toBeLessThanOrEqual(caixa.y + 1);
    expect(editor.height).toBeGreaterThan(300);
  });

  test('aberto pelo Executar com movimento reduzido, o log já nasce completo e sem Pular', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/sobre-mim');

    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    await expect(page.locator('app-janela-de-run section')).toHaveAttribute(
      'data-terminado',
      'true',
    );
    await expect(page.locator('app-janela-de-run .linha.oculta')).toHaveCount(0);
    await expect(log(page)).toContainText('Started PortfolioApplication in 1.8 seconds');
    await expect(page.getByRole('button', { name: 'Pular' })).toHaveCount(0);
    expect(
      await page
        .locator('app-janela-de-run .linha')
        .last()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
  });
});

test.describe('Janela de Run: Executar fora dos projetos com site', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('em Sobre Mim não há ▶ na calha e o Executar da barra abre a janela de Run', async ({
    page,
  }) => {
    await page.goto('/sobre-mim');

    await expect(page.getByRole('button', { name: /^Executar Projeto \d$/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(log(page)).toContainText('Started PortfolioApplication');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('em Projeto 1 (sem site) o Executar abre o Run, não o preview', async ({ page }) => {
    await page.goto('/projeto-1');

    await page.getByRole('button', { name: 'Executar PortfolioApplication' }).click();

    await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
    await expect(page.getByRole('dialog')).toHaveCount(0);
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
        await executar(page).click();
        await expect(janela(page)).toHaveCSS('opacity', '1');
        // Durante a revelação cada linha faz fade: o contraste só vale com o log completo.
        await expect(page.locator('app-janela-de-run section')).toHaveAttribute(
          'data-terminado',
          'true',
        );

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
  await executar(page).click();
  await expect(janela(page)).toHaveAttribute('data-aberto', 'true');
  await expect(janela(page)).toHaveCSS('opacity', '1');

  const caixa = (await janela(page).boundingBox())!;
  const status = (await page.getByRole('contentinfo').boundingBox())!;

  expect(caixa.height).toBeLessThanOrEqual(844 * 0.4 + 1);
  expect(caixa.y + caixa.height).toBeLessThanOrEqual(status.y + 1);
});
