import { expect, test } from '@playwright/test';

test.use({
  viewport: { width: 1920, height: 1080 },
  permissions: ['clipboard-read', 'clipboard-write'],
});

const LINHAS_MINIMAS = 15;

test.describe('Editor de código', () => {
  test('reserva a altura de 15 linhas e mostra os números de 1 a 15', async ({ page }) => {
    await page.goto('/projeto-1');
    const editor = page.locator('app-editor-de-codigo');

    const { altura, alturaDaLinha } = await editor.evaluate((el) => {
      const sonda = document.createElement('div');
      sonda.style.height = getComputedStyle(el).getPropertyValue('--altura-linha-codigo');
      el.append(sonda);
      const alturaDaLinha = sonda.getBoundingClientRect().height;
      sonda.remove();
      return { altura: el.getBoundingClientRect().height, alturaDaLinha };
    });

    expect(alturaDaLinha).toBeGreaterThan(0);
    expect(altura).toBeGreaterThanOrEqual(LINHAS_MINIMAS * alturaDaLinha - 1);

    const numeros = editor.locator('.numeros');
    const caixa = await numeros.boundingBox();
    const ultimoVisivel = await numeros
      .locator('span')
      .nth(LINHAS_MINIMAS - 1)
      .boundingBox();
    expect(ultimoVisivel!.y + ultimoVisivel!.height).toBeLessThanOrEqual(
      caixa!.y + caixa!.height + 1,
    );
  });

  test('recorta a numeração pela altura: não mostra os 99 números num conteúdo curto', async ({
    page,
  }) => {
    await page.goto('/projeto-1');

    const ultimo = page.locator('app-editor-de-codigo .numeros span').last();

    await expect(ultimo).not.toBeInViewport();
  });

  test('copiar o código não traz números de linha nem "*"', async ({ page }) => {
    await page.goto('/projeto-1');
    await page.locator('app-editor-de-codigo code').evaluate((codigo) => {
      const intervalo = document.createRange();
      intervalo.selectNodeContents(codigo);
      const selecao = getSelection();
      selecao?.removeAllRanges();
      selecao?.addRange(intervalo);
    });

    await page.keyboard.press('ControlOrMeta+C');
    const copiado = await page.evaluate(() => navigator.clipboard.readText());

    expect(copiado).toContain('em construção');
    expect(copiado).not.toContain('*');
    expect(copiado).not.toMatch(/\d/);
  });

  test('selecionar a página inteira também deixa os números de fora', async ({ page }) => {
    await page.goto('/projeto-1');
    await page.getByRole('main').click();

    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+C');
    const copiado = await page.evaluate(() => navigator.clipboard.readText());

    expect(copiado).toContain('em construção');
    expect(copiado).not.toContain('*');
    expect(copiado).not.toMatch(/(^|\s)1\s+2\s+3(\s|$)/);
  });
});
