import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import type { Page, Route } from '@playwright/test';

import { SECOES, totalDePaginas } from '../src/app/core/secoes';
import { abrirHidratada, abrirPastas, arquivoDaArvore, contraste, esperarLogDoRun } from './apoio';

const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };
const TAGS = ['wcag2a', 'wcag2aa'];
const ROTAS = [
  '/',
  ...SECOES.flatMap((secao) =>
    Array.from({ length: totalDePaginas(secao) }, (_, i) =>
      i === 0 ? `/${secao.slug}` : `/${secao.slug}/${i + 1}`,
    ),
  ),
];

const FUNDO_DA_PAGINA = { escuro: 'rgb(28, 28, 28)', claro: 'rgb(217, 217, 217)' };
const FUNDO_DO_EDITOR = { escuro: 'rgb(43, 43, 43)', claro: 'rgb(247, 247, 247)' };
const FUNDO_DA_LINHA_ATUAL = 'rgb(240, 240, 240)';
const THEME_COLOR = { escuro: '#2b2b2b', claro: '#ececec' };
/** Cores de sintaxe do IntelliJ Light, com o amarelo da anotação e o comentário escurecidos para o AA. */
const SINTAXE_CLARA = {
  'papel-palavra-chave': 'rgb(0, 51, 179)',
  'papel-declaracao': 'rgb(135, 16, 148)',
  'papel-literal': 'rgb(6, 125, 23)',
  'papel-valor': 'rgb(23, 80, 235)',
  'papel-anotacao': 'rgb(125, 107, 0)',
  'papel-comentario': 'rgb(106, 106, 106)',
};

const botaoDeTema = (page: Page) => page.getByRole('button', { name: /^Usar tema/ });
const dataTema = (page: Page) =>
  page.evaluate(() => document.documentElement.getAttribute('data-tema'));
const fundo = (page: Page, seletor: string) =>
  page
    .locator(seletor)
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor);
const themeColor = (page: Page) =>
  page.locator('head meta[name="theme-color"]').getAttribute('content');
const esquemaDeCores = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
const armazenado = (page: Page) => page.evaluate(() => localStorage.getItem('tema'));

async function violacoes(page: Page): Promise<string[]> {
  await esperarLogDoRun(page);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations.flatMap((v) => v.nodes.map((n) => `${v.id}: ${n.target.join(' ')}`));
}

/** Espera o tema do <html>: com a View Transition, `data-tema` só muda no quadro seguinte ao clique. */
const esperarTema = (page: Page, tema: string | null) =>
  expect.poll(() => dataTema(page), { message: `data-tema deveria ser ${tema}` }).toBe(tema);

/** Ativa o botão de tema e espera a troca terminar (o tema anterior some do <html>). */
async function alternarTema(page: Page): Promise<void> {
  const antes = await dataTema(page);
  await botaoDeTema(page).click();
  await expect.poll(() => dataTema(page)).not.toBe(antes);
  await expect(page.locator('html.transicao-de-tema')).toHaveCount(0);
}

async function abrirNoClaro(page: Page, rota: string): Promise<void> {
  await abrirHidratada(page, rota);
  expect(await dataTema(page)).toBe('claro');
}

test.describe('Tema inicial: sistema no claro', () => {
  test.use({ colorScheme: 'light', viewport: DESKTOP });

  // O CSS crítico inlinado pelo build só ganha os tokens claros pelo scripts/inlinar-tokens-claros.mjs;
  // com o estilo atrasado, só ele pinta o 1º quadro.
  test('na primeira visita já pinta claro, sem nunca passar pelo escuro', async ({ page }) => {
    // Atrasa a folha de estilos externa: só o CSS crítico inlinado no HTML pinta o 1º quadro.
    await page.route('**/styles-*.css', async (rota) => {
      await new Promise((resolver) => setTimeout(resolver, 800));
      await rota.continue();
    });
    await page.addInitScript(() => {
      const w = window as unknown as { __temas: (string | null)[]; __fundos: string[] };
      w.__temas = [];
      w.__fundos = [];
      // O init script roda antes de existir o <html>: observa o documento inteiro.
      new MutationObserver(() =>
        w.__temas.push(document.documentElement.getAttribute('data-tema')),
      ).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-tema'] });
      const amostrar = (quando: string) => {
        const raiz = document.documentElement;
        const fundo = document.body ? getComputedStyle(document.body).backgroundColor : 'sem body';
        w.__fundos.push(`${fundo} (${quando}, data-tema=${raiz.getAttribute('data-tema')})`);
      };
      requestAnimationFrame(() => amostrar('1º quadro'));
      document.addEventListener('DOMContentLoaded', () => amostrar('DOMContentLoaded'));
    });

    await abrirHidratada(page, '/skills');

    const { temas, fundos } = await page.evaluate(() => {
      const w = window as unknown as { __temas: (string | null)[]; __fundos: string[] };
      return { temas: w.__temas, fundos: w.__fundos };
    });
    expect(temas.length).toBeGreaterThan(0);
    expect(
      temas.every((t) => t === 'claro'),
      `data-tema observados: ${temas}`,
    ).toBe(true);
    expect(fundos.length).toBeGreaterThan(0);
    for (const f of fundos) expect(f).toContain(FUNDO_DA_PAGINA.claro);
  });

  test('antes de qualquer interação o editor, o painel e a barra já estão claros', async ({
    page,
  }) => {
    await abrirNoClaro(page, '/');

    expect(await fundo(page, 'body')).toBe(FUNDO_DA_PAGINA.claro);
    expect(await fundo(page, 'app-editor-de-codigo')).toBe(FUNDO_DO_EDITOR.claro);
    expect(await fundo(page, 'app-painel-lateral')).toBe('rgb(236, 236, 236)');
    expect(await esquemaDeCores(page)).toBe('light');
    expect(await themeColor(page)).toBe('#ececec');
    expect(await armazenado(page)).toBeNull();
  });

  test('o HTML pré-renderizado não tem data-tema: o script inline decide no navegador', async ({
    request,
  }) => {
    for (const rota of ['/', '/skills', '/projeto-4/3']) {
      const html = await (await request.get(rota)).text();
      const abertura = /<html[^>]*>/.exec(html)?.[0] ?? '';

      expect(abertura, rota).not.toContain('data-tema');
      expect(abertura, rota).not.toContain('color-scheme');
      expect(html.indexOf('localStorage'), rota).toBeGreaterThan(-1);
      expect(html.indexOf('localStorage'), rota).toBeLessThan(
        html.indexOf('<link rel="stylesheet"'),
      );
      expect(html, rota).toMatch(/<meta name="theme-color" content="#2B2B2B"/i);
    }
  });

  test('sem JavaScript, com o sistema no claro, a página aparece clara', async ({ browser }) => {
    const contexto = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: 'light',
      viewport: DESKTOP,
    });
    const pagina = await contexto.newPage();

    await pagina.goto('/skills');

    expect(await dataTema(pagina)).toBeNull();
    expect(await fundo(pagina, 'body')).toBe(FUNDO_DA_PAGINA.claro);
    expect(await fundo(pagina, 'app-editor-de-codigo')).toBe(FUNDO_DO_EDITOR.claro);
    await contexto.close();
  });

  test('sem JavaScript, com o sistema no escuro, a página continua escura', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
    const pagina = await contexto.newPage();

    await pagina.goto('/skills');

    expect(await fundo(pagina, 'body')).toBe(FUNDO_DA_PAGINA.escuro);
    expect(await fundo(pagina, 'app-editor-de-codigo')).toBe(FUNDO_DO_EDITOR.escuro);
    await contexto.close();
  });

  test('o tema guardado vale mais que o sistema, nos dois sentidos', async ({ browser }) => {
    for (const [sistema, guardado, esperado] of [
      ['light', 'escuro', 'escuro'],
      ['dark', 'claro', 'claro'],
    ] as const) {
      const contexto = await browser.newContext({ colorScheme: sistema, viewport: DESKTOP });
      await contexto.addInitScript((valor) => localStorage.setItem('tema', valor), guardado);
      const pagina = await contexto.newPage();

      await abrirHidratada(pagina, '/');

      expect(await dataTema(pagina), `${sistema} + ${guardado}`).toBe(esperado);
      expect(await fundo(pagina, 'body')).toBe(FUNDO_DA_PAGINA[esperado]);
      await contexto.close();
    }
  });

  test('com o sistema no escuro, a primeira visita é escura', async ({ browser }) => {
    const contexto = await browser.newContext({ colorScheme: 'dark', viewport: DESKTOP });
    const pagina = await contexto.newPage();

    await abrirHidratada(pagina, '/');

    expect(await dataTema(pagina)).toBe('escuro');
    expect(await esquemaDeCores(pagina)).toBe('dark');
    expect(await themeColor(pagina)).toBe(THEME_COLOR.escuro);
    await contexto.close();
  });
});

test.describe('Botão de tema', () => {
  test.use({ viewport: DESKTOP });

  test('no escuro oferece o claro, com aria-pressed falso, e troca ao ativar', async ({ page }) => {
    await abrirHidratada(page, '/');
    const botao = botaoDeTema(page);

    expect(await dataTema(page)).toBe('escuro');
    await expect(botao).toHaveAccessibleName('Usar tema claro');
    await expect(botao).toHaveAttribute('aria-pressed', 'false');

    await botao.click();
    await expect.poll(() => dataTema(page)).toBe('claro');
    await expect(page.locator('html.transicao-de-tema')).toHaveCount(0);

    expect(await dataTema(page)).toBe('claro');
    await expect(botao).toHaveAccessibleName('Usar tema escuro');
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
    expect(await fundo(page, 'body')).toBe(FUNDO_DA_PAGINA.claro);
    expect(await armazenado(page)).toBe('claro');
  });

  test('a escolha persiste ao recarregar, nos dois sentidos, sem passar pelo outro tema', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');
    await alternarTema(page);
    expect(await armazenado(page)).toBe('claro');

    await page.addInitScript(() => {
      const w = window as unknown as { __temas: (string | null)[] };
      w.__temas = [];
      // O init script roda antes de existir o <html>: observa o documento inteiro.
      new MutationObserver(() =>
        w.__temas.push(document.documentElement.getAttribute('data-tema')),
      ).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-tema'] });
    });
    await page.reload();
    await expect(page.locator('main app-editor-de-codigo')).toHaveClass(/pronto/);

    expect(await dataTema(page)).toBe('claro');
    const vistos = await page.evaluate(() => (window as unknown as { __temas: string[] }).__temas);
    expect(vistos.length).toBeGreaterThan(0);
    expect(new Set(vistos), `data-tema observados: ${vistos}`).toEqual(new Set(['claro']));
    await expect(botaoDeTema(page)).toHaveAccessibleName('Usar tema escuro');
    await alternarTema(page);
    expect(await armazenado(page)).toBe('escuro');
    await page.reload();

    await expect(page.locator('main app-editor-de-codigo')).toHaveClass(/pronto/);
    expect(await dataTema(page)).toBe('escuro');
  });

  test('o tema continua ao navegar entre seções', async ({ page }) => {
    await abrirHidratada(page, '/');
    await alternarTema(page);

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Sobre Mim').click();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    expect(await dataTema(page)).toBe('claro');
    expect(await fundo(page, 'app-editor-de-codigo')).toBe(FUNDO_DO_EDITOR.claro);
  });

  test('é um botão do teclado, na ordem de Tab, com anel de foco visível', async ({ page }) => {
    await abrirHidratada(page, '/');
    const botao = botaoDeTema(page);

    await botao.focus();
    const anel = await botao.evaluate((el) => {
      const estilo = getComputedStyle(el);
      return { estilo: estilo.outlineStyle, largura: estilo.outlineWidth };
    });
    await page.keyboard.press('Enter');

    expect(anel).toEqual({ estilo: 'solid', largura: '2px' });
    await esperarTema(page, 'claro');
    await expect(page.locator('html.transicao-de-tema')).toHaveCount(0);
    await page.keyboard.press('Space');
    await esperarTema(page, 'escuro');
  });

  test('o botão faz parte da barra, ao lado do Buscar, e fica fora dos decorativos', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');

    const tema = (await botaoDeTema(page).boundingBox())!;
    const busca = (await page
      .getByRole('button', { name: 'Buscar seção (Ctrl+P)' })
      .boundingBox())!;

    expect(Math.abs(tema.y - busca.y)).toBeLessThan(8);
    expect(tema.x).toBeGreaterThan(busca.x);
  });

  test.describe('no celular', () => {
    test.use({ viewport: CELULAR });

    test('o botão está na barra compacta, troca o tema e persiste', async ({ page }) => {
      await abrirHidratada(page, '/');

      await expect(botaoDeTema(page)).toBeVisible();
      await alternarTema(page);
      await page.reload();

      await expect(page.locator('main app-editor-de-codigo')).toHaveClass(/pronto/);
      expect(await dataTema(page)).toBe('claro');
      const estourou = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(estourou).toBe(false);
    });
  });
});

test.describe('theme-color e color-scheme nos dois temas', () => {
  test.use({ viewport: DESKTOP });

  test('seguem o tema ao alternar, nos dois sentidos', async ({ page }) => {
    await abrirHidratada(page, '/');

    expect(await themeColor(page)).toBe(THEME_COLOR.escuro);
    expect(await esquemaDeCores(page)).toBe('dark');
    await alternarTema(page);
    expect(await themeColor(page)).toBe(THEME_COLOR.claro);
    expect(await esquemaDeCores(page)).toBe('light');
    expect(await fundo(page, 'app-painel-lateral')).toBe('rgb(236, 236, 236)');
    await alternarTema(page);

    expect(await themeColor(page)).toBe(THEME_COLOR.escuro);
    expect(await esquemaDeCores(page)).toBe('dark');
    expect(await fundo(page, 'app-painel-lateral')).toBe('rgb(43, 43, 43)');
  });

  test('o escuro vale mesmo com o sistema no claro: controles nativos no escuro', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ colorScheme: 'light', viewport: DESKTOP });
    await contexto.addInitScript(() => localStorage.setItem('tema', 'escuro'));
    const pagina = await contexto.newPage();

    await abrirHidratada(pagina, '/');

    expect(await esquemaDeCores(pagina)).toBe('dark');
    expect(await themeColor(pagina)).toBe(THEME_COLOR.escuro);
    await contexto.close();
  });

  test('os números de linha e a posição do cursor continuam tabulares no claro', async ({
    page,
  }) => {
    await abrirHidratada(page, '/skills');
    await alternarTema(page);

    const variante = (seletor: string) =>
      page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).fontVariantNumeric);

    expect(await variante('main .numeros span')).toContain('tabular-nums');
    expect(await variante('app-barra-de-status footer .posicao')).toContain('tabular-nums');
  });
});

test.describe('localStorage bloqueado', () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const erro = () => {
        throw new DOMException('bloqueado', 'SecurityError');
      };
      Object.defineProperty(window, 'localStorage', { get: erro, configurable: true });
    });
  });

  test('a página abre, sem erro, e o botão ainda troca o tema nesta visita', async ({ page }) => {
    const erros: string[] = [];
    page.on('pageerror', (e) => erros.push(e.message));
    await abrirHidratada(page, '/');

    expect(await dataTema(page)).toBe('escuro');
    await alternarTema(page);

    expect(await dataTema(page)).toBe('claro');
    expect(await fundo(page, 'body')).toBe(FUNDO_DA_PAGINA.claro);
    expect(erros).toEqual([]);
  });

  test.describe('com o sistema no claro', () => {
    test.use({ colorScheme: 'light' });

    test('o script inline cai no tema do sistema', async ({ page }) => {
      const erros: string[] = [];
      page.on('pageerror', (e) => erros.push(e.message));

      await abrirHidratada(page, '/skills');

      expect(await dataTema(page)).toBe('claro');
      expect(erros).toEqual([]);
    });
  });
});

/** Conta as chamadas a startViewTransition e registra se o <html> chegou a ganhar a classe da transição. */
async function espiarTransicoes(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __transicoes: number; __classeApareceu: boolean };
    w.__transicoes = 0;
    w.__classeApareceu = false;
    const original = document.startViewTransition?.bind(document);
    if (original) {
      document.startViewTransition = ((...argumentos: Parameters<typeof original>) => {
        w.__transicoes += 1;
        return original(...argumentos);
      }) as typeof document.startViewTransition;
    }
    new MutationObserver(() => {
      if (document.documentElement.classList.contains('transicao-de-tema')) {
        w.__classeApareceu = true;
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
}

const transicoes = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __transicoes: number; __classeApareceu: boolean };
    return { chamadas: w.__transicoes, classe: w.__classeApareceu };
  });

test.describe('Troca suave e movimento reduzido', () => {
  test.use({ viewport: DESKTOP });

  test('com movimento reduzido a troca é imediata, sem View Transition nem classe de transição', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await espiarTransicoes(page);
    await abrirHidratada(page, '/');

    const logoApos = await page.evaluate(() => {
      // A navegação inicial do roteador também usa View Transition: conta só a partir do clique.
      (window as unknown as { __transicoes: number }).__transicoes = 0;
      (
        Array.from(document.querySelectorAll('button')).find((b) =>
          b.getAttribute('aria-label')?.startsWith('Usar tema'),
        ) as HTMLButtonElement
      ).click();
      return document.documentElement.getAttribute('data-tema');
    });

    expect(logoApos).toBe('claro');
    await page.waitForTimeout(300);
    expect(await transicoes(page)).toEqual({ chamadas: 0, classe: false });
    expect(
      await page.evaluate(
        () =>
          (document as unknown as { activeViewTransition?: unknown }).activeViewTransition ?? null,
      ),
    ).toBeNull();
    expect(await fundo(page, 'body')).toBe(FUNDO_DA_PAGINA.claro);
  });

  test('sem movimento reduzido a troca roda numa View Transition e termina no tema novo', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await espiarTransicoes(page);
    await abrirHidratada(page, '/');
    const suporta = await page.evaluate(() => typeof document.startViewTransition === 'function');
    test.skip(!suporta, 'o navegador não tem View Transitions');
    await page.evaluate(() => {
      (window as unknown as { __transicoes: number }).__transicoes = 0;
    });

    await alternarTema(page);

    const { chamadas, classe } = await transicoes(page);
    expect(chamadas).toBe(1);
    expect(classe).toBe(true);
    await expect(page.locator('html.transicao-de-tema')).toHaveCount(0);
    expect(await fundo(page, 'body')).toBe(FUNDO_DA_PAGINA.claro);
    expect(await armazenado(page)).toBe('claro');
  });
});

test.describe('Contraste das cores de sintaxe no claro', () => {
  test.use({ colorScheme: 'light', viewport: DESKTOP });

  for (const rota of ROTAS) {
    test(`${rota}: cada cor de sintaxe passa em 4,5:1 sobre o editor e a linha atual`, async ({
      page,
    }) => {
      await abrirNoClaro(page, rota);

      const lidas = await page.evaluate(() =>
        Array.from(document.querySelectorAll('main code [class^="papel-"]'), (el) => ({
          papel: el.className.split(' ')[0],
          cor: getComputedStyle(el).color,
        })),
      );
      const editor = await fundo(page, 'app-editor-de-codigo');

      expect(editor).toBe(FUNDO_DO_EDITOR.claro);
      expect(lidas.length).toBeGreaterThan(0);
      for (const { papel, cor } of lidas) {
        expect(contraste(cor, editor), `${papel} ${cor} sobre ${editor}`).toBeGreaterThanOrEqual(
          4.5,
        );
        expect(
          contraste(cor, FUNDO_DA_LINHA_ATUAL),
          `${papel} ${cor} sobre a linha atual`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(cor, `${papel} em ${rota}`).toBe(
          SINTAXE_CLARA[papel as keyof typeof SINTAXE_CLARA] ?? cor,
        );
      }
    });
  }

  test('o texto da interface e os números de linha também passam em 4,5:1 no claro', async ({
    page,
  }) => {
    await abrirNoClaro(page, '/skills');
    const cor = (seletor: string) =>
      page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).color);

    for (const [seletor, fundoEsperado] of [
      ['main .numeros span', FUNDO_DO_EDITOR.claro],
      ['main .numeros span', FUNDO_DA_LINHA_ATUAL],
      ['nav[aria-label="Seções do portfólio"] a', 'rgb(236, 236, 236)'],
      ['app-barra-de-status footer .item', 'rgb(236, 236, 236)'],
    ] as const) {
      const texto = await cor(seletor);
      expect(contraste(texto, fundoEsperado), `${seletor} ${texto}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('as seis cores de sintaxe da seção Skills são as do IntelliJ Light ajustadas', async ({
    page,
  }) => {
    await abrirNoClaro(page, '/skills');

    const lidas = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main code [class^="papel-"]'), (el) => ({
        papel: el.className.split(' ')[0],
        cor: getComputedStyle(el).color,
      })),
    );
    const porPapel = new Map<string, Set<string>>();
    for (const { papel, cor } of lidas)
      porPapel.set(papel, (porPapel.get(papel) ?? new Set()).add(cor));

    expect([...(porPapel.get('papel-palavra-chave') ?? [])]).toEqual([
      SINTAXE_CLARA['papel-palavra-chave'],
    ]);
    expect([...(porPapel.get('papel-literal') ?? [])]).toEqual([SINTAXE_CLARA['papel-literal']]);
    expect([...(porPapel.get('papel-comentario') ?? [])]).toEqual([
      SINTAXE_CLARA['papel-comentario'],
    ]);
  });
});

for (const [nome, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) no tema claro, ${nome}`, () => {
    test.use({ colorScheme: 'light', viewport });

    for (const rota of ROTAS) {
      test(`${rota} não tem violações`, async ({ page }) => {
        await page.goto(rota);
        await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
        expect(await dataTema(page)).toBe('claro');

        expect(await violacoes(page), `Violações em ${rota}`).toEqual([]);
      });
    }

    test('depois de trocar pelo botão também não tem violações', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
      await abrirHidratada(page, '/skills');
      await alternarTema(page);
      expect(await dataTema(page)).toBe('claro');

      expect(await violacoes(page)).toEqual([]);
    });
  });
}

const HISTORICO = {
  geradoEm: '2026-10-14T18:00:00.000Z',
  repositorio: 'viniassuncao1/Portifolio-Vinicius-Machado',
  commits: [
    {
      sha: '703a632197fe451347b40e37227240fb799304ce',
      pais: [
        'cd6b4286d499ca607aaaa538f80d7185ff28a084',
        'd73fa64af45ddf93381b21ea355babe0d03c1248',
      ],
      autor: 'Vinicius Machado',
      data: '2026-10-14T13:54:42-03:00',
      assunto: 'Merge pull request #27 from viniassuncao1/feat/barras-e-icones-da-new-ui',
      pr: 27,
      branch: 'feat/barras-e-icones-da-new-ui',
    },
    {
      sha: 'd73fa64af45ddf93381b21ea355babe0d03c1248',
      pais: ['cd6b4286d499ca607aaaa538f80d7185ff28a084'],
      autor: 'Vinicius Machado',
      data: '2026-10-14T13:30:00-03:00',
      assunto: 'feat: encaixa a faixa e o painel escondível na casca',
    },
    {
      sha: 'cd6b4286d499ca607aaaa538f80d7185ff28a084',
      pais: [],
      autor: 'Vinicius Machado',
      data: '2026-10-13T10:00:00-03:00',
      assunto: 'chore: inicia o portfólio',
    },
  ],
};
const SITES = /drajulianamaluhy\.com|wattscompany\.com\.br/;

const responder = (corpo: unknown) => (rota: Route) =>
  rota.fulfill({ contentType: 'application/json', body: JSON.stringify(corpo) });

for (const [nome, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Busca, repositório e janela de preview no tema claro, ${nome}`, () => {
    test.use({ colorScheme: 'light', viewport });

    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    });

    test('a busca aberta é clara e não tem violações', async ({ page }) => {
      await abrirNoClaro(page, '/skills');
      await page.getByRole('button', { name: 'Buscar seção (Ctrl+P)' }).click();
      const dialogo = page.getByRole('dialog', { name: 'Buscar seção' });
      await expect(dialogo).toBeVisible();
      await expect(page.getByRole('combobox', { name: 'Buscar arquivo ou seção' })).toBeFocused();

      const caixa = await dialogo.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(contraste(caixa, 'rgb(43, 43, 43)')).toBeGreaterThan(3);
      expect(await violacoes(page)).toEqual([]);
    });

    test('a página do repositório é clara, com o histórico carregado, e não tem violações', async ({
      page,
    }) => {
      await page.route('**/git/historico.json', responder(HISTORICO));
      await abrirNoClaro(page, '/sobre-mim');
      await page.getByRole('button', { name: 'Branch master, abrir o repositório' }).click();
      await expect(page).toHaveURL(/\/repositorio$/);
      await expect(page.locator('main dl.numeros')).toBeVisible();

      const fundo = await page
        .locator('main app-repositorio')
        .evaluate((el) => getComputedStyle(el.closest('main') ?? el).backgroundColor);
      expect(contraste(fundo, 'rgb(255, 255, 255)')).toBeLessThan(2);
      expect(await violacoes(page)).toEqual([]);
    });

    test('a página do repositório com erro também passa no claro', async ({ page }) => {
      await page.route('**/git/historico.json', (rota) => rota.fulfill({ status: 500, body: '' }));
      await abrirNoClaro(page, '/sobre-mim');
      await page.getByRole('button', { name: 'Branch master, abrir o repositório' }).click();
      await expect(page.getByRole('alert')).toBeVisible();

      expect(await violacoes(page)).toEqual([]);
    });

    test('a janela de preview aberta é clara e não tem violações', async ({ page }) => {
      await page.route(SITES, (rota) =>
        rota.fulfill({
          contentType: 'text/html; charset=utf-8',
          body: '<!doctype html><html lang="pt-BR"><head><title>Site simulado</title></head><body><main><h1>Site simulado</h1></main></body></html>',
        }),
      );
      await abrirNoClaro(page, '/projeto-2');
      await page.getByRole('button', { name: 'Executar Projeto 2' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      expect(await dataTema(page)).toBe('claro');
      expect(await violacoes(page)).toEqual([]);
    });

    test('a árvore com as pastas abertas (e a gaveta, no celular) passa no claro', async ({
      page,
    }) => {
      await abrirNoClaro(page, '/');
      if (viewport.width < 768) {
        await page.getByRole('button', { name: 'Seções', exact: true }).click();
      }
      await abrirPastas(page);
      await expect(arquivoDaArvore(page, 'Sobre Mim')).toBeVisible();

      expect(await violacoes(page)).toEqual([]);
    });
  });
}
