import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { verBoasVindas } from './apoio';
import { expect, test } from './fixtures';

const TELA = 'app-tela-de-boas-vindas .tela';
const tela = (page: Page) => page.locator(TELA);
const editorPronto = (page: Page) =>
  expect(page.locator('main app-editor-de-codigo')).toHaveClass(/pronto/);

/**
 * Registra quando a tela entrou no DOM e quando saiu (`performance.now()`), para medir a duração
 * mínima e o teto sem depender do ritmo da máquina de teste.
 */
const medirTela = (page: Page) =>
  page.addInitScript(() => {
    const registro = { inicio: 0, fim: 0, estados: [] as string[] };
    (window as unknown as { __tela: typeof registro }).__tela = registro;
    new MutationObserver(() => {
      const el = document.querySelector('app-tela-de-boas-vindas .tela');
      if (el && !registro.inicio) registro.inicio = performance.now();
      if (el && !registro.estados.includes(el.getAttribute('data-estado') ?? '')) {
        registro.estados.push(el.getAttribute('data-estado') ?? '');
      }
      if (!el && registro.inicio && !registro.fim) registro.fim = performance.now();
    }).observe(document, { subtree: true, attributes: true, childList: true });
  });

const duracao = (page: Page) =>
  page.evaluate(() => {
    const r = (window as unknown as { __tela: { inicio: number; fim: number; estados: string[] } })
      .__tela;
    return { total: r.fim - r.inicio, fechou: r.fim > 0, estados: r.estados };
  });

/** Segura o fechamento: o teto de 2 s vira 10 min, e as fontes demoram, para a tela ficar aberta. */
const manterAberta = async (page: Page) => {
  await page.addInitScript(() => {
    const original = window.setTimeout.bind(window);
    window.setTimeout = ((acao: TimerHandler, ms?: number, ...resto: unknown[]) =>
      original(acao, ms === 2000 || ms === 1000 ? 600_000 : ms, ...resto)) as typeof setTimeout;
  });
  await page.route('**/*.woff*', async (rota) => {
    await new Promise((resolver) => setTimeout(resolver, 15_000));
    await rota.continue().catch(() => undefined);
  });
};

test.describe('Boas-vindas: primeira visita', () => {
  test.beforeEach(async ({ page }) => {
    await verBoasVindas(page);
  });

  test('mostra a foto, o nome, o cargo, a frase e a barra de carregamento', async ({ page }) => {
    await manterAberta(page);
    await page.goto('/sobre-mim', { waitUntil: 'domcontentloaded' });

    await expect(tela(page)).toBeVisible();
    // O cartão é decorativo (aria-hidden); quem lê o status ouve o texto "Carregando...".
    await expect(tela(page).locator('img[alt="Foto de Vinicius Machado"]')).toBeVisible();
    await expect(tela(page)).toContainText('Vinicius Machado');
    await expect(tela(page)).toContainText('Desenvolvedor Full Stack Júnior');
    await expect(tela(page)).toContainText('Seja bem-vindo ao meu portfólio');
    await expect(tela(page).locator('.barra .preenchimento')).toBeAttached();
    await expect(tela(page)).toContainText(
      /Starting PortfolioApplication|Initializing Spring|Started/,
    );
  });

  test('é um status com o texto "Carregando o portfólio de Vinicius Machado"', async ({ page }) => {
    await manterAberta(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('status').filter({ hasText: 'Carregando o portfólio de Vinicius Machado' }),
    ).toBeAttached();
    await expect(tela(page)).toHaveAttribute('role', 'status');
  });

  test('não tem botão de pular nem nenhum controle focável', async ({ page }) => {
    await manterAberta(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(tela(page)).toBeVisible();

    await expect(tela(page).getByRole('button')).toHaveCount(0);
    await expect(tela(page).getByRole('link')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /pular|skip/i })).toHaveCount(0);
  });

  test('não rouba o foco e deixa o resto da casca inerte só enquanto está aberta', async ({
    page,
  }) => {
    await manterAberta(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(tela(page)).toBeVisible();

    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY');
    expect(await page.evaluate(() => document.querySelectorAll('[inert]').length)).toBeGreaterThan(
      0,
    );
    // A própria tela (e o conteúdo, no DOM) não ficam inertes.
    expect(await tela(page).evaluate((el) => !!el.closest('[inert]'))).toBe(false);
    await expect(page.locator('main h1')).toBeAttached();
  });

  test('o conteúdo da página continua no DOM enquanto a tela está aberta', async ({ page }) => {
    await manterAberta(page);
    await page.goto('/sobre-mim', { waitUntil: 'domcontentloaded' });
    await expect(tela(page)).toBeVisible();

    await expect(page.getByRole('heading', { level: 1, includeHidden: true })).toHaveText(
      'Sobre Mim',
    );
    await expect(page.locator('main code')).toContainText('interface Desenvolvedor');
  });

  test('fecha sozinha em até 2 s, fica no mínimo 0,6 s e não deixa nada inerte', async ({
    page,
  }) => {
    await medirTela(page);
    await page.goto('/skills');
    await editorPronto(page);

    await expect(tela(page)).toHaveCount(0, { timeout: 4000 });
    const { total, fechou } = await duracao(page);

    expect(fechou).toBe(true);
    expect(total, 'duração mínima de 0,6 s').toBeGreaterThanOrEqual(600);
    // 2 s de teto + 0,2 s do fade de saída, com folga para uma máquina carregada.
    expect(total, 'teto de 2 s (mais o fade)').toBeLessThanOrEqual(2600);
    expect(await page.evaluate(() => document.querySelectorAll('[inert]').length)).toBe(0);
  });

  test('aos 2 s fecha mesmo que a página demore para ficar pronta (fontes lentas)', async ({
    page,
  }) => {
    await medirTela(page);
    await page.route('**/*.woff*', async (rota) => {
      await new Promise((resolver) => setTimeout(resolver, 6000));
      await rota.continue().catch(() => undefined);
    });
    await page.goto('/skills', { waitUntil: 'domcontentloaded' });

    await expect(tela(page)).toBeVisible();
    await expect(tela(page)).toHaveCount(0, { timeout: 4500 });
    const { total } = await duracao(page);

    expect(total).toBeGreaterThanOrEqual(1900);
    expect(total).toBeLessThanOrEqual(2700);
  });

  test('o fade de saída acontece (estado "saindo") e a barra chega ao fim', async ({ page }) => {
    await medirTela(page);
    await page.goto('/skills');
    await editorPronto(page);

    await expect(tela(page)).toHaveCount(0, { timeout: 4000 });

    expect((await duracao(page)).estados).toEqual(expect.arrayContaining(['aberta', 'saindo']));
  });

  test('depois que fecha, a barra de status avisa por 6 s "PortfolioApplication started in 1.8 s"', async ({
    page,
  }) => {
    await page.goto('/skills');
    const aviso = page.locator('app-barra-de-status .aviso');

    await expect(aviso).toHaveAttribute('aria-live', 'polite');
    await expect(aviso).toHaveText('PortfolioApplication started in 1.8 s', { timeout: 4000 });
    await expect(aviso).toHaveText('', { timeout: 8000 });
  });

  test('a janela de Run não abre sozinha depois das boas-vindas', async ({ page }) => {
    await page.goto('/skills');
    await expect(tela(page)).toHaveCount(0, { timeout: 4000 });

    await expect(page.locator('app-janela-de-run')).toHaveAttribute('data-aberto', 'false');
  });
});

test.describe('Boas-vindas: mesma sessão', () => {
  test('recarregar e abrir outra página não mostram a tela de novo', async ({ page }) => {
    await verBoasVindas(page);
    await medirTela(page);
    await page.goto('/skills');
    await expect(tela(page)).toHaveCount(0, { timeout: 4000 });

    await page.reload();
    await editorPronto(page);
    await page.goto('/sobre-mim');
    await editorPronto(page);

    await expect(tela(page)).toHaveCount(0);
    expect(await page.evaluate(() => sessionStorage.getItem('boas-vindas-exibida'))).toBe('1');
  });

  test('uma aba nova (sessão nova) mostra a tela de novo', async ({ browser }) => {
    const contexto = await browser.newContext();
    const pagina = await contexto.newPage();
    await verBoasVindas(pagina);
    await manterAberta(pagina);

    await pagina.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(tela(pagina)).toBeVisible();
    await contexto.close();
  });

  test('sem sessionStorage a tela aparece e o site segue funcionando', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get() {
          throw new DOMException('bloqueado', 'SecurityError');
        },
      });
    });
    await page.goto('/skills');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK');
    await expect(tela(page)).toHaveCount(0, { timeout: 4000 });
  });
});

test.describe('Boas-vindas: movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('aparece sem barra animada nem fade e fecha em até 1 s', async ({ page }) => {
    await verBoasVindas(page);
    await medirTela(page);
    await page.route('**/*.woff*', async (rota) => {
      await new Promise((resolver) => setTimeout(resolver, 6000));
      await rota.continue().catch(() => undefined);
    });
    await page.goto('/skills', { waitUntil: 'domcontentloaded' });
    await expect(tela(page)).toBeVisible();

    const preenchimento = tela(page).locator('.preenchimento');
    expect(await preenchimento.evaluate((el) => getComputedStyle(el).transitionDuration)).toMatch(
      /^0s(, 0s)*$/,
    );
    expect(await tela(page).evaluate((el) => getComputedStyle(el).animationName)).toBe('none');

    await expect(tela(page)).toHaveCount(0, { timeout: 3000 });
    const { total, estados } = await duracao(page);

    expect(total).toBeLessThanOrEqual(1400);
    expect(estados, 'sem estado de fade de saída').not.toContain('saindo');
  });
});

test.describe('Boas-vindas: conteúdo e HTML pré-renderizado', () => {
  test('o HTML de /sobre-mim tem o conteúdo da seção e não tem a tela', async ({ request }) => {
    const html = await (await request.get('/sobre-mim')).text();

    expect(html).toContain('Sobre Mim');
    expect(html).toContain('Sou desenvolvedor Full Stack');
    expect(html).toContain('<app-tela-de-boas-vindas');
    expect(html).not.toContain('Seja bem-vindo ao meu portfólio');
    expect(html).not.toContain('Carregando o portfólio');
    expect(html).not.toMatch(/class="tela"/);
    expect(html).not.toMatch(/\binert\b/);
  });

  test('sem JavaScript a tela não aparece e a página é usável', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/sobre-mim');

    await expect(pagina.locator(TELA)).toHaveCount(0);
    await expect(pagina.getByText('Seja bem-vindo ao meu portfólio')).toHaveCount(0);
    await expect(pagina.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
    expect(await pagina.evaluate(() => document.querySelectorAll('[inert]').length)).toBe(0);
    await contexto.close();
  });
});

for (const [nomeDaTela, viewport] of [
  ['desktop', { width: 1920, height: 1080 }],
  ['celular', { width: 390, height: 844 }],
] as const) {
  test.describe(`Boas-vindas no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      test(`passa no axe sem exclusões enquanto está aberta (${tema})`, async ({ page }) => {
        await verBoasVindas(page);
        await manterAberta(page);
        await page.emulateMedia({ colorScheme: tema });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await expect(tela(page)).toBeVisible();
        await expect(tela(page).locator('img')).toHaveJSProperty('complete', true);

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();

        expect(
          violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
        ).toEqual([]);
      });
    }

    test('o cartão cabe na tela, sem rolagem horizontal, e a foto tem tamanho fixo', async ({
      page,
    }) => {
      await verBoasVindas(page);
      await manterAberta(page);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(tela(page)).toBeVisible();

      const cartao = (await tela(page).locator('.cartao').boundingBox())!;
      const foto = (await tela(page).locator('img').boundingBox())!;
      const rolagem = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      );

      expect(cartao.x).toBeGreaterThanOrEqual(0);
      expect(cartao.x + cartao.width).toBeLessThanOrEqual(viewport.width);
      expect(cartao.y + cartao.height).toBeLessThanOrEqual(viewport.height);
      expect(foto.width).toBe(foto.height);
      expect(rolagem).toBe(true);
    });
  });
}
