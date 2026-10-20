import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';

import { abrirHidratada, arquivoDaArvore, esperarLogDoRun } from './apoio';

const TAGS = ['wcag2a', 'wcag2aa'];
const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };

const DECORATIVOS = [
  'app-barra-de-ferramentas .decorativo',
  'app-barra-de-ferramentas span.executar',
  'app-faixa-de-ferramentas span.botao',
];

const buscar = (page: Page) => page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' });
const status = (page: Page) => page.getByRole('contentinfo');

async function violacoes(page: Page): Promise<string[]> {
  await esperarLogDoRun(page);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`));
}

/** Percorre a ordem de Tab e devolve o que recebeu foco, até a sequência voltar ao início. */
async function focosPorTab(page: Page, passos: number): Promise<string[]> {
  const focados: string[] = [];
  for (let i = 0; i < passos; i++) {
    await page.keyboard.press('Tab');
    focados.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        return el
          ? `${el.tagName.toLowerCase()}|${el.className}|${el.getAttribute('aria-label') ?? ''}`
          : '';
      }),
    );
  }
  return focados;
}

test.describe('Barra superior (desktop)', () => {
  test.use({ viewport: DESKTOP });

  test('mostra o indicador da branch master e não tem mais os widgets do projeto', async ({
    page,
  }) => {
    for (const rota of ['/', '/skills', '/projeto-5']) {
      await page.goto(rota);
      const barra = page.locator('app-barra-de-ferramentas');

      await expect(barra.locator('.ramo')).toContainText('master');
      await expect(barra).not.toContainText('portfolio-vinicius');
      await expect(barra).not.toContainText('PortfolioApplication');
    }
  });

  test('põe os ícones à esquerda, com Executar antes de Buscar, e a branch ao lado', async ({
    page,
  }) => {
    await page.goto('/');
    const x = async (seletor: string) => (await page.locator(seletor).first().boundingBox())!.x;

    const executar = await x('app-barra-de-ferramentas .executar');
    const busca = (await buscar(page).boundingBox())!.x;
    const ramo = await x('app-barra-de-ferramentas .ramo');

    expect(executar).toBeLessThan(busca);
    expect(busca).toBeLessThan(ramo);
    expect(ramo).toBeLessThan(960);
  });

  test('Buscar abre a busca de seções com o foco no campo', async ({ page }) => {
    await abrirHidratada(page, '/');

    await buscar(page).click();

    await expect(page.getByRole('dialog', { name: 'Buscar seção' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();
  });

  test('Executar abre o preview no Projeto 5 e no Projeto 6', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const rota of ['/projeto-5', '/projeto-6']) {
      await abrirHidratada(page, rota);

      await page.getByRole('button', { name: 'Executar o projeto' }).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
    }
  });

  test('Executar fora dos projetos com site é um botão que abre a janela de Run', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const rota of ['/', '/skills', '/projeto-4', '/projeto-1']) {
      await page.goto(rota);
      const executar = page.getByRole('button', { name: 'Executar PortfolioApplication' });

      await expect(page.getByRole('button', { name: 'Executar o projeto' })).toHaveCount(0);
      await expect(executar).toBeVisible();
      await executar.click();

      await expect(page.locator('app-janela-de-run')).toHaveAttribute('data-aberto', 'true');
      await expect(page.getByRole('region', { name: /Log de inicialização/ })).toContainText(
        'Started PortfolioApplication',
      );
    }
  });

  test('o leitor de tela só encontra como botões Executar, Buscar, o tema, a branch, Projeto e Commit', async ({
    page,
  }) => {
    await page.goto('/skills');

    const botoes = await page
      .locator('app-barra-de-ferramentas, app-faixa-de-ferramentas')
      .getByRole('button')
      .evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));
    const texto = (await page.locator('app-barra-de-ferramentas').ariaSnapshot()) ?? '';

    expect(botoes).toEqual([
      'Executar PortfolioApplication',
      'Buscar seção (Ctrl+P)',
      'Usar tema claro',
      'Branch master, abrir o repositório',
      'Projeto',
      'Commit',
    ]);
    expect(texto).not.toContain('portfolio-vinicius');
  });

  test('controles decorativos não têm tabindex, papel nem são links ou botões', async ({
    page,
  }) => {
    await page.goto('/');

    for (const seletor of DECORATIVOS) {
      for (const item of await page.locator(seletor).all()) {
        expect(
          await item.evaluate((el) => el.matches('button, a, input, [tabindex], [role]')),
        ).toBe(false);
        await expect(item).toHaveAttribute('aria-hidden', 'true');
      }
    }
  });

  test('nenhum Tab da página inteira cai num controle decorativo', async ({ page }) => {
    await abrirHidratada(page, '/projeto-5');

    const focados = await focosPorTab(page, 40);
    const decorativos = await page.evaluate(
      (seletores) => seletores.map((s) => document.querySelectorAll(s).length),
      DECORATIVOS,
    );

    // No Projeto 5 o Executar da barra é um botão real, então só os demais precisam existir.
    expect(
      decorativos
        .filter((_, i) => DECORATIVOS[i] !== 'app-barra-de-ferramentas span.executar')
        .every((n) => n > 0),
    ).toBe(true);
    for (const foco of focados) {
      expect(foco).not.toMatch(/decorativo|span\|/);
    }
    expect(focados.some((f) => f.includes('Buscar seção'))).toBe(true);
    expect(focados.some((f) => f.endsWith('|Executar o projeto'))).toBe(true);
  });
});

test.describe('Ícones da barra de ferramentas do design', () => {
  test.use({ viewport: DESKTOP });

  test('a barra usa os ícones do design, e só a busca e a branch são da IntelliJ Platform', async ({
    page,
  }) => {
    await page.goto('/projeto-5');
    const origens = (seletor: string) =>
      page.locator(seletor).evaluateAll((els) => els.map((el) => el.getAttribute('src') ?? ''));

    const daBarra = await origens('app-barra-de-ferramentas app-icone img');
    const daArvore = await origens('app-arvore-de-secoes app-icone img');

    expect(daBarra.length).toBeGreaterThanOrEqual(8);
    expect(
      daBarra.filter((src) => src.includes('icones/new-ui/') && !src.includes('/claro/')).length,
    ).toBe(2);
    expect(daArvore.length).toBeGreaterThan(0);
    for (const src of daArvore) expect(src).not.toContain('icones/new-ui/');
  });
});

test.describe('Estrutura fixa da IDE', () => {
  test.use({ viewport: DESKTOP });

  test('barra no topo, faixa e painel à esquerda, abas sobre o editor e status no rodapé', async ({
    page,
  }) => {
    for (const rota of ['/', '/formacao']) {
      await page.goto(rota);
      const caixa = async (seletor: string) => (await page.locator(seletor).first().boundingBox())!;

      const barra = await caixa('app-barra-de-ferramentas');
      const faixa = await caixa('app-faixa-de-ferramentas');
      const painel = await caixa('app-painel-lateral');
      const abas = await caixa('app-faixa-de-abas');
      const editor = (await page.getByRole('main').boundingBox())!;
      const rodape = (await status(page).boundingBox())!;

      expect(barra.y).toBeLessThanOrEqual(1);
      expect(barra.width).toBeGreaterThan(1900);
      expect(faixa.x).toBeLessThanOrEqual(1);
      expect(faixa.y).toBeGreaterThanOrEqual(barra.y + barra.height - 1);
      expect(painel.x).toBeGreaterThanOrEqual(faixa.x + faixa.width - 1);
      expect(abas.x).toBeGreaterThanOrEqual(painel.x + painel.width - 1);
      expect(editor.y).toBeGreaterThanOrEqual(abas.y + abas.height - 1);
      expect(rodape.y).toBeGreaterThanOrEqual(editor.y + editor.height - 1);
      expect(rodape.y + rodape.height).toBeLessThanOrEqual(DESKTOP.height + 1);
    }
  });

  test('o painel começa com o cabeçalho Portfolio_Vinicius, decorativo, e o botão da faixa volta a mostrá-lo', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const painel = page.locator('app-painel-lateral');
    const botao = page.locator('app-faixa-de-ferramentas').getByRole('button', { name: 'Projeto' });

    const cabecalho = painel.locator('.cabecalho');
    await expect(cabecalho).toContainText('Portfolio_Vinicius');
    await expect(cabecalho).toHaveAttribute('aria-hidden', 'true');
    await botao.click();
    await expect(painel).toBeHidden();
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await botao.click();
    await expect(painel).toBeVisible();
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
  });

  test('o botão Projeto é anunciado como botão com estado pressionado', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Projeto', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('a barra de rolagem horizontal do pé do painel é só decoração: oculta, sem foco e sem rolar', async ({
    page,
  }) => {
    await page.goto('/');
    const rodape = page.locator('app-painel-lateral .rodape');

    await expect(rodape).toHaveAttribute('aria-hidden', 'true');
    expect(
      await rodape.evaluate(
        (el) => el.matches('[tabindex]') || el.querySelector('[tabindex], a, button') !== null,
      ),
    ).toBe(false);
    expect(await page.locator('app-painel-lateral').evaluate((el) => el.scrollLeft)).toBe(0);
  });

  test('o painel do projeto não tem rolagem horizontal', async ({ page }) => {
    for (const rota of ['/', '/sobre-mim', '/depoimentos']) {
      await page.goto(rota);

      const medidas = await page
        .locator('app-painel-lateral, app-painel-lateral *')
        .evaluateAll((els) =>
          els
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
        );

      expect(medidas, `Elementos que estouram em ${rota}`).toEqual([]);
    }
  });
});

test.describe('Barra de status: commit do deploy', () => {
  test('mostra o SHA curto como link para o commit, ou nada no build local', async ({ page }) => {
    await page.goto('/skills');
    const link = status(page).locator('a.commit');

    if ((await link.count()) === 0) {
      await expect(status(page)).not.toContainText(/\b[0-9a-f]{7}\b/);
      return;
    }
    const sha = (await link.textContent())!.trim();
    expect(sha).toMatch(/^[0-9a-f]{7}$/);
    await expect(link).toHaveAttribute(
      'href',
      new RegExp(
        `^https://github\\.com/viniassuncao1/Portifolio-Vinicius-Machado/commit/${sha}[0-9a-f]*$`,
      ),
    );
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('fica no HTML pré-renderizado, sem JavaScript, quando o build traz o SHA', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/skills');

    const link = status(pagina).locator('a.commit');
    if ((await link.count()) > 0) {
      await expect(link).toHaveAttribute('href', /\/commit\/[0-9a-f]{7,64}$/);
    }
    await contexto.close();
  });
});

test.describe('Celular (390x844)', () => {
  test.use({ viewport: CELULAR });

  test('esconde a faixa de ferramentas e recolhe o painel, com Seções e Buscar na barra', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('app-faixa-de-ferramentas')).toBeHidden();
    await expect(
      page.locator('app-painel-lateral').getByRole('link', { name: 'Sobre Mim' }),
    ).toBeHidden();
    await expect(page.getByRole('button', { name: 'Seções' })).toBeVisible();
    await expect(buscar(page)).toBeVisible();
    // A branch fica na barra compacta: é por ela que o painel do Git abre no celular.
    await expect(page.locator('app-barra-de-ferramentas .ramo')).toBeVisible();
    await expect(page.locator('app-barra-de-ferramentas .decorativo').first()).toBeHidden();
  });

  test('o editor usa a largura da tela e a página não rola na horizontal', async ({ page }) => {
    await page.goto('/');

    const { rolagem, largura } = await page.evaluate(() => ({
      rolagem: document.documentElement.scrollWidth,
      largura: document.documentElement.clientWidth,
    }));
    const editor = (await page.getByRole('main').boundingBox())!;

    expect(rolagem).toBeLessThanOrEqual(largura);
    expect(editor.x).toBeLessThanOrEqual(1);
    expect(editor.width).toBeGreaterThanOrEqual(CELULAR.width - 1);
  });

  test('Buscar na barra compacta abre a busca com o foco no campo', async ({ page }) => {
    await abrirHidratada(page, '/');

    await buscar(page).click();

    await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();
  });

  test('o Tab não passa por controle decorativo', async ({ page }) => {
    await abrirHidratada(page, '/projeto-5');

    const focados = await focosPorTab(page, 40);

    for (const foco of focados) expect(foco).not.toMatch(/decorativo|span\|/);
  });
});

test.describe('Ícones da New UI e créditos', () => {
  test.use({ viewport: DESKTOP });

  test('todos os ícones da casca vêm do próprio site, do design ou da pasta new-ui, e carregam', async ({
    page,
  }) => {
    const externas: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('http://localhost')) externas.push(r.url());
    });
    await page.goto('/');
    await expect(page.locator('app-barra-de-ferramentas .botao-busca img').first()).toBeVisible();

    // Ícones de controles escondidos neste tamanho (o Projeto do celular) nem chegam a carregar.
    const imagens = await page.locator('app-icone img').evaluateAll((els) =>
      els
        .filter((el) => el.checkVisibility())
        .map((el) => ({
          src: (el as HTMLImageElement).getAttribute('src'),
          ok: (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0,
        })),
    );

    expect(imagens.length).toBeGreaterThan(8);
    for (const { src, ok } of imagens) {
      expect(src).toMatch(/icones\/(new-ui\/)?[\w-]+\.svg$/);
      expect(ok, `${src} não carregou`).toBe(true);
    }
    expect(externas).toEqual([]);
  });

  test('a pasta publicada tem CREDITOS.md com origem, copyright e Apache 2.0, e nenhum logotipo', async ({
    request,
  }) => {
    const resposta = await request.get('/icones/new-ui/CREDITOS.md').catch(() => null);
    const texto = resposta?.ok()
      ? await resposta.text()
      : await readFile('public/icones/new-ui/CREDITOS.md', 'utf8');
    const arquivos = await readdir('public/icones/new-ui');

    expect(texto).toContain('JetBrains/intellij-community');
    expect(texto).toContain('Copyright');
    expect(texto).toContain('Apache License, Version 2.0');
    expect(
      arquivos.filter((a) => /logo|idea|intellij|jetbrains|phpstorm|webstorm/i.test(a)),
    ).toEqual([]);
    expect(await readFile('README.md', 'utf8')).toContain('icones/new-ui/CREDITOS.md');
  });
});

for (const [nome, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) das barras no ${nome}`, () => {
    test.use({ viewport });

    test('com a busca aberta não tem violações', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await abrirHidratada(page, '/skills');
      await buscar(page).click();
      await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();

      expect(await violacoes(page)).toEqual([]);
    });

    test('com a janela de preview aberta não tem violações', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await abrirHidratada(page, '/projeto-5');
      // No celular a barra compacta esconde o Executar; o do código abre a mesma janela.
      await page.getByRole('button', { name: 'Executar' }).first().click();
      await expect(page.getByRole('dialog')).toBeVisible();

      expect(await violacoes(page)).toEqual([]);
    });
  });
}

test.describe('Acessibilidade das barras: estados do painel', () => {
  test('desktop com o painel escondido não tem violações', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Projeto', exact: true }).click();
    await expect(page.locator('app-painel-lateral')).toBeHidden();

    expect(await violacoes(page)).toEqual([]);
  });

  test('celular com a gaveta aberta não tem violações', async ({ page }) => {
    await page.setViewportSize(CELULAR);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await abrirHidratada(page, '/');
    await page.getByRole('button', { name: 'Seções', exact: true }).click();
    await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeVisible();

    expect(await violacoes(page)).toEqual([]);
  });
});
