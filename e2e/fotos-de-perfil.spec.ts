import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirPastas, arquivoDaArvore, esperarLogDoRun } from './apoio';

const EDITOR = 'main app-editor-de-codigo';
const LINKEDIN_DA_LUANA = 'https://www.linkedin.com/in/luana-porto-pereira-gomes/';

const retrato = (page: Page) => page.locator('main .javadoc img.retrato');

/** Segura as fotos até `liberar()`: dá para medir o layout antes e depois de elas chegarem. */
async function segurarFotos(page: Page): Promise<() => void> {
  let liberar!: () => void;
  const portao = new Promise<void>((resolver) => (liberar = resolver));
  await page.route('**/fotos/*.webp', async (rota) => {
    await portao;
    await rota.continue();
  });
  return liberar;
}

const caixa = async (alvo: ReturnType<Page['locator']>) => (await alvo.boundingBox())!;

test.describe('Retrato no Javadoc: Início', () => {
  test('mostra a foto do Vinicius no Javadoc de PortfolioApplication, com alt, tamanho fixo e prioridade', async ({
    page,
  }) => {
    await page.goto('/');

    const foto = retrato(page);

    await expect(foto).toHaveCount(1);
    await expect(foto).toHaveAttribute('alt', 'Foto de Vinicius Machado');
    await expect(foto).toHaveAttribute('src', /fotos\/vinicius\.webp$/);
    await expect(foto).toHaveAttribute('width', '96');
    await expect(foto).toHaveAttribute('height', '96');
    await expect(foto).toHaveAttribute('fetchpriority', 'high');
    await expect(foto).toHaveAttribute('loading', 'eager');
    await expect(page.getByRole('img', { name: 'Foto de Vinicius Machado' })).toBeVisible();
  });

  test('a foto baixa de verdade: o arquivo existe e a imagem decodifica', async ({ page }) => {
    const resposta = page.waitForResponse((r) => r.url().endsWith('/fotos/vinicius.webp'));
    await page.goto('/');

    expect((await resposta).status()).toBe(200);
    await expect
      .poll(() => retrato(page).evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  });

  test('a foto é redonda e fica à esquerda do texto do Javadoc, ambos na mesma caixa', async ({
    page,
  }) => {
    await page.goto('/');
    const foto = retrato(page);
    const corpo = page.locator('main .javadoc-corpo');

    expect(await foto.evaluate((el) => getComputedStyle(el).borderRadius)).toBe('50%');
    const [fotoCaixa, corpoCaixa] = [await caixa(foto), await caixa(corpo)];

    expect(fotoCaixa.x + fotoCaixa.width).toBeLessThanOrEqual(corpoCaixa.x + 1);
    expect(fotoCaixa.width).toBe(96);
    expect(fotoCaixa.height).toBe(96);
    expect(await foto.evaluate((el) => !!el.closest('.javadoc'))).toBe(true);
  });

  test('o HTML pré-renderizado já traz a foto, sem JavaScript', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/');

    await expect(pagina.getByRole('img', { name: 'Foto de Vinicius Machado' })).toHaveCount(1);
    await contexto.close();
  });
});

test.describe('Retrato no Javadoc: Sobre Mim', () => {
  test('mostra a foto do Vinicius no Javadoc da apresentação', async ({ page }) => {
    await page.goto('/sobre-mim');

    const foto = retrato(page);

    await expect(foto).toHaveCount(1);
    await expect(foto).toHaveAttribute('alt', 'Foto de Vinicius Machado');
    await expect(foto).toHaveAttribute('src', /fotos\/vinicius\.webp$/);
    await expect(page.locator('main .javadoc')).toContainText('Sou desenvolvedor Full Stack');
  });

  test('só o Início carrega a foto com prioridade', async ({ page }) => {
    await page.goto('/sobre-mim');

    await expect(retrato(page)).toHaveAttribute('loading', 'lazy');
    await expect(retrato(page)).not.toHaveAttribute('fetchpriority', 'high');
  });
});

test.describe('Retrato e @author: Depoimentos', () => {
  test('mostra a foto da Luana, menor, com alt "Foto de Luana Porto"', async ({ page }) => {
    await page.goto('/depoimentos');

    const foto = retrato(page);

    await expect(foto).toHaveCount(1);
    await expect(foto).toHaveAttribute('alt', 'Foto de Luana Porto');
    await expect(foto).toHaveAttribute('src', /fotos\/luana-porto\.webp$/);
    await expect(foto).toHaveAttribute('width', '64');
    await expect(foto).toHaveAttribute('height', '64');
    expect((await caixa(foto)).width).toBe(64);
  });

  test('o Javadoc termina com @author e o nome da Luana é link para o LinkedIn', async ({
    page,
  }) => {
    await page.goto('/depoimentos');
    const autor = page.locator('main .javadoc-autor');

    await expect(autor).toContainText('@author');
    await expect(autor.getByRole('link')).toHaveAttribute('href', LINKEDIN_DA_LUANA);
    await expect(autor.getByRole('link')).toContainText('Luana Porto');
    // O @author é a última linha do corpo do Javadoc.
    await expect(page.locator('main .javadoc-corpo > :last-child')).toHaveClass(/javadoc-autor/);
  });

  test('o link abre em nova aba com rel seguro e avisa isso no nome acessível', async ({
    page,
  }) => {
    await page.goto('/depoimentos');
    const link = page.getByRole('link', { name: /Luana Porto/ });

    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(link).toHaveAccessibleName(/Luana Porto.*abre em nova aba/);
  });

  test('ativar o nome abre o LinkedIn numa nova aba e o site continua aberto', async ({
    page,
    context,
  }) => {
    await context.route('https://www.linkedin.com/**', (rota) =>
      rota.fulfill({ contentType: 'text/html', body: '<title>LinkedIn</title>' }),
    );
    await page.goto('/depoimentos');

    const [nova] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /Luana Porto/ }).click(),
    ]);

    await expect(nova).toHaveURL(LINKEDIN_DA_LUANA);
    expect(await nova.evaluate(() => window.opener)).toBeNull();
    await expect(page).toHaveURL(/\/depoimentos$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('o link do @author se alcança pelo teclado e mostra o anel de foco', async ({ page }) => {
    await page.goto('/depoimentos');
    const link = page.getByRole('link', { name: /Luana Porto/ });

    await link.focus();

    await expect(link).toBeFocused();
    expect(await link.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
  });
});

test.describe('Sem deslocamento de layout ao carregar a foto', () => {
  for (const [rota, nome] of [
    ['/', 'Início'],
    ['/sobre-mim', 'Sobre Mim'],
    ['/depoimentos', 'Depoimentos'],
  ] as const) {
    test(`${nome}: o texto e a foto não mudam de lugar quando a imagem termina de baixar`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const liberar = await segurarFotos(page);
      await page.goto(rota, { waitUntil: 'domcontentloaded' });
      await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
      const antes = {
        texto: await caixa(page.locator('main .javadoc-corpo')),
        ultima: await caixa(page.locator('main code > .linha').last()),
        foto: await caixa(retrato(page)),
      };
      const semFoto = await retrato(page).evaluate((img: HTMLImageElement) => img.complete);

      liberar();
      await expect
        .poll(() => retrato(page).evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      const depois = {
        texto: await caixa(page.locator('main .javadoc-corpo')),
        ultima: await caixa(page.locator('main code > .linha').last()),
        foto: await caixa(retrato(page)),
      };

      expect(semFoto, 'a foto ainda não tinha chegado na primeira medida').toBe(false);
      expect(depois).toEqual(antes);
    });
  }

  test('nenhuma mudança de layout é registrada pelo navegador ao abrir o Início', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver((lista) => {
        for (const e of lista.getEntries() as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[])
          if (!e.hadRecentInput) w.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('/');
    await expect
      .poll(() => retrato(page).evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);

    expect(cls).toBeLessThan(0.01);
  });
});

test.describe('Retrato durante a digitação', () => {
  test('a foto é recortada junto com o Javadoc a que pertence e aparece quando ele aparece', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.requestAnimationFrame = () => 0;
    });
    await page.goto('/');
    await abrirPastas(page);
    await arquivoDaArvore(page, 'Sobre Mim').click();
    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);

    const javadoc = page.locator('main .javadoc');

    // Como o retrato é filho do .javadoc, o recorte do bloco o esconde junto com o texto.
    await expect(javadoc).toHaveCSS('clip-path', /inset/);
    expect(await retrato(page).evaluate((img) => !!img.closest('.javadoc'))).toBe(true);

    await page.keyboard.press('Shift');

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await expect(javadoc).toHaveCSS('clip-path', 'none');
    await expect(retrato(page)).toBeVisible();
  });
});

const PAGINAS = ['/', '/sobre-mim', '/depoimentos'] as const;

for (const [nomeDaTela, viewport] of [
  ['desktop', { width: 1920, height: 1080 }],
  ['celular', { width: 390, height: 844 }],
] as const) {
  test.describe(`Fotos de perfil no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      for (const rota of PAGINAS) {
        test(`${rota} passa no axe sem exclusões (${tema})`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: tema });
          await page.goto(rota);
          await expect(retrato(page)).toBeVisible();
          await esperarLogDoRun(page);

          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

          expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
          ).toEqual([]);
        });
      }
    }

    for (const rota of PAGINAS) {
      test(`${rota}: a foto mantém o tamanho e a página não rola na horizontal`, async ({
        page,
      }) => {
        await page.goto(rota);
        await expect(retrato(page)).toBeVisible();

        // Os tokens encolhem o retrato no celular: 96 -> 64 (grande) e 64 -> 48 (pequeno).
        const grande = nomeDaTela === 'desktop' ? 96 : 64;
        const pequeno = nomeDaTela === 'desktop' ? 64 : 48;
        const lado = rota === '/depoimentos' ? pequeno : grande;
        const foto = await caixa(retrato(page));
        const { rolagem, largura } = await page.evaluate(() => ({
          rolagem: document.documentElement.scrollWidth,
          largura: document.documentElement.clientWidth,
        }));

        expect(foto.width).toBe(lado);
        expect(foto.height).toBe(lado);
        expect(rolagem).toBeLessThanOrEqual(largura);
      });
    }
  });
}
