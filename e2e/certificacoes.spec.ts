import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { linhasDoCodigo, textoDoCodigo } from './apoio';

const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

/** Os nove cursos das telas 19 a 21, do mais recente para o mais antigo, três por página. */
const PAGINAS = [
  {
    rota: '/certificacoes',
    cursos: [
      ['Spring Boot 3: desenvolva uma API Rest em Java', 10, '2025, 12, 19'],
      ['Java: persistência de dados e consultas com Spring Data JPA', 16, '2025, 12, 9'],
      ['Java: consumindo API, gravando arquivos e lidando com erros', 10, '2025, 11, 5'],
    ],
  },
  {
    rota: '/certificacoes/2',
    cursos: [
      ['HTTP: entendendo a web por baixo dos panos', 10, '2025, 10, 14'],
      ['Angular: construa uma aplicação web com componentes, template e CLI', 8, '2025, 9, 22'],
      ['TypeScript na prática: implemente um projeto completo', 12, '2025, 9, 11'],
    ],
  },
  {
    rota: '/certificacoes/3',
    cursos: [
      ['Python para Dados: primeiros passos', 10, '2025, 4, 8'],
      ['Python: avance na Orientação a Objetos e consuma API', 8, '2025, 3, 27'],
      ['Git e GitHub: repositório, commit e versões', 8, '2025, 3, 25'],
    ],
  },
] as const;

test.describe('Certificações (/certificacoes)', () => {
  for (const [indice, { rota, cursos }] of PAGINAS.entries()) {
    test(`${rota}: mostra o nome, as horas e a data de cada curso (${indice + 1}/3)`, async ({
      page,
    }) => {
      await page.goto(rota);
      const texto = await textoDoCodigo(page);

      for (const [nome, horas, data] of cursos) {
        expect(texto, nome).toContain(`"${nome}",`);
        expect(texto, nome).toContain(`${horas}, LocalDate.of(${data}));`);
      }
      await expect(controle(page)).toContainText(`${indice + 1}/3`);
    });
  }

  test('os nove cursos aparecem sem faltar nenhum, do mais recente para o mais antigo', async ({
    page,
  }) => {
    const datas: number[] = [];
    const nomes: string[] = [];

    for (const { rota } of PAGINAS) {
      await page.goto(rota);
      const linhas = await linhasDoCodigo(page);

      for (const linha of linhas) {
        const nome = /^"(.+)",$/.exec(linha);
        const data = /LocalDate\.of\((\d+), (\d+), (\d+)\)/.exec(linha);
        if (nome) nomes.push(nome[1]);
        if (data) datas.push(Date.UTC(Number(data[1]), Number(data[2]) - 1, Number(data[3])));
      }
    }

    expect(nomes).toEqual(PAGINAS.flatMap(({ cursos }) => cursos.map(([nome]) => nome)));
    expect(datas).toHaveLength(9);
    expect(datas).toEqual([...datas].sort((a, b) => b - a));
  });

  test('a página 1 explica o registro em pt-BR e as outras não repetem a declaração', async ({
    page,
  }) => {
    await page.goto('/certificacoes');

    await expect(page.locator('main .papel-comentario').first()).toContainText(
      'Cada curso tem o nome, as horas e a data de conclusão',
    );
    await expect(codigo(page)).toContainText('record Certification(');

    await page.goto('/certificacoes/2');

    await expect(codigo(page)).not.toContainText('record Certification(');
  });

  test('tem título, h1 e árvore com a seção atual, e a página aparece no título', async ({
    page,
  }) => {
    await page.goto('/certificacoes');

    await expect(page).toHaveTitle('Certificações | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Certificações');
    await expect(arvore(page).getByRole('link', { name: 'Certificações' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await page.goto('/certificacoes/3');

    await expect(page).toHaveTitle('Certificações (3/3) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Certificações (3/3)');
    await expect(arvore(page).getByRole('link', { name: 'Certificações' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('o controle percorre as três páginas pelo teclado e pelos links', async ({ page }) => {
    await page.goto('/certificacoes');
    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveCount(0);

    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/certificacoes\/2$/);
    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/certificacoes\/3$/);

    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveCount(0);
    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveAttribute(
      'href',
      '/certificacoes/2',
    );
  });

  test('/certificacoes/4 não existe e leva ao Início', async ({ page }) => {
    await page.goto('/certificacoes/4');

    await expect(page).toHaveURL('/');
  });

  for (const rota of ['/certificacoes', '/certificacoes/2', '/certificacoes/3']) {
    test(`${rota} não tem violações de acessibilidade (axe, WCAG 2 A e AA)`, async ({ page }) => {
      await page.goto(rota);
      await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' ')}`)).toEqual(
        [],
      );
    });
  }
});

test.describe('Certificações sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const { rota, cursos } of PAGINAS) {
    test(`${rota} entrega os cursos e o controle no HTML`, async ({ page }) => {
      await page.goto(rota);

      for (const [nome] of cursos) await expect(codigo(page)).toContainText(nome);
      await expect(controle(page)).toContainText('/3');
      await expect(page.locator('main')).not.toContainText('em construção');
    });
  }
});
