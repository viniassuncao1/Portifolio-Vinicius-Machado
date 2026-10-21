import { expect, test } from './fixtures';
import { abrirHidratada, abrirPastas, arquivoDaArvore } from './apoio';

const DESKTOP = { width: 1440, height: 900 };

test.describe('Indicador deslizante das abas', () => {
  test.use({ viewport: DESKTOP });

  test('fica sob a aba ativa, é decorativo e desliza só com transform', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    const indicador = page.locator('app-faixa-de-abas .indicador');

    await expect(indicador).toHaveAttribute('aria-hidden', 'true');
    await expect(indicador).toHaveClass(/medido/);
    const antes = await indicador.evaluate((el) => (el as HTMLElement).style.transform);

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Experiências').click();
    await expect(page.getByRole('tab', { name: /Experiencias\.java/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await expect
      .poll(() => indicador.evaluate((el) => (el as HTMLElement).style.transform))
      .not.toBe(antes);
    // O indicador desliza (0,2 s): espera chegar sob a aba.
    await expect
      .poll(async () => {
        const aba = (await page.getByRole('tab', { name: /Experiencias\.java/ }).boundingBox())!;
        const fio = (await indicador.boundingBox())!;
        return Math.abs(fio.x - aba.x) + Math.abs(fio.width - aba.width);
      })
      .toBeLessThan(3);
  });

  test('não fica dentro do tablist (que só aceita abas)', async ({ page }) => {
    await abrirHidratada(page, '/skills');

    await expect(page.locator('[role="tablist"] .indicador')).toHaveCount(0);
  });
});

test.describe('Barra de carregamento na troca de rota', () => {
  test.use({ viewport: DESKTOP });

  test('aparece ao navegar e some depois, sem atrapalhar leitores de tela', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    const barra = page.locator('app-barra-de-carregamento');
    await expect(barra).toHaveAttribute('aria-hidden', 'true');
    await expect(barra).toHaveAttribute('data-estado', 'parada');

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Experiências').click();

    await expect(barra).toHaveAttribute('data-estado', /correndo|terminando/);
    await expect(barra).toHaveAttribute('data-estado', 'parada', { timeout: 3000 });
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce' });

    test('a barra não é exibida', async ({ page }) => {
      await abrirHidratada(page, '/skills');

      await expect(page.locator('app-barra-de-carregamento')).toHaveCSS('display', 'none');
    });
  });
});

test.describe('Revelações no Início em cartão', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  test('os blocos abaixo da dobra entram uma vez e terminam visíveis', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero .nome')).toBeInViewport();

    const sobre = page.locator('section.faixa[aria-label="Sobre"] .coluna');
    await expect(sobre)
      .toHaveCSS('opacity', '0', { timeout: 5000 })
      .catch(() => undefined);
    await sobre.scrollIntoViewIfNeeded();

    await expect(sobre).toHaveCSS('opacity', '1', { timeout: 5000 });
  });

  test('os números das provas terminam nos valores finais', async ({ page }) => {
    await page.goto('/');
    const valores = page.locator('.prova .valor');

    await page.locator('app-provas').scrollIntoViewIfNeeded();

    await expect(valores).toHaveText(['2', '21', '3', '6']);
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce' });

    test('tudo já está visível, sem esperar o scroll', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('section.faixa[aria-label="Contato"] .coluna')).toHaveCSS(
        'opacity',
        '1',
      );
      await expect(page.locator('.prova .valor')).toHaveText(['2', '21', '3', '6']);
    });
  });
});
