import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirHidratada } from './apoio';

/** A árvore de seções (a seção com várias páginas tem outra `nav`, com `aria-current` próprio). */
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });

const SECOES = [
  { slug: 'sobre-mim', titulo: 'Sobre Mim' },
  { slug: 'diferenciais', titulo: 'Diferenciais' },
  { slug: 'como-uso-ia', titulo: 'Como uso a IA' },
  { slug: 'skills', titulo: 'Skills / STACK' },
  { slug: 'experiencias', titulo: 'Experiências' },
  { slug: 'projeto-1', titulo: 'Projeto 1' },
  { slug: 'projeto-2', titulo: 'Projeto 2' },
  { slug: 'projeto-3', titulo: 'Projeto 3' },
  { slug: 'projeto-4', titulo: 'Projeto 4' },
  { slug: 'certificacoes', titulo: 'Certificações' },
  { slug: 'eventos', titulo: 'Eventos' },
  { slug: 'formacao', titulo: 'Formação' },
  { slug: 'idiomas', titulo: 'Idiomas' },
  { slug: 'depoimentos', titulo: 'Depoimentos/Recomendações' },
  { slug: 'contato', titulo: 'Contato' },
];

test.describe('Estrutura da IDE', () => {
  test('lista as 15 seções na árvore, na ordem do design', async ({ page }) => {
    await page.goto('/');

    const arvore = page.getByRole('navigation', { name: 'Seções do portfólio' });
    await expect(arvore.getByRole('link')).toHaveText(SECOES.map((secao) => secao.titulo));
  });

  test('mostra a barra, o painel, a faixa de abas, o editor e a barra de status em qualquer seção', async ({
    page,
  }) => {
    await page.goto('/projeto-2');

    await expect(page.locator('app-barra-de-ferramentas')).toBeVisible();
    await expect(page.locator('app-painel-lateral')).toBeVisible();
    await expect(page.getByRole('tablist', { name: 'Arquivos abertos' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Projeto2.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Projeto2.java');
  });

  test('destaca "Sobre Mim" no Início, sem marcar página atual', async ({ page }) => {
    await page.goto('/');

    const sobreMim = page.getByRole('link', { name: 'Sobre Mim' });
    await expect(sobreMim.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.getByRole('link', { name: 'Diferenciais' }).locator('.seta')).not.toHaveCSS(
      'rotate',
      '90deg',
    );
    await expect(arvore(page).locator('[aria-current]')).toHaveCount(0);
  });

  test('mantém a barra de ferramentas fora da árvore de acessibilidade', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('app-barra-de-ferramentas')).toHaveAttribute('aria-hidden', 'true');
    await expect(
      page.locator('app-barra-de-ferramentas').locator('button, a, [tabindex]'),
    ).toHaveCount(0);
  });
});

test.describe('Navegação pela árvore', () => {
  test('abre a seção clicada, muda o endereço e destaca o item', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Experiências' }).click();

    await expect(page).toHaveURL(/\/experiencias$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiências');
    await expect(page).toHaveTitle('Experiências | Vinicius Machado');
    await expect(page.getByRole('link', { name: 'Experiências' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(arvore(page).locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('troca o item atual ao navegar de uma seção para outra', async ({ page }) => {
    await page.goto('/sobre-mim');

    await page.getByRole('link', { name: 'Formação' }).click();

    await expect(page.getByRole('link', { name: 'Formação' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('gira a seta do item atual para baixo', async ({ page }) => {
    await page.goto('/contato');

    const seta = page.getByRole('link', { name: 'Contato' }).locator('.seta');
    const outra = page.getByRole('link', { name: 'Idiomas' }).locator('.seta');

    await expect(seta).toHaveCSS('rotate', '90deg');
    await expect(outra).not.toHaveCSS('rotate', '90deg');
  });

  test('abre direto pelo endereço já com a seção atual', async ({ page }) => {
    await page.goto('/contato');

    await expect(page.getByRole('link', { name: 'Contato' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contato');
    await expect(page).toHaveTitle('Contato | Vinicius Machado');
  });

  test('volta ao Início pelo botão voltar do navegador', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Idiomas' }).click();
    await expect(page).toHaveURL(/\/idiomas$/);

    await page.goBack();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
  });
});

test.describe('Teclado', () => {
  test('chega a "Eventos" com Tab e setas, mostra o foco e abre com Enter', async ({ page }) => {
    await abrirHidratada(page, '/');
    const eventos = page.getByRole('link', { name: 'Eventos' });
    const posicao = SECOES.findIndex((secao) => secao.slug === 'eventos');

    // A árvore tem um só item na ordem de Tab (roving tabindex); as setas percorrem o resto.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toBeFocused();
    for (let i = 0; i < posicao; i++) await page.keyboard.press('ArrowDown');

    await expect(eventos).toBeFocused();
    await expect(eventos).toHaveCSS('outline-style', 'solid');
    await expect(eventos).not.toHaveCSS('outline-width', '0px');

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/eventos$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Eventos');
  });

  test('não deixa os controles decorativos entrarem na ordem de Tab', async ({ page }) => {
    await page.goto('/');

    const focados: (string | null)[] = [];
    for (let i = 0; i < SECOES.length + 2; i++) {
      await page.keyboard.press('Tab');
      focados.push(
        await page.evaluate(
          () =>
            document.activeElement?.closest(
              'app-barra-de-ferramentas, app-aba-do-editor, .cabecalho',
            )?.tagName ?? null,
        ),
      );
    }

    expect(focados.every((alvo) => alvo === null)).toBe(true);
  });
});

test.describe('Seção em construção', () => {
  test('mostra o aviso como comentário de código no editor', async ({ page }) => {
    await page.goto('/projeto-3');

    await expect(page.getByRole('main')).toContainText('Esta seção está em construção');
    await expect(page.getByRole('main').locator('code')).toBeVisible();
  });
});

test.describe('Pré-renderização das 15 rotas', () => {
  test.use({ javaScriptEnabled: false });

  for (const { slug, titulo } of SECOES) {
    test(`/${slug} entrega a casca e o editor no HTML`, async ({ page }) => {
      await page.goto(`/${slug}`);

      await expect(page).toHaveTitle(`${titulo} | Vinicius Machado`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
      await expect(
        page.getByRole('navigation', { name: 'Seções do portfólio' }).getByRole('link'),
      ).toHaveCount(15);
      await expect(page.getByRole('link', { name: titulo })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(page.getByRole('main').locator('code')).toBeAttached();
    });
  }
});
