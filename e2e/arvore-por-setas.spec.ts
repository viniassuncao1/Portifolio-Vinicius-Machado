import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore, arvoreDeSecoes } from './apoio';

import { SECOES } from '../src/app/core/secoes';

const pasta = (page: Page, nome: string) =>
  arvoreDeSecoes(page).locator(`[data-tipo=pasta][data-pacote=${nome}]`);

// Movimento reduzido: o código aparece pronto, sem a digitação interferir.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('Árvore em pastas navegável por teclado', () => {
  test('só um item entra na ordem de Tab: o arquivo da seção aberta', async ({ page }) => {
    await abrirHidratada(page, '/diferenciais');

    const focaveis = await arvoreDeSecoes(page)
      .getByRole('treeitem')
      .evaluateAll((itens) =>
        itens.filter((i) => i.getAttribute('tabindex') === '0').map((i) => i.textContent?.trim()),
      );

    expect(focaveis).toEqual(['Diferenciais.java']);
  });

  test('a pasta da seção aberta vem expandida e as outras recolhidas', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');

    await expect(pasta(page, 'projetos')).toHaveAttribute('aria-expanded', 'true');
    await expect(pasta(page, 'sobre')).toHaveAttribute('aria-expanded', 'false');
    await expect(arquivoDaArvore(page, 'Projeto 2')).toHaveAttribute('aria-current', 'page');
  });

  test('abrindo a rota direto, os arquivos da pasta aberta ficam visíveis, sem depender de animação', async ({
    page,
  }) => {
    await abrirHidratada(page, '/projeto-2');

    const grupo = arvoreDeSecoes(page).locator('#grupo-projetos');
    await expect(grupo).toBeVisible();
    await expect(grupo).toHaveCSS('opacity', '1');
    await expect(grupo.locator('a')).toHaveCount(4);
    for (const arquivo of await grupo.locator('a').all()) {
      await expect(arquivo).toBeVisible();
      await expect(arquivo).toHaveCSS('opacity', '1');
    }
  });

  test('o HTML pré-renderizado tem os 15 links, com as pastas recolhidas escondidas', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const semJs = await contexto.newPage();

    await semJs.goto('/projeto-2');

    const arvore = arvoreDeSecoes(semJs);
    await expect(arvore.locator('a[href]')).toHaveCount(SECOES.length);
    await expect(arvore.locator('.grupo[hidden]')).toHaveCount(6);
    await expect(arvore.locator('#grupo-projetos')).toBeVisible();
    await expect(arvore.locator('#grupo-sobre')).toBeHidden();
    await contexto.close();
  });

  test('clicar na pasta projetos mostra Projeto1.java a Projeto4.java', async ({ page }) => {
    await abrirHidratada(page, '/');

    await pasta(page, 'projetos').click();

    await expect(pasta(page, 'projetos')).toHaveAttribute('aria-expanded', 'true');
    await expect(arvoreDeSecoes(page).locator('#grupo-projetos a')).toHaveText([
      'Projeto1.java',
      'Projeto2.java',
      'Projeto3.java',
      'Projeto4.java',
    ]);
  });

  test('seta para baixo vai de "Diferenciais" a "Como uso a IA"', async ({ page }) => {
    await abrirHidratada(page, '/diferenciais');
    await arquivoDaArvore(page, 'Diferenciais').focus();

    await page.keyboard.press('ArrowDown');

    await expect(arquivoDaArvore(page, 'Como uso a IA')).toBeFocused();
    await expect(arquivoDaArvore(page, 'Como uso a IA')).toHaveAttribute('tabindex', '0');
    await expect(arquivoDaArvore(page, 'Diferenciais')).toHaveAttribute('tabindex', '-1');
  });

  test('seta para cima sobe um item, até a pasta', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await arquivoDaArvore(page, 'Sobre Mim').focus();

    await page.keyboard.press('ArrowUp');

    await expect(pasta(page, 'sobre')).toBeFocused();
  });

  test('seta para a direita expande a pasta; para a esquerda, recolhe e volta à pasta', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');
    await pasta(page, 'projetos').focus();

    await page.keyboard.press('ArrowRight');
    await expect(pasta(page, 'projetos')).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(arquivoDaArvore(page, 'Projeto 1')).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(pasta(page, 'projetos')).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(pasta(page, 'projetos')).toHaveAttribute('aria-expanded', 'false');
  });

  test('Enter e Espaço alternam a pasta', async ({ page }) => {
    await abrirHidratada(page, '/');
    await pasta(page, 'contato').focus();

    await page.keyboard.press('Enter');
    await expect(pasta(page, 'contato')).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(pasta(page, 'contato')).toHaveAttribute('aria-expanded', 'false');
  });

  test('as setas param nas pontas e Home e End vão ao primeiro e ao último item', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);
    await pasta(page, 'sobre').focus();
    await page.keyboard.press('ArrowUp');
    await expect(pasta(page, 'sobre')).toBeFocused();

    await page.keyboard.press('End');
    await page.keyboard.press('ArrowDown');
    await expect(arquivoDaArvore(page, SECOES.at(-1)!.titulo)).toBeFocused();

    await page.keyboard.press('Home');
    await expect(pasta(page, 'sobre')).toBeFocused();
  });

  test('Enter num arquivo abre a seção', async ({ page }) => {
    await abrirHidratada(page, '/');
    await arquivoDaArvore(page, 'Como uso a IA').focus();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/como-uso-ia$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como uso a IA');
  });

  test('o foco visível acompanha as setas', async ({ page }) => {
    await abrirHidratada(page, '/');
    await arquivoDaArvore(page, 'Sobre Mim').focus();

    await page.keyboard.press('ArrowDown');

    const focado = arquivoDaArvore(page, 'Diferenciais');
    await expect(focado).toHaveCSS('outline-style', 'solid');
    await expect(focado).not.toHaveCSS('outline-width', '0px');
  });

  test('percorre as 7 pastas e as 15 seções de cima a baixo', async ({ page }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);
    await pasta(page, 'sobre').focus();
    const visitados: (string | undefined)[] = [];

    await Array.from({ length: SECOES.length + 7 }).reduce<Promise<void>>(async (anterior) => {
      await anterior;
      visitados.push(await page.evaluate(() => document.activeElement?.textContent?.trim()));
      await page.keyboard.press('ArrowDown');
    }, Promise.resolve());

    expect(visitados.filter((nome) => nome?.endsWith('.java'))).toEqual(
      SECOES.map((secao) => secao.arquivo),
    );
    expect(visitados.filter((nome) => !nome?.endsWith('.java'))).toHaveLength(7);
  });
});
