import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const normalizar = (texto: string | null) => (texto ?? '').replace(/\s+/g, ' ').trim();

const linhasDoCodigo = async (codigo: Locator) =>
  (await codigo.locator('> span').evaluateAll((els) => els.map((el) => el.textContent ?? '')))
    .map(normalizar)
    .filter((linha) => linha !== '');

const cor = (alvo: Locator) => alvo.evaluate((el) => getComputedStyle(el).color);

/** Razão de contraste WCAG entre duas cores "rgb(r, g, b)". */
function contraste(a: string, b: string): number {
  const luminancia = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/\d+/g) ?? []).slice(0, 3).map((c) => {
      const v = Number(c) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

test.describe('Sobre Mim (/sobre-mim)', () => {
  test('exibe a interface, a anotação e o método da tela 02', async ({ page }) => {
    await page.goto('/sobre-mim');

    const linhas = await linhasDoCodigo(page.locator('main code'));

    expect(linhas).toEqual([
      'public interface ViniciusMachado {',
      'void sobreMim();',
      '}',
      '@Override',
      'public void sobreMim() {',
      expect.stringContaining('Sou desenvolvedor Full Stack'),
      '}',
    ]);
  });

  test('começa e termina o parágrafo com os textos da spec', async ({ page }) => {
    await page.goto('/sobre-mim');

    const paragrafo = normalizar(await page.locator('main .paragrafo').textContent());

    expect(
      paragrafo.startsWith('Sou desenvolvedor Full Stack com cerca de 2 anos de experiência'),
    ).toBe(true);
    expect(paragrafo.endsWith('Sistemas Distribuídos e Arquitetura de Software.')).toBe(true);
    expect(paragrafo).toContain('UniCEUB');
  });

  test('colore palavra-chave e anotação com tokens distintos', async ({ page }) => {
    await page.goto('/sobre-mim');

    expect(await cor(page.locator('main .papel-palavra-chave').first())).toBe('rgb(222, 96, 210)');
    expect(await cor(page.locator('main .papel-anotacao'))).toBe('rgb(116, 137, 248)');
  });

  test('quebra o parágrafo em várias linhas dentro da largura de 72 colunas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/sobre-mim');
    const paragrafo = page.locator('main .paragrafo');

    const { largura, linhas } = await paragrafo.evaluate((el) => {
      const caixa = el.getBoundingClientRect();
      const alturaDaLinha = parseFloat(getComputedStyle(el).lineHeight);
      return { largura: caixa.width, linhas: Math.round(caixa.height / alturaDaLinha) };
    });
    const editor = await page.locator('main app-editor-de-codigo').boundingBox();

    expect(linhas).toBeGreaterThan(5);
    expect(largura).toBeLessThan(editor!.width);
  });

  test('marca "Sobre Mim" como página atual, com a seta para baixo', async ({ page }) => {
    await page.goto('/sobre-mim');

    const item = page.getByRole('link', { name: 'Sobre Mim' });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
  });

  test('não mostra números nem "*" no texto copiável do código', async ({ page }) => {
    await page.goto('/sobre-mim');

    const texto = (await page.locator('main code').textContent()) ?? '';

    expect(texto).not.toContain('*');
    // "2 anos" é texto do parágrafo; o que não pode aparecer é a coluna 1, 2, 3...
    expect(texto).not.toMatch(/1\s*2\s*3/);
  });
});

test.describe('Diferenciais (/diferenciais)', () => {
  test('exibe a classe PersonalData, os campos, a anotação e o método da tela 03', async ({
    page,
  }) => {
    await page.goto('/diferenciais');

    const linhas = await linhasDoCodigo(page.locator('main code'));

    expect(linhas).toEqual([
      'public class PersonalData {',
      'String origem = “Mineiro”;',
      'String cidade = “Brasília”;',
      'boolean extrovertido = true;',
      'boolean curioso = true;',
      'boolean gostaDeAprender = true;',
      '@Override',
      'public void diferenciais() {',
      expect.stringContaining('Moro em Brasília há 20 anos.'),
      '}',
    ]);
  });

  test('começa e termina o parágrafo com os textos da spec', async ({ page }) => {
    await page.goto('/diferenciais');

    const paragrafo = normalizar(await page.locator('main .paragrafo').textContent());

    expect(paragrafo.startsWith('Moro em Brasília há 20 anos.')).toBe(true);
    expect(paragrafo.endsWith('encarar o que aparecer pela frente.')).toBe(true);
  });

  test('colore "boolean curioso" como declaração e "true" como valor', async ({ page }) => {
    await page.goto('/diferenciais');
    const linha = page.locator('main code > span', { hasText: 'boolean curioso' });

    const declaracao = await cor(linha.locator('.papel-declaracao'));
    const valor = await cor(linha.locator('.papel-valor'));
    const texto = await cor(page.locator('main .papel-literal').first());

    expect(declaracao).toBe('rgb(213, 150, 62)');
    expect(valor).toBe('rgb(79, 175, 172)');
    expect(valor).not.toBe(texto);
    await expect(linha.locator('.papel-valor')).toHaveText('true');
  });

  test('colore os três booleanos com a cor de valor', async ({ page }) => {
    await page.goto('/diferenciais');

    await expect(page.locator('main .papel-valor')).toHaveText(['true', 'true', 'true']);
  });

  test('a cor de valor tem contraste de pelo menos 4,5:1 com o fundo do editor', async ({
    page,
  }) => {
    await page.goto('/diferenciais');

    const valor = await cor(page.locator('main .papel-valor').first());
    const fundo = await page
      .locator('main app-editor-de-codigo')
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(contraste(valor, fundo)).toBeGreaterThanOrEqual(4.5);
  });

  test('marca "Diferenciais" como página atual e "Sobre Mim" não', async ({ page }) => {
    await page.goto('/diferenciais');

    const item = page.getByRole('link', { name: 'Diferenciais' });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page).toHaveTitle('Diferenciais | Vinicius Machado');
  });

  test('os campos compactos ficam mais juntos que as linhas comuns', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/diferenciais');
    const altura = (texto: string) =>
      page
        .locator('main code > span', { hasText: texto })
        .first()
        .evaluate((el) => el.getBoundingClientRect().height);

    expect(await altura('boolean curioso')).toBeLessThan(await altura('public void diferenciais'));
  });
});

test.describe('Seções sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/sobre-mim entrega o código, o parágrafo e o item atual no HTML', async ({ page }) => {
    await page.goto('/sobre-mim');

    await expect(page.locator('main code')).toContainText('public interface');
    await expect(page.locator('main .paragrafo')).toContainText('Sou desenvolvedor Full Stack');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
  });

  test('/diferenciais entrega o código, o valor e o parágrafo no HTML', async ({ page }) => {
    await page.goto('/diferenciais');

    await expect(page.locator('main code')).toContainText('public class');
    await expect(page.locator('main .papel-valor')).toHaveCount(3);
    await expect(page.locator('main .paragrafo')).toContainText('Moro em Brasília há 20 anos.');
    await expect(page.getByRole('link', { name: 'Diferenciais' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('não deixa as seções com o aviso de em construção', async ({ page }) => {
    for (const rota of ['/sobre-mim', '/diferenciais']) {
      await page.goto(rota);

      await expect(page.locator('main')).not.toContainText('em construção');
    }
  });
});
