import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const EDITOR = 'main app-editor-de-codigo';

/**
 * Congela os quadros de animação: a digitação (que avança em `requestAnimationFrame`) fica parada
 * no primeiro quadro e só termina por tecla ou clique. Torna os testes de "pular" determinísticos.
 */
const congelarQuadros = (page: Page) =>
  page.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
  });

/**
 * Registra, a cada mudança de classe do editor, se ele está digitando e quanto texto já está no
 * DOM, e quando a digitação começou e terminou.
 */
const observarDigitacao = (page: Page) =>
  page.addInitScript(() => {
    const registro = { inicio: 0, fim: 0, tamanhos: [] as number[], viuDigitando: false };
    (window as unknown as { __digitacao: typeof registro }).__digitacao = registro;
    new MutationObserver(() => {
      const editor = document.querySelector('main app-editor-de-codigo');
      if (!editor) return;
      const digitando = editor.classList.contains('digitando');
      if (digitando && !registro.viuDigitando) {
        registro.viuDigitando = true;
        registro.inicio = performance.now();
      }
      if (digitando) registro.tamanhos.push(editor.querySelector('code')?.textContent?.length ?? 0);
      if (!digitando && registro.viuDigitando && !registro.fim) registro.fim = performance.now();
    }).observe(document, { subtree: true, attributes: true, childList: true });
  });

const registroDeDigitacao = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          __digitacao: { inicio: number; fim: number; tamanhos: number[]; viuDigitando: boolean };
        }
      ).__digitacao,
  );

const abrirPelaArvore = async (page: Page, secao: string, url: RegExp) => {
  await page.getByRole('link', { name: secao, exact: true }).click();
  await expect(page).toHaveURL(url);
};

test.describe('Digitação do código', () => {
  test('ao abrir uma seção pela árvore o texto completo já está no DOM e a digitação termina', async ({
    page,
  }) => {
    await observarDigitacao(page);
    await page.goto('/');
    // O Início também digita ao carregar; zera o registro para medir só a abertura de Sobre Mim.
    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await page.evaluate(() => {
      const registro = (window as unknown as { __digitacao: Record<string, unknown> }).__digitacao;
      Object.assign(registro, { inicio: 0, fim: 0, tamanhos: [], viuDigitando: false });
    });
    const sobreMim = page.getByRole('link', { name: 'Sobre Mim', exact: true });
    await sobreMim.click();
    await expect(page).toHaveURL(/\/sobre-mim$/);

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    const registro = await registroDeDigitacao(page);
    const tamanhoFinal = await page
      .locator(`${EDITOR} code`)
      .evaluate((c) => c.textContent!.length);

    expect(registro.viuDigitando).toBe(true);
    // O texto completo esteve no DOM durante toda a digitação.
    expect(registro.tamanhos.length).toBeGreaterThan(0);
    expect(registro.tamanhos.every((tamanho) => tamanho === tamanhoFinal)).toBe(true);
    // E a digitação durou no máximo 1,5 s (com folga de medição).
    expect(registro.fim - registro.inicio).toBeLessThanOrEqual(1700);
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
  });

  test('durante a digitação o código completo está acessível ao leitor de tela', async ({
    page,
  }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);

    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);

    const regiao = page.getByRole('region', { name: 'Código da seção' });
    await expect(regiao).toBeVisible();
    await expect(regiao).toContainText('PersonalData');
    await expect(regiao).not.toHaveAttribute('aria-hidden', 'true');
    const texto = await regiao.evaluate((el) => el.textContent ?? '');
    expect(texto.length).toBeGreaterThan(200);
  });

  test('durante a digitação o texto fica recortado só visualmente: existe e tem clip-path', async ({
    page,
  }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);

    const ultima = page.locator(`${EDITOR} .linha`).last();

    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);
    await expect(ultima).toHaveCSS('clip-path', /inset/);
    await expect(ultima).not.toHaveCSS('display', 'none');
    await expect(ultima).not.toHaveCSS('visibility', 'hidden');
  });

  test('uma tecla durante a digitação completa o código', async ({ page }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);
    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);

    await page.keyboard.press('Shift');

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
  });

  test('um clique no editor durante a digitação também completa o código', async ({ page }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);
    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);

    // As linhas ainda estão recortadas: o clique do visitante cai na área do editor.
    await page.locator(`${EDITOR} .codigo`).click({ position: { x: 300, y: 60 } });

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
  });

  test('voltar a uma seção já vista mostra o código pronto, sem digitar', async ({ page }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);
    await page.keyboard.press('Shift');
    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);

    await abrirPelaArvore(page, 'Sobre Mim', /\/sobre-mim$/);
    await page.keyboard.press('Shift');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
  });

  test('uma seção ainda não vista digita mesmo depois de outra já vista', async ({ page }) => {
    await congelarQuadros(page);
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);
    await page.keyboard.press('Shift');

    await abrirPelaArvore(page, 'Sobre Mim', /\/sobre-mim$/);

    await expect(page.locator(EDITOR)).toHaveClass(/digitando/);
  });
});

test.describe('Cursor e linha atual', () => {
  test('termina a digitação com uma linha atual e o cursor piscando', async ({ page }) => {
    await page.goto('/sobre-mim');
    const editor = page.locator(EDITOR);

    await expect(editor).toHaveClass(/pronto/);

    await expect(editor.locator('.atual')).toHaveCount(1);
    const animacao = await editor
      .locator('.linha.atual')
      .evaluate((el) => getComputedStyle(el, '::after').animationName);
    expect(animacao).toMatch(/piscar/);
  });

  test('clicar numa linha move o destaque e a posição na barra de status', async ({ page }) => {
    await page.goto('/sobre-mim');
    const editor = page.locator(EDITOR);
    await expect(editor).toHaveClass(/pronto/);
    const posicao = page.locator('app-barra-de-status .posicao');
    const antes = await posicao.textContent();

    await editor.locator('.linha[data-indice="3"]').click();

    await expect(editor.locator('.atual')).toHaveCount(1);
    await expect(editor.locator('.atual')).toHaveAttribute('data-indice', '3');
    await expect(posicao).toContainText('4');
    expect(await posicao.textContent()).not.toBe(antes);
  });
});

test.describe('Movimento reduzido', () => {
  test.beforeEach(async ({ page }) => {
    await congelarQuadros(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('não digita ao abrir uma seção: o código aparece pronto', async ({ page }) => {
    await page.goto('/');
    await abrirPelaArvore(page, 'Diferenciais', /\/diferenciais$/);

    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
    await expect(page.locator(`${EDITOR} .linha`).last()).not.toHaveCSS('clip-path', /inset/);
  });

  test('não mostra o cursor piscando', async ({ page }) => {
    await page.goto('/sobre-mim');
    const editor = page.locator(EDITOR);
    await expect(editor).toHaveClass(/pronto/);

    const animacao = await editor
      .locator('.linha.atual')
      .evaluate((el) => getComputedStyle(el, '::after').animationName);

    expect(animacao).toBe('none');
  });

  test('mantém o código completo e a linha atual no fim', async ({ page }) => {
    await page.goto('/diferenciais');

    await expect(page.locator(`${EDITOR} code`)).toContainText('PersonalData');
    await expect(page.locator(`${EDITOR} .atual`)).toHaveCount(1);
  });

  test('nenhuma animação de CSS corre no editor', async ({ page }) => {
    await page.goto('/sobre-mim');
    await expect(page.locator(EDITOR)).toHaveClass(/pronto/);

    const animacoes = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => (a.effect as KeyframeEffect | null)?.target?.closest?.('main'))
        .map((a) => (a as CSSAnimation).animationName ?? a.constructor.name),
    );

    expect(animacoes).toEqual([]);
  });
});

test.describe('Sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('o HTML pré-renderizado traz o código completo e nunca o estado de digitação', async ({
    page,
  }) => {
    const resposta = await page.request.get('/sobre-mim');
    const html = await resposta.text();

    expect(html).toContain('app-editor-de-codigo');
    expect(html).not.toMatch(/class="[^"]*digitando/);
    await page.goto('/sobre-mim');
    await expect(page.locator(`${EDITOR} code`)).toContainText('aboutMe');
    await expect(page.locator(EDITOR)).not.toHaveClass(/digitando/);
  });
});
