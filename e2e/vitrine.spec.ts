import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { PROJETOS } from '../src/app/core/projetos';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };
const TAGS = ['wcag2a', 'wcag2aa'];
const LIMITE_DE_IMAGEM_EM_BYTES = 200 * 1024;

const pista = (page: Page) => page.getByRole('group', { name: 'Projetos' });
const cartao = (page: Page, slug: string) => page.locator(`a.cartao[data-slug="${slug}"]`);
const dialogo = (page: Page) => page.getByRole('dialog');

/** A vitrine só responde a cliques depois da hidratação: o diálogo só abre com o app assumindo. */
async function abrirVitrine(page: Page, url = '/projetos') {
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Projetos', level: 2 })).toBeVisible();
  // O carrossel marca `data-pronto` depois da hidratação: só então arrasto e setas respondem.
  await expect(page.locator('.carrossel')).toHaveAttribute('data-pronto', 'true');
  // As fontes trocam o layout: só com elas prontas os cartões estão onde o mouse vai procurar.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.evaluate(
    () => new Promise((pronto) => requestAnimationFrame(() => requestAnimationFrame(pronto))),
  );
}

test.describe('Vitrine de projetos no desktop', () => {
  test.use({ viewport: DESKTOP });

  test('o HTML pré-renderizado já traz os seis cartões, sem JavaScript', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: DESKTOP });
    const page = await contexto.newPage();

    await page.goto('/projetos');

    await expect(page.locator('a.cartao')).toHaveCount(PROJETOS.length);
    await expect(page.locator('a.cartao').first()).toHaveAttribute('href', '/projetos/memora');
    await contexto.close();
  });

  test('mostra um cartão por projeto, na ordem da árvore, com contador', async ({ page }) => {
    await abrirVitrine(page);

    await expect(page.locator('a.cartao')).toHaveCount(PROJETOS.length);
    await expect(page.locator('a.cartao .numero')).toHaveText(
      PROJETOS.map((p) => `0${p.numero} / 06`),
    );
    await expect(page.locator('a.cartao .titulo')).toHaveText(PROJETOS.map((p) => p.titulo));
  });

  test('os botões e os pontos levam a outro projeto', async ({ page }) => {
    await abrirVitrine(page);
    const pontos = page.getByRole('group', { name: 'Escolher projeto' }).getByRole('button');
    await expect(pontos.nth(0)).toHaveAttribute('aria-current', 'true');

    await page.getByRole('button', { name: 'Próximo projeto' }).click();
    await expect(pontos.nth(1)).toHaveAttribute('aria-current', 'true');

    await pontos.nth(4).click();
    await expect(pontos.nth(4)).toHaveAttribute('aria-current', 'true');
    await expect(page.getByRole('button', { name: 'Projeto anterior' })).toBeEnabled();
  });

  test('arrastar com o mouse rola o carrossel e não abre o cartão em que soltou', async ({
    page,
  }) => {
    await abrirVitrine(page);
    const antes = await pista(page).evaluate((el) => el.scrollLeft);
    const pontoDoCartao = async () => {
      const caixa = (await cartao(page, 'memora').boundingBox())!;
      return { x: caixa.x + caixa.width / 2, y: caixa.y + 40 };
    };
    // O layout ainda assenta depois da hidratação (janela de Run recolhendo): espera o cartão estar sob o ponto.
    await expect
      .poll(async () => {
        const { x, y } = await pontoDoCartao();
        return page.evaluate(
          ([px, py]) =>
            document.elementFromPoint(px, py)?.closest('a.cartao')?.getAttribute('data-slug') ??
            null,
          [x, y],
        );
      })
      .toBe('memora');
    const { x, y } = await pontoDoCartao();

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 300, y, { steps: 12 });
    await page.mouse.up();

    await expect
      .poll(() => pista(page).evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(antes + 50);
    await expect(dialogo(page)).toBeHidden();
    await expect(page).toHaveURL(/\/projetos$/);
  });

  test('as setas do teclado andam de cartão em cartão', async ({ page }) => {
    await abrirVitrine(page);
    await cartao(page, 'memora').focus();

    await page.keyboard.press('ArrowRight');

    await expect(cartao(page, 'portfolio')).toBeFocused();
  });

  test('alterna entre carrossel e grade, com todos os cartões à vista na grade', async ({
    page,
  }) => {
    await abrirVitrine(page);
    const botao = page.getByRole('button', { name: 'Ver em grade' });
    await expect(botao).toHaveAttribute('aria-pressed', 'false');

    await botao.click();

    await expect(page.getByRole('button', { name: 'Ver em carrossel' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    for (const projeto of PROJETOS) await expect(cartao(page, projeto.slug)).toBeInViewport();
  });

  test('o carrossel não tem cópias: cada projeto aparece uma vez para leitores de tela', async ({
    page,
  }) => {
    await abrirVitrine(page);

    await expect(page.getByRole('link', { name: /Ana, agente de IA/ })).toHaveCount(1);
    await expect(page.locator('[aria-hidden="true"] a.cartao')).toHaveCount(0);
  });
});

test.describe('Detalhes do projeto', () => {
  test.use({ viewport: DESKTOP });

  test('clicar no cartão abre os detalhes, atualiza o endereço e põe o foco em Fechar', async ({
    page,
  }) => {
    await abrirVitrine(page);

    await cartao(page, 'ana').click();

    await expect(dialogo(page)).toBeVisible();
    await expect(dialogo(page).getByRole('heading', { name: 'Ana, agente de IA' })).toBeVisible();
    await expect(page).toHaveURL(/\/projetos\/ana$/);
    await expect(dialogo(page).getByRole('button', { name: 'Fechar' })).toBeFocused();
    await expect(dialogo(page).locator('.contador')).toHaveText('04 / 06');
  });

  test('abrir e fechar expandem e recolhem o cartão com uma View Transition de mesmo nome', async ({
    page,
  }) => {
    await abrirVitrine(page);
    // Amostra a cada quadro se a animação do grupo `projeto` existe; cada rajada é uma transição.
    await page.evaluate(() => {
      const janela = window as unknown as { __rajadas: number; __parar: boolean };
      janela.__rajadas = 0;
      janela.__parar = false;
      let animando = false;
      const amostrar = () => {
        const agora = document
          .getAnimations()
          .some((a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement?.includes(
              '::view-transition-group(projeto)',
            ),
          );
        if (agora && !animando) janela.__rajadas++;
        animando = agora;
        if (!janela.__parar) requestAnimationFrame(amostrar);
      };
      requestAnimationFrame(amostrar);
    });

    await cartao(page, 'memora').click();
    await expect(dialogo(page)).toBeVisible();
    await expect(page).toHaveURL(/\/projetos\/memora$/);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __rajadas: number }).__rajadas), {
        message: 'expansão na ida',
      })
      .toBe(1);
    // Espera a ida terminar de verdade antes de fechar.
    await page.waitForFunction(
      () =>
        !document
          .getAnimations()
          .some((a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement?.includes(
              '::view-transition-group(projeto)',
            ),
          ),
    );

    await page.keyboard.press('Escape');
    await expect(dialogo(page)).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __rajadas: number }).__rajadas), {
        message: 'recolhimento na volta',
      })
      .toBe(2);
    await page.evaluate(() => ((window as unknown as { __parar: boolean }).__parar = true));
    await expect
      .poll(() =>
        cartao(page, 'memora').evaluate((el) => el.style.getPropertyValue('view-transition-name')),
      )
      .toBe('');
  });

  test('Esc fecha, volta o foco ao cartão e o endereço à vitrine', async ({ page }) => {
    await abrirVitrine(page);
    await cartao(page, 'ana').click();
    await expect(dialogo(page)).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialogo(page)).toBeHidden();
    await expect(page).toHaveURL(/\/projetos$/);
    await expect(cartao(page, 'ana')).toBeFocused();
  });

  test('o foco fica preso dentro do diálogo e o fundo não é alcançável', async ({ page }) => {
    await abrirVitrine(page);
    await cartao(page, 'ana').click();
    await expect(dialogo(page)).toBeVisible();

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const dentro = await page.evaluate(() => document.activeElement?.closest('dialog') !== null);
      expect(dentro, `Tab ${i + 1}`).toBe(true);
    }
  });

  test('abre direto pelo endereço do projeto', async ({ page }) => {
    await abrirVitrine(page, '/projetos/launcher-de-tv');

    await expect(dialogo(page)).toBeVisible();
    await expect(dialogo(page).getByRole('heading', { name: 'Launcher de TV' })).toBeVisible();
    await expect(page).toHaveTitle('Launcher de TV | Vinicius Machado');
  });

  test('Voltar do navegador fecha os detalhes', async ({ page }) => {
    await abrirVitrine(page);
    await cartao(page, 'ana').click();
    await expect(dialogo(page)).toBeVisible();

    await page.goBack();

    await expect(dialogo(page)).toBeHidden();
    await expect(page).toHaveURL(/\/projetos$/);
  });

  test('o próximo projeto dá a volta do último ao primeiro, pelo botão e pela seta', async ({
    page,
  }) => {
    await abrirVitrine(page, '/projetos/watts-company');
    await expect(dialogo(page).locator('.contador')).toHaveText('06 / 06');

    await dialogo(page)
      .getByRole('button', { name: /Próximo projeto/ })
      .click();
    await expect(dialogo(page).locator('.contador')).toHaveText('01 / 06');

    await page.keyboard.press('ArrowLeft');
    await expect(dialogo(page).locator('.contador')).toHaveText('06 / 06');
  });

  test('"Ver site" abre em nova aba com rel seguro e "Ver em código" leva ao arquivo Java', async ({
    page,
  }) => {
    await abrirVitrine(page, '/projetos/dra-juliana');

    const site = dialogo(page).getByRole('link', { name: /Ver site/ });
    await expect(site).toHaveAttribute('href', 'https://www.drajulianamaluhy.com/');
    await expect(site).toHaveAttribute('target', '_blank');
    await expect(site).toHaveAttribute('rel', 'noopener noreferrer');

    await dialogo(page)
      .getByRole('link', { name: /Ver em código/ })
      .click();
    await expect(page).toHaveURL(/\/projeto-5$/);
  });

  test('projeto sem endereço público não mostra o botão do site', async ({ page }) => {
    await abrirVitrine(page, '/projetos/memora');

    await expect(dialogo(page).getByRole('link', { name: /Ver (site|repositório)/ })).toHaveCount(
      0,
    );
  });

  test('sem violações de acessibilidade (axe) com os detalhes abertos', async ({ page }) => {
    await abrirVitrine(page, '/projetos/dra-juliana');
    await expect(dialogo(page)).toBeVisible();

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([]);
  });
});

test.describe('Vitrine com movimento reduzido', () => {
  test.use({ viewport: DESKTOP, reducedMotion: 'reduce' });

  test('abre e fecha os detalhes na hora, sem animação de expansão', async ({ page }) => {
    await abrirVitrine(page);

    await cartao(page, 'ana').click();
    await expect(dialogo(page)).toBeVisible();
    // Sem View Transition do cartão, nada fica animando: o foco já está em Fechar.
    await expect(dialogo(page).getByRole('button', { name: 'Fechar' })).toBeFocused();
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

    await page.keyboard.press('Escape');
    await expect(dialogo(page)).toBeHidden();
  });
});

test.describe('Vitrine no celular', () => {
  test.use({ viewport: CELULAR });

  test('abre em grade de uma coluna, sem rolagem horizontal da página', async ({ page }) => {
    await abrirVitrine(page);

    await expect(page.getByRole('group', { name: 'Escolher projeto' })).toBeHidden();
    const transborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(transborda).toBe(false);
    const caixa = (await cartao(page, 'memora').boundingBox())!;
    expect(caixa.width).toBeGreaterThan(CELULAR.width * 0.75);
  });

  test('os detalhes cabem na tela e não rolam na horizontal', async ({ page }) => {
    await abrirVitrine(page, '/projetos/dra-juliana');

    await expect(dialogo(page)).toBeVisible();
    const transborda = await dialogo(page)
      .locator('.painel')
      .evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(transborda).toBe(false);
  });
});

test.describe('Vitrine no tema claro', () => {
  test.use({ viewport: DESKTOP });

  test('não tem violações de acessibilidade (axe)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await abrirVitrine(page);

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([]);
  });
});

test.describe('Imagens da vitrine', () => {
  test('nenhuma imagem de projeto passa de 200 KB e todas têm dimensões e texto alternativo', async ({
    page,
    request,
  }) => {
    for (const imagem of PROJETOS.flatMap((p) => p.imagens)) {
      const resposta = await request.get(`/${imagem.src}`);
      expect(resposta.ok(), imagem.src).toBe(true);
      expect((await resposta.body()).length, imagem.src).toBeLessThanOrEqual(
        LIMITE_DE_IMAGEM_EM_BYTES,
      );
    }

    await page.setViewportSize(DESKTOP);
    await abrirVitrine(page);
    const imagens = await page.locator('a.cartao img').evaluateAll((els) =>
      els.map((el) => ({
        largura: el.getAttribute('width'),
        altura: el.getAttribute('height'),
        alt: el.getAttribute('alt'),
      })),
    );
    expect(imagens.length).toBeGreaterThan(0);
    for (const img of imagens) {
      expect(img.largura).not.toBeNull();
      expect(img.altura).not.toBeNull();
      expect(img.alt?.length).toBeGreaterThan(20);
    }
  });

  test('os arquivos são WebP, um formato moderno', async ({ request }) => {
    for (const imagem of PROJETOS.flatMap((p) => p.imagens)) {
      expect(imagem.src).toMatch(/\.(webp|avif)$/);
      const resposta = await request.get(`/${imagem.src}`);
      expect(resposta.headers()['content-type']).toMatch(/image\/(webp|avif)/);
    }
  });
});
