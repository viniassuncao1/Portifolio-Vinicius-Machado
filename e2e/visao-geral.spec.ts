import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { PROJETOS } from '../src/app/core/projetos';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };
const TAGS = ['wcag2a', 'wcag2aa'];
const FAIXAS = [
  { rotulo: 'Apresentação', tema: 'hero' },
  { rotulo: 'Sobre', tema: 'sobre' },
  { rotulo: 'Stack', tema: 'stack' },
  { rotulo: 'Experiência e formação', tema: 'formacao' },
  { rotulo: 'Projetos', tema: 'projetos' },
  { rotulo: 'Contato', tema: 'contato' },
] as const;

const faixa = (page: Page, rotulo: string) => page.locator(`section.faixa[aria-label="${rotulo}"]`);
const rolante = (page: Page) => page.locator('.conteudo');

/** O cartão só responde depois da hidratação: o botão de copiar e-mail marca o fim dela. */
async function abrirInicio(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Copiar e-mail' }).first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** Leva a faixa à janela e espera o tema dela assentar (a troca de cor leva 900 ms). */
async function irParaAFaixa(page: Page, rotulo: string, tema: string) {
  await faixa(page, rotulo).scrollIntoViewIfNeeded();
  await rolante(page).evaluate((el, alvo) => {
    const faixaAlvo = document.querySelector(`section.faixa[aria-label="${alvo}"]`)!;
    const caixa = faixaAlvo.getBoundingClientRect();
    el.scrollBy({ top: caixa.top - el.getBoundingClientRect().top - 24 });
  }, rotulo);
  await expect(page.locator('html')).toHaveAttribute('data-secao', tema);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.getAnimations().filter((a) => a instanceof CSSTransition).length,
      ),
    )
    .toBe(0);
}

test.describe('Início em cartão', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  test('abre no cartão: o hero, a barra de ações e as seis faixas', async ({ page }) => {
    await abrirInicio(page);

    await expect(page.getByRole('heading', { level: 2, name: 'Vinicius Machado' })).toBeVisible();
    await expect(page.locator('.hero .cargo')).toHaveText('Desenvolvedor Full Stack');
    await expect(page.locator('main code')).toHaveCount(0);
    for (const { rotulo } of FAIXAS) await expect(faixa(page, rotulo)).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Ações rápidas' }).first()).toBeVisible();
  });

  test('a primeira dobra mostra nome, cargo, stack, "Disponível" e as ações, sem rolar', async ({
    page,
  }) => {
    await abrirInicio(page);

    for (const alvo of [
      page.locator('.hero .nome'),
      page.locator('.hero .cargo'),
      page.locator('.stack .chip').first(),
      page.locator('.hero .eyebrow'),
      page.getByRole('link', { name: /Ver projetos/ }).first(),
      page.getByRole('link', { name: /Baixar currículo/ }),
      page.getByRole('link', { name: /Currículo/ }).first(),
    ]) {
      await expect(alvo).toBeInViewport();
    }
    await expect(page.locator('.hero .eyebrow')).toContainText('Disponível');
  });

  test('o HTML pré-renderizado já traz o cartão e as seis faixas, sem JavaScript', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: DESKTOP });
    const page = await contexto.newPage();

    await page.goto('/');

    await expect(page.locator('.hero .nome')).toHaveText('Vinicius Machado');
    await expect(page.locator('section.faixa')).toHaveCount(FAIXAS.length);
    await expect(page.locator('app-experiencia-em-grafo .commit')).toHaveCount(3);
    await expect(page.locator('app-projetos-em-destaque a.cartao')).toHaveCount(PROJETOS.length);
    await expect(page.locator('.cartao .status')).toContainText('Disponível');
    await contexto.close();
  });

  test('"Ver como código" mostra o Início em Java e a escolha fica lembrada', async ({ page }) => {
    await abrirInicio(page);

    await page.getByRole('button', { name: 'Ver como código' }).click();
    await expect(page.locator('main app-editor-de-codigo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver como cartão' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.reload();
    await expect(page.locator('main app-editor-de-codigo')).toBeVisible();

    await page.getByRole('button', { name: 'Ver como cartão' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Vinicius Machado' })).toBeVisible();
  });

  test('o currículo é um PDF baixável', async ({ page, request }) => {
    await abrirInicio(page);

    const link = page
      .getByRole('navigation', { name: 'Ações rápidas' })
      .first()
      .getByRole('link', { name: /Currículo/ });
    await expect(link).toHaveAttribute('download', '');
    const href = (await link.getAttribute('href'))!;
    const resposta = await request.get(`/${href}`);
    expect(resposta.ok()).toBe(true);
    expect(resposta.headers()['content-type']).toBe('application/pdf');
  });

  test('copiar o e-mail põe o endereço na área de transferência e avisa', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await abrirInicio(page);

    await page.getByRole('button', { name: 'Copiar e-mail' }).first().click();

    await expect(
      page.getByRole('status').filter({ hasText: 'E-mail copiado' }).first(),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'viniciusmassuncao@gmail.com',
    );
  });

  test('LinkedIn e GitHub abrem em nova aba com rel seguro', async ({ page }) => {
    await abrirInicio(page);

    for (const nome of [/LinkedIn/, /GitHub/]) {
      const link = page
        .getByRole('navigation', { name: 'Ações rápidas' })
        .first()
        .getByRole('link', { name: nome });
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('o tema de cor muda conforme a faixa que passa da metade da janela', async ({ page }) => {
    await abrirInicio(page);

    const fundoDoHero = await page
      .locator('.visao')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    for (const { rotulo, tema } of FAIXAS.slice(1)) await irParaAFaixa(page, rotulo, tema);

    const fundoDoContato = await page
      .locator('.visao')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(fundoDoContato).not.toBe(fundoDoHero);
  });

  test('as faixas passam no axe, cada uma com o seu tema, nos temas escuro e claro', async ({
    page,
  }) => {
    for (const esquema of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: esquema });
      await abrirInicio(page);
      await page.getByRole('button', { name: 'Copiar e-mail' }).first().waitFor();
      for (const { rotulo, tema } of FAIXAS) {
        await irParaAFaixa(page, rotulo, tema);
        const { violations } = await new AxeBuilder({ page })
          .include(`section.faixa[aria-label="${rotulo}"]`)
          .withTags(TAGS)
          .analyze();
        expect(
          violations.map(
            (v) =>
              `${esquema}/${rotulo}: ${v.id} ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          ),
        ).toEqual([]);
      }
    }
  });

  test('o foco no teclado mostra um anel de 2px na cor do texto do tema, em cada faixa', async ({
    page,
  }) => {
    await abrirInicio(page);
    await page
      .getByRole('link', { name: /Ver projetos/ })
      .first()
      .focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');

    const anel = await page.evaluate(() => {
      const foco = document.activeElement as HTMLElement;
      const estilo = getComputedStyle(foco);
      const texto = getComputedStyle(document.documentElement).getPropertyValue('--s-texto').trim();
      return {
        largura: estilo.outlineWidth,
        cor: estilo.outlineColor,
        estilo: estilo.outlineStyle,
        texto,
      };
    });
    expect(anel.estilo).toBe('solid');
    expect(anel.largura).toBe('2px');
    expect(anel.cor.replace(/\s/g, '')).toMatch(/^rgb\(/);
  });

  test('a stack liga uma tecnologia ao projeto que a usa', async ({ page }) => {
    await abrirInicio(page);

    const link = page.locator('app-stack-em-gradle a.com-link').first();
    await expect(link).toHaveAttribute('href', /\/projetos\//);
    await link.click();
    await expect(page).toHaveURL(/\/projetos\/[a-z-]+$/);
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('"Ver projetos" leva à vitrine', async ({ page }) => {
    await abrirInicio(page);

    await page
      .getByRole('link', { name: /Ver projetos/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/projetos$/);
  });
});

test.describe('Hero: código que vira cartão', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  test('com movimento digita a classe e, em até 4 s, resolve no cartão', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.janela-do-hero')).toHaveAttribute('data-fase', 'digitando');
    await expect(page.locator('.janela-do-hero .codigo')).toBeVisible();
    await expect(page.locator('.janela-do-hero .codigo')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.janela-do-hero')).toHaveAttribute('data-fase', 'cartao', {
      timeout: 4000,
    });
    await expect(page.locator('.cartao .status')).toBeVisible();
    await expect(page.locator('.janela-do-hero .codigo')).toHaveCount(0);
  });

  test('o texto do hero não espera pela animação', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero .nome')).toBeInViewport();
    await expect(page.locator('.hero .nome')).toHaveCSS('opacity', '1');
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce' });

    test('o cartão aparece direto, sem digitação', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('.janela-do-hero')).toHaveAttribute('data-fase', 'cartao');
      await expect(page.locator('.janela-do-hero .codigo')).toHaveCount(0);
      await expect(page.locator('.cartao .status')).toBeVisible();
    });
  });
});

test.describe('Início em cartão no celular', () => {
  test.use({ viewport: CELULAR, visao: 'cartao' });

  test('cabe na tela, sem rolagem horizontal, com os cartões em uma coluna', async ({ page }) => {
    await abrirInicio(page);

    const transborda = await rolante(page).evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(transborda).toBe(false);
    await expect(page.locator('.hero .nome')).toBeInViewport();
    const largura = await page
      .locator('app-sobre-em-cartoes article')
      .first()
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(largura).toBeGreaterThan(CELULAR.width * 0.6);
  });

  test('o hero mostra as ações principais sem rolar', async ({ page }) => {
    await abrirInicio(page);

    await expect(page.getByRole('link', { name: /Ver projetos/ }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: /Currículo/ }).first()).toBeInViewport();
  });
});
