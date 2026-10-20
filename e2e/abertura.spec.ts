import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';

import {
  CLASSES_COMPILADAS,
  CLIQUE_ATE_O_PORTFOLIO_MS,
  INICIO_DA_REVELACAO_MS,
  INSTANTE_DO_STARTED_MS,
  LINHA_DO_TEMPO,
  caminhoDaClasse,
} from '../src/app/core/linha-do-tempo-da-abertura';
import { verAbertura } from './apoio';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };
const T = LINHA_DO_TEMPO;
const AVISO = 'PortfolioApplication started in 1.8 s';

const abertura = (page: Page) => page.locator('app-abertura .abertura');
const dialogo = (page: Page) => page.getByRole('dialog', { name: 'Vinicius Machado' });
const botaoRun = (page: Page) =>
  page
    .getByRole('button', { name: 'Executar PortfolioApplication' })
    .and(page.locator('app-abertura button'));
const janela = (page: Page) =>
  page.getByRole('region', { name: 'Execução do PortfolioApplication' });
const avisoDaBarra = (page: Page) => page.locator('app-barra-de-status .aviso');
/**
 * Espera a fase. Com o relógio parado a página só repinta quando ele anda, então cada tentativa dá
 * um passo curto nele (16 ms, um quadro): o suficiente para o Angular aplicar o que mudou.
 */
const faseDe = (page: Page, fase: string) =>
  expect
    .poll(
      async () => {
        await page.clock.runFor(16);
        return abertura(page).getAttribute('data-fase');
      },
      { message: `fase "${fase}"` },
    )
    .toBe(fase);

/** Fase sem mexer no relógio: antes de ele parar e nos testes que não o usam. */
const faseSemRelogio = (page: Page, fase: string) =>
  expect(abertura(page)).toHaveAttribute('data-fase', fase);

/** Quantos `[inert]` há na página: a casca fica inerte da abertura até a revelação. */
const inertes = (page: Page) => page.evaluate(() => document.querySelectorAll('[inert]').length);
const focado = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return `${el?.tagName}${el?.closest('app-abertura') ? ' (abertura)' : ''}`;
  });

/**
 * Primeira visita de verdade a `/` com o relógio do navegador sob controle: espera a abertura
 * começar (o app hidratar) e congela o tempo. Dali em diante só `avancar` mexe nos relógios, então
 * as fases e os tempos não dependem da velocidade da máquina. Os keyframes de CSS seguem em tempo
 * real (o relógio falso não os controla).
 */
async function abrirComRelogio(page: Page, url = '/'): Promise<void> {
  await verAbertura(page);
  await iniciarComRelogioParado(page, url);
  await esperarAAbertura(page);
}

/** Relógio falso já parado quando a página nasce: nenhum tempo corre antes de `avancar`. */
async function iniciarComRelogioParado(page: Page, url: string, opcoes = {}): Promise<void> {
  await page.clock.install({ time: new Date('2026-10-15T10:00:00') });
  await page.clock.pauseAt(new Date('2026-10-15T10:00:01'));
  await page.goto(url, opcoes);
}

/** O app hidrata em tempo real; o relógio falso só anda aos poucos, até a abertura começar. */
async function esperarAAbertura(page: Page, fase = 'splash'): Promise<void> {
  for (let i = 0; i < 400; i++) {
    if ((await abertura(page).getAttribute('data-fase')) === fase) return;
    await page.clock.runFor(10);
    await page.waitForTimeout(25);
  }
  await faseSemRelogio(page, fase);
}

/**
 * Anda o relógio e deixa a página assentar: a View Transition da revelação chama de volta num
 * quadro de verdade (tempo real), e o Angular só repinta com o relógio andando.
 */
async function avancar(page: Page, ms: number): Promise<void> {
  await page.clock.runFor(ms);
  await page.waitForTimeout(60);
  await page.clock.runFor(30);
}
const assentar = (page: Page) => avancar(page, 10);

/** Leva a abertura até o ▶ pronto (o splash dura 3 s). */
async function ateOPronto(page: Page): Promise<void> {
  await avancar(page, T.splash + 100);
  await faseDe(page, 'pronto');
}

/** Executa pelo clique e devolve o tempo até o portfólio (derivado da linha do tempo). */
async function executar(page: Page): Promise<void> {
  await botaoRun(page).click();
  await assentar(page);
  await faseDe(page, 'compilando');
}

/**
 * O axe usa `setTimeout` dentro da página, que o relógio parado não dispara. Enquanto ele roda, o
 * relógio anda 2 ms por vez: o suficiente para o axe terminar e quase nada para as fases (que
 * duram centenas de ms).
 */
async function analisar(page: Page) {
  let terminou = false;
  const analise = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
    .finally(() => (terminou = true));
  while (!terminou) {
    await page.clock.runFor(2).catch(() => undefined);
    await page.waitForTimeout(5);
  }
  return analise;
}

/** Espera os keyframes (de duração finita) acabarem: o axe não mede uma fade no meio. */
const semAnimacoes = (page: Page) =>
  expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity,
            ).length,
      ),
    )
    .toBe(0);

test.describe('Abertura: splash', () => {
  test('a primeira visita a / mostra o cartão: foto, nome, cargo, frase e a barra de carregamento', async ({
    page,
  }) => {
    await abrirComRelogio(page);

    await expect(dialogo(page)).toBeVisible();
    await expect(dialogo(page)).toHaveAttribute('aria-modal', 'true');
    await expect(dialogo(page).locator('img[alt="Foto de Vinicius Machado"]')).toBeVisible();
    await expect(dialogo(page)).toContainText('Vinicius Machado');
    await expect(dialogo(page)).toContainText('Desenvolvedor Full Stack');
    await expect(dialogo(page)).toContainText('Seja bem-vindo ao meu portfólio');
    await expect(dialogo(page).locator('.barra .preenchimento')).toBeAttached();
  });

  test('a barra avança pelas etapas da IDE em degraus, e o texto é o do IntelliJ', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    const etapa = dialogo(page).locator('.etapa');
    const progresso = () =>
      dialogo(page)
        .locator('.preenchimento')
        .evaluate((el) => Number(el.style.getPropertyValue('--p')));

    await avancar(page, 650);
    await expect(etapa).toHaveText('Opening Portfolio_Vinicius…');
    expect(await progresso()).toBeCloseTo(0.25);
    await avancar(page, 650);
    await expect(etapa).toHaveText('Resolving Gradle dependencies…');
    expect(await progresso()).toBeCloseTo(0.5);
    await avancar(page, 650);
    await expect(etapa).toHaveText(`Indexing ${CLASSES_COMPILADAS.length} Java classes…`);
    expect(await progresso()).toBeCloseTo(0.8);
    await avancar(page, 1300);
    await expect(etapa).toHaveText('Project ready');
    expect(await progresso()).toBe(1);
  });

  test('o splash dura 3 s: antes disso é splash e logo depois o ▶ está pronto', async ({
    page,
  }) => {
    await abrirComRelogio(page);

    await avancar(page, T.splash - 400);
    await faseDe(page, 'splash');
    await avancar(page, 600);

    await faseDe(page, 'pronto');
  });

  test('com rede lenta (fontes que não chegam) o splash passa de 3 s mas nunca de 5 s', async ({
    page,
  }) => {
    await page.route('**/*.woff*', async (rota) => {
      await new Promise((resolver) => setTimeout(resolver, 30_000));
      await rota.continue().catch(() => undefined);
    });
    await verAbertura(page);
    await iniciarComRelogioParado(page, '/', { waitUntil: 'domcontentloaded' });
    await esperarAAbertura(page);

    await avancar(page, T.splash + 600);
    await faseDe(page, 'splash');
    await avancar(page, T.tetoDoSplash - T.splash - 600 + 200);

    await faseDe(page, 'pronto');
  });

  test('não rouba o foco, deixa o resto da casca inerte e mantém o conteúdo no DOM', async ({
    page,
  }) => {
    await abrirComRelogio(page);

    expect(await focado(page)).toBe('BODY');
    expect(await inertes(page)).toBeGreaterThan(0);
    await expect(page.getByRole('heading', { level: 1, includeHidden: true })).toBeAttached();
    expect(await dialogo(page).evaluate((el) => !!el.closest('[inert]'))).toBe(false);
  });

  test('o primeiro quadro já tem data-abertura em /, e não em link direto nem na mesma sessão', async ({
    page,
    browser,
  }) => {
    const marcar = (alvo: Page) =>
      alvo.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => {
          (window as unknown as { __abertura: boolean }).__abertura =
            document.documentElement.hasAttribute('data-abertura');
        });
      });
    const lido = (alvo: Page) =>
      alvo.evaluate(() => (window as unknown as { __abertura: boolean }).__abertura);

    await verAbertura(page);
    await marcar(page);
    await page.goto('/');
    expect(await lido(page), '/ na primeira visita').toBe(true);

    const direto = await browser.newContext();
    const pagina = await direto.newPage();
    await verAbertura(pagina);
    await marcar(pagina);
    await pagina.goto('/skills');
    expect(await lido(pagina), 'link direto').toBe(false);
    await direto.close();
  });
});

test.describe('Abertura: pronto para executar', () => {
  test('o ▶ "Executar PortfolioApplication" fica focado, com o atalho do sistema anunciado', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);
    // O foco vai ao ▶ depois do próximo render e a entrada do widget anima em tempo real: dá
    // quadros ao relógio até o foco chegar e espera os keyframes acabarem antes de medir.
    await expect
      .poll(async () => {
        await page.clock.runFor(16);
        return focado(page);
      })
      .toBe('BUTTON (abertura)');
    await expect(botaoRun(page)).toBeFocused();
    await semAnimacoes(page);
    await expect(botaoRun(page)).toHaveAttribute('aria-keyshortcuts', /^(Control\+R|Shift\+F10)$/);
    const mac = await page.evaluate(() => /mac|iphone|ipad/i.test(navigator.platform));
    await expect(dialogo(page).locator('kbd.atalho')).toHaveText(mac ? '⌃R' : '⇧F10');
    await expect(dialogo(page).locator('[aria-live]')).toContainText('Projeto carregado');
    // A área de toque tem 44 px: o botão tem 36 e um pseudo-elemento cobre o resto.
    const caixa = (await botaoRun(page).boundingBox())!;
    const cx = caixa.x + caixa.width / 2;
    const cy = caixa.y + caixa.height / 2;
    for (const [dx, dy] of [
      [-21, -21],
      [21, -21],
      [-21, 21],
      [21, 21],
    ]) {
      const acerta = await page.evaluate(
        ([x, y]) => !!document.elementFromPoint(x, y)?.closest('app-abertura .botao-run'),
        [cx + dx, cy + dy],
      );
      expect(acerta, `ponto (${dx}, ${dy}) do alvo de toque`).toBe(true);
    }
  });

  test('a dica "Executando sozinho em instantes…" aparece 3 s depois de pronto', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);

    await avancar(page, T.dicaEm - 500);
    await expect(dialogo(page)).not.toContainText('Executando sozinho em instantes');
    await avancar(page, 700);

    await expect(dialogo(page)).toContainText('Executando sozinho em instantes…');
  });

  test('Enter no ▶ executa', async ({ page }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);

    await page.keyboard.press('Enter');
    await assentar(page);

    await faseDe(page, 'compilando');
  });

  test('o atalho do IntelliJ executa (⌃R no Mac, ⇧F10 nos outros)', async ({ page }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);
    const mac = await page.evaluate(() => /mac|iphone|ipad/i.test(navigator.platform));

    await page.keyboard.press(mac ? 'Control+r' : 'Shift+F10');
    await assentar(page);

    await faseDe(page, 'compilando');
  });

  test('o clique no ▶ executa', async ({ page }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);

    await botaoRun(page).click();
    await assentar(page);

    await faseDe(page, 'compilando');
  });

  test('sem clique, a execução começa sozinha 5 s depois de pronto', async ({ page }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);

    await avancar(page, T.execucaoAutomatica - 700);
    await faseDe(page, 'pronto');
    await avancar(page, 900);

    await faseDe(page, 'compilando');
  });

  test('o Tab não escapa da abertura e as teclas de atalho só valem com o ▶ pronto', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    const mac = await page.evaluate(() => /mac|iphone|ipad/i.test(navigator.platform));

    // No splash o atalho não faz nada.
    await page.keyboard.press(mac ? 'Control+r' : 'Shift+F10');
    await assentar(page);
    await faseDe(page, 'splash');
    await ateOPronto(page);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await focado(page)).not.toMatch(/^(A|BUTTON|INPUT|MAIN)$/);
    }
  });
});

test.describe('Abertura: execução, build e Spring', () => {
  test('a janela Build/Run recebe o foco e compila uma classe por seção, na ordem da árvore', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);

    await executar(page);

    await expect(janela(page)).toBeFocused();
    await avancar(page, T.compileJava + 100);
    await expect(janela(page)).toContainText('> Task :compileJava');
    await avancar(page, 1200);
    const arquivos = janela(page).locator('.arquivo');
    expect(await arquivos.count()).toBeGreaterThan(5);
    await expect(arquivos.first()).toContainText(caminhoDaClasse(CLASSES_COMPILADAS[0]));
    await avancar(page, T.trocaParaRun - 1300);
    await expect(arquivos).toHaveCount(CLASSES_COMPILADAS.length);
    await expect(arquivos.last()).toContainText('PortfolioApplication.java');
    expect(
      CLASSES_COMPILADAS.length,
      'uma classe por seção, mais PortfolioApplication',
    ).toBeGreaterThan(16);
  });

  test('depois do compileJava vêm :processResources, :classes e :bootRun, e a aba troca para Run', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);
    await executar(page);

    await avancar(page, (T.tarefas.at(-1)?.em ?? T.trocaParaRun) + 60);
    for (const tarefa of ['compileJava', 'processResources', 'classes', 'bootRun']) {
      await expect(janela(page)).toContainText(`> Task :${tarefa}`);
    }
    await avancar(page, T.trocaParaRun + 100);

    await faseDe(page, 'iniciando');
    await expect(janela(page).locator('.aba.ativa')).toHaveText('Run: PortfolioApplication');
  });

  test('o log do Spring mostra o banner e termina em "Started PortfolioApplication"', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);
    await executar(page);

    await avancar(page, T.banner + 200);
    await expect(janela(page).locator('.log')).toContainText(':: Spring Boot ::');
    await expect(janela(page).locator('.log')).not.toContainText('Started PortfolioApplication');
    await avancar(page, INSTANTE_DO_STARTED_MS - T.banner + 100);

    await expect(janela(page).locator('.log')).toContainText('Started PortfolioApplication');
    await expect(dialogo(page).locator('[aria-live]')).toContainText('Portfólio pronto');
  });

  test('do clique ao portfólio leva no máximo 5 s: o Início aparece, a abertura sai e o foco vai ao editor', async ({
    page,
  }) => {
    expect(CLIQUE_ATE_O_PORTFOLIO_MS).toBeLessThanOrEqual(T.tetoDaExecucao);
    await abrirComRelogio(page);
    await ateOPronto(page);
    await executar(page);

    await avancar(page, INICIO_DA_REVELACAO_MS - 300);
    await faseDe(page, 'iniciando');
    await avancar(page, 400);
    await faseDe(page, 'revelando');
    expect(await inertes(page), 'a casca volta a responder na revelação').toBe(0);
    await avancar(page, T.fimDaRevelacao + 100);

    await expect(page.locator('html')).not.toHaveAttribute('data-abertura', '');
    await expect(dialogo(page)).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Vinicius Machado/);
    expect(await focado(page)).toBe('MAIN');
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('a barra de status avisa "PortfolioApplication started in 1.8 s" por 6 s depois da abertura', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    await ateOPronto(page);
    await executar(page);
    await avancar(page, CLIQUE_ATE_O_PORTFOLIO_MS + 200);

    await expect(avisoDaBarra(page)).toHaveText(AVISO);
    await expect(avisoDaBarra(page)).toHaveAttribute('aria-live', 'polite');
    await avancar(page, T.tetoDoAviso - 500);
    await expect(avisoDaBarra(page)).toHaveText(AVISO);
    await avancar(page, 800);

    await expect(avisoDaBarra(page)).toHaveText('');
  });

  test('os anúncios para leitor de tela são só os marcos, não o log linha a linha', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    const viva = page.locator('app-abertura [aria-live]');
    const vistos: string[] = [];
    const ler = async () => {
      const texto = ((await viva.textContent()) ?? '').trim();
      if (texto && vistos.at(-1) !== texto) vistos.push(texto);
    };

    await ler();
    await ateOPronto(page);
    await ler();
    await executar(page);
    await ler();
    for (let i = 0; i < 10; i++) {
      await avancar(page, 450);
      await ler();
    }

    expect(vistos[0]).toContain('Carregando o portfólio de Vinicius Machado');
    expect(vistos.join(' | ')).toMatch(
      /Projeto carregado.*Compilando \d+ classes.*Iniciando o Spring Boot.*Portfólio pronto/,
    );
    expect(vistos.length, 'poucos marcos, não uma mensagem por linha').toBeLessThanOrEqual(6);
  });

  test('o foco acompanha as fases: corpo, ▶, janela de execução e, no fim, o editor', async ({
    page,
  }) => {
    await abrirComRelogio(page);
    expect(await focado(page)).toBe('BODY');
    await ateOPronto(page);
    expect(await focado(page)).toBe('BUTTON (abertura)');
    await executar(page);
    expect(await focado(page)).toBe('SECTION (abertura)');
    // Em duas etapas: a revelação entra num quadro de verdade (View Transition) e só depois sai.
    await avancar(page, INICIO_DA_REVELACAO_MS + 200);
    await faseDe(page, 'revelando');
    await avancar(page, T.fimDaRevelacao + 300);
    await faseDe(page, 'encerrada');

    await expect.poll(() => focado(page)).toBe('MAIN');
  });
});

test.describe('Abertura: sem pular e com teto', () => {
  test('não há botão de pular em nenhuma fase e o Esc não fecha nada', async ({ page }) => {
    await abrirComRelogio(page);
    const pular = page
      .locator('app-abertura')
      .getByRole('button', { name: /pular|skip|fechar|close/i });

    await expect(pular).toHaveCount(0);
    await page.keyboard.press('Escape');
    await assentar(page);
    await faseDe(page, 'splash');

    await ateOPronto(page);
    await expect(pular).toHaveCount(0);
    await page.keyboard.press('Escape');
    await assentar(page);
    await faseDe(page, 'pronto');

    await executar(page);
    await expect(pular).toHaveCount(0);
    await page.keyboard.press('Escape');
    await assentar(page);
    await expect(abertura(page)).not.toHaveAttribute('data-fase', 'encerrada');
    await expect(abertura(page)).not.toHaveAttribute('data-fase', 'revelando');
  });

  test('o pior caso sem nenhum clique leva cerca de 12 s e termina no portfólio', async ({
    page,
  }) => {
    await abrirComRelogio(page);

    await avancar(page, T.splash + T.execucaoAutomatica + CLIQUE_ATE_O_PORTFOLIO_MS + 300);

    await expect(dialogo(page)).toBeHidden();
    await expect(page.getByRole('main')).toBeVisible();
    expect(await inertes(page)).toBe(0);
  });
});

test.describe('Abertura: uma vez por sessão e só em /', () => {
  test('depois da abertura, recarregar e voltar a / não mostram nada', async ({ page }) => {
    await abrirComRelogio(page);
    await avancar(page, T.splash + T.execucaoAutomatica + CLIQUE_ATE_O_PORTFOLIO_MS + 300);
    await expect(dialogo(page)).toBeHidden();

    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
    await expect(page.locator('html')).not.toHaveAttribute('data-abertura', '');
    await expect(dialogo(page)).toBeHidden();
    await page.goto('/');

    await expect(page.locator('html')).not.toHaveAttribute('data-abertura', '');
    await expect(dialogo(page)).toBeHidden();
    expect(await page.evaluate(() => sessionStorage.getItem('abertura-exibida'))).toBe('1');
  });

  for (const rota of ['/projeto-2', '/contato', '/projeto-5']) {
    test(`link direto para ${rota}: vai ao conteúdo, sem abertura, só com o aviso na barra de status`, async ({
      page,
    }) => {
      await verAbertura(page);
      await page.clock.install();
      await page.goto(rota);

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('html')).not.toHaveAttribute('data-abertura', '');
      await expect(dialogo(page)).toBeHidden();
      await expect(avisoDaBarra(page)).toHaveText(AVISO);
      expect(await inertes(page)).toBe(0);
      expect(await page.evaluate(() => sessionStorage.getItem('abertura-exibida'))).toBe('1');
      await page.clock.runFor(T.tetoDoAviso + 300);
      await expect(avisoDaBarra(page)).toHaveText('');
    });
  }

  test('quem entrou por um link direto e depois vai a / não vê a abertura (já é a mesma sessão)', async ({
    page,
  }) => {
    await verAbertura(page);
    await page.goto('/contato');
    await expect(avisoDaBarra(page)).toHaveText(AVISO);

    await page.goto('/');

    await expect(page.locator('html')).not.toHaveAttribute('data-abertura', '');
    await expect(dialogo(page)).toBeHidden();
  });

  test('uma sessão nova (outra aba) volta a mostrar a abertura em /', async ({ browser }) => {
    const contexto = await browser.newContext();
    const pagina = await contexto.newPage();
    await verAbertura(pagina);

    await pagina.goto('/');

    await expect(pagina.locator('app-abertura .abertura')).toHaveAttribute('data-fase', 'splash');
    await contexto.close();
  });

  test('sem sessionStorage a abertura aparece e o site segue funcionando', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get() {
          throw new DOMException('bloqueado', 'SecurityError');
        },
      });
    });
    await iniciarComRelogioParado(page, '/');
    await expect(page.getByRole('heading', { level: 1, includeHidden: true })).toBeAttached();
    await esperarAAbertura(page);
    await avancar(page, T.splash + T.execucaoAutomatica + CLIQUE_ATE_O_PORTFOLIO_MS + 2000);
    await expect(dialogo(page)).toBeHidden();
  });
});

test.describe('Abertura: sem JavaScript', () => {
  test('o HTML de / não liga a abertura e traz o conteúdo do Início', async ({ request }) => {
    const html = await (await request.get('/')).text();

    expect(html).toContain('Vinicius Machado');
    expect(html).toContain('PortfolioApplication');
    expect(html).not.toMatch(/<html[^>]*data-abertura/);
    // O marcado da abertura vai no HTML, mas só aparece com `html[data-abertura]` (feito por JS).
  });

  test('sem JavaScript a página abre direto: sem diálogo, sem inert e com o conteúdo', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/');

    await expect(pagina.getByRole('dialog')).toHaveCount(0);
    await expect(pagina.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(pagina.getByRole('main')).toBeVisible();
    expect(await pagina.evaluate(() => document.querySelectorAll('[inert]').length)).toBe(0);
    await contexto.close();
  });
});

test.describe('Abertura: movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('as mesmas etapas, sem esperar: o ▶ fica pronto de imediato, com a barra cheia', async ({
    page,
  }) => {
    await verAbertura(page);
    await iniciarComRelogioParado(page, '/');
    await esperarAAbertura(page, 'pronto');

    await expect(dialogo(page).locator('.etapa')).toHaveText('Project ready');
    await expect(botaoRun(page)).toBeFocused();
    expect(
      await dialogo(page)
        .locator('.preenchimento')
        .evaluate((el) => el.style.getPropertyValue('--p')),
    ).toBe('1');
  });

  test('executar mostra o build e o log completos de uma vez, e a IDE surge sem deslocamento', async ({
    page,
  }) => {
    await verAbertura(page);
    await iniciarComRelogioParado(page, '/');
    await esperarAAbertura(page, 'pronto');

    await botaoRun(page).click();
    await assentar(page);

    await faseDe(page, 'iniciando');
    await expect(janela(page).locator('.arquivo')).toHaveCount(CLASSES_COMPILADAS.length);
    await expect(janela(page).locator('.log')).toContainText('Started PortfolioApplication');
    // Uma pausa para ler o log completo, e então um fade curto: sem deslocamento nem animação longa.
    await avancar(page, T.reduzido.pausaDeLeitura - 500);
    await faseDe(page, 'iniciando');
    await avancar(page, 500 + T.reduzido.fade + 300);

    await expect(dialogo(page)).toBeHidden();
    await expect(page.getByRole('main')).toBeVisible();
    expect(await focado(page)).toBe('MAIN');
    await expect(avisoDaBarra(page)).toHaveText(AVISO);
  });

  test('nenhuma animação de movimento: só opacidade, de até 150 ms', async ({ page }) => {
    await verAbertura(page);
    await page.goto('/');
    await faseDe(page, 'pronto');

    const animacoes = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => (a.effect as KeyframeEffect | null)?.target?.closest?.('app-abertura'))
        .map((a) => ({
          nome: (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty,
          duracao: Number(a.effect?.getTiming().duration ?? 0),
          infinita: a.effect?.getTiming().iterations === Infinity,
        })),
    );

    for (const animacao of animacoes) {
      expect(animacao.infinita, animacao.nome).toBe(false);
      expect(animacao.duracao, animacao.nome).toBeLessThanOrEqual(150);
      expect(animacao.nome, 'só opacidade').toMatch(/opacity|fade|sumir|aparecer|^$/i);
    }
    expect(
      await page
        .locator('app-abertura .botao-run')
        .evaluate((el) => el.classList.contains('pulso')),
    ).toBe(false);
  });

  test('a execução automática continua valendo 5 s depois de pronto', async ({ page }) => {
    await verAbertura(page);
    await iniciarComRelogioParado(page, '/');
    await esperarAAbertura(page, 'pronto');

    await avancar(page, T.execucaoAutomatica - 700);
    await faseDe(page, 'pronto');
    await avancar(page, 900);

    await faseDe(page, 'iniciando');
  });
});

/** Cada fase em que o axe mede: como chegar a ela com o relógio parado. */
const FASES: readonly {
  nome: string;
  fase: string;
  chegar: (page: Page) => Promise<void>;
}[] = [
  { nome: 'splash', fase: 'splash', chegar: (page) => avancar(page, 1500) },
  { nome: 'pronto', fase: 'pronto', chegar: (page) => ateOPronto(page) },
  {
    nome: 'compilando',
    fase: 'compilando',
    chegar: async (page) => {
      await ateOPronto(page);
      await executar(page);
      await avancar(page, 900);
    },
  },
  {
    nome: 'iniciando',
    fase: 'iniciando',
    chegar: async (page) => {
      await ateOPronto(page);
      await executar(page);
      await avancar(page, T.trocaParaRun + 700);
    },
  },
  {
    nome: 'revelando',
    fase: 'revelando',
    chegar: async (page) => {
      await ateOPronto(page);
      await executar(page);
      await avancar(page, INICIO_DA_REVELACAO_MS + 100);
    },
  },
];

for (const [nomeDaTela, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) da abertura no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      for (const { nome, fase, chegar } of FASES) {
        test(`fase ${nome} (${tema}): sem violações e sem rolagem horizontal`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: tema });
          await abrirComRelogio(page);
          await chegar(page);
          await faseDe(page, fase);
          await semAnimacoes(page);

          const { violations } = await analisar(page);
          const cabe = await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          );

          expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
          ).toEqual([]);
          expect(cabe, 'sem rolagem horizontal').toBe(true);
        });
      }
    }

    test('o cartão e a janela cabem na tela em cada fase', async ({ page }) => {
      await abrirComRelogio(page);
      const cabe = async (alvo: Locator) => {
        const caixa = (await alvo.boundingBox())!;
        expect(caixa.x).toBeGreaterThanOrEqual(0);
        expect(caixa.x + caixa.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(caixa.y + caixa.height).toBeLessThanOrEqual(viewport.height + 1);
      };

      await cabe(dialogo(page).locator('.cartao'));
      await ateOPronto(page);
      await cabe(dialogo(page).locator('.cartao'));
      await executar(page);
      await avancar(page, 1200);
      await cabe(janela(page));
    });
  });
}
