import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { linhasDoCodigo, normalizar } from './apoio';

const COR_VALOR = 'rgb(79, 175, 172)';
const COR_LITERAL = 'rgb(143, 194, 88)';
const COR_DECLARACAO = 'rgb(213, 150, 62)';

const cor = (alvo: Locator) => alvo.evaluate((el) => getComputedStyle(el).color);

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
      'public static final boolean FAD = false;',
      'public static final boolean PART_OF_THE_JOB = true;',
      'public static final List<String> TOOLS = List.of("Claude Code", "Codex");',
      'public static final String METHODOLOGY = "SDD (Spec-Driven Development)";',
      'private ArtificialIntelligence() {}',
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
      'boolean FAD',
      'boolean PART_OF_THE_JOB',
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
      'public record TechSkills(',
      'List<String> languages,',
      'List<String> frameworks,',
      'List<String> databases',
      ') {',
      'public static final TechSkills CORE = new TechSkills(',
      'List.of(',
      '"Java",',
      '"TypeScript",',
      '"JavaScript",',
      '"PHP",',
      '"SQL"',
      '),',
      'List.of(',
      '"Spring Boot",',
      '"Spring Data JPA",',
      '"Angular"',
      '),',
      'List.of(',
      '"Oracle",',
      '"PostgreSQL",',
      '"MySQL"',
      ')',
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

  test('mostra o controle 1/2 só com a próxima página', async ({ page }) => {
    await page.goto('/skills');

    await expect(controle(page)).toContainText('1/2');
    await expect(controle(page).locator('[aria-current="page"]')).toHaveAccessibleName(
      'página 1 de 2',
    );
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveAttribute(
      'href',
      '/skills/2',
    );
    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveCount(0);
  });

  test('vai para a página 2 pelo link e o controle passa a mostrar 2/2', async ({ page }) => {
    await page.goto('/skills');

    await controle(page).getByRole('link', { name: 'Próxima página' }).click();

    await expect(page).toHaveURL(/\/skills\/2$/);
    await expect(controle(page)).toContainText('2/2');
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
      'public record InfraSkills(',
      'List<String> cloudAndInfra,',
      'List<String> tools',
      ') {',
      'public static final InfraSkills CORE = new InfraSkills(',
      'List.of(',
      '"Docker",',
      '"Kubernetes",',
      '"Nginx",',
      '"AWS",',
      '"Azure"',
      '),',
      'List.of(',
      '"Git",',
      '"GitLab CI/CD",',
      '"Grafana",',
      '"Scrum"',
      ')',
      ');',
      '}',
    ]);
    await expect(controle(page)).toContainText('2/2');
  });

  test('mostra só a página anterior, que volta para /skills', async ({ page }) => {
    await page.goto('/skills/2');

    await expect(controle(page).getByRole('link', { name: 'Página anterior' })).toHaveAttribute(
      'href',
      '/skills',
    );
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveCount(0);
    await expect(controle(page).locator('[aria-current="page"]')).toHaveAccessibleName(
      'página 2 de 2',
    );
  });

  test('indica a página no título da janela e no h1', async ({ page }) => {
    await page.goto('/skills/2');

    await expect(page).toHaveTitle('Skills / STACK (2/2) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK (2/2)');
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
    await expect(controle(page)).toContainText('2/2');

    const anterior = controle(page).getByRole('link', { name: 'Página anterior' });
    await focarComTab(page, anterior);
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/skills$/);
    await expect(controle(page)).toContainText('1/2');
  });

  test('o botão voltar do navegador volta da página 2 para a 1', async ({ page }) => {
    await page.goto('/skills');
    await controle(page).getByRole('link', { name: 'Próxima página' }).click();
    await expect(page).toHaveURL(/\/skills\/2$/);

    await page.goBack();

    await expect(page).toHaveURL(/\/skills$/);
    await expect(controle(page)).toContainText('1/2');
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

  test('/skills entrega o código e o controle 1/2 no HTML', async ({ page }) => {
    await page.goto('/skills');

    await expect(page.locator('main code')).toContainText('record TechSkills(');
    await expect(controle(page)).toContainText('1/2');
    await expect(controle(page).getByRole('link', { name: 'Próxima página' })).toHaveAttribute(
      'href',
      '/skills/2',
    );
  });

  test('/skills/2 entrega a segunda página, o título e o controle 2/2 no HTML', async ({
    page,
  }) => {
    await page.goto('/skills/2');

    await expect(page).toHaveTitle('Skills / STACK (2/2) | Vinicius Machado');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Skills / STACK (2/2)');
    await expect(page.locator('main code')).toContainText('record InfraSkills(');
    await expect(controle(page)).toContainText('2/2');
    await expect(page.getByRole('link', { name: 'Skills / STACK' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
