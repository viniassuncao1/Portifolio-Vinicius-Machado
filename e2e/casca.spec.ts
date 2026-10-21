import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore } from './apoio';

import { SECOES as SECOES_DO_SITE } from '../src/app/core/secoes';

/** A árvore de seções (a seção com várias páginas tem outra `nav`, com `aria-current` próprio). */
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });

const SECOES = [
  { slug: 'sobre-mim', titulo: 'Sobre Mim' },
  { slug: 'diferenciais', titulo: 'Diferenciais' },
  { slug: 'como-uso-ia', titulo: 'Como uso a IA' },
  { slug: 'skills', titulo: 'Skills / STACK' },
  { slug: 'experiencias', titulo: 'Experiências' },
  { slug: 'projetos', titulo: 'Vitrine de projetos' },
  { slug: 'projeto-1', titulo: 'Projeto 1' },
  { slug: 'projeto-2', titulo: 'Projeto 2' },
  { slug: 'projeto-3', titulo: 'Projeto 3' },
  { slug: 'projeto-4', titulo: 'Projeto 4' },
  { slug: 'projeto-5', titulo: 'Projeto 5' },
  { slug: 'projeto-6', titulo: 'Projeto 6' },
  { slug: 'certificacoes', titulo: 'Certificações' },
  { slug: 'eventos', titulo: 'Eventos' },
  { slug: 'formacao', titulo: 'Formação' },
  { slug: 'idiomas', titulo: 'Idiomas' },
  { slug: 'depoimentos', titulo: 'Depoimentos/Recomendações' },
  { slug: 'contato', titulo: 'Contato' },
];

test.describe('Estrutura da IDE', () => {
  test('lista as 18 seções na árvore, na ordem do design', async ({ page }) => {
    await page.goto('/');

    await abrirPastas(page);

    await expect(arvore(page).locator('a[role=treeitem]')).toHaveText(
      SECOES_DO_SITE.map((secao) => secao.arquivo),
    );
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
    await expect(page.getByRole('contentinfo')).toContainText('Projeto2.java');
  });

  test('destaca "Sobre Mim" no Início, sem marcar página atual', async ({ page }) => {
    await page.goto('/');

    await expect(arvore(page).locator('[data-tipo=pasta][data-pacote=sobre]')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toHaveClass(/destacado/);
    await expect(arquivoDaArvore(page, 'Diferenciais')).not.toHaveClass(/destacado/);
    await expect(arvore(page).locator('[aria-current]')).toHaveCount(0);
  });

  test('deixa os controles decorativos fora da árvore de acessibilidade e Buscar e Projeto como botões', async ({
    page,
  }) => {
    await page.goto('/');

    for (const seletor of [
      'app-barra-de-ferramentas .decorativo',
      'app-faixa-de-ferramentas span.botao',
    ]) {
      for (const item of await page.locator(seletor).all()) {
        await expect(item).toHaveAttribute('aria-hidden', 'true');
      }
    }
    await expect(page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Projeto' })).toBeVisible();
  });
});

test.describe('Navegação pela árvore', () => {
  test('abre a seção clicada, muda o endereço e destaca o item', async ({ page }) => {
    await page.goto('/');

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Experiências').click();

    await expect(page).toHaveURL(/\/experiencias$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiências');
    await expect(page).toHaveTitle('Experiências | Vinicius Machado');
    await expect(arquivoDaArvore(page, 'Experiências')).toHaveAttribute('aria-current', 'page');
    await expect(arvore(page).locator('[aria-current="page"]')).toHaveCount(1);
  });

  test('troca o item atual ao navegar de uma seção para outra', async ({ page }) => {
    await page.goto('/sobre-mim');

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Formação').click();

    await expect(arquivoDaArvore(page, 'Formação')).toHaveAttribute('aria-current', 'page');
    await expect(arquivoDaArvore(page, 'Sobre Mim')).not.toHaveAttribute('aria-current', 'page');
  });

  test('a pasta da seção atual vem expandida, com a seta para baixo, e as outras recolhidas', async ({
    page,
  }) => {
    await page.goto('/contato');

    const contato = arvore(page).locator('[data-tipo=pasta][data-pacote=contato]');
    const formacao = arvore(page).locator('[data-tipo=pasta][data-pacote=formacao]');

    await expect(contato).toHaveAttribute('aria-expanded', 'true');
    await expect(contato.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(formacao).toHaveAttribute('aria-expanded', 'false');
    await expect(formacao.locator('.seta')).not.toHaveCSS('rotate', '90deg');
  });

  test('abre direto pelo endereço já com a seção atual', async ({ page }) => {
    await page.goto('/contato');

    await expect(arquivoDaArvore(page, 'Contato')).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contato');
    await expect(page).toHaveTitle('Contato | Vinicius Machado');
  });

  test('volta ao Início pelo botão voltar do navegador', async ({ page }) => {
    await page.goto('/');
    await abrirPastas(page);
    await arquivoDaArvore(page, 'Idiomas').click();
    await expect(page).toHaveURL(/\/idiomas$/);

    await page.goBack();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Vinicius Machado, Desenvolvedor Full Stack',
    );
  });
});

const ITENS_ATE_FORMACAO = 7;
const POSICAO_DE_EVENTOS_NA_PASTA = 2;
const pasta = (page: Page, nome: string) =>
  arvore(page).locator(`[data-tipo=pasta][data-pacote=${nome}]`);

test.describe('Teclado', () => {
  test('chega a "Eventos" com Tab e setas, mostra o foco e abre com Enter', async ({ page }) => {
    await abrirHidratada(page, '/');
    const eventos = arquivoDaArvore(page, 'Eventos');

    // Antes da árvore ficam só os botões Executar, Buscar, tema, master, Projeto e Commit; a árvore tem um só item na ordem de Tab
    // (roving tabindex) e as setas percorrem o resto.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Executar PortfolioApplication' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /^Usar tema/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /^Branch master/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Projeto' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Commit' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(pasta(page, 'sobre')).toBeFocused();
    // Itens visíveis no Início: sobre e seus 3 arquivos, skills, experiencias, projetos, formacao.
    for (let i = 0; i < ITENS_ATE_FORMACAO; i++) await page.keyboard.press('ArrowDown');
    await expect(pasta(page, 'formacao')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(pasta(page, 'formacao')).toHaveAttribute('aria-expanded', 'true');
    for (let i = 0; i < POSICAO_DE_EVENTOS_NA_PASTA; i++) await page.keyboard.press('ArrowDown');

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
              '.decorativo, .executar:not(button), app-faixa-de-ferramentas span, app-aba-do-editor, app-painel-lateral .cabecalho',
            )?.tagName ?? null,
        ),
      );
    }

    expect(focados.every((alvo) => alvo === null)).toBe(true);
  });
});

test.describe('Seção de projeto', () => {
  test('mostra o código do projeto no editor, sem o aviso de em construção', async ({ page }) => {
    await page.goto('/projeto-3');

    await expect(page.getByRole('main').locator('code')).toContainText('LauncherDeTv');
    await expect(page.getByRole('main')).not.toContainText('em construção');
  });
});

test.describe('Pré-renderização das 18 rotas', () => {
  test.use({ javaScriptEnabled: false });

  for (const { slug, titulo } of SECOES) {
    test(`/${slug} entrega a casca e o editor no HTML`, async ({ page }) => {
      await page.goto(`/${slug}`);

      await expect(page).toHaveTitle(`${titulo} | Vinicius Machado`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
      await expect(arvore(page).locator('[data-tipo=pasta]')).toHaveCount(7);
      await expect(arvore(page).locator('a[href]')).toHaveCount(SECOES.length);
      await expect(arquivoDaArvore(page, titulo)).toHaveAttribute('aria-current', 'page');
      // A vitrine não é um arquivo de código: o HTML traz os cartões dos projetos.
      await (slug === 'projetos'
        ? expect(page.getByRole('main').locator('a.cartao')).toHaveCount(6)
        : expect(page.getByRole('main').locator('code')).toBeAttached());
    });
  }
});
