import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { abrirHidratada, arquivoDaArvore, arvoreDeSecoes } from './apoio';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };
const CHAVE_DO_PAINEL = 'painel-do-projeto';

const barra = (page: Page) => page.locator('app-barra-de-ferramentas');
const inicio = (page: Page) =>
  page.getByRole('button', { name: 'Portfolio_Vinicius, ir para o início' });
const botaoProjeto = (page: Page) => page.getByRole('button', { name: 'Projeto', exact: true });
const painel = (page: Page) => page.locator('app-painel-lateral');
const abas = (page: Page) => page.getByRole('tablist', { name: 'Arquivos abertos' });
const rodape = (page: Page) => page.getByRole('contentinfo');
const acoes = (page: Page) => page.getByRole('navigation', { name: 'Ações' });
const guardado = (page: Page) =>
  page.evaluate((chave) => sessionStorage.getItem(chave), CHAVE_DO_PAINEL);
const larguraDoEditor = async (page: Page) => (await page.getByRole('main').boundingBox())!.width;

test.describe('Casca nova: estrutura no desktop (1440x900)', () => {
  test.use({ viewport: DESKTOP });

  test('tem as regiões: barra superior, árvore, faixa de arquivos, editor e barra de status', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(barra(page)).toHaveAttribute('role', 'banner');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Seções do portfólio' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Faixa de arquivos' })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(rodape(page)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK');
  });

  test('a barra superior tem a identidade do projeto, Executar, busca, tema e a branch, nesta ordem', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    const botoes = await barra(page)
      .getByRole('button')
      .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));

    expect(botoes).toEqual([
      'Portfolio_Vinicius, ir para o início',
      'Executar PortfolioApplication',
      'Buscar seção (Ctrl+K)',
      'Usar tema claro',
      'Branch master, abrir o repositório',
    ]);
  });

  test('o link Repositório da gaveta só existe no celular: no desktop fica escondido', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(painel(page).getByRole('link', { name: 'Repositório' })).toBeHidden();
  });

  test('"Portfolio_Vinicius, ir para o início" leva ao Início, também pelo teclado', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await inicio(page).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto('/contato');
    await inicio(page).focus();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/$/);
  });

  for (const [atalho, descricao] of [
    ['Control+k', 'Ctrl+K'],
    ['Meta+k', 'Cmd+K'],
    ['Control+p', 'Ctrl+P (continua valendo)'],
  ] as const) {
    test(`${descricao} abre a busca com o foco no campo, e Esc fecha`, async ({ page }) => {
      await abrirHidratada(page, '/skills');

      await page.keyboard.press(atalho);
      await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();
      await page.keyboard.press('Escape');

      await expect(page.getByRole('dialog', { name: 'Buscar seção' })).toBeHidden();
    });
  }

  test('a barra de status mostra caminho, arquivo, posição, branch, "Disponível" e o relógio de Brasília', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(rodape(page).locator('.arquivo')).toHaveText('Skills.java');
    await expect(rodape(page)).toContainText('skills');
    await expect(rodape(page)).toContainText('Disponível');
    await expect(rodape(page).locator('.ramo')).toContainText('master');
    await expect(rodape(page).locator('.posicao')).toHaveText(/^\d+:\d+$/);
    // Relógio: hora e minuto no fuso de Brasília.
    const hora = (await rodape(page).locator('.relogio').textContent())!.trim();
    expect(hora).toMatch(/^\d{2}:\d{2}/);
    const [h, m] = hora.split(':').map(Number);
    const esperado = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .split(':')
      .map(Number);
    const agora = esperado[0] * 60 + esperado[1];
    const mostrado = h * 60 + m;
    expect(
      Math.min(Math.abs(agora - mostrado), 1440 - Math.abs(agora - mostrado)),
    ).toBeLessThanOrEqual(2);
  });

  test('na barra de status só o arquivo e o aviso são lidos; o resto é decoração', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(rodape(page).locator('.disponivel')).toHaveAttribute('aria-hidden', 'true');
    await expect(rodape(page).locator('.relogio')).toHaveAttribute('aria-hidden', 'true');
    await expect(rodape(page).locator('.posicao')).toHaveAttribute('aria-hidden', 'true');
    await expect(rodape(page).locator('.arquivo')).toHaveAttribute('role', 'status');
    await expect(rodape(page).locator('.aviso')).toHaveAttribute('aria-live', 'polite');
  });
});

test.describe('Casca nova: painel do projeto recolhível (desktop)', () => {
  test.use({ viewport: DESKTOP });

  test('o botão Projeto da faixa recolhe e reabre o painel, e o editor ocupa o espaço', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    const comPainel = await larguraDoEditor(page);
    await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'true');

    await botaoProjeto(page).click();

    await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(painel(page)).toBeHidden();
    expect(await larguraDoEditor(page)).toBeGreaterThan(comPainel + 150);

    await botaoProjeto(page).click();

    await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(painel(page)).toBeVisible();
  });

  for (const [atalho, descricao] of [
    ['Control+b', 'Ctrl+B'],
    ['Meta+b', 'Cmd+B'],
  ] as const) {
    test(`${descricao} alterna o painel, sem o atalho de negrito do navegador`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await abrirHidratada(page, '/skills');

      await page.keyboard.press(atalho);
      await expect(painel(page)).toBeHidden();
      await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'false');
      await page.keyboard.press(atalho);

      await expect(painel(page)).toBeVisible();
      await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'true');
    });
  }

  test('o botão Projeto funciona só com o teclado (Enter e Espaço) e mantém o foco', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    await botaoProjeto(page).focus();

    await page.keyboard.press('Enter');
    await expect(painel(page)).toBeHidden();
    await expect(botaoProjeto(page)).toBeFocused();
    await page.keyboard.press('Space');

    await expect(painel(page)).toBeVisible();
    await expect(botaoProjeto(page)).toBeFocused();
  });

  test('o estado fica guardado na sessão: recolhido grava, reabrir apaga, e a aba nova começa aberta', async ({
    page,
    browser,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    expect(await guardado(page)).toBeNull();

    await page.keyboard.press('Control+b');
    await expect(painel(page)).toBeHidden();
    expect(await guardado(page)).toBe('recolhido');
    await page.keyboard.press('Control+b');
    await expect(painel(page)).toBeVisible();
    expect(await guardado(page)).toBeNull();

    const outra = await browser.newContext({ viewport: DESKTOP });
    const pagina = await outra.newPage();
    await abrirHidratada(pagina, '/skills');
    await expect(pagina.locator('app-painel-lateral')).toBeVisible();
    await outra.close();
  });

  test('recarregar mantém o painel recolhido depois da hidratação', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    await page.keyboard.press('Control+b');
    await expect(painel(page)).toBeHidden();

    await page.reload();
    await expect(page.locator('main app-editor-de-codigo, main').first()).toBeAttached();

    await expect(painel(page)).toBeHidden();
    await expect(botaoProjeto(page)).toHaveAttribute('aria-pressed', 'false');
  });

  test('navegar entre seções mantém o painel como o visitante deixou', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    await page.keyboard.press('Control+b');
    await expect(painel(page)).toBeHidden();

    await page.keyboard.press('Control+k');
    await page.getByRole('combobox', { name: 'Buscar arquivo ou seção' }).fill('contato');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/contato$/);
    await expect(painel(page)).toBeHidden();
  });

  test('o HTML pré-renderizado sai com o painel aberto (a escolha só vale depois da hidratação)', async ({
    request,
  }) => {
    const html = await (await request.get('/skills')).text();

    expect(html).toMatch(/data-painel="true"/);
    expect(html).not.toMatch(/data-painel="false"/);
  });

  test('com o painel recolhido o resto da casca segue usável: abas, árvore pela busca e editor', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    await page.keyboard.press('Control+b');

    await expect(abas(page).getByRole('tab', { name: 'Skills.java' })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(arquivoDaArvore(page, 'Skills / STACK')).toBeHidden();
  });
});

test.describe('Casca nova: faixa de abas', () => {
  test.use({ viewport: DESKTOP });

  test('a aba da seção aberta é a ativa e o indicador de acento fica sob ela', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    const aba = abas(page).getByRole('tab', { name: 'Skills.java' });
    const indicador = page.locator('app-faixa-de-abas .indicador');

    await expect(aba).toHaveAttribute('aria-selected', 'true');
    await expect(indicador).toHaveClass(/medido/);
    const [a, i] = [(await aba.boundingBox())!, (await indicador.boundingBox())!];
    expect(Math.abs(i.x - a.x), 'começa na ponta esquerda da aba').toBeLessThanOrEqual(3);
    expect(Math.abs(i.width - a.width), 'tem a largura da aba').toBeLessThanOrEqual(3);
    expect(i.y).toBeGreaterThanOrEqual(a.y + a.height - 6);
  });

  test('o indicador acompanha a aba ativa ao abrir outra seção', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/skills');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox', { name: 'Buscar arquivo ou seção' }).fill('contato');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/contato$/);

    const aba = abas(page).getByRole('tab', { name: 'Contato.java' });
    await expect(aba).toHaveAttribute('aria-selected', 'true');
    const indicador = page.locator('app-faixa-de-abas .indicador');
    await expect
      .poll(async () => Math.abs((await indicador.boundingBox())!.x - (await aba.boundingBox())!.x))
      .toBeLessThanOrEqual(3);
  });

  test('clicar numa aba volta à seção, e a seta do teclado move o foco entre as abas', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');
    await page.keyboard.press('Control+k');
    await page.getByRole('combobox', { name: 'Buscar arquivo ou seção' }).fill('contato');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/contato$/);

    await abas(page).getByRole('tab', { name: 'Skills.java' }).click();
    await expect(page).toHaveURL(/\/skills$/);
    await expect(abas(page).getByRole('tab', { name: 'Skills.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('ArrowRight');

    await expect(abas(page).getByRole('tab', { name: 'Contato.java' })).toBeFocused();
  });

  test('fechar a aba ativa tira a aba e leva a outra seção, sem deixar a casca vazia', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');
    await page.getByRole('button', { name: 'Fechar Skills.java' }).click();

    await expect(abas(page).getByRole('tab', { name: 'Skills.java' })).toHaveCount(0);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(abas(page).getByRole('tab').first()).toBeVisible();
  });
});

test.describe('Casca nova: celular (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('a barra de ações fica embaixo, com Seções, Projetos e Contato de 44 px', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(acoes(page)).toBeVisible();
    const caixa = (await acoes(page).boundingBox())!;
    expect(caixa.y + caixa.height, 'colada no pé da tela').toBeGreaterThanOrEqual(
      CELULAR.height - 2,
    );
    expect(caixa.y).toBeGreaterThan(CELULAR.height / 2);
    for (const alvo of await acoes(page).locator('.acao').all()) {
      const c = (await alvo.boundingBox())!;
      expect(c.height).toBeGreaterThanOrEqual(44);
      expect(c.width).toBeGreaterThanOrEqual(44);
    }
    await expect(acoes(page).locator('.acao')).toHaveText([/Seções/, /Projetos/, /Contato/]);
  });

  test('Seções abre a gaveta com as pastas, e Esc fecha devolvendo o foco ao botão', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');
    const secoes = acoes(page).getByRole('button', { name: 'Seções' });

    await secoes.click();
    await expect(secoes).toHaveAttribute('aria-expanded', 'true');
    await expect(arvoreDeSecoes(page)).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(secoes).toHaveAttribute('aria-expanded', 'false');
    await expect(secoes).toBeFocused();
  });

  test('Projetos leva à vitrine e Contato à seção, com aria-current na ação da página', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');

    await acoes(page).getByRole('link', { name: 'Projetos' }).click();
    await expect(page).toHaveURL(/\/projetos$/);
    await expect(acoes(page).getByRole('link', { name: 'Projetos' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await acoes(page).getByRole('link', { name: 'Contato' }).click();

    await expect(page).toHaveURL(/\/contato$/);
    await expect(acoes(page).getByRole('link', { name: 'Contato' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(acoes(page).getByRole('link', { name: 'Projetos' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('a gaveta tem o link Repositório depois da árvore, que leva a /repositorio e fecha a gaveta', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');
    await acoes(page).getByRole('button', { name: 'Seções' }).click();
    const link = painel(page).getByRole('link', { name: 'Repositório' });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/repositorio');
    const [arvoreCaixa, linkCaixa] = [
      (await arvoreDeSecoes(page).boundingBox())!,
      (await link.boundingBox())!,
    ];
    expect(linkCaixa.y, 'depois da árvore').toBeGreaterThanOrEqual(arvoreCaixa.y);
    expect(linkCaixa.height).toBeGreaterThanOrEqual(44);
    await link.click();

    await expect(page).toHaveURL(/\/repositorio$/);
    await expect(acoes(page).getByRole('button', { name: 'Seções' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await acoes(page).getByRole('button', { name: 'Seções' }).click();
    await expect(painel(page).getByRole('link', { name: 'Repositório' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('a barra de ações continua com três botões: o Repositório fica só na gaveta', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(acoes(page).locator('.acao')).toHaveCount(3);
    await expect(acoes(page).getByRole('link', { name: 'Repositório' })).toHaveCount(0);
  });

  test('a branch some da barra superior, o painel não tem botão de recolher e Ctrl+B não faz nada', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    await expect(page.locator('app-barra-de-ferramentas .ramo')).toBeHidden();
    await expect(botaoProjeto(page)).toBeHidden();
    await page.keyboard.press('Control+b');
    expect(await guardado(page)).toBeNull();
    await expect(acoes(page)).toBeVisible();
  });

  test('a barra superior mantém o início, Executar, a busca e o tema, e a página não rola na horizontal', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');

    for (const nome of [
      'Portfolio_Vinicius, ir para o início',
      'Executar PortfolioApplication',
      'Buscar seção (Ctrl+K)',
      'Usar tema claro',
    ]) {
      await expect(barra(page).getByRole('button', { name: nome })).toBeVisible();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });

  test('a busca pelo botão do topo abre com o foco no campo', async ({ page }) => {
    await abrirHidratada(page, '/skills');

    await barra(page).getByRole('button', { name: 'Buscar seção (Ctrl+K)' }).click();

    await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();
  });
});

for (const [nomeDaTela, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Casca nova: acessibilidade (axe) no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      const analisar = async (page: Page) => {
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
          .analyze();
        return violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
        );
      };

      test(`estado padrão, sem exclusões (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
        await abrirHidratada(page, '/skills');

        expect(await analisar(page)).toEqual([]);
      });

      if (nomeDaTela === 'desktop') {
        test(`painel recolhido (${tema})`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
          await abrirHidratada(page, '/skills');
          await page.keyboard.press('Control+b');
          await expect(painel(page)).toBeHidden();

          expect(await analisar(page)).toEqual([]);
        });
      } else {
        test(`gaveta aberta (${tema})`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
          await abrirHidratada(page, '/skills');
          await acoes(page).getByRole('button', { name: 'Seções' }).click();
          await expect(arvoreDeSecoes(page)).toBeVisible();

          expect(await analisar(page)).toEqual([]);
        });
      }

      test(`com a busca aberta (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
        await abrirHidratada(page, '/skills');
        await page.keyboard.press('Control+k');
        await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();

        expect(await analisar(page)).toEqual([]);
      });
    }
  });
}
