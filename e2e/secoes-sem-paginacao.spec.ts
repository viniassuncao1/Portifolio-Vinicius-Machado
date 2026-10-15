import { readFile } from 'node:fs/promises';

import { SECOES } from '../src/app/core/secoes';
import { linhasDoCodigo } from './apoio';
import { expect, test } from './fixtures';

const ORIGEM = 'https://portfolio-vinicius-machado.vercel.app';
/** As cinco seções que já tiveram páginas (`/<seção>/<n>`). */
const COM_ENDERECO_ANTIGO = [
  { slug: 'skills', titulo: 'Skills / STACK', antigos: [2, 3], ultimo: 'Conhecimento teórico' },
  { slug: 'experiencias', titulo: 'Experiências', antigos: [2, 3], ultimo: 'wattsCompany' },
  { slug: 'projeto-4', titulo: 'Projeto 4', antigos: [2, 3], ultimo: 'AyoForms' },
  { slug: 'projeto-5', titulo: 'Projeto 5', antigos: [2, 3, 4], ultimo: 'Ferramenta maestri' },
  { slug: 'certificacoes', titulo: 'Certificações', antigos: [2, 3], ultimo: 'Git e GitHub' },
] as const;

const controle = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Páginas da seção' });

test.describe('Seções numa tela só', () => {
  test('nenhuma rota do site tem controle de páginas, indicação n/N nem links de página', async ({
    page,
  }) => {
    for (const rota of ['/', ...SECOES.map((secao) => `/${secao.slug}`), '/repositorio']) {
      await page.goto(rota);
      await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

      await expect(controle(page), rota).toHaveCount(0);
      await expect(
        page.getByRole('link', { name: /Próxima página|Página anterior/ }),
        rota,
      ).toHaveCount(0);
      await expect(page.locator('main'), rota).not.toContainText(/\b\d\/[2-9]\b/);
      if (rota !== '/') await expect(page, rota).toHaveTitle(/^[^()]+\| Vinicius Machado$/);
    }
  });

  for (const { slug, titulo, ultimo } of COM_ENDERECO_ANTIGO) {
    test(`/${slug} mostra tudo no mesmo arquivo, até o fim (${ultimo})`, async ({ page }) => {
      await page.goto(`/${slug}`);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
      const texto = (await linhasDoCodigo(page)).join('\n');
      expect(texto).toContain(ultimo);
      expect(texto.trimEnd().endsWith('}')).toBe(true);
      expect(texto.match(/^public class /gm), 'uma só classe pública por arquivo').toHaveLength(1);
    });
  }
});

test.describe('Endereços antigos das páginas', () => {
  for (const { slug, titulo, antigos } of COM_ENDERECO_ANTIGO) {
    for (const n of antigos) {
      test(`/${slug}/${n} leva a /${slug}`, async ({ page }) => {
        await page.goto(`/${slug}/${n}`);

        await expect(page).toHaveURL(new RegExp(`/${slug}$`));
        await expect(page).toHaveTitle(`${titulo} | Vinicius Machado`);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
        await expect(controle(page)).toHaveCount(0);
      });
    }
  }

  test('o redirecionamento deixa uma aba só e não prende o botão voltar', async ({ page }) => {
    await page.goto('/sobre-mim');
    await page.goto('/skills/3');
    await expect(page).toHaveURL(/\/skills$/);

    await expect(page.getByRole('tab', { name: 'Skills.java' })).toHaveCount(1);
    await expect(page.getByRole('tab', { name: 'Skills.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.goBack();

    await expect(page).toHaveURL(/\/sobre-mim$/);
  });

  test('o endereço antigo mantém o item da seção como atual na árvore', async ({ page }) => {
    await page.goto('/experiencias/2');

    await expect(page).toHaveURL(/\/experiencias$/);
    await expect(
      page
        .getByRole('navigation', { name: 'Seções do portfólio' })
        .locator('[aria-current="page"]'),
    ).toHaveCount(1);
  });

  test('seções que nunca tiveram páginas não redirecionam: /sobre-mim/2 vai ao Início', async ({
    page,
  }) => {
    await page.goto('/sobre-mim/2');

    await expect(page).toHaveURL('/');
  });

  test('na Vercel o redirecionamento é permanente (301) só para as cinco seções com páginas', async () => {
    const config = JSON.parse(await readFile('vercel.json', 'utf8')) as {
      redirects: { source: string; destination: string; permanent: boolean }[];
    };
    const regra = config.redirects.find((r) => r.destination === '/:secao');

    expect(regra, 'regra de redirecionamento das páginas').toBeDefined();
    expect(regra!.permanent).toBe(true);
    const origem = new RegExp(
      '^' +
        regra!.source
          .replace(/^\/:secao\((.+)\)\/:pagina\((.+)\)$/, '/($1)/($2)')
          .replace(/\\\\/g, '\\') +
        '$',
    );
    for (const { slug, antigos } of COM_ENDERECO_ANTIGO) {
      for (const n of antigos) expect(origem.test(`/${slug}/${n}`), `/${slug}/${n}`).toBe(true);
    }
    expect(origem.test('/sobre-mim/2')).toBe(false);
    expect(origem.test('/skills')).toBe(false);
    expect(origem.test('/skills/abc')).toBe(false);
  });
});

test.describe('Sitemap sem as páginas antigas', () => {
  test('lista uma URL por seção e nenhuma /<seção>/<n>', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const enderecos = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);

    expect(enderecos).toHaveLength(SECOES.length + 2);
    for (const secao of SECOES) expect(enderecos).toContain(`${ORIGEM}/${secao.slug}`);
    for (const { slug, antigos } of COM_ENDERECO_ANTIGO) {
      for (const n of antigos) expect(enderecos).not.toContain(`${ORIGEM}/${slug}/${n}`);
    }
    expect(enderecos.filter((endereco) => /\/\d+$/.test(endereco))).toEqual([]);
  });
});

test.describe('Seções inteiras no celular (390x844)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const { slug } of COM_ENDERECO_ANTIGO) {
    test(`/${slug} rola na vertical, sem corte nem rolagem horizontal`, async ({ page }) => {
      await page.goto(`/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

      const { cabe, cortadas } = await page.evaluate(() => ({
        cabe: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        cortadas: [...document.querySelectorAll('main code > .linha')]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.textContent),
      }));

      expect(cabe).toBe(true);
      expect(cortadas).toEqual([]);
    });
  }
});
