import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { linhasDoCodigo, normalizar, textoDoCodigo } from './apoio';

const PARAGRAFOS = [
  'Tive a oportunidade de trabalhar com o Vinícius e acompanhar de perto seu trabalho no dia a dia. É um profissional muito comprometido, responsável e colaborativo, sempre disposto a ajudar o time e contribuir para que as entregas aconteçam da melhor forma possível.',
  'Além da parte técnica, se destaca pela facilidade de comunicação, organização e pela forma como lida com desafios e aprende novas tecnologias. É uma pessoa em quem o time pode confiar e que agrega muito ao ambiente de trabalho.',
  'Recomendo o Vinícius com muita tranquilidade e tenho certeza de que será uma ótima adição a qualquer equipe.',
];

const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Depoimentos/Recomendações (/depoimentos)', () => {
  test('mostra autora, cargo, relação e data da recomendação de Luana Porto', async ({ page }) => {
    await page.goto('/depoimentos');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        '"Luana Porto",',
        '"Desenvolvedor Backend Java",',
        '"Trabalhou na mesma equipe",',
        'LocalDate.of(2026, 9, 22)',
      ]),
    );
  });

  test('declara o record Recomendacao e lista as recomendações, sem constantes em caixa alta', async ({
    page,
  }) => {
    await page.goto('/depoimentos');
    const texto = await textoDoCodigo(page);

    expect(texto).toContain(
      'record Recomendacao(String autora, String cargo, String relacao, LocalDate data) {}',
    );
    expect(texto).toContain('Recomendacao luana = new Recomendacao(');
    expect(texto).toMatch(/List<Recomendacao> todas = List\.of\(luana\);/);
    expect(texto).not.toMatch(/static final|\b[A-Z]{3,}_?[A-Z]*\b =/);
    await expect(page.locator('main .papel-comentario').first()).toContainText('recomendação');
  });

  test('mostra os três parágrafos completos num único Javadoc', async ({ page }) => {
    await page.goto('/depoimentos');
    const javadoc = page.locator('main .javadoc');
    const paragrafos = javadoc.locator('.javadoc-paragrafo:not(.javadoc-autor)');

    await expect(javadoc).toHaveCount(1);
    await expect(paragrafos).toHaveCount(3);
    for (const [i, texto] of PARAGRAFOS.entries()) {
      expect(normalizar(await paragrafos.nth(i).textContent()), `parágrafo ${i + 1}`).toBe(texto);
    }
  });

  test('o texto copiado do Javadoc traz os três parágrafos na ordem', async ({ page }) => {
    await page.goto('/depoimentos');

    const texto = normalizar(await page.locator('main .javadoc').textContent());

    expect(texto).toBe(`${PARAGRAFOS.join(' ')}@author Luana Porto (abre em nova aba)`);
  });

  test('cada parágrafo começa numa linha nova, separado do anterior', async ({ page }) => {
    await page.goto('/depoimentos');
    const caixas = await page
      .locator('main .javadoc .javadoc-paragrafo:not(.javadoc-autor)')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));

    expect(caixas).toHaveLength(3);
    expect(caixas[1].top).toBeGreaterThan(caixas[0].bottom);
    expect(caixas[2].top).toBeGreaterThan(caixas[1].bottom);
  });

  test('não tem Lorem Ipsum nem texto de exemplo', async ({ page }) => {
    await page.goto('/depoimentos');

    await expect(page.locator('main')).not.toContainText(/lorem|ipsum|dolor sit amet/i);
    await expect(page.locator('main')).not.toContainText('em construção');
  });

  test('tem título, h1, árvore com a seção atual e uma só página', async ({ page }) => {
    await page.goto('/depoimentos');

    await expect(page).toHaveTitle('Depoimentos/Recomendações | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Depoimentos/Recomendações');
    await expect(
      arvore(page).getByRole('treeitem', { name: 'Depoimentos/Recomendações' }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('navigation', { name: 'Páginas da seção' })).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Depoimentos.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('colore a data com a cor de valor e os dados como textos entre aspas', async ({ page }) => {
    await page.goto('/depoimentos');

    await expect(page.locator('main .linha .papel-valor')).toHaveText(['2026', '9', '22']);
    await expect(page.locator('main .papel-literal')).toHaveText([
      '"Luana Porto"',
      '"Desenvolvedor Backend Java"',
      '"Trabalhou na mesma equipe"',
    ]);
  });
});

test.describe('Depoimentos no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('o texto cabe na largura, sem rolagem horizontal', async ({ page }) => {
    await page.goto('/depoimentos');

    const transborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(transborda).toBe(false);
    await expect(page.locator('main .javadoc .javadoc-paragrafo:not(.javadoc-autor)')).toHaveCount(
      3,
    );
  });
});

test.describe('Depoimentos sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('entrega a recomendação completa no HTML', async ({ page }) => {
    await page.goto('/depoimentos');

    await expect(page).toHaveTitle('Depoimentos/Recomendações | Vinicius Machado');
    await expect(codigo(page)).toContainText('Luana Porto');
    await expect(codigo(page)).toContainText('Desenvolvedor Backend Java');
    await expect(codigo(page)).toContainText('Trabalhou na mesma equipe');
    await expect(codigo(page)).toContainText('LocalDate.of(2026, 9, 22)');
    for (const paragrafo of PARAGRAFOS) await expect(codigo(page)).toContainText(paragrafo);
    await expect(page.locator('main')).not.toContainText('em construção');
  });
});
