import { expect, test } from './fixtures';

import { abrirPastas, arquivoDaArvore, linhasDoCodigo } from './apoio';

test.describe('Página inicial', () => {
  test('exibe o título do portfólio', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Vinicius Machado/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Vinicius Machado, Desenvolvedor Full Stack',
    );
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

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Vinicius Machado, Desenvolvedor Full Stack',
    );
  });
});

const CODIGO_DO_INICIO = [
  'package dev.vinicius.portfolio;',
  'import java.util.List;',
  'import org.springframework.boot.SpringApplication;',
  'import org.springframework.boot.autoconfigure.SpringBootApplication;',
  '@SpringBootApplication',
  'public class PortfolioApplication {',
  expect.stringMatching(/^\/\/ .+/),
  'record Desenvolvedor(String cargo,',
  'List<String> stack) {}',
  'public static void main(String... args) {',
  'var vinicius = new Desenvolvedor(',
  '"Full Stack",',
  'List.of("Java", "Spring Boot", "Angular", "SQL")',
  ');',
  'SpringApplication.run(PortfolioApplication.class, args);',
  '}',
  '}',
  '// Próximo: ver os projetos →',
  '// Fale comigo →',
];

test.describe('Código do Início em Java moderno', () => {
  test('mostra o pacote, a anotação do Spring Boot, o record, o cargo e a stack em List.of', async ({
    page,
  }) => {
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

    expect(palavraChave).toBe('rgb(207, 142, 109)');
    expect(campo).toBe('rgb(199, 125, 186)');
    expect(literal).toBe('rgb(106, 171, 115)');
  });

  test('exibe o cargo e a pilha com as quatro tecnologias na ordem', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main .papel-literal')).toHaveText([
      '"Full Stack"',
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

  test('a página inicial é o arquivo PortfolioApplication.java, com a anotação do Spring Boot', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('tab', { name: /PortfolioApplication\.java/ })).toBeVisible();
    await expect(page.locator('main code')).toContainText('@SpringBootApplication');
    await expect(page.locator('main code')).toContainText('"Full Stack"');
  });
});

test.describe('Título do Início', () => {
  test('tem um único h1 e o nome do Vinicius no título da janela', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Vinicius Machado, Desenvolvedor Full Stack',
    );
    await expect(page).toHaveTitle('Vinicius Machado | Desenvolvedor Full Stack');
  });
});

test.describe('Árvore no Início', () => {
  test('destaca "Sobre Mim" com a seta para baixo, sem aria-current em nenhum item', async ({
    page,
  }) => {
    await page.goto('/');
    const destacado = arquivoDaArvore(page, 'Sobre Mim');
    const outro = arquivoDaArvore(page, 'Diferenciais');
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

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Sobre Mim').click();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toHaveAttribute('aria-current', 'page');
  });

  test.describe('sem JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('entrega o código, o destaque e a árvore sem aria-current no HTML', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('main code')).toContainText('package dev.vinicius.portfolio;');
      await expect(page.locator('main code')).toContainText('"Spring Boot"');
      await expect(page.locator('nav [aria-current]')).toHaveCount(0);
    });
  });
});
