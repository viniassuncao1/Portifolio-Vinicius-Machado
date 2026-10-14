import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore } from './apoio';

interface Projeto {
  rota: string;
  nome: string;
  url: string;
  dominio: RegExp;
  textoAlternativo: RegExp;
}

const PROJETOS: readonly Projeto[] = [
  {
    rota: '/projeto-2',
    nome: 'Dra. Juliana Maluhy',
    url: 'https://www.drajulianamaluhy.com/',
    dominio: /drajulianamaluhy\.com/,
    textoAlternativo: /Landing page da fisioterapeuta/,
  },
  {
    rota: '/projeto-3',
    nome: 'Watts Company',
    url: 'https://wattscompany.com.br/',
    dominio: /wattscompany\.com\.br/,
    textoAlternativo: /Landing page da Watts Company/,
  },
];

const SEM_PLAY = ['/', '/sobre-mim', '/skills', '/projeto-1', '/projeto-4', '/projeto-4/2'];

const DOMINIOS_DOS_PROJETOS = /drajulianamaluhy\.com|wattscompany\.com\.br/;

const botaoDoCodigo = (page: Page) => page.getByRole('button', { name: /^Executar Projeto \d$/ });
const botaoDaBarra = (page: Page) => page.getByRole('button', { name: 'Executar o projeto' });
const janela = (page: Page, nome?: string) => page.getByRole('dialog', nome ? { name: nome } : {});

/** Troca os sites reais por uma página mínima, para o teste não depender da internet. */
async function simularSites(page: Page): Promise<void> {
  await page.route(DOMINIOS_DOS_PROJETOS, (rota) =>
    rota.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: '<!doctype html><html lang="pt-BR"><head><title>Site simulado</title></head><body><main><h1>Site simulado</h1></main></body></html>',
    }),
  );
}

/** Abre a rota hidratada, sem animação, e dá o botão que pede a abertura. */
async function abrir(
  page: Page,
  { rota, nome }: Projeto,
  origem: (p: Page) => Locator,
): Promise<Locator> {
  await abrirHidratada(page, rota);
  const botao = origem(page);
  await botao.click();
  await expect(janela(page, nome)).toBeVisible();
  return botao;
}

/**
 * O foco está preso quando nunca chega a um elemento da IDE por trás: fica dentro do diálogo ou,
 * no ponto de virada do ciclo, no `body` (o `<dialog>` modal nativo passa pela interface do
 * navegador antes de voltar ao primeiro controle).
 */
const focoPreso = (page: Page): Promise<boolean> =>
  page.evaluate(() => {
    const ativo = document.activeElement;
    return !ativo || ativo === document.body || !!ativo.closest('dialog');
  });

test.describe('Janela de preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await simularSites(page);
  });

  for (const projeto of PROJETOS) {
    test.describe(projeto.nome, () => {
      test(`abre pelo ▶ da calha em ${projeto.rota}`, async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);

        await expect(janela(page, projeto.nome)).toHaveAttribute('aria-labelledby', /.+/);
        await expect(janela(page).getByRole('heading', { name: projeto.nome })).toBeVisible();
      });

      test(`abre pelo play da barra de ferramentas em ${projeto.rota}`, async ({ page }) => {
        await abrir(page, projeto, botaoDaBarra);

        await expect(janela(page)).toHaveCount(1);
      });

      test('o diálogo é modal: o resto da IDE fica inerte atrás dele', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);

        const modal = await janela(page).evaluate((el: HTMLDialogElement) => el.matches(':modal'));

        expect(modal).toBe(true);
      });

      test('mostra a captura com texto alternativo, rolável dentro da janela', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        const imagem = janela(page).getByRole('img', { name: projeto.textoAlternativo });

        await expect(imagem).toBeVisible();
        expect(await imagem.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(
          0,
        );
        const area = janela(page).getByRole('region', { name: `Captura do site ${projeto.nome}` });
        const rolavel = await area.evaluate((el) => el.scrollHeight > el.clientHeight);

        expect(rolavel).toBe(true);
      });

      test('a captura abre sem nenhuma requisição ao site do projeto', async ({ page }) => {
        const requisicoes: string[] = [];
        page.on('request', (requisicao) => requisicoes.push(requisicao.url()));

        await abrir(page, projeto, botaoDoCodigo);
        await expect(
          janela(page).getByRole('img', { name: projeto.textoAlternativo }),
        ).toBeVisible();

        expect(requisicoes.filter((url) => DOMINIOS_DOS_PROJETOS.test(url))).toEqual([]);
        expect(requisicoes.filter((url) => !url.startsWith('http://localhost'))).toEqual([]);
      });

      test('"Ver ao vivo" troca a captura pelo site num iframe seguro e vira "Ver captura"', async ({
        page,
      }) => {
        await abrir(page, projeto, botaoDoCodigo);
        const requisicoes: string[] = [];
        page.on('request', (requisicao) => requisicoes.push(requisicao.url()));

        await janela(page).getByRole('button', { name: 'Ver ao vivo' }).click();

        const iframe = janela(page).locator('iframe');
        await expect(iframe).toHaveCount(1);
        await expect(iframe).toHaveAttribute('title', /.+/);
        await expect(iframe).toHaveAttribute('src', projeto.url);
        await expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer');
        await expect(iframe).toHaveAttribute('sandbox', /.+/);
        expect(await iframe.getAttribute('sandbox')).not.toContain('allow-top-navigation');
        await expect(janela(page).getByRole('button', { name: 'Ver captura' })).toBeVisible();
        await expect(janela(page).getByRole('button', { name: 'Ver ao vivo' })).toHaveCount(0);
        await expect(janela(page).getByRole('img')).toHaveCount(0);
        await expect(
          page.frameLocator('dialog iframe').getByRole('heading', { name: 'Site simulado' }),
        ).toBeVisible();
        expect(requisicoes.some((url) => DOMINIOS_DOS_PROJETOS.test(url))).toBe(true);
      });

      test('"Ver captura" volta para a imagem e remove o iframe', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        await janela(page).getByRole('button', { name: 'Ver ao vivo' }).click();

        await janela(page).getByRole('button', { name: 'Ver captura' }).click();

        await expect(janela(page).locator('iframe')).toHaveCount(0);
        await expect(
          janela(page).getByRole('img', { name: projeto.textoAlternativo }),
        ).toBeVisible();
        await expect(janela(page).getByRole('button', { name: 'Ver ao vivo' })).toBeVisible();
      });

      test('reabrir a janela começa de novo na captura', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        await janela(page).getByRole('button', { name: 'Ver ao vivo' }).click();
        await page.keyboard.press('Escape');
        await expect(janela(page)).toHaveCount(0);

        await botaoDoCodigo(page).click();

        await expect(janela(page).getByRole('button', { name: 'Ver ao vivo' })).toBeVisible();
        await expect(janela(page).locator('iframe')).toHaveCount(0);
      });

      test('"Abrir em nova aba" tem target _blank e rel noopener noreferrer', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        const link = janela(page).getByRole('link', { name: 'Abrir em nova aba' });

        await expect(link).toHaveAttribute('href', projeto.url);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });

      test('"Abrir em nova aba" abre o site noutra aba e mantém o portfólio', async ({
        page,
        context,
      }) => {
        await context.route(DOMINIOS_DOS_PROJETOS, (rota) =>
          rota.fulfill({ contentType: 'text/html', body: '<title>Site</title>' }),
        );
        await abrir(page, projeto, botaoDoCodigo);

        const [nova] = await Promise.all([
          context.waitForEvent('page'),
          janela(page).getByRole('link', { name: 'Abrir em nova aba' }).click(),
        ]);

        expect(nova.url()).toBe(projeto.url);
        expect(page.url()).toContain(projeto.rota);
        await expect(janela(page)).toBeVisible();
      });

      test('Escape fecha a janela e o foco volta ao ▶ da calha', async ({ page }) => {
        const origem = await abrir(page, projeto, botaoDoCodigo);

        await page.keyboard.press('Escape');

        await expect(janela(page)).toHaveCount(0);
        await expect(origem).toBeFocused();
      });

      test('Escape fecha a janela e o foco volta ao play da barra de ferramentas', async ({
        page,
      }) => {
        const origem = await abrir(page, projeto, botaoDaBarra);

        await page.keyboard.press('Escape');

        await expect(janela(page)).toHaveCount(0);
        await expect(origem).toBeFocused();
      });

      test('o botão × fecha a janela e o foco volta a quem a abriu', async ({ page }) => {
        const origem = await abrir(page, projeto, botaoDoCodigo);

        await janela(page).getByRole('button', { name: 'Fechar a janela' }).click();

        await expect(janela(page)).toHaveCount(0);
        await expect(origem).toBeFocused();
      });

      test('o foco fica preso na janela, para frente e para trás', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        const focados = new Set<string>();

        for (let i = 0; i < 12; i++) {
          await page.keyboard.press('Tab');
          expect(await focoPreso(page), `Tab ${i + 1}`).toBe(true);
          focados.add(
            await page.evaluate(() =>
              document.activeElement?.closest('dialog')
                ? (document.activeElement.getAttribute('aria-label') ??
                  document.activeElement.textContent?.trim() ??
                  '')
                : '',
            ),
          );
        }
        for (let i = 0; i < 12; i++) {
          await page.keyboard.press('Shift+Tab');
          expect(await focoPreso(page), `Shift+Tab ${i + 1}`).toBe(true);
        }

        expect([...focados].filter(Boolean).length).toBeGreaterThanOrEqual(3);
      });

      test('os controles da janela são alcançáveis pelo teclado e têm nome', async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);

        for (const controle of [
          janela(page).getByRole('button', { name: 'Fechar a janela' }),
          janela(page).getByRole('button', { name: 'Ver ao vivo' }),
          janela(page).getByRole('link', { name: 'Abrir em nova aba' }),
        ]) {
          await controle.focus();
          await expect(controle).toBeFocused();
        }
      });
    });
  }

  test('sem animação com movimento reduzido: aparece pronta e fecha na hora', async ({ page }) => {
    await abrir(page, PROJETOS[0], botaoDoCodigo);

    const animacao = await janela(page).evaluate((el) => getComputedStyle(el).animationName);
    await page.keyboard.press('Escape');

    expect(animacao).toBe('none');
    await expect(janela(page)).toHaveCount(0);
  });

  test('o fundo atrás da janela não anima com movimento reduzido', async ({ page }) => {
    await abrir(page, PROJETOS[0], botaoDoCodigo);

    const animacaoDoFundo = await janela(page).evaluate(
      (el) => getComputedStyle(el, '::backdrop').animationName,
    );

    expect(animacaoDoFundo).toBe('none');
  });
});

test.describe('Janela de preview com animação', () => {
  test('abre e fecha com animação quando o movimento não está reduzido', async ({ page }) => {
    await simularSites(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await abrirHidratada(page, '/projeto-2');
    await botaoDoCodigo(page).click();

    const animacao = await janela(page).evaluate((el) => getComputedStyle(el).animationName);
    await page.keyboard.press('Escape');

    expect(animacao).not.toBe('none');
    await expect(janela(page)).toHaveCount(0);
    await expect(botaoDoCodigo(page)).toBeFocused();
  });
});

test.describe('Play da barra de ferramentas', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  for (const rota of ['/projeto-2', '/projeto-3']) {
    test(`é um botão com nome e recebe foco em ${rota}`, async ({ page }) => {
      await abrirHidratada(page, rota);

      await expect(botaoDaBarra(page)).toBeVisible();
      await botaoDaBarra(page).focus();
      await expect(botaoDaBarra(page)).toBeFocused();
    });
  }

  for (const rota of SEM_PLAY) {
    test(`não é botão nem recebe foco em ${rota}`, async ({ page }) => {
      await abrirHidratada(page, rota);

      await expect(botaoDaBarra(page)).toHaveCount(0);
      await expect(botaoDoCodigo(page)).toHaveCount(0);
      await expect(page.getByRole('dialog')).toHaveCount(0);
    });
  }

  test('em "Sobre Mim" nenhum Tab pára no play', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    const nomes = new Set<string>();

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      nomes.add(
        await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? ''),
      );
    }

    expect(nomes).not.toContain('Executar o projeto');
  });

  test('o play some ao sair do projeto e volta ao entrar noutro', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');
    await expect(botaoDaBarra(page)).toBeVisible();

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Sobre Mim').click();
    await expect(botaoDaBarra(page)).toHaveCount(0);

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Projeto 3').click();
    await expect(botaoDaBarra(page)).toBeVisible();
  });
});

test.describe('Janela de preview no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await simularSites(page);
  });

  test('ocupa a tela inteira, com os mesmos controles, e a página não rola', async ({ page }) => {
    await abrir(page, PROJETOS[0], botaoDoCodigo);
    const caixa = await janela(page).boundingBox();

    expect(caixa).not.toBeNull();
    expect(caixa!.x).toBeLessThanOrEqual(1);
    expect(caixa!.y).toBeLessThanOrEqual(1);
    expect(caixa!.width).toBeGreaterThanOrEqual(388);
    expect(caixa!.height).toBeGreaterThanOrEqual(842);
    await expect(janela(page).getByRole('button', { name: 'Fechar a janela' })).toBeVisible();
    await expect(janela(page).getByRole('button', { name: 'Ver ao vivo' })).toBeVisible();
    await expect(janela(page).getByRole('link', { name: 'Abrir em nova aba' })).toBeVisible();
    await page.mouse.move(195, 500);
    await page.mouse.wheel(0, 600);
    const pagina = await page.evaluate(() => ({
      rolagem: window.scrollY,
      transborda: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));

    expect(pagina).toEqual({ rolagem: 0, transborda: false });
  });

  test('a captura rola dentro da janela', async ({ page }) => {
    await abrir(page, PROJETOS[1], botaoDoCodigo);
    const area = janela(page).getByRole('region', { name: 'Captura do site Watts Company' });

    await area.hover();
    await page.mouse.wheel(0, 500);

    await expect.poll(() => area.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  });

  test('Escape fecha e devolve o foco ao Executar', async ({ page }) => {
    const origem = await abrir(page, PROJETOS[0], botaoDoCodigo);

    await page.keyboard.press('Escape');

    await expect(janela(page)).toHaveCount(0);
    await expect(origem).toBeFocused();
  });

  test('o × fecha a janela', async ({ page }) => {
    await abrir(page, PROJETOS[1], botaoDoCodigo);

    await janela(page).getByRole('button', { name: 'Fechar a janela' }).click();

    await expect(janela(page)).toHaveCount(0);
  });
});

const TAGS = ['wcag2a', 'wcag2aa'];

async function violacoes(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations.flatMap((v) =>
    v.nodes.map((no) => `[${v.impact}] ${v.id}: ${no.target.join(' ')}\n${no.html}`),
  );
}

for (const [tela, viewport] of [
  ['desktop', { width: 1920, height: 1080 }],
  ['celular', { width: 390, height: 844 }],
] as const) {
  test.describe(`Acessibilidade (axe) com a janela aberta no ${tela}`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await simularSites(page);
    });

    for (const projeto of PROJETOS) {
      test(`${projeto.rota} mostrando a captura`, async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        await expect(
          janela(page).getByRole('img', { name: projeto.textoAlternativo }),
        ).toBeVisible();

        expect(await violacoes(page)).toEqual([]);
      });

      test(`${projeto.rota} mostrando o site ao vivo`, async ({ page }) => {
        await abrir(page, projeto, botaoDoCodigo);
        await janela(page).getByRole('button', { name: 'Ver ao vivo' }).click();
        await expect(page.frameLocator('dialog iframe').locator('h1')).toBeVisible();

        expect(await violacoes(page)).toEqual([]);
      });
    }
  });
}
