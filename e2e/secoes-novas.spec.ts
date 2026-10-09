import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { linhasDoCodigo } from './apoio';

const COR_VALOR = 'rgb(79, 175, 172)';

const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

test.describe('Experiências (/experiencias)', () => {
  test('página 1: Memora, Desenvolvedor Full Stack Júnior, desde 08/2026 e o controle 1/3', async ({
    page,
  }) => {
    await page.goto('/experiencias');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'import java.time.YearMonth;',
        'import java.util.List;',
        'import java.util.Optional;',
        'public class Experiences {',
        'record Experience(',
        'String company,',
        'Optional<YearMonth> end,',
        'static final Experience MEMORA = new Experience(',
        '"Memora",',
        '"Desenvolvedor Full Stack Júnior",',
        'YearMonth.of(2026, 8),',
        'Optional.empty(), // em andamento (Presente)',
      ]),
    );
    await expect(controle(page)).toContainText('1/3');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiências');
  });

  test('página 1: liderança de squad e Scrum nos destaques e no Javadoc', async ({ page }) => {
    await page.goto('/experiencias');

    await expect(codigo(page)).toContainText('"Liderança de squad"');
    await expect(page.locator('main .javadoc')).toContainText(
      'Lidero um squad, orientando o time nas demandas',
    );
    await expect(page.locator('main .javadoc')).toContainText(
      'Scrum, com dailies, previsões de conclusão e reviews',
    );
  });

  test('página 2: estágio na Memora, 08/2025 a 07/2026, sem declarar o record de novo', async ({
    page,
  }) => {
    await page.goto('/experiencias/2');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'static final Experience MEMORA_INTERNSHIP = new Experience(',
        '"Memora",',
        '"Estagiário de Desenvolvimento",',
        'YearMonth.of(2025, 8),',
        'Optional.of(YearMonth.of(2026, 7)),',
      ]),
    );
    expect(linhas).not.toContain('record Experience(');
    await expect(controle(page)).toContainText('2/3');
  });

  test('página 2: Oracle para PostgreSQL, scrapers com Playwright, AyoForms e Sankhya', async ({
    page,
  }) => {
    await page.goto('/experiencias/2');

    for (const trecho of [
      '"Migração de APIs de Oracle para PostgreSQL"',
      '"Scrapers em Java + Playwright"',
      '"AyoForms em PHP + MySQL"',
      '"Correção de bug crítico no faturamento (Sankhya)"',
    ]) {
      await expect(codigo(page)).toContainText(trecho);
    }
    for (const trecho of ['Coren e Sanesul', 'Google Workspace e Microsoft Azure']) {
      await expect(page.locator('main .javadoc')).toContainText(trecho);
    }
  });

  test('página 3: Watts Company, Co-fundador & Desenvolvedor Full Stack, desde 02/2025', async ({
    page,
  }) => {
    await page.goto('/experiencias/3');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'static final Experience WATTS_COMPANY = new Experience(',
        '"Watts Company",',
        '"Co-fundador & Desenvolvedor Full Stack",',
        'YearMonth.of(2025, 2),',
        'Optional.empty(), // em andamento (Presente)',
      ]),
    );
    await expect(controle(page)).toContainText('3/3');
    await expect(page.locator('main .javadoc')).toContainText('integrei modelos de IA via n8n');
  });

  test('o controle percorre as três páginas e a árvore mantém Experiências como atual', async ({
    page,
  }) => {
    await page.goto('/experiencias');

    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/experiencias\/2$/);
    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/experiencias\/3$/);

    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveCount(0);
    await expect(arvore(page).getByRole('link', { name: 'Experiências' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page).toHaveTitle('Experiências (3/3) | Vinicius Machado');
  });

  test('/experiencias/4 não existe e leva ao Início', async ({ page }) => {
    await page.goto('/experiencias/4');

    await expect(page).toHaveURL('/');
  });

  test('as três páginas usam períodos de java.time', async ({ page }) => {
    for (const rota of ['/experiencias', '/experiencias/2', '/experiencias/3']) {
      await page.goto(rota);

      await expect(codigo(page)).toContainText('YearMonth.of(');
    }
  });
});

test.describe('Eventos (/eventos)', () => {
  test('lista Brasília IT, Campus Party Brasília e BB Digital Week em List.of', async ({
    page,
  }) => {
    await page.goto('/eventos');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.util.List;',
      'public class Events {',
      'record Event(String name, int times) {}',
      'static final List<Event> ATTENDED = List.of(',
      'new Event("Brasília IT", 1),',
      'new Event("Campus Party Brasília", 2), // 2x',
      'new Event("BB Digital Week", 1)',
      ');',
      '}',
    ]);
  });

  test('a Campus Party aparece com duas participações; os outros eventos, com uma', async ({
    page,
  }) => {
    await page.goto('/eventos');
    const valores = page.locator('main .papel-valor');

    await expect(valores).toHaveText(['1', '2', '1']);
    expect(await valores.nth(1).evaluate((el) => getComputedStyle(el).color)).toBe(COR_VALOR);
    await expect(page.locator('main .papel-comentario')).toHaveText(['// 2x']);
  });

  test('tem aba, título e árvore da seção', async ({ page }) => {
    await page.goto('/eventos');

    await expect(page).toHaveTitle('Eventos | Vinicius Machado');
    await expect(page.getByRole('tab', { name: 'Eventos.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(arvore(page).getByRole('link', { name: 'Eventos' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

test.describe('Formação (/formacao)', () => {
  test('mostra UniCEUB, bacharelado em Ciência da Computação e conclusão em 2027', async ({
    page,
  }) => {
    await page.goto('/formacao');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.time.Year;',
      'public class Education {',
      'record Degree(',
      'String institution,',
      'String course,',
      'Year expectedGraduation) {}',
      'static final Degree DEGREE = new Degree(',
      '"UniCEUB",',
      '"Bacharelado em Ciência da Computação",',
      'Year.of(2027)',
      ');',
      '}',
    ]);
  });

  test('o ano previsto usa a cor de valor', async ({ page }) => {
    await page.goto('/formacao');
    const ano = page.locator('main .papel-valor');

    await expect(ano).toHaveText('2027');
    expect(await ano.evaluate((el) => getComputedStyle(el).color)).toBe(COR_VALOR);
  });
});

test.describe('Idiomas (/idiomas)', () => {
  test('mostra inglês e espanhol em nível básico, com o enum Level', async ({ page }) => {
    await page.goto('/idiomas');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'import java.util.Map;',
        'public class Languages {',
        'enum Level {',
        'BASIC("Básico"),',
        'static final Map<String, Level> SPOKEN = Map.of(',
        '"Inglês", Level.BASIC,',
        '"Espanhol", Level.BASIC',
      ]),
    );
  });

  test('declara os quatro níveis do enum, em ordem', async ({ page }) => {
    await page.goto('/idiomas');

    await expect(page.locator('main .papel-declaracao').filter({ hasText: /^[A-Z]+$/ })).toHaveText(
      ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'FLUENT'],
    );
  });
});

test.describe('Contato (/contato)', () => {
  test('mostra e-mail, telefone, LinkedIn e GitHub no record Contact', async ({ page }) => {
    await page.goto('/contato');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.net.URI;',
      'public record Contact(',
      'String email,',
      'String phone,',
      'URI linkedin,',
      'URI github) {',
      'public static final Contact VINICIUS = new Contact(',
      '"viniciusmassuncao@gmail.com",',
      '"+55 61 98283-7805",',
      'URI.create("https://linkedin.com/in/viniassuncao"),',
      'URI.create("https://github.com/viniassuncao1")',
      ');',
      '}',
    ]);
  });

  test('os quatro contatos são links reais: mailto:, tel: e https', async ({ page }) => {
    await page.goto('/contato');
    const links = page.locator('main code a');

    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute('href', 'mailto:viniciusmassuncao@gmail.com');
    await expect(links.nth(1)).toHaveAttribute('href', 'tel:+5561982837805');
    await expect(links.nth(2)).toHaveAttribute('href', 'https://linkedin.com/in/viniassuncao');
    await expect(links.nth(3)).toHaveAttribute('href', 'https://github.com/viniassuncao1');
  });

  test('os https abrem em nova aba com rel seguro; mailto e tel não', async ({ page }) => {
    await page.goto('/contato');
    const links = page.locator('main code a');

    for (const i of [2, 3]) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveAttribute('rel', 'noopener noreferrer');
    }
    for (const i of [0, 1]) {
      await expect(links.nth(i)).not.toHaveAttribute('target', /.+/);
      await expect(links.nth(i)).not.toHaveAttribute('rel', /.+/);
    }
  });

  test('clicar no LinkedIn abre o perfil numa nova aba', async ({ page, context }) => {
    await context.route('https://linkedin.com/**', (rota) =>
      rota.fulfill({ contentType: 'text/html', body: '<title>LinkedIn</title>' }),
    );
    await page.goto('/contato');

    const [nova] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('main code a').nth(2).click(),
    ]);

    expect(nova.url()).toBe('https://linkedin.com/in/viniassuncao');
    expect(page.url()).toMatch(/\/contato$/);
  });

  test('os links têm nome acessível e são alcançáveis pelo teclado', async ({ page }) => {
    await page.goto('/contato');
    const links = page.locator('main code a');

    for (let i = 0; i < 4; i++) {
      await links.nth(i).focus();
      await expect(links.nth(i)).toBeFocused();
      await expect(links.nth(i)).toHaveAccessibleName(/.+/);
    }
  });
});

test.describe('Cinco seções novas sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const [rota, trecho] of [
    ['/experiencias', 'static final Experience MEMORA'],
    ['/experiencias/2', 'MEMORA_INTERNSHIP'],
    ['/experiencias/3', 'WATTS_COMPANY'],
    ['/eventos', 'Campus Party Brasília'],
    ['/formacao', 'UniCEUB'],
    ['/idiomas', 'Level.BASIC'],
    ['/contato', 'mailto:viniciusmassuncao@gmail.com'],
  ] as const) {
    test(`${rota} entrega o código no HTML`, async ({ page }) => {
      await page.goto(rota);

      if (trecho.startsWith('mailto:')) {
        await expect(page.locator('main code a').first()).toHaveAttribute('href', trecho);
      } else {
        await expect(codigo(page)).toContainText(trecho);
      }
      await expect(page.locator('main')).not.toContainText('em construção');
    });
  }

  test('/experiencias entrega o controle 1/3 no HTML', async ({ page }) => {
    await page.goto('/experiencias');

    await expect(controle(page)).toContainText('1/3');
  });
});
