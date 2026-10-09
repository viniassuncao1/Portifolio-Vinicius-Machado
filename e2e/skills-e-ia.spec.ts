import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const COR_VALOR = 'rgb(79, 175, 172)';
const COR_LITERAL = 'rgb(143, 194, 88)';
const COR_DECLARACAO = 'rgb(213, 150, 62)';

const normalizar = (texto: string | null) => (texto ?? '').replace(/\s+/g, ' ').trim();

const linhasDoCodigo = async (page: Page) =>
  (
    await page
      .locator('main code > span')
      .evaluateAll((els) => els.map((el) => el.textContent ?? ''))
  )
    .map(normalizar)
    .filter((linha) => linha !== '');

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
  test('exibe a classe ArtificialIntelligence, os campos, a anotação e o método da tela 04', async ({
    page,
  }) => {
    await page.goto('/como-uso-ia');

    expect(await linhasDoCodigo(page)).toEqual([
      'public class ArtificialIntelligence {',
      'boolean modismo = false;',
      'boolean parteDoTrabalho = true;',
      '@Override',
      'public void comoEuUsoIA() {',
      expect.stringContaining('Não vejo IA como modismo'),
      '}',
    ]);
  });

  test('começa e termina o parágrafo com os textos da spec', async ({ page }) => {
    await page.goto('/como-uso-ia');

    const paragrafo = normalizar(await page.locator('main .paragrafo').textContent());

    expect(paragrafo.startsWith('Não vejo IA como modismo')).toBe(true);
    expect(paragrafo.endsWith('parte de como eu planejo e entrego código.')).toBe(true);
  });

  test('colore false e true com a cor de valor e os campos como declaração', async ({ page }) => {
    await page.goto('/como-uso-ia');
    const valores = page.locator('main .papel-valor');

    await expect(valores).toHaveText(['false', 'true']);
    expect(await cor(valores.nth(0))).toBe(COR_VALOR);
    expect(await cor(valores.nth(1))).toBe(COR_VALOR);
    expect(await cor(page.locator('main .papel-declaracao').first())).toBe(COR_DECLARACAO);
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
  test('exibe os três arrays da tela 05', async ({ page }) => {
    await page.goto('/skills');

    expect(await linhasDoCodigo(page)).toEqual([
      'public class TechSkills {',
      'String[] linguagens = {',
      '“Java”,',
      '“TypeScript”,',
      '“JavaScript”,',
      '“PHP”,',
      '“SQL”',
      '};',
      'String[] frameworks = {',
      '“Spring Boot”,',
      '“Spring Data JPA”,',
      '“Angular”',
      '};',
      'String[] databases = {',
      '“Oracle”,',
      '“PostgreSQL”,',
      '“MySQL”',
      '};',
    ]);
  });

  test('colore os textos dos arrays como literais, sem papel de valor', async ({ page }) => {
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
  test('abre direto pelo endereço com os dois arrays da tela 06', async ({ page }) => {
    await page.goto('/skills/2');

    expect(await linhasDoCodigo(page)).toEqual([
      'public class TechSkills {',
      'String[] cloudAndInfra = {',
      '“Docker”,',
      '“Kubernetes”,',
      '“Nginx”,',
      '“AWS”,',
      '“Azure”',
      '};',
      'String[] ferramentas = {',
      '“Git”,',
      '“GitLab CI/CD”,',
      '“Grafana”,',
      '“Scrum”',
      '};',
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

  test('/como-uso-ia entrega o código, os valores e o parágrafo no HTML', async ({ page }) => {
    await page.goto('/como-uso-ia');

    await expect(page.locator('main code')).toContainText('ArtificialIntelligence');
    await expect(page.locator('main .papel-valor')).toHaveText(['false', 'true']);
    await expect(page.locator('main .paragrafo')).toContainText('Não vejo IA como modismo');
    await expect(page.getByRole('link', { name: 'Como uso a IA' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('/skills entrega o código e o controle 1/2 no HTML', async ({ page }) => {
    await page.goto('/skills');

    await expect(page.locator('main code')).toContainText('String[] linguagens = {');
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
    await expect(page.locator('main code')).toContainText('String[] cloudAndInfra = {');
    await expect(controle(page)).toContainText('2/2');
    await expect(page.getByRole('link', { name: 'Skills / STACK' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
