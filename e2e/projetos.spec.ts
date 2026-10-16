import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { linhasDoCodigo, normalizar, textoDoCodigo } from './apoio';

const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('Projeto 1: a Ana (/projeto-1)', () => {
  test('mostra a Ana, o WhatsApp, o n8n, as integrações e o painel em React', async ({ page }) => {
    await page.goto('/projeto-1');
    const texto = await textoDoCodigo(page);

    expect(texto).toMatch(/class Ana\b/);
    for (const trecho of [
      '"WhatsApp"',
      '"n8n"',
      '"Google OAuth 2.0"',
      '"API do WhatsApp"',
      '"CRM em React"',
    ]) {
      expect(texto, trecho).toContain(trecho);
    }
  });

  test('lista o que a Ana faz pela fisioterapeuta', async ({ page }) => {
    await page.goto('/projeto-1');
    const texto = await textoDoCodigo(page);

    for (const tarefa of [
      'Responde pacientes',
      'Marca sessões',
      'Desmarca sessões',
      'Cancela sessões',
      'Envia confirmações',
      'Aciona a médica quando necessário',
      'Bloqueia spam',
    ]) {
      expect(texto, tarefa).toContain(`"${tarefa}"`);
    }
  });

  test('o texto da tela 10 fala da fisioterapeuta, do Claude Code, do SDD e dos feedbacks', async ({
    page,
  }) => {
    await page.goto('/projeto-1');
    const javadoc = page.locator('main .javadoc');

    for (const trecho of [
      'agente de IA em n8n',
      'fisioterapeuta autônoma',
      'atendimento via WhatsApp',
      'Google OAuth 2.0',
      'marca, desmarca e cancela sessões',
      'aciona a médica quando necessário e bloqueia spam',
      'painel de controle/CRM em React',
      'Claude Code',
      'SDD',
      'feedbacks diários de pacientes',
    ]) {
      await expect(javadoc, trecho).toContainText(trecho);
    }
  });

  test('tem título, h1, árvore e uma só página, sem Executar', async ({ page }) => {
    await page.goto('/projeto-1');

    await expect(page).toHaveTitle('Projeto 1 | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 1');
    await expect(arvore(page).getByRole('treeitem', { name: 'Projeto 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(controle(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Executar Projeto \d$/ })).toHaveCount(0);
  });
});

test.describe('Projeto 2: Dra. Juliana (/projeto-2)', () => {
  test('mostra a tecnologia, o tipo, o CTA e o link do site', async ({ page }) => {
    await page.goto('/projeto-2');
    const texto = await textoDoCodigo(page);

    expect(texto).toContain('"HTML + JavaScript"');
    expect(texto).toContain('"Landing Page"');
    expect(texto).toContain('"Agendar via WhatsApp"');
    await expect(
      page.getByRole('link', { name: '"https://www.drajulianamaluhy.com/"' }),
    ).toHaveAttribute('href', 'https://www.drajulianamaluhy.com/');
  });

  test('descreve o foco em conversão, a avaliação 5.0, as especialidades e o caminho ao WhatsApp', async ({
    page,
  }) => {
    await page.goto('/projeto-2');
    const javadoc = page.locator('main .javadoc');

    for (const trecho of [
      'HTML e JS puro',
      'design autoral',
      'conversão',
      'avaliação 5.0 no Doctoralia',
      'especialidades',
      'convênios',
      'depoimentos',
      'WhatsApp',
    ]) {
      await expect(javadoc, trecho).toContainText(trecho);
    }
  });

  test('mostra o ▶ de executar na calha, na linha public class', async ({ page }) => {
    await page.goto('/projeto-2');

    await expect(page.getByRole('button', { name: /^Executar Projeto \d$/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 2');
    await expect(controle(page)).toHaveCount(0);
  });
});

test.describe('Projeto 3: Watts Company (/projeto-3)', () => {
  test('mostra a tecnologia React, o tipo e o link do site', async ({ page }) => {
    await page.goto('/projeto-3');
    const texto = await textoDoCodigo(page);

    expect(texto).toContain('"React"');
    expect(texto).toContain('"Landing Page"');
    await expect(
      page.getByRole('link', { name: '"https://wattscompany.com.br/"' }),
    ).toHaveAttribute('href', 'https://wattscompany.com.br/');
  });

  test('descreve a proposta, a conversão de leads e o diagnóstico gratuito', async ({ page }) => {
    await page.goto('/projeto-3');
    const javadoc = page.locator('main .javadoc');

    for (const trecho of [
      'desenvolvida em React',
      'conversão de leads',
      'Automatize. Escale. Domine.',
      'bots para WhatsApp',
      'diagnóstico gratuito',
    ]) {
      await expect(javadoc, trecho).toContainText(trecho);
    }
  });

  test('mostra o ▶ de executar na calha, na linha public class', async ({ page }) => {
    await page.goto('/projeto-3');

    await expect(page.getByRole('button', { name: /^Executar Projeto \d$/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 3');
  });
});

const CASES = [
  {
    titulo: 'Oracle → PostgreSQL',
    stack: ['Java', 'Oracle', 'PostgreSQL', 'SQL'],
    javadoc: [
      'migração de APIs e microsserviços em produção',
      'login, financeiro',
      'DTOs',
      'SQL nativos',
    ],
  },
  {
    titulo: 'Scraper de licitações',
    stack: ['Java', 'Playwright', 'Coren', 'Sanesul'],
    javadoc: ['scrapers em Java com Playwright', 'Coren e Sanesul', 'sem usar APIs'],
  },
  {
    titulo: 'AyoForms',
    stack: ['PHP', 'MySQL', 'Google Workspace', 'Microsoft Azure', 'SharePoint'],
    javadoc: [
      'PHP puro e MySQL',
      'Google Workspace e Microsoft Azure',
      'upload de vídeo',
      'insights de origem de acesso',
      'votação',
      'SharePoint',
    ],
  },
] as const;

test.describe('Projeto 4: os três cases da Memora num arquivo só (/projeto-4)', () => {
  test('mostra os três cases, cada um com a stack e o que foi feito', async ({ page }) => {
    await page.goto('/projeto-4');
    const texto = await textoDoCodigo(page);
    const javadocs = normalizar((await page.locator('main .javadoc').allTextContents()).join(' '));

    for (const { titulo, stack, javadoc } of CASES) {
      const lista = stack.map((item) => `"${item}"`).join(', ');

      expect(texto, titulo).toContain(`"${titulo}"`);
      expect(texto, titulo).toContain(`List.of(${lista})`);
      for (const trecho of javadoc) expect(javadocs, trecho).toContain(trecho);
    }
    await expect(page.getByRole('button', { name: /^Executar Projeto \d$/ })).toHaveCount(0);
  });

  test('os cases vêm na ordem da spec, um comentário em pt-BR por case e o record uma vez só', async ({
    page,
  }) => {
    await page.goto('/projeto-4');
    const texto = await textoDoCodigo(page);

    expect(CASES.map(({ titulo }) => texto.indexOf(`"${titulo}"`))).toEqual(
      [...CASES.map(({ titulo }) => texto.indexOf(`"${titulo}"`))].sort((a, b) => a - b),
    );
    await expect(page.locator('main .papel-comentario').first()).toContainText(
      'Cases que entreguei na Memora',
    );
    expect(texto.split('record Caso(String titulo, List<String> tecnologias)').length - 1).toBe(1);
  });

  test('não tem controle de páginas, tem título sem (n/N) e a árvore mantém o Projeto 4 atual', async ({
    page,
  }) => {
    await page.goto('/projeto-4');

    await expect(controle(page)).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\b\d\/3\b/);
    await expect(arvore(page).getByRole('treeitem', { name: 'Projeto 4' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page).toHaveTitle('Projeto 4 | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projeto 4');
  });

  test('os endereços antigos (/projeto-4/2, /3 e /4) levam a /projeto-4', async ({ page }) => {
    for (const antigo of ['/projeto-4/2', '/projeto-4/3', '/projeto-4/4']) {
      await page.goto(antigo);

      await expect(page, antigo).toHaveURL(/\/projeto-4$/);
      await expect(codigo(page), antigo).toContainText('AyoForms');
    }
  });

  test('o código tem Java plausível: chaves e parênteses balanceados e sem Optional', async ({
    page,
  }) => {
    await page.goto('/projeto-4');
    const linhas = (await linhasDoCodigo(page)).join('\n');

    expect(linhas.split('(').length).toBe(linhas.split(')').length);
    expect(linhas.split('{').length).toBe(linhas.split('}').length);
    expect(linhas).not.toContain('Optional');
  });
});

test.describe('Projetos sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [rota, trecho] of [
    ['/projeto-1', 'WhatsApp'],
    ['/projeto-2', 'HTML + JavaScript'],
    ['/projeto-3', 'React'],
    ['/projeto-4', 'Oracle → PostgreSQL'],
  ] as const) {
    test(`${rota} entrega o conteúdo no HTML`, async ({ page }) => {
      await page.goto(rota);

      await expect(codigo(page)).toContainText(trecho);
      await expect(page.locator('main')).not.toContainText('em construção');
    });
  }
});

test.describe('Executar na calha', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  for (const [rota, nome] of [
    ['/projeto-2', 'Executar Projeto 2'],
    ['/projeto-3', 'Executar Projeto 3'],
  ] as const) {
    test(`${rota}: o ▶ fica na calha, na linha public class, sem cobrir o número`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(rota);
      const botao = page.getByRole('button', { name: nome });
      const linha = page.locator('main code > span', { hasText: 'public class' }).first();

      await expect(botao).toBeVisible();
      await expect(page.getByRole('button', { name: 'Executar', exact: true })).toHaveCount(0);
      const b = (await botao.boundingBox())!;
      const l = (await linha.boundingBox())!;
      const numeros = (await page.locator('app-editor-de-codigo .numeros').boundingBox())!;

      expect(b.x + b.width).toBeLessThanOrEqual(numeros.x + 1);
      expect(b.y).toBeLessThanOrEqual(l.y + l.height);
      expect(b.y + b.height).toBeGreaterThanOrEqual(l.y);
      expect(b.width).toBeGreaterThanOrEqual(24);
      expect(b.height).toBeGreaterThanOrEqual(24);
      expect(await botao.locator('img').first().getAttribute('src')).toContain(
        'icones/new-ui/executar',
      );
    });

    test(`${rota}: o ▶ tem foco visível e abre o preview`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(rota);
      const botao = page.getByRole('button', { name: nome });

      await botao.focus();
      await expect(botao).toHaveCSS('outline-style', 'solid');
      await expect(botao).not.toHaveCSS('outline-width', '0px');
      await botao.click();

      await expect(page.getByRole('dialog')).toBeVisible();
    });
  }

  test('seções sem site não têm ▶ na calha', async ({ page }) => {
    for (const rota of ['/', '/sobre-mim', '/projeto-1', '/projeto-4']) {
      await page.goto(rota);

      await expect(page.getByRole('button', { name: /^Executar Projeto/ })).toHaveCount(0);
    }
  });
});
