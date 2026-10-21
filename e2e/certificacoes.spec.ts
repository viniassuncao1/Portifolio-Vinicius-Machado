import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { esperarLogDoRun, linhasDoCodigo, textoDoCodigo } from './apoio';

const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

/** Os nove cursos das telas 19 a 21, do mais recente para o mais antigo, num arquivo só. */
const CURSOS = [
  ['Spring Boot 3: desenvolva uma API Rest em Java', 10, '2025, 12, 19'],
  ['Java: persistência de dados e consultas com Spring Data JPA', 16, '2025, 12, 9'],
  ['Java: consumindo API, gravando arquivos e lidando com erros', 10, '2025, 11, 5'],
  ['HTTP: entendendo a web por baixo dos panos', 10, '2025, 10, 14'],
  ['Angular: construa uma aplicação web com componentes, template e CLI', 8, '2025, 9, 22'],
  ['TypeScript na prática: implemente um projeto completo', 12, '2025, 9, 11'],
  ['Python para Dados: primeiros passos', 10, '2025, 4, 8'],
  ['Python: avance na Orientação a Objetos e consuma API', 8, '2025, 3, 27'],
  ['Git e GitHub: repositório, commit e versões', 8, '2025, 3, 25'],
] as const;

test.describe('Certificações (/certificacoes): os nove cursos num arquivo só', () => {
  test('mostra o nome, as horas e a data de cada um dos nove cursos', async ({ page }) => {
    await page.goto('/certificacoes');
    const texto = await textoDoCodigo(page);

    for (const [nome, horas, data] of CURSOS) {
      expect(texto, nome).toContain(`"${nome}",`);
      expect(texto, nome).toContain(`${horas}, LocalDate.of(${data}));`);
    }
  });

  test('os nove cursos aparecem do mais recente para o mais antigo, sem controle de páginas', async ({
    page,
  }) => {
    await page.goto('/certificacoes');
    const datas: number[] = [];
    const nomes: string[] = [];

    for (const linha of await linhasDoCodigo(page)) {
      const nome = /^"(.+)",$/.exec(linha);
      const data = /LocalDate\.of\((\d+), (\d+), (\d+)\)/.exec(linha);
      if (nome) nomes.push(nome[1]);
      if (data) datas.push(Date.UTC(Number(data[1]), Number(data[2]) - 1, Number(data[3])));
    }

    expect(nomes).toEqual(CURSOS.map(([nome]) => nome));
    expect(datas).toHaveLength(9);
    expect(datas).toEqual([...datas].sort((a, b) => b - a));
    await expect(controle(page)).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\b\d\/3\b/);
  });

  test('declara o record uma vez só, com o comentário em pt-BR', async ({ page }) => {
    await page.goto('/certificacoes');

    await expect(page.locator('main .papel-comentario').first()).toContainText(
      'Cada curso tem o nome, as horas e a data de conclusão',
    );
    expect((await textoDoCodigo(page)).split('record Certificacao(').length - 1).toBe(1);
  });

  test('tem título e h1 sem (n/N) e a árvore com a seção atual', async ({ page }) => {
    await page.goto('/certificacoes');

    await expect(page).toHaveTitle('Certificações | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Certificações');
    await expect(arvore(page).getByRole('treeitem', { name: 'Certificações' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('os endereços antigos levam a /certificacoes, que já tem todos os cursos', async ({
    page,
  }) => {
    for (const antigo of ['/certificacoes/2', '/certificacoes/3', '/certificacoes/4']) {
      await page.goto(antigo);

      await expect(page, antigo).toHaveURL(/\/certificacoes$/);
      await expect(codigo(page), antigo).toContainText('Git e GitHub');
    }
  });

  test('/certificacoes não tem violações de acessibilidade (axe, WCAG 2 A e AA)', async ({
    page,
  }) => {
    await page.goto('/certificacoes');
    await expect(page.getByRole('heading', { level: 1 })).toBeAttached();
    await esperarLogDoRun(page);

    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual([]);
  });
});

test.describe('Certificações sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/certificacoes entrega os nove cursos no HTML, sem controle de páginas', async ({
    page,
  }) => {
    await page.goto('/certificacoes');

    for (const [nome] of CURSOS) {
      await expect(page.locator('main .cartao-da-secao')).toContainText(nome);
    }
    await expect(controle(page)).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('em construção');
  });
});
