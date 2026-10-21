import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { SECOES } from '../src/app/core/secoes';
import { expect, test } from './fixtures';

const DESKTOP = { width: 1440, height: 900 };
const TAGS = ['wcag2a', 'wcag2aa'];
/** Todas as seções, menos a vitrine, têm as duas visões. */
const COM_DUAS_VISOES = SECOES.filter((secao) => secao.slug !== 'projetos');

async function abrirSecao(page: Page, rota: string) {
  await page.goto(rota);
  await expect(page.locator('.cartao-da-secao')).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // O tema da seção assenta em 0,9 s.
  await expect
    .poll(() =>
      page.evaluate(
        () => document.getAnimations().filter((a) => a instanceof CSSTransition).length,
      ),
    )
    .toBe(0);
}

/** O Início só responde ao ponteiro depois da hidratação: o botão de copiar e-mail marca o fim dela. */
async function abrirInicio(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Copiar e-mail' }).first()).toBeVisible();
}

/** Mexe o mouse até a página reagir (a biblioteca de movimento chega depois da hidratação). */
async function mexerAteResponder(page: Page, x: number, y: number, esperar: () => Promise<void>) {
  await expect(async () => {
    await page.mouse.move(x - 8, y - 8);
    await page.mouse.move(x, y, { steps: 3 });
    await esperar();
  }).toPass({ timeout: 8000 });
}

test.describe('Visão em cartão das seções', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  for (const secao of COM_DUAS_VISOES) {
    test(`/${secao.slug}: abre no cartão, com o botão para o código e o editor ao trocar`, async ({
      page,
    }) => {
      await abrirSecao(page, `/${secao.slug}`);

      await expect(page.locator('main app-editor-de-codigo')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Ver como código' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );

      await page.getByRole('button', { name: 'Ver como código' }).click();
      await expect(page.locator('main app-editor-de-codigo')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ver como cartão' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });
  }

  test('o HTML pré-renderizado de cada seção já traz o cartão, sem JavaScript', async ({
    browser,
  }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false, viewport: DESKTOP });
    const page = await contexto.newPage();

    for (const secao of COM_DUAS_VISOES) {
      await page.goto(`/${secao.slug}`);
      await expect(page.locator('main .cartao-da-secao'), secao.slug).toBeAttached();
      await expect(
        page.locator('main .titulo-de-secao, main .titulo').first(),
        secao.slug,
      ).toBeAttached();
    }
    await contexto.close();
  });

  // Um teste por seção e esquema: as 17 seções num teste só estouravam o tempo no tema escuro.
  for (const esquema of ['dark', 'light'] as const) {
    for (const secao of COM_DUAS_VISOES) {
      test(`o cartão de ${secao.slug} passa no axe, com o tema da seção, no tema ${esquema}`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: esquema });
        await abrirSecao(page, `/${secao.slug}`);
        const { violations } = await new AxeBuilder({ page })
          .include('.cartao-da-secao')
          .withTags(TAGS)
          .analyze();
        expect(
          violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
        ).toEqual([]);
      });
    }
  }

  test('o cartão de projeto mostra o papel, os destaques e leva à vitrine', async ({ page }) => {
    await abrirSecao(page, '/projeto-3');

    await expect(page.getByRole('heading', { level: 3, name: 'Launcher de TV' })).toBeVisible();
    await expect(page.locator('main')).toContainText('Fork do CleanYourTV');
    await expect(page.locator('main .destaques li')).toHaveCount(3);
    await page.getByRole('link', { name: /Ver na vitrine/ }).click();
    await expect(page).toHaveURL(/\/projetos\/launcher-de-tv$/);
  });

  test('a seção Contato tem os quatro contatos como links reais no cartão', async ({ page }) => {
    await abrirSecao(page, '/contato');

    const hrefs = await page
      .locator('main .saida a')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs).toEqual([
      'mailto:viniciusmassuncao@gmail.com',
      'tel:+5561982837805',
      'https://linkedin.com/in/viniassuncao',
      'https://github.com/viniassuncao1',
    ]);
  });
});

test.describe('"Ver em código" da vitrine', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  test('abre o arquivo Java do projeto sem mudar a visão de sempre', async ({ page }) => {
    await page.goto('/projetos/launcher-de-tv');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page
      .getByRole('dialog')
      .getByRole('link', { name: /Ver em código/ })
      .click();

    await expect(page).toHaveURL(/\/projeto-3\?visao=codigo$/);
    await expect(page.locator('main app-editor-de-codigo')).toBeVisible();
    await expect(page.locator('main code')).toContainText('LauncherDeTv');
    expect(await page.evaluate(() => localStorage.getItem('visao-do-conteudo'))).toBe('cartao');
  });
});

test.describe('Interações de ponteiro', () => {
  test.use({ viewport: DESKTOP, visao: 'cartao' });

  test('o anel do cursor acompanha o mouse e cresce sobre um botão', async ({ page }) => {
    await abrirInicio(page);
    const anel = page.locator('app-cursor-do-site');
    await expect(anel).toHaveAttribute('aria-hidden', 'true');

    await mexerAteResponder(page, 700, 400, () =>
      expect(anel).toHaveAttribute('data-ativo', 'true'),
    );
    await expect(anel).toHaveAttribute('data-sobre-alvo', 'false');

    const botao = (await page
      .getByRole('link', { name: /Ver projetos/ })
      .first()
      .boundingBox())!;
    await mexerAteResponder(page, botao.x + botao.width / 2, botao.y + botao.height / 2, () =>
      expect(anel).toHaveAttribute('data-sobre-alvo', 'true'),
    );
  });

  test('o cartão de projeto em destaque se inclina com o mouse', async ({ page }) => {
    await abrirInicio(page);
    const cartao = page.locator('app-projetos-em-destaque a.cartao').first();
    await cartao.scrollIntoViewIfNeeded();
    const caixa = (await cartao.boundingBox())!;

    // A biblioteca de animação chega depois da hidratação: o mouse mexe até o cartão responder.
    await expect
      .poll(async () => {
        await page.mouse.move(caixa.x + caixa.width - 12, caixa.y + 10);
        await page.mouse.move(caixa.x + caixa.width - 4, caixa.y + 6, { steps: 4 });
        return cartao.evaluate((el) => (el as HTMLElement).style.transform);
      })
      .toContain('rotateY');
  });

  test.describe('com movimento reduzido', () => {
    test.use({ reducedMotion: 'reduce' });

    test('o anel do cursor não aparece e o cartão não se inclina', async ({ page }) => {
      await abrirInicio(page);

      await expect(page.locator('app-cursor-do-site')).toHaveCSS('display', 'none');
      const cartao = page.locator('app-projetos-em-destaque a.cartao').first();
      await cartao.scrollIntoViewIfNeeded();
      const caixa = (await cartao.boundingBox())!;
      await page.mouse.move(caixa.x + caixa.width - 4, caixa.y + 6);

      expect(await cartao.evaluate((el) => (el as HTMLElement).style.transform)).toBe('');
    });
  });
});
