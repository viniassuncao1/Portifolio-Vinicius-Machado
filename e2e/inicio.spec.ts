import { expect, test } from '@playwright/test';

import { linhasDoCodigo } from './apoio';

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

const CODIGO_DO_INICIO = [
  'package portfolio.viniciusmachado;',
  'import java.util.List;',
  expect.stringContaining('Desenvolvedor Full Stack Júnior: Java, Spring Boot, Angular e SQL.'),
  'public record ViniciusMachado(',
  'String role,',
  'List<String> stack',
  ') implements FullStackDeveloper {',
  expect.stringMatching(/^\/\/ .+/),
  expect.stringMatching(/^public static final ViniciusMachado [A-Z_]+ = new ViniciusMachado\($/),
  '"Full Stack Júnior",',
  'List.of("Java", "Spring Boot", "Angular", "SQL")',
  ');',
  '}',
];

test.describe('Código do Início em Java moderno', () => {
  test('mostra o pacote, o record, o cargo e a stack em List.of', async ({ page }) => {
    await page.goto('/');

    expect(await linhasDoCodigo(page)).toEqual(CODIGO_DO_INICIO);
  });

  test('colore palavras-chave, componentes e textos com tokens distintos', async ({ page }) => {
    await page.goto('/');
    const cor = (seletor: string) =>
      page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).color);

    const [palavraChave, campo, literal] = await Promise.all([
      cor('main .papel-palavra-chave'),
      cor('main .papel-declaracao'),
      cor('main .papel-literal'),
    ]);

    expect(palavraChave).toBe('rgb(222, 96, 210)');
    expect(campo).toBe('rgb(213, 150, 62)');
    expect(literal).toBe('rgb(143, 194, 88)');
  });

  test('exibe o cargo e a pilha com as quatro tecnologias na ordem', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main .papel-literal')).toHaveText([
      '"Full Stack Júnior"',
      '"Java"',
      '"Spring Boot"',
      '"Angular"',
      '"SQL"',
    ]);
  });

  test('não usa arrays String[]: a stack é uma lista imutável', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main code')).not.toContainText('String[]');
    await expect(page.locator('main code')).toContainText('List.of(');
  });
});

test.describe('Título do Início', () => {
  test('tem um único h1 e o nome do Vinicius no título da janela', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
    await expect(page).toHaveTitle('Vinicius Machado | Desenvolvedor Full Stack');
  });
});

test.describe('Árvore no Início', () => {
  test('destaca "Sobre Mim" com a seta para baixo, sem aria-current em nenhum item', async ({
    page,
  }) => {
    await page.goto('/');
    const destacado = page.getByRole('link', { name: 'Sobre Mim' });
    const outro = page.getByRole('link', { name: 'Diferenciais' });

    await expect(destacado.locator('.seta')).toHaveCSS('rotate', '90deg');
    // A faixa de destaque é o ::before do item, mostrado com opacity.
    const faixa = (link: typeof destacado) =>
      link.evaluate((el) => {
        const estilo = getComputedStyle(el, '::before');
        return { opacidade: estilo.opacity, fundo: estilo.backgroundColor };
      });
    expect((await faixa(destacado)).opacidade).toBe('1');
    expect((await faixa(destacado)).fundo).not.toBe('rgba(0, 0, 0, 0)');
    expect((await faixa(outro)).opacidade).toBe('0');
    await expect(page.locator('nav [aria-current]')).toHaveCount(0);
  });

  test('passa a anunciar "Sobre Mim" como página atual ao abrir a seção', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Sobre Mim' }).click();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test.describe('sem JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('entrega o código, o destaque e a árvore sem aria-current no HTML', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('main code')).toContainText('portfolio.viniciusmachado;');
      await expect(page.locator('main code')).toContainText('"Spring Boot"');
      await expect(page.getByRole('link', { name: 'Sobre Mim' }).locator('.seta')).toHaveCSS(
        'rotate',
        '90deg',
      );
      await expect(page.locator('nav [aria-current]')).toHaveCount(0);
    });
  });
});
