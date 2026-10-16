import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { SECOES } from '../src/app/core/secoes';
import { abrirHidratada, abrirPastas, arquivoDaArvore } from './apoio';

const ORIGEM = 'https://vinimachado.wattscompany.com.br';
const SITE = 'Vinicius Machado';
const IMAGEM = `${ORIGEM}/compartilhamento/portfolio.png`;
const LIMITE_DA_DESCRICAO = 160;
const TOTAL_DE_PAGINAS = 18;

/**
 * O Início, cada seção (um arquivo só: `/`, `/skills`) e a página do repositório, que
 * não é uma seção da árvore mas tem rota e aba próprias.
 */
const ROTAS = ['/', ...SECOES.map((secao) => `/${secao.slug}`), '/repositorio'];

/** Endereço absoluto esperado de uma rota: o Início termina na barra, as demais não. */
const enderecoDe = (rota: string): string => (rota === '/' ? `${ORIGEM}/` : `${ORIGEM}${rota}`);

const meta = (page: Page, atributo: 'name' | 'property', nome: string) =>
  page.locator(`head meta[${atributo}="${nome}"]`);

/** Tudo o que um robô lê do `<head>`, em um objeto. */
async function metadados(page: Page) {
  const conteudo = async (atributo: 'name' | 'property', nome: string) =>
    meta(page, atributo, nome).getAttribute('content');
  return {
    titulo: await page.title(),
    descricao: await conteudo('name', 'description'),
    canonico: await page.locator('head link[rel="canonical"]').getAttribute('href'),
    ogTitulo: await conteudo('property', 'og:title'),
    ogDescricao: await conteudo('property', 'og:description'),
    ogUrl: await conteudo('property', 'og:url'),
    ogImagem: await conteudo('property', 'og:image'),
    ogLargura: await conteudo('property', 'og:image:width'),
    ogAltura: await conteudo('property', 'og:image:height'),
    ogAlt: await conteudo('property', 'og:image:alt'),
    ogTipo: await conteudo('property', 'og:type'),
    ogLocale: await conteudo('property', 'og:locale'),
    ogSite: await conteudo('property', 'og:site_name'),
    twitterCartao: await conteudo('name', 'twitter:card'),
    twitterTitulo: await conteudo('name', 'twitter:title'),
    twitterDescricao: await conteudo('name', 'twitter:description'),
    twitterImagem: await conteudo('name', 'twitter:image'),
  };
}

test('a lista de rotas tem as 18 páginas, sem repetir nenhuma', () => {
  expect(ROTAS).toHaveLength(TOTAL_DE_PAGINAS);
  expect(new Set(ROTAS).size).toBe(ROTAS.length);
});

test.describe('Metadados no HTML pré-renderizado (sem JavaScript)', () => {
  test.use({ javaScriptEnabled: false });

  for (const rota of ROTAS) {
    test(`${rota}: título, descrição, canônico e cartão de compartilhamento`, async ({ page }) => {
      await page.goto(rota);
      const m = await metadados(page);

      expect(m.titulo, 'título').toContain(SITE);
      expect(m.descricao, 'descrição').toBeTruthy();
      expect(m.descricao!.trim().length, 'descrição não vazia').toBeGreaterThan(0);
      expect(m.descricao!.length, 'descrição até 160').toBeLessThanOrEqual(LIMITE_DA_DESCRICAO);
      expect(m.canonico, 'canônico').toBe(enderecoDe(rota));
      expect(m.canonico).toMatch(/^https:\/\//);

      expect(m.ogTitulo, 'og:title').toBe(m.titulo);
      expect(m.ogDescricao, 'og:description').toBe(m.descricao);
      expect(m.ogUrl, 'og:url').toBe(m.canonico);
      expect(m.ogImagem, 'og:image').toBe(IMAGEM);
      expect(m.ogLargura, 'og:image:width').toBe('2400');
      expect(m.ogAltura, 'og:image:height').toBe('1260');
      expect(m.ogAlt?.trim(), 'og:image:alt').toBeTruthy();
      expect(m.ogTipo, 'og:type').toBe('website');
      expect(m.ogLocale, 'og:locale').toBe('pt_BR');
      expect(m.ogSite, 'og:site_name').toBe(SITE);

      expect(m.twitterCartao, 'twitter:card').toBe('summary_large_image');
      expect(m.twitterTitulo, 'twitter:title').toBe(m.titulo);
      expect(m.twitterDescricao, 'twitter:description').toBe(m.descricao);
      expect(m.twitterImagem, 'twitter:image').toBe(IMAGEM);
    });
  }

  test('o título e a descrição de /skills são os da spec', async ({ page }) => {
    await page.goto('/skills');
    const m = await metadados(page);

    expect(m.titulo).toBe('Skills / STACK | Vinicius Machado');
    expect(m.descricao).toContain('Java, Spring Boot, Angular');
    expect(m.canonico).toBe(`${ORIGEM}/skills`);
  });

  test('cada seção tem a sua descrição, diferente das outras', async ({ page }) => {
    const descricoes = new Map<string, string>();

    for (const secao of SECOES) {
      await page.goto(`/${secao.slug}`);
      descricoes.set(secao.slug, (await metadados(page)).descricao ?? '');
    }

    expect(new Set(descricoes.values()).size).toBe(SECOES.length);
  });

  test('o título e o canônico de uma seção não indicam página', async ({ page }) => {
    await page.goto('/skills');
    const m = await metadados(page);

    expect(m.titulo).toBe('Skills / STACK | Vinicius Machado');
    expect(m.canonico).toBe(`${ORIGEM}/skills`);
    expect(m.ogUrl).toBe(`${ORIGEM}/skills`);
  });

  test('cada página tem um só canônico e um só título', async ({ page }) => {
    for (const rota of ['/', '/skills', '/projeto-4']) {
      await page.goto(rota);

      await expect(page.locator('head link[rel="canonical"]'), rota).toHaveCount(1);
      await expect(page.locator('head title'), rota).toHaveCount(1);
      await expect(page.locator('head meta[name="description"]'), rota).toHaveCount(1);
    }
  });

  test('os dados estruturados Person existem só no Início e são JSON válido', async ({ page }) => {
    await page.goto('/');
    const blocos = await page.locator('script[type="application/ld+json"]').allTextContents();

    expect(blocos).toHaveLength(1);
    const dados = JSON.parse(blocos[0]);
    expect(dados['@context']).toBe('https://schema.org');
    expect(dados['@type']).toBe('Person');
    expect(dados.name).toBe('Vinicius Machado');
    expect(dados.jobTitle).toBeTruthy();
    expect(dados.url).toBe(ORIGEM);
    expect(dados.sameAs).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^https:\/\/(www\.)?linkedin\.com\/in\/viniassuncao/),
        'https://github.com/viniassuncao1',
      ]),
    );
    expect(dados.knowsAbout).toEqual(expect.arrayContaining(['Java', 'Spring Boot', 'Angular']));
  });

  test('as outras páginas não trazem dados estruturados', async ({ page }) => {
    for (const rota of ROTAS.filter((r) => r !== '/')) {
      await page.goto(rota);

      await expect(page.locator('script[type="application/ld+json"]'), rota).toHaveCount(0);
    }
  });
});

test.describe('Arquivos de SEO servidos pelo site', () => {
  test('/robots.txt é texto simples, permite tudo e aponta para o sitemap', async ({ request }) => {
    const resposta = await request.get('/robots.txt');
    const texto = await resposta.text();

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toContain('text/plain');
    expect(texto).toMatch(/^User-agent: \*$/m);
    expect(texto).toMatch(/^Allow: \/$/m);
    expect(texto).not.toMatch(/^Disallow: \/$/m);
    expect(texto).toMatch(new RegExp(`^Sitemap: ${ORIGEM}/sitemap\\.xml$`, 'm'));
  });

  test('/sitemap.xml é XML e lista as 18 páginas em endereços absolutos', async ({ request }) => {
    const resposta = await request.get('/sitemap.xml');
    const xml = await resposta.text();
    const enderecos = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]);

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toContain('application/xml');
    expect(xml).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(enderecos).toHaveLength(TOTAL_DE_PAGINAS);
    expect(new Set(enderecos).size).toBe(TOTAL_DE_PAGINAS);
    expect([...enderecos].sort()).toEqual(ROTAS.map(enderecoDe).sort());
    for (const antigo of [
      '/skills/2',
      '/skills/3',
      '/experiencias/2',
      '/projeto-4/3',
      '/projeto-5/4',
    ]) {
      expect(enderecos, `${antigo} não entra no sitemap`).not.toContain(`${ORIGEM}${antigo}`);
    }
    expect(enderecos.filter((endereco) => /\/\d+$/.test(endereco))).toEqual([]);
    enderecos.forEach((endereco) => expect(endereco).toMatch(/^https:\/\//));
  });

  test('nenhum arquivo de SEO cita mais o domínio antigo da Vercel', async ({ request }) => {
    for (const arquivo of ['/', '/skills', '/sitemap.xml', '/robots.txt']) {
      const texto = await (await request.get(arquivo)).text();

      expect(texto, arquivo).not.toContain('portfolio-vinicius-machado.vercel.app');
      expect(texto, arquivo).toContain('vinimachado.wattscompany.com.br');
    }
  });

  test('o sitemap e os canônicos listam os mesmos endereços', async ({ page, request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const doSitemap = new Set(Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]));

    for (const rota of ['/', '/skills', '/certificacoes', '/projeto-4', '/depoimentos']) {
      await page.goto(rota);

      expect(doSitemap.has((await metadados(page)).canonico ?? ''), rota).toBe(true);
    }
  });

  test('a imagem de compartilhamento responde 200, é PNG e tem 2400x1260', async ({ request }) => {
    const resposta = await request.get('/compartilhamento/portfolio.png');
    const bytes = await resposta.body();

    expect(resposta.status()).toBe(200);
    expect(resposta.headers()['content-type']).toContain('image/png');
    expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
    // O cabeçalho IHDR do PNG guarda largura e altura nos bytes 16 a 23.
    expect(bytes.readUInt32BE(16)).toBe(2400);
    expect(bytes.readUInt32BE(20)).toBe(1260);
  });
});

test.describe('Metadados ao navegar com JavaScript', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('de / para /skills as metas e o canônico acompanham a página', async ({ page }) => {
    await abrirHidratada(page, '/');
    const inicio = await metadados(page);
    expect(inicio.canonico).toBe(`${ORIGEM}/`);

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Skills / STACK').click();
    await expect(page).toHaveURL(/\/skills$/);

    await expect.poll(async () => (await metadados(page)).canonico).toBe(`${ORIGEM}/skills`);
    const skills = await metadados(page);
    expect(skills.titulo).toBe('Skills / STACK | Vinicius Machado');
    expect(skills.ogTitulo).toBe(skills.titulo);
    expect(skills.ogUrl).toBe(`${ORIGEM}/skills`);
    expect(skills.descricao).not.toBe(inicio.descricao);
    expect(skills.ogDescricao).toBe(skills.descricao);
    expect(skills.twitterDescricao).toBe(skills.descricao);
    expect(skills.ogImagem).toBe(IMAGEM);
    expect(skills.twitterCartao).toBe('summary_large_image');
  });

  test('as metas navegadas são as mesmas do HTML pré-renderizado', async ({ page, browser }) => {
    await abrirHidratada(page, '/');
    await abrirPastas(page);
    await arquivoDaArvore(page, 'Certificações').click();
    await expect.poll(async () => (await metadados(page)).canonico).toBe(`${ORIGEM}/certificacoes`);

    const semJs = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await semJs.newPage();
    await pagina.goto('/certificacoes');

    expect(await metadados(page)).toEqual(await metadados(pagina));
    await semJs.close();
  });

  test('um endereço antigo de página redireciona e o canônico é o da seção', async ({ page }) => {
    await page.goto('/skills/2');

    await expect(page).toHaveURL(/\/skills$/);
    await expect.poll(async () => (await metadados(page)).canonico).toBe(`${ORIGEM}/skills`);
    const m = await metadados(page);
    expect(m.titulo).toBe('Skills / STACK | Vinicius Machado');
    expect(m.ogUrl).toBe(`${ORIGEM}/skills`);
  });

  test('ao voltar para o Início, os dados estruturados Person continuam só nele', async ({
    page,
  }) => {
    await abrirHidratada(page, '/');
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);

    await abrirPastas(page);
    await arquivoDaArvore(page, 'Skills / STACK').click();
    await expect(page).toHaveURL(/\/skills$/);

    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  });
});
