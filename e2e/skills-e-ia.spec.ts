import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { linhasDoCodigo, normalizar } from './apoio';

const COR_VALOR = 'rgb(79, 175, 172)';
const COR_LITERAL = 'rgb(143, 194, 88)';
const COR_DECLARACAO = 'rgb(213, 150, 62)';

const cor = (alvo: Locator) => alvo.evaluate((el) => getComputedStyle(el).color);

const codigo = (page: Page) => page.locator('main code');
const controle = (page: Page) => page.getByRole('navigation', { name: 'Páginas da seção' });

/** Aperta Tab até o alvo receber o foco (o controle vem depois da árvore e do editor). */
async function focarComTab(page: Page, alvo: Locator) {
  for (let i = 0; i < 40; i++) {
    if (await alvo.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(alvo).toBeFocused();
}

test.describe('Como uso a IA (/como-uso-ia)', () => {
  test('exibe a classe ArtificialIntelligence com as constantes em Java moderno', async ({
    page,
  }) => {
    await page.goto('/como-uso-ia');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.util.List;',
      expect.stringContaining('Não vejo IA como modismo'),
      'public final class ArtificialIntelligence {',
      expect.stringMatching(/^\/\/ .+/),
      expect.stringMatching(/^public static final boolean [A-Z_]+ = false;$/),
      expect.stringMatching(/^public static final boolean [A-Z_]+ = true;$/),
      expect.stringMatching(/^\/\/ .+/),
      expect.stringMatching(
        /^public static final List<String> [A-Z_]+ = List\.of\("Claude Code", "Codex"\);$/,
      ),
      expect.stringMatching(
        /^public static final String [A-Z_]+ = "SDD \(Spec-Driven Development\)";$/,
      ),
      '}',
    ]);
  });

  test('começa e termina o Javadoc com os textos da spec', async ({ page }) => {
    await page.goto('/como-uso-ia');

    const texto = normalizar(await page.locator('main .javadoc').textContent());

    expect(texto.startsWith('Não vejo IA como modismo')).toBe(true);
    expect(texto.endsWith('parte de como eu planejo e entrego código.')).toBe(true);
  });

  test('preserva a Ana, o WhatsApp, o Claude Code, o Codex e o SDD', async ({ page }) => {
    await page.goto('/como-uso-ia');
    const bloco = page.locator('main .javadoc');

    for (const trecho of [
      'Watts Company',
      'a Ana, por exemplo, atende pacientes de uma clínica pelo WhatsApp',
      'Claude Code e Codex com metodologia SDD (Spec-Driven Development)',
    ]) {
      await expect(bloco).toContainText(trecho);
    }
  });

  test('colore false e true com a cor de valor e as constantes booleanas como declaração', async ({
    page,
  }) => {
    await page.goto('/como-uso-ia');
    const valores = page.locator('main .papel-valor');

    await expect(valores).toHaveText(['false', 'true']);
    expect(await cor(valores.nth(0))).toBe(COR_VALOR);
    expect(await cor(valores.nth(1))).toBe(COR_VALOR);
    await expect(page.locator('main .papel-declaracao')).toHaveText([
      /^boolean [A-Z_]+$/,
      /^boolean [A-Z_]+$/,
    ]);
    expect(await cor(page.locator('main .papel-declaracao').first())).toBe(COR_DECLARACAO);
  });

  test('lista as ferramentas e a metodologia como textos entre aspas', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(page.locator('main .papel-literal')).toHaveText([
      '"Claude Code"',
      '"Codex"',
      '"SDD (Spec-Driven Development)"',
    ]);
  });

  test('tem o título, o h1 e a árvore com a seção atual', async ({ page }) => {
    await page.goto('/como-uso-ia');

    const item = page.getByRole('link', { name: 'Como uso a IA' });

    await expect(page).toHaveTitle('Como uso a IA | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como uso a IA');
    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
  });

  test('não mostra controle de páginas', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(controle(page)).toHaveCount(0);
  });
});

test.describe('Skills / STACK (/skills)', () => {
  test('exibe as três listas imutáveis do record TechSkills (tela 05)', async ({ page }) => {
    await page.goto('/skills');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.util.List;',
      '// Linguagens, frameworks e bancos de dados que uso',
      'public record TechSkills(',
      'List<String> languages,',
      'List<String> frameworks,',
      'List<String> databases',
      ') {',
      expect.stringMatching(/^public static final TechSkills [A-Z_]+ = new TechSkills\($/),
      'List.of("Java", "TypeScript", "JavaScript", "PHP", "SQL"),',
      'List.of("Spring Boot", "Spring Data JPA", "Angular"),',
      'List.of("Oracle", "PostgreSQL", "MySQL")',
      ');',
      '}',
    ]);
  });

  test('colore os textos das listas como literais, sem papel de valor', async ({ page }) => {
    await page.goto('/skills');
    const literais = page.locator('main .papel-literal');

    await expect(literais).toHaveCount(11);
    expect(await cor(literais.first())).toBe(COR_LITERAL);
    await expect(page.locator('main .papel-valor')).toHaveCount(0);
  });

  test('mostra o controle 1/3 só com a próxima página', async ({ page }) => {
    await page.goto('/skills');

    await expect(controle(page)).toContainText('1/3');
    await expect(controle(page).locator('[aria-current="page"]')).toHaveAccessibleName(
      'página 1 de 3',
    );
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveAttribute(
      'href',
      '/skills/2',
    );
    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveCount(0);
  });

  test('vai para a página 2 pelo link e o controle passa a mostrar 2/3', async ({ page }) => {
    await page.goto('/skills');

    await controle(page).getByRole('link', { name: 'Próxima página' }).click();

    await expect(page).toHaveURL(/\/skills\/2$/);
    await expect(controle(page)).toContainText('2/3');
    await expect(page.locator('main code')).toContainText('cloudAndInfra');
  });

  test('uma seção de uma página só não tem controle', async ({ page }) => {
    await page.goto('/sobre-mim');

    await expect(controle(page)).toHaveCount(0);
  });

  test('tem título e h1 de Skills / STACK e a árvore com a seção atual', async ({ page }) => {
    await page.goto('/skills');

    const item = page.getByRole('link', { name: 'Skills / STACK' });

    await expect(page).toHaveTitle('Skills / STACK | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK');
    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
  });
});

test.describe('Skills / STACK, página 2 (/skills/2)', () => {
  test('abre direto pelo endereço com as duas listas do record InfraSkills (tela 06)', async ({
    page,
  }) => {
    await page.goto('/skills/2');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.util.List;',
      '// Nuvem, infraestrutura e ferramentas do dia a dia',
      'public record InfraSkills(',
      'List<String> cloudAndInfra,',
      'List<String> tools',
      ') {',
      expect.stringMatching(/^public static final InfraSkills [A-Z_]+ = new InfraSkills\($/),
      'List.of("Docker", "Kubernetes", "Nginx", "AWS", "Azure"),',
      'List.of("Git", "GitLab CI/CD", "Grafana", "Scrum")',
      ');',
      '}',
    ]);
    await expect(controle(page)).toContainText('2/3');
  });

  test('mostra a página anterior (/skills) e a próxima (/skills/3)', async ({ page }) => {
    await page.goto('/skills/2');

    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveAttribute(
      'href',
      '/skills',
    );
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveAttribute(
      'href',
      '/skills/3',
    );
    await expect(controle(page).locator('[aria-current="page"]')).toHaveAccessibleName(
      'página 2 de 3',
    );
  });

  test('indica a página no título da janela e no h1', async ({ page }) => {
    await page.goto('/skills/2');

    await expect(page).toHaveTitle('Skills / STACK (2/3) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK (2/3)');
  });

  test('mantém "Skills / STACK" como página atual, com a seta para baixo', async ({ page }) => {
    await page.goto('/skills/2');

    const item = page.getByRole('link', { name: 'Skills / STACK' });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.locator('nav [aria-current="page"]').first()).toHaveCount(1);
  });

  test('leva uma página inexistente (/skills/9) ao Início', async ({ page }) => {
    await page.goto('/skills/9');

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
  });

  test('/skills/4 não existe e leva ao Início', async ({ page }) => {
    await page.goto('/skills/4');

    await expect(page).toHaveURL('/');
  });
});

test.describe('Skills / STACK, página 3: níveis de conhecimento (/skills/3)', () => {
  const NIVEIS = [
    {
      nome: 'Domínio diário',
      descricao: 'uso todo dia no trabalho',
      tecnologias: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'Oracle', 'TypeScript', 'Git'],
    },
    {
      nome: 'Projeto completo',
      descricao: 'já entreguei um projeto inteiro com ela',
      tecnologias: ['PHP'],
    },
    {
      nome: 'Uso pontual',
      descricao: 'usei em tarefas isoladas',
      tecnologias: ['React Native', 'CI/CD'],
    },
    {
      nome: 'Conhecimento teórico',
      descricao: 'estudei, mas ainda não usei em produção',
      tecnologias: ['Python', 'AWS', 'Azure', 'Docker', 'Kubernetes'],
    },
  ];

  test('mostra os quatro níveis, cada um com a sua explicação em pt-BR', async ({ page }) => {
    await page.goto('/skills/3');

    for (const { nome, descricao } of NIVEIS) {
      await expect(codigo(page)).toContainText(`${nome}: ${descricao}`);
    }
  });

  test('mostra as tecnologias de cada nível, na ordem da spec', async ({ page }) => {
    await page.goto('/skills/3');
    const texto = (await linhasDoCodigo(page)).join(' ');

    for (const { tecnologias } of NIVEIS) {
      const lista = tecnologias.map((t) => `"${t}"`).join(', ');

      expect(texto, tecnologias[0]).toContain(`List.of(${lista})`);
    }
  });

  test('mostra o controle 3/3 só com a página anterior, que volta para /skills/2', async ({
    page,
  }) => {
    await page.goto('/skills/3');

    await expect(controle(page)).toContainText('3/3');
    await expect(controle(page).locator('[aria-current="page"]')).toHaveAccessibleName(
      'página 3 de 3',
    );
    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveAttribute(
      'href',
      '/skills/2',
    );
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveCount(0);
  });

  test('indica a página 3 no título da janela e no h1', async ({ page }) => {
    await page.goto('/skills/3');

    await expect(page).toHaveTitle('Skills / STACK (3/3) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK (3/3)');
  });

  test('começa com um comentário em pt-BR e não usa Optional nem genérico aninhado', async ({
    page,
  }) => {
    await page.goto('/skills/3');

    await expect(page.locator('main .papel-comentario').first()).toContainText(
      'Quanto conheço cada tecnologia',
    );
    const texto = (await codigo(page).textContent()) ?? '';

    expect(texto).not.toContain('Optional');
    expect(texto).not.toMatch(/<[^<>\n]*<[^<>\n]*>/);
  });

  test('o botão voltar do navegador volta da página 3 para a 2', async ({ page }) => {
    await page.goto('/skills/2');
    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/skills\/3$/);

    await page.goBack();

    await expect(page).toHaveURL(/\/skills\/2$/);
    await expect(controle(page)).toContainText('2/3');
  });
});

test.describe('Controle de páginas pelo teclado', () => {
  test('vai e volta com Tab e Enter, com o foco visível', async ({ page }) => {
    await page.goto('/skills');
    const proxima = controle(page).getByRole('link', { name: 'Próxima página' });

    await focarComTab(page, proxima);
    await expect(proxima).toHaveCSS('outline-style', 'solid');
    await expect(proxima).not.toHaveCSS('outline-width', '0px');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/skills\/2$/);
    await expect(controle(page)).toContainText('2/3');

    const anterior = controle(page).getByRole('link', { name: 'Página anterior' });
    await focarComTab(page, anterior);
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/skills$/);
    await expect(controle(page)).toContainText('1/3');
  });

  test('o botão voltar do navegador volta da página 2 para a 1', async ({ page }) => {
    await page.goto('/skills');
    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/skills\/2$/);

    await page.goBack();

    await expect(page).toHaveURL(/\/skills$/);
    await expect(controle(page)).toContainText('1/3');
  });
});

test.describe('Sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/como-uso-ia entrega o código, os valores e o Javadoc no HTML', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(page.locator('main code')).toContainText('ArtificialIntelligence');
    await expect(page.locator('main .papel-valor')).toHaveText(['false', 'true']);
    await expect(page.locator('main .javadoc')).toContainText('Não vejo IA como modismo');
    await expect(page.getByRole('link', { name: 'Como uso a IA' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('/skills entrega o código e o controle 1/3 no HTML', async ({ page }) => {
    await page.goto('/skills');

    await expect(page.locator('main code')).toContainText('record TechSkills(');
    await expect(controle(page)).toContainText('1/3');
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveAttribute(
      'href',
      '/skills/2',
    );
  });

  test('/skills/2 entrega a segunda página, o título e o controle 2/3 no HTML', async ({
    page,
  }) => {
    await page.goto('/skills/2');

    await expect(page).toHaveTitle('Skills / STACK (2/3) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK (2/3)');
    await expect(page.locator('main code')).toContainText('record InfraSkills(');
    await expect(controle(page)).toContainText('2/3');
    await expect(page.getByRole('link', { name: 'Skills / STACK' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('/skills/3 entrega os níveis de conhecimento e o controle 3/3 no HTML', async ({ page }) => {
    await page.goto('/skills/3');

    await expect(page).toHaveTitle('Skills / STACK (3/3) | Vinicius Machado');
    await expect(page.locator('main code')).toContainText('Domínio diário');
    await expect(page.locator('main code')).toContainText('Conhecimento teórico');
    await expect(controle(page)).toContainText('3/3');
  });
});
