import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirComFocoNaCasca, abrirHidratada } from './apoio';

const dialogo = (page: Page) => page.getByRole('dialog', { name: 'Buscar seção' });
const campo = (page: Page) => page.getByRole('combobox', { name: 'Buscar arquivo ou seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });

// Movimento reduzido: o código aparece pronto, sem a digitação interferir.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('Busca de seções', () => {
  for (const atalho of ['Control+p', 'Meta+p']) {
    test(`${atalho} abre a busca com o foco no campo`, async ({ page }) => {
      await abrirComFocoNaCasca(page, '/');

      await page.keyboard.press(atalho);

      await expect(dialogo(page)).toBeVisible();
      await expect(campo(page)).toBeFocused();
    });
  }

  for (const atalho of ['Control+p', 'Meta+p']) {
    test(`${atalho} abre a busca logo após carregar, com o foco no corpo da página`, async ({
      page,
    }) => {
      await abrirHidratada(page, '/');
      expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');

      await page.keyboard.press(atalho);

      await expect(dialogo(page)).toBeVisible();
      await expect(campo(page)).toBeFocused();
    });
  }

  test('o atalho cancela a ação padrão do navegador (a impressão)', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.evaluate(() => {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'p')
          document.documentElement.dataset['cancelado'] = String(e.defaultPrevented);
      });
    });

    await page.keyboard.press('Control+p');

    await expect(page.locator('html')).toHaveAttribute('data-cancelado', 'true');
  });

  test('"exp" e Enter abrem Experiências e fecham a busca', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await campo(page).fill('exp');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/experiencias$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiências');
    await expect(dialogo(page)).toBeHidden();
  });

  test('a busca ignora acentos: "formacao" acha Formação', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await campo(page).fill('formacao');

    const opcoes = page.getByRole('option');
    await expect(opcoes).toHaveCount(1);
    await expect(opcoes.first()).toContainText('Formação');
    await expect(opcoes.first()).toContainText('Formacao.java');
  });

  test('ignora maiúsculas e busca pelo nome do arquivo', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await campo(page).fill('SOBREMIM.JAVA');

    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.getByRole('option').first()).toContainText('Sobre Mim');
  });

  test('sem filtro lista todos os arquivos (Início e 15 seções)', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await expect(page.getByRole('option')).toHaveCount(16);
    await expect(dialogo(page).getByRole('status')).toHaveText('16 resultados');
  });

  test('usa o singular com um resultado e avisa quando nada casa', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await campo(page).fill('formacao');
    await expect(dialogo(page).getByRole('status')).toHaveText('1 resultado');

    await campo(page).fill('zzzz');
    await expect(dialogo(page).getByRole('status')).toHaveText('Nenhum resultado');
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(campo(page)).not.toHaveAttribute('aria-activedescendant', /.+/);
  });

  test('as setas mudam o aria-activedescendant e a opção selecionada', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');
    await expect(campo(page)).toHaveAttribute('aria-activedescendant', 'opcao-busca-0');

    await page.keyboard.press('ArrowDown');
    await expect(campo(page)).toHaveAttribute('aria-activedescendant', 'opcao-busca-1');
    await expect(page.locator('#opcao-busca-1')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#opcao-busca-0')).toHaveAttribute('aria-selected', 'false');

    await page.keyboard.press('ArrowUp');
    await expect(campo(page)).toHaveAttribute('aria-activedescendant', 'opcao-busca-0');
  });

  test('escolhe pela seta e Enter: segunda opção abre Sobre Mim', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/sobre-mim$/);
  });

  test('clicar numa opção abre a seção', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await page.getByRole('option', { name: /Contato/ }).click();

    await expect(page).toHaveURL(/\/contato$/);
    await expect(dialogo(page)).toBeHidden();
  });

  test('segue o padrão combobox: lista, ligação do campo e papel das opções', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');

    await expect(campo(page)).toHaveAttribute('aria-controls', 'resultados-busca');
    await expect(campo(page)).toHaveAttribute('aria-autocomplete', 'list');
    await expect(page.getByRole('listbox', { name: 'Resultados' })).toBeVisible();
  });

  test('Escape fecha e devolve o foco a quem o tinha', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    const item = arvore(page).getByRole('link', { name: 'Diferenciais' });
    await item.focus();
    await page.keyboard.press('Control+p');
    await expect(campo(page)).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(dialogo(page)).toBeHidden();
    await expect(item).toBeFocused();
  });

  test('o botão da faixa de abas também abre a busca', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');

    await page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' }).click();

    await expect(dialogo(page)).toBeVisible();
    await expect(campo(page)).toBeFocused();
  });

  test('a busca reabre limpa, sem o texto da vez anterior', async ({ page }) => {
    await abrirComFocoNaCasca(page, '/');
    await page.keyboard.press('Control+p');
    await campo(page).fill('exp');
    await page.keyboard.press('Escape');
    await expect(dialogo(page)).toBeHidden();

    await page.keyboard.press('Control+p');

    await expect(campo(page)).toHaveValue('');
    await expect(page.getByRole('option')).toHaveCount(16);
  });
});

test.describe('Busca no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('o botão de busca está visível e abre a caixa', async ({ page }) => {
    await abrirHidratada(page, '/');
    const botao = page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' });

    await expect(botao).toBeVisible();
    await botao.click();

    await expect(dialogo(page)).toBeVisible();
    await expect(campo(page)).toBeFocused();
  });

  test('abre uma seção pela busca e a página não rola na horizontal', async ({ page }) => {
    await abrirHidratada(page, '/');
    await page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' }).click();

    await campo(page).fill('exp');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/experiencias$/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
});
