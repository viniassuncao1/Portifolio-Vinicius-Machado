import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { abrirHidratada, abrirPastas, arquivoDaArvore, linhasDoCodigo } from './apoio';
import { expect, test } from './fixtures';

const REPOSITORIO = 'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado';
const DESKTOP = { width: 1920, height: 1080 };
const CELULAR = { width: 390, height: 844 };

const codigo = (page: Page) => page.locator('main code');
const javadocs = (page: Page) => page.locator('main .javadoc');

test.describe('Projeto 2: este portfólio como estudo com IA (/projeto-2)', () => {
  test('está na árvore, na pasta projetos, depois do Projeto 1, e abre como Projeto2.java', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);

    const projetos = page
      .getByRole('navigation', { name: 'Seções do portfólio' })
      .locator('#grupo-projetos a');
    await expect(projetos).toHaveText([
      'Projeto1.java',
      'Projeto2.java',
      'Projeto3.java',
      'Projeto4.java',
      'Projeto5.java',
      'Projeto6.java',
    ]);
    await arquivoDaArvore(page, 'Projeto 2').click();

    await expect(page).toHaveURL(/\/projeto-2$/);
    await expect(page).toHaveTitle('Projeto 2 | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 2');
    await expect(page.getByRole('tab', { name: 'Projeto2.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(arquivoDaArvore(page, 'Projeto 2')).toHaveAttribute('aria-current', 'page');
  });

  test('é um arquivo só, rolando: o estudo, SDD com OpenSpec, ECC e Maestri, sem controle de páginas', async ({
    page,
  }) => {
    await page.goto('/projeto-2');

    await expect(
      page
        .locator('main .papel-comentario')
        .filter({ hasText: /^\/\/ (O estudo|SDD com OpenSpec|ECC|Maestri)$/ }),
    ).toHaveText(['// O estudo', '// SDD com OpenSpec', '// ECC', '// Maestri']);
    await expect(javadocs(page)).toHaveCount(4);
    await expect(page.getByRole('navigation', { name: 'Páginas da seção' })).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\b\d\/4\b/);
  });

  test('o estudo apresenta o portfólio, a feita com IA e o código aberto no GitHub', async ({
    page,
  }) => {
    await page.goto('/projeto-2');

    await expect(javadocs(page).first()).toContainText('estudo de desenvolvimento com IA');
    await expect(javadocs(page).first()).toContainText('Angular 22');
    await expect(codigo(page)).toContainText(REPOSITORIO);
  });

  test('o SDD com OpenSpec, o ECC de Affaan Mustafa e o Maestri de Evert Junior estão no texto', async ({
    page,
  }) => {
    await page.goto('/projeto-2');
    const texto = (await javadocs(page).allTextContents()).join(' ');

    expect(texto).toContain('OpenSpec');
    expect(texto).toContain('Spec-Driven Development');
    expect(texto).toContain('Affaan Mustafa');
    expect(texto).toContain('hackathon Anthropic x Forum Ventures em setembro de 2025');
    expect(texto).toContain('Maestri');
    expect(texto).toContain('Evert Junior');
    expect(texto).toContain('desenvolvedor brasileiro');
    for (const agente of [
      'Regente',
      'Pincel',
      'Compasso',
      'Sentinela',
      'Escriba',
      'Grafite',
      'Nanquim',
    ]) {
      expect(texto, agente).toContain(agente);
    }
  });

  test('os links externos (repositório, OpenSpec, ECC e Maestri) abrem em nova aba com rel seguro', async ({
    page,
  }) => {
    await page.goto('/projeto-2');
    const externos = page.locator('main a[href^="https://"]');

    const hrefs = await externos.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        REPOSITORIO,
        `${REPOSITORIO}/tree/main/openspec`,
        'https://github.com/affaan-m/ECC',
        'https://www.producthunt.com/products/maestri',
      ]),
    );
    for (const link of await externos.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('a lista de skills do ECC e a equipe de agentes aparecem em List.of', async ({ page }) => {
    await page.goto('/projeto-2');
    const linhas = (await linhasDoCodigo(page)).join(' ');

    for (const skill of ['accessibility', 'motion-foundations', 'li-human']) {
      expect(linhas, skill).toContain(`"${skill}"`);
    }
    for (const agente of ['Regente', 'Pincel', 'Nanquim']) {
      expect(linhas, agente).toContain(`"${agente}"`);
    }
  });

  test('o code vision "▶ Executar · Ver no GitHub" é um link para o repositório em nova aba', async ({
    page,
    context,
  }) => {
    await context.route('https://github.com/**', (rota) =>
      rota.fulfill({ contentType: 'text/html', body: '<title>GitHub</title>' }),
    );
    await page.goto('/projeto-2');
    const visao = page.getByRole('link', { name: /Executar · Ver no GitHub/ });

    await expect(visao).toBeVisible();
    await expect(visao).toHaveAttribute('href', REPOSITORIO);
    await expect(visao).toHaveAttribute('target', '_blank');
    await expect(visao).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(visao).toHaveAccessibleName(/abre em nova aba/);
    const classe = (await page
      .locator('main code > .linha', { hasText: 'public class' })
      .boundingBox())!;
    const caixa = (await visao.boundingBox())!;
    expect(caixa.y + caixa.height).toBeLessThanOrEqual(classe.y + 1);

    const [nova] = await Promise.all([context.waitForEvent('page'), visao.click()]);

    await expect(nova).toHaveURL(REPOSITORIO);
    expect(await nova.evaluate(() => window.opener)).toBeNull();
    await expect(page).toHaveURL(/\/projeto-2$/);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('não abre a janela de preview: não é um projeto com site', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');

    await expect(
      page.getByRole('button', { name: /Executar Projeto \d|Ver o site ao vivo/ }),
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Executar PortfolioApplication' })).toBeVisible();
  });

  test('"// Ver o repositório →" leva à página do repositório', async ({ page }) => {
    await abrirHidratada(page, '/projeto-2');

    await page.getByRole('link', { name: '// Ver o repositório →' }).click();

    await expect(page).toHaveURL(/\/repositorio$/);
  });

  test('sem JavaScript o HTML traz o texto, a lista de agentes e os links', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/projeto-2');

    await expect(pagina.locator('main code')).toContainText('Ferramenta maestri');
    await expect(pagina.locator('main .javadoc').nth(3)).toContainText('Evert Junior');
    await expect(pagina.locator('main a[href="https://github.com/affaan-m/ECC"]')).toHaveCount(1);
    await expect(pagina.locator('main')).not.toContainText('em construção');
    await contexto.close();
  });
});

for (const [nomeDaTela, viewport] of [
  ['desktop', DESKTOP],
  ['celular', CELULAR],
] as const) {
  test.describe(`Projeto 2 no ${nomeDaTela}`, () => {
    test.use({ viewport });

    for (const tema of ['dark', 'light'] as const) {
      test(`passa no axe sem exclusões (${tema})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
        await abrirHidratada(page, '/projeto-2');

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
          .analyze();

        expect(
          violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
        ).toEqual([]);
      });
    }

    test('o texto cabe na largura, sem rolagem horizontal nem linha cortada', async ({ page }) => {
      await abrirHidratada(page, '/projeto-2');

      const cortadas = await page
        .locator('main code > .linha')
        .evaluateAll((els) =>
          els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
        );
      const cabe = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      );

      expect(cortadas).toEqual([]);
      expect(cabe).toBe(true);
    });
  });
}
