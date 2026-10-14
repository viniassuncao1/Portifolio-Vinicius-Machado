import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { COR_DO_FOCO, COR_ROSA_ANTIGA, CORES_DE_SINTAXE, abrirHidratada } from './apoio';

const FUNDO_DO_EDITOR = 'rgb(30, 31, 34)';
const FUNDO_DO_PAINEL = 'rgb(43, 45, 48)';
const FUNDO_DA_LINHA_ATUAL = 'rgb(38, 40, 46)';
const CONTRASTE_AA = 4.5;
const ARVORE = 'nav[aria-label="Seções do portfólio"]';

/** Luminância relativa de "rgb(r, g, b)", como na WCAG 2. */
function luminancia(cor: string): number {
  const [r, g, b] = (cor.match(/\d+/g) ?? []).slice(0, 3).map((canal) => {
    const c = Number(canal) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores "rgb(r, g, b)". */
function contraste(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

const cor = (page: Page, seletor: string, propriedade: 'color' | 'backgroundColor' = 'color') =>
  page
    .locator(seletor)
    .first()
    .evaluate((el, p) => getComputedStyle(el)[p as 'color'], propriedade);

test.describe('Paleta Dark do IntelliJ New UI', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('o editor, o painel e as barras usam os fundos da New UI, sem degradê', async ({ page }) => {
    await page.goto('/skills');

    expect(await cor(page, 'body', 'backgroundColor')).toBe(FUNDO_DO_EDITOR);
    expect(await cor(page, 'app-editor-de-codigo', 'backgroundColor')).toBe(FUNDO_DO_EDITOR);
    expect(await cor(page, 'app-painel-lateral', 'backgroundColor')).toBe(FUNDO_DO_PAINEL);
    expect(await cor(page, 'app-barra-de-ferramentas', 'backgroundColor')).toBe(FUNDO_DO_PAINEL);
    for (const seletor of [
      'body',
      'app-painel-lateral',
      'app-barra-de-ferramentas',
      'app-faixa-de-abas',
      'app-barra-de-status',
      'app-editor-de-codigo',
    ]) {
      const imagem = await page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(imagem, seletor).toBe('none');
    }
  });

  test('o editor não tem cantos arredondados', async ({ page }) => {
    await page.goto('/skills');

    const raio = await page
      .locator('app-editor-de-codigo')
      .evaluate((el) => getComputedStyle(el).borderRadius);

    expect(raio).toBe('0px');
  });
});

test.describe('Fontes servidas pelo próprio site', () => {
  test('a Inter e a JetBrains Mono vêm do mesmo domínio, sem requisição a serviços de fontes', async ({
    page,
  }) => {
    const requisicoes: { tipo: string; url: string }[] = [];
    page.on('request', (r) => requisicoes.push({ tipo: r.resourceType(), url: r.url() }));

    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const fontes = requisicoes.filter(({ tipo, url }) => tipo === 'font' || /\.woff2?$/.test(url));
    expect(fontes.length).toBeGreaterThanOrEqual(2);
    expect(fontes.filter(({ url }) => !url.startsWith('http://localhost'))).toEqual([]);
    expect(fontes.some(({ url }) => /inter/i.test(url))).toBe(true);
    expect(fontes.some(({ url }) => /jetbrains-mono/i.test(url))).toBe(true);
    expect(
      requisicoes.filter(({ url }) =>
        /fonts\.(googleapis|gstatic)\.com|typekit|fontawesome/i.test(url),
      ),
    ).toEqual([]);
    expect(requisicoes.filter(({ url }) => !url.startsWith('http://localhost'))).toEqual([]);
  });

  test('as duas famílias carregam de fato (Inter e JetBrains Mono)', async ({ page }) => {
    await page.goto('/skills');
    await page.evaluate(() => document.fonts.ready);

    const carregadas = await page.evaluate(() =>
      Array.from(document.fonts)
        .filter((fonte) => fonte.status === 'loaded')
        .map((fonte) => fonte.family.replace(/"/g, '')),
    );

    expect(carregadas).toEqual(expect.arrayContaining(['Inter', 'JetBrains Mono']));
  });

  test('a interface usa a Inter e o código usa a JetBrains Mono', async ({ page }) => {
    await page.goto('/skills');
    const familia = (seletor: string) =>
      page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).fontFamily);

    expect(await familia(`${ARVORE} a`)).toMatch(/^"?Inter"?,/);
    expect(await familia('[role="tab"]')).toMatch(/^"?Inter"?,/);
    expect(await familia('[role="status"]')).toMatch(/^"?Inter"?,/);
    expect(await familia('main code')).toMatch(/^"?JetBrains Mono"?,/);
    expect(await familia('main .numeros')).toMatch(/^"?JetBrains Mono"?,/);
  });

  test('sem JavaScript o CSS já aponta as fontes do próprio domínio', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    const requisicoes: string[] = [];
    pagina.on('request', (r) => requisicoes.push(r.url()));

    await pagina.goto('/');
    await pagina.waitForLoadState('networkidle');

    expect(requisicoes.filter((url) => !url.startsWith('http://localhost'))).toEqual([]);
    await contexto.close();
  });
});

test.describe('Anel de foco azul de 2px', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  const anel = (page: Page) =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const estilo = getComputedStyle(el);
      return {
        estilo: estilo.outlineStyle,
        largura: estilo.outlineWidth,
        cor: estilo.outlineColor,
        tag: el.tagName,
        rotulo: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40) ?? el.tagName,
      };
    });

  test('o item da árvore focado pelo teclado mostra o anel azul de 2px', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    await page.locator(`${ARVORE} a[tabindex="0"]`).focus();
    await page.keyboard.press('ArrowDown');

    expect(await anel(page)).toMatchObject({ estilo: 'solid', largura: '2px', cor: COR_DO_FOCO });
  });

  test('a aba focada mostra o anel azul de 2px', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    await page.getByRole('tab', { name: 'Skills.java' }).focus();

    expect(await anel(page)).toMatchObject({ estilo: 'solid', largura: '2px', cor: COR_DO_FOCO });
  });

  test('os botões focados mostram o anel azul de 2px', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');

    for (const nome of ['Executar o projeto', 'Buscar seção (Ctrl+P)', 'Executar Projeto 2']) {
      await page.getByRole('button', { name: nome }).first().focus();

      expect(await anel(page), nome).toMatchObject({
        estilo: 'solid',
        largura: '2px',
        cor: COR_DO_FOCO,
      });
    }
  });

  test('os links do controle de páginas focados mostram o anel azul de 2px', async ({ page }) => {
    await abrirHidratada(page, '/skills');
    await page.getByRole('link', { name: 'Próxima página' }).focus();

    expect(await anel(page)).toMatchObject({ estilo: 'solid', largura: '2px', cor: COR_DO_FOCO });
  });

  test('todo controle alcançado por Tab tem o anel azul de 2px', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');
    const vistos = new Set<string>();

    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const foco = await anel(page);
      if (foco.tag === 'BODY') continue;
      vistos.add(foco.rotulo);
      expect(foco, `Tab ${i + 1} (${foco.rotulo})`).toMatchObject({
        estilo: 'solid',
        largura: '2px',
        cor: COR_DO_FOCO,
      });
    }

    expect(vistos.size).toBeGreaterThanOrEqual(5);
  });

  test('nenhum elemento da página usa o rosa antigo', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');
    await page.getByRole('button', { name: 'Executar Projeto 2' }).focus();

    const comRosa = await page.evaluate((rosa) => {
      const propriedades = [
        'color',
        'backgroundColor',
        'borderTopColor',
        'borderBottomColor',
        'borderLeftColor',
        'borderRightColor',
        'outlineColor',
      ] as const;
      return Array.from(document.querySelectorAll('*'))
        .filter((el) => propriedades.some((p) => getComputedStyle(el)[p] === rosa))
        .map((el) => el.tagName + '.' + el.className);
    }, COR_ROSA_ANTIGA);

    expect(comRosa).toEqual([]);
  });

  test('os estilos publicados não citam o rosa antigo (#de60d2)', async ({ page, request }) => {
    await page.goto('/');
    const folhas = await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links) => links.map((l) => (l as HTMLLinkElement).href));
    const estilos = await page.evaluate(() =>
      Array.from(document.querySelectorAll('style'), (s) => s.textContent ?? ''),
    );

    for (const href of folhas) estilos.push(await (await request.get(href)).text());

    expect(estilos.length).toBeGreaterThan(0);
    expect(estilos.join('\n')).not.toMatch(/de60d2|222,\s*96,\s*210/i);
  });
});

test.describe('Ajustes nativos do navegador', () => {
  test('o HTML declara color-scheme dark para controles e barras de rolagem nativos', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const esquema = await page.evaluate(
      () => getComputedStyle(document.documentElement).colorScheme,
    );

    expect(esquema).toContain('dark');
    expect(esquema).not.toContain('light');
  });

  test('o theme-color é o fundo dos painéis (#2B2D30), já no HTML pré-renderizado', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();

    for (const rota of ['/', '/skills', '/projeto-4/3']) {
      await pagina.goto(rota);

      const tema = await pagina.locator('head meta[name="theme-color"]').getAttribute('content');
      expect(tema?.toLowerCase(), rota).toBe('#2b2d30');
    }
    await contexto.close();
  });

  test('o theme-color acompanha o fundo real dos painéis', async ({ page }) => {
    await page.goto('/');

    const tema = await page.locator('head meta[name="theme-color"]').getAttribute('content');
    const fundo = await cor(page, 'app-painel-lateral', 'backgroundColor');

    expect(fundo).toBe('rgb(43, 45, 48)');
    expect(tema?.toLowerCase()).toBe('#2b2d30');
  });

  test('os números de linha e a posição da barra de status usam números tabulares', async ({
    page,
  }) => {
    await page.goto('/skills');

    const variante = (seletor: string) =>
      page
        .locator(seletor)
        .first()
        .evaluate((el) => getComputedStyle(el).fontVariantNumeric);

    expect(await variante('main .numeros span')).toContain('tabular-nums');
    expect(await variante('[role="status"] .posicao')).toContain('tabular-nums');
  });

  test('o bloco de código não é traduzido pelo tradutor do navegador', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();

    for (const rota of ['/', '/sobre-mim', '/skills/3', '/depoimentos']) {
      await pagina.goto(rota);

      await expect(pagina.locator('main pre'), rota).toHaveAttribute('translate', 'no');
      expect(await pagina.locator('main pre').evaluate((el: HTMLElement) => el.translate)).toBe(
        false,
      );
    }
    await contexto.close();
  });

  test('os números de linha continuam escondidos dos leitores de tela e passam em 4,5:1', async ({
    page,
  }) => {
    await page.goto('/skills');
    const numero = await cor(page, 'main .numeros span');

    await expect(page.locator('main .numeros')).toHaveAttribute('aria-hidden', 'true');
    for (const fundo of [FUNDO_DO_EDITOR, FUNDO_DA_LINHA_ATUAL]) {
      expect(contraste(numero, fundo), `${numero} sobre ${fundo}`).toBeGreaterThanOrEqual(
        CONTRASTE_AA,
      );
    }
  });
});

test.describe('Cores de sintaxe com contraste AA', () => {
  const ROTAS = ['/', '/sobre-mim', '/diferenciais', '/projeto-1', '/eventos', '/skills'];

  /** Cor de cada papel de sintaxe, lida das páginas que o usam. */
  async function coresPorPapel(page: Page): Promise<Record<string, Set<string>>> {
    const mapa: Record<string, Set<string>> = {};
    for (const rota of ROTAS) {
      await page.goto(rota);
      const lidas = await page.evaluate(() =>
        Array.from(document.querySelectorAll('main code [class^="papel-"]'), (el) => ({
          papel: el.className.split(' ')[0],
          cor: getComputedStyle(el).color,
        })),
      );
      for (const { papel, cor: valor } of lidas) (mapa[papel] ??= new Set()).add(valor);
    }
    return mapa;
  }

  test('cada papel de sintaxe tem a cor da paleta New UI, e só ela', async ({ page }) => {
    const mapa = await coresPorPapel(page);

    expect([...mapa['papel-palavra-chave']]).toEqual([CORES_DE_SINTAXE.palavraChave]);
    expect([...mapa['papel-declaracao']]).toEqual([CORES_DE_SINTAXE.campo]);
    expect([...mapa['papel-literal']]).toEqual([CORES_DE_SINTAXE.literal]);
    expect([...mapa['papel-valor']]).toEqual([CORES_DE_SINTAXE.valor]);
    expect([...mapa['papel-anotacao']]).toEqual([CORES_DE_SINTAXE.anotacao]);
    expect([...mapa['papel-comentario']]).toEqual([CORES_DE_SINTAXE.comentario]);
  });

  test('todas as cores de sintaxe e o texto passam em 4,5:1 sobre o editor e a linha atual', async ({
    page,
  }) => {
    const mapa = await coresPorPapel(page);
    const cores = new Set([...Object.values(mapa).flatMap((c) => [...c])]);

    expect(cores.size).toBeGreaterThanOrEqual(6);
    for (const texto of cores) {
      for (const fundo of [FUNDO_DO_EDITOR, FUNDO_DA_LINHA_ATUAL]) {
        expect(contraste(texto, fundo), `${texto} sobre ${fundo}`).toBeGreaterThanOrEqual(
          CONTRASTE_AA,
        );
      }
    }
  });

  test('o texto da árvore, das abas e da barra de status passa em 4,5:1 sobre o painel', async ({
    page,
  }) => {
    await page.goto('/skills');

    for (const seletor of [
      `${ARVORE} a`,
      '[role="tab"]',
      '[role="status"] .arquivo',
      '[role="status"] .item',
    ]) {
      const texto = await cor(page, seletor);
      const fundo =
        seletor === '[role="tab"]' ? await cor(page, seletor, 'backgroundColor') : FUNDO_DO_PAINEL;
      const base = /rgba\(.*, 0\)/.test(fundo) ? FUNDO_DO_PAINEL : fundo;

      expect(contraste(texto, base), `${seletor}: ${texto} sobre ${base}`).toBeGreaterThanOrEqual(
        CONTRASTE_AA,
      );
    }
  });

  test('o verificador de contraste acerta valores conhecidos', () => {
    expect(contraste('rgb(255, 255, 255)', 'rgb(0, 0, 0)')).toBeCloseTo(21, 0);
    expect(contraste('rgb(111, 115, 122)', FUNDO_DO_EDITOR)).toBeCloseTo(3.46, 1);
    expect(contraste('rgb(188, 190, 196)', FUNDO_DO_EDITOR)).toBeCloseTo(8.87, 1);
  });
});
