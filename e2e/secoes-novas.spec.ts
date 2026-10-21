import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { linhasDoCodigo } from './apoio';

const COR_VALOR = 'rgb(42, 172, 184)';

const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const codigo = (page: Page) => page.locator('main code');

test.describe('Experiências (/experiencias): as três num arquivo só', () => {
  test('mostra Memora, o estágio na Memora e a Watts Company no mesmo arquivo, cada uma com empresa, cargo e período', async ({
    page,
  }) => {
    await page.goto('/experiencias');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'import java.util.List;',
        'public class Experiencias {',
        'record Experiencia(',
        'String empresa,',
        'String cargo,',
        'String periodo,',
        'Experiencia memora = new Experiencia(',
        '"Desenvolvedor Full Stack Júnior",',
        '"08/2026 - Presente",',
        'Experiencia estagioNaMemora = new Experiencia(',
        '"Estagiário de Desenvolvimento",',
        '"08/2025 - 07/2026",',
        'Experiencia wattsCompany = new Experiencia(',
        '"Watts Company",',
        '"Co-fundador & Desenvolvedor Full Stack",',
        '"02/2025 - Presente",',
      ]),
    );
    expect(linhas.filter((l) => l.startsWith('record Experiencia('))).toHaveLength(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experiências');
    await expect(page).toHaveTitle('Experiências | Vinicius Machado');
  });

  test('não tem controle de páginas nem indicação n/N', async ({ page }) => {
    await page.goto('/experiencias');

    await expect(controle(page)).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/\b\d\/3\b/);
  });

  test('cada experiência tem o seu bloco de comentário, em ordem', async ({ page }) => {
    await page.goto('/experiencias');

    await expect(page.locator('main .papel-comentario')).toContainText([
      'Cada experiência tem empresa, cargo, período e destaques',
      'Memora',
      'Estágio na Memora',
      'Watts Company',
    ]);
  });

  test('stack do dia a dia e liderança de squad nos destaques e no Javadoc da Memora', async ({
    page,
  }) => {
    await page.goto('/experiencias');

    await expect(codigo(page)).toContainText(
      '"APIs REST em Java 21 e Spring Boot, com Spring Data JPA e Spring Security"',
    );
    await expect(codigo(page)).toContainText(
      '"Liderança de squad no Scrum: dúvidas, planejamento e merge requests"',
    );
    await expect(page.locator('main .javadoc').first()).toContainText(
      'numa arquitetura de microsserviços (login, gateway, financeiro, RH, entre outros)',
    );
    await expect(page.locator('main .javadoc').first()).toContainText('componentes em Angular 17');
  });

  test('o estágio cita Oracle para PostgreSQL, scrapers com Playwright, AyoForms e Sankhya', async ({
    page,
  }) => {
    await page.goto('/experiencias');

    for (const trecho of [
      '"Migração de APIs e microsserviços de Oracle para PostgreSQL"',
      '"Entidades JPA, DTOs e SQL nativo adaptados na migração"',
      '"Scrapers em Java + Playwright"',
      '"AyoForms em PHP 8, JavaScript e MySQL"',
      '"Correção de bug crítico no faturamento (Sankhya)"',
    ]) {
      await expect(codigo(page)).toContainText(trecho);
    }
    for (const trecho of ['Coren e Sanesul', 'Google Workspace e Microsoft Azure']) {
      await expect(page.locator('main .javadoc').nth(1)).toContainText(trecho);
    }
  });

  test('a Watts Company aparece com o Javadoc e os destaques', async ({ page }) => {
    await page.goto('/experiencias');

    await expect(page.locator('main .javadoc').nth(2)).toContainText(
      'integrei modelos de IA via n8n',
    );
    await expect(codigo(page)).toContainText('"Modelos de IA integrados via n8n"');
  });

  test('a árvore mantém Experiências como atual e o próximo arquivo é o seguinte da árvore', async ({
    page,
  }) => {
    await page.goto('/experiencias');

    await expect(arvore(page).getByRole('treeitem', { name: 'Experiências' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('app-proximo-arquivo a')).toHaveText(/^\/\/ Próximo: \S+\.java →$/);
  });

  test('os endereços antigos (/experiencias/2, /3 e /4) levam a /experiencias', async ({
    page,
  }) => {
    for (const antigo of ['/experiencias/2', '/experiencias/3', '/experiencias/4']) {
      await page.goto(antigo);

      await expect(page, antigo).toHaveURL(/\/experiencias$/);
      await expect(codigo(page), antigo).toContainText('"Watts Company"');
    }
  });

  test('os três períodos são texto simples, sem java.time', async ({ page }) => {
    await page.goto('/experiencias');

    for (const periodo of ['08/2026 - Presente', '08/2025 - 07/2026', '02/2025 - Presente']) {
      await expect(codigo(page)).toContainText(`"${periodo}"`);
    }
    await expect(codigo(page)).not.toContainText('YearMonth');
    await expect(codigo(page)).not.toContainText('Optional');
  });
});

test.describe('Eventos (/eventos)', () => {
  test('lista Brasília IT, Campus Party Brasília e BB Digital Week em List.of', async ({
    page,
  }) => {
    await page.goto('/eventos');

    expect(await linhasDoCodigo(page)).toEqual([
      'package dev.vinicius.portfolio.formacao;',
      'import java.util.List;',
      'public class Eventos {',
      expect.stringMatching(/^\/\/ .+/),
      'record Evento(String nome, int vezes) {}',
      expect.stringMatching(/^\/\/ .+/),
      'List<Evento> participei = List.of(',
      'new Evento("Brasília IT", 1),',
      'new Evento("Campus Party Brasília", 2), // 2x',
      'new Evento("BB Digital Week", 1)',
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
    await expect(page.locator('main .papel-comentario').filter({ hasText: '2x' })).toHaveText([
      '// 2x',
    ]);
  });

  test('tem aba, título e árvore da seção', async ({ page }) => {
    await page.goto('/eventos');

    await expect(page).toHaveTitle('Eventos | Vinicius Machado');
    await expect(page.getByRole('tab', { name: 'Eventos.java' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(arvore(page).getByRole('treeitem', { name: 'Eventos' })).toHaveAttribute(
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
      'package dev.vinicius.portfolio.formacao;',
      'public class Formacao {',
      expect.stringMatching(/^\/\/ .+/),
      'record Graduacao(',
      'String instituicao,',
      'String curso,',
      'int anoPrevistoDeFormatura) {}',
      expect.stringMatching(/^\/\/ .+/),
      'Graduacao graduacao = new Graduacao(',
      '"UniCEUB",',
      '"Bacharelado em Ciência da Computação",',
      '2027',
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
  test('mostra inglês e espanhol em nível básico, em constantes simples', async ({ page }) => {
    await page.goto('/idiomas');
    const linhas = await linhasDoCodigo(page);

    expect(linhas).toEqual(
      expect.arrayContaining([
        'public class Idiomas {',
        expect.stringMatching(/^\/\/ .+/),
        'String ingles = "Básico";',
        'String espanhol = "Básico";',
      ]),
    );
    await expect(codigo(page)).not.toContainText('static final');
    await expect(codigo(page)).not.toContainText('Map.of');
    await expect(codigo(page)).not.toContainText('enum');
  });

  test('os dois níveis são textos entre aspas, na cor de literal', async ({ page }) => {
    await page.goto('/idiomas');

    await expect(page.locator('main .papel-literal')).toHaveText(['"Básico"', '"Básico"']);
  });
});

test.describe('Contato (/contato)', () => {
  test('mostra e-mail, telefone, LinkedIn e GitHub no record Contatos', async ({ page }) => {
    await page.goto('/contato');

    expect(await linhasDoCodigo(page)).toEqual([
      'package dev.vinicius.portfolio.contato;',
      'public class Contato {',
      expect.stringMatching(/^\/\/ .+/),
      'record Contatos(',
      'String email,',
      'String telefone,',
      'String linkedin,',
      'String github) {}',
      expect.stringMatching(/^\/\/ .+/),
      'Contatos vinicius = new Contatos(',
      '"viniciusmassuncao@gmail.com",',
      '"+55 61 98283-7805",',
      '"linkedin.com/in/viniassuncao",',
      '"github.com/viniassuncao1"',
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

  // Experiências, Formação e Contato têm cartão e código: sem JavaScript o HTML traz o cartão.
  for (const [rota, trecho] of [
    ['/experiencias', 'Desenvolvedor Full Stack Júnior'],
    ['/formacao', 'UniCEUB'],
  ] as const) {
    test(`${rota} entrega o cartão no HTML`, async ({ page }) => {
      await page.goto(rota);

      await expect(page.locator('main .cartao-da-secao')).toContainText(trecho);
      await expect(page.locator('main')).not.toContainText('em construção');
    });
  }

  test('/contato entrega o cartão com os contatos como links reais no HTML', async ({ page }) => {
    await page.goto('/contato');

    await expect(
      page.locator('main .cartao-da-secao a[href="mailto:viniciusmassuncao@gmail.com"]'),
    ).toHaveCount(1);
    await expect(page.locator('main')).not.toContainText('em construção');
  });

  // Eventos e Idiomas só têm a visão em código.
  for (const [rota, trecho] of [
    ['/eventos', 'Campus Party Brasília'],
    ['/idiomas', '"Básico"'],
  ] as const) {
    test(`${rota} entrega o código no HTML`, async ({ page }) => {
      await page.goto(rota);

      await expect(codigo(page)).toContainText(trecho);
      await expect(page.locator('main')).not.toContainText('em construção');
    });
  }

  test('/experiencias entrega as três experiências no HTML, sem controle de páginas', async ({
    page,
  }) => {
    await page.goto('/experiencias');

    await expect(controle(page)).toHaveCount(0);
    await expect(page.locator('main .commit')).toHaveCount(3);
    await expect(page.locator('main')).toContainText('Watts Company');
  });
});
