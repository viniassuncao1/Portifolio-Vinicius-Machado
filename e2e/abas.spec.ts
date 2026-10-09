import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { abrirHidratada } from './apoio';

const faixa = (page: Page) => page.getByRole('tablist', { name: 'Arquivos abertos' });
const aba = (page: Page, arquivo: string) => faixa(page).getByRole('tab', { name: arquivo });
const fechar = (page: Page, arquivo: string) =>
  page.getByRole('button', { name: `Fechar ${arquivo}` });
const arvore = (page: Page) => page.getByRole('navigation', { name: 'Seções do portfólio' });
const abrirPelaArvore = (page: Page, secao: string) =>
  arvore(page).getByRole('link', { name: secao, exact: true }).click();

// Movimento reduzido: o código aparece pronto, sem a digitação interferir.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test.describe('Abas dos arquivos', () => {
  test('abrir duas seções cria SobreMim.java e Skills.java, com a última ativa', async ({
    page,
  }) => {
    await abrirHidratada(page, '/sobre-mim');

    await abrirPelaArvore(page, 'Skills / STACK');

    await expect(page).toHaveURL(/\/skills$/);
    await expect(faixa(page).getByRole('tab')).toHaveText(['SobreMim.java', 'Skills.java']);
    await expect(aba(page, 'Skills.java')).toHaveAttribute('aria-selected', 'true');
    await expect(aba(page, 'SobreMim.java')).toHaveAttribute('aria-selected', 'false');
  });

  test('o Início abre como ViniciusMachado.java, ativa', async ({ page }) => {
    await abrirHidratada(page, '/');

    await expect(faixa(page).getByRole('tab')).toHaveText(['ViniciusMachado.java']);
    await expect(aba(page, 'ViniciusMachado.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('abrir de novo uma seção que já tem aba só a ativa, sem duplicar', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Diferenciais');

    await abrirPelaArvore(page, 'Sobre Mim');

    await expect(faixa(page).getByRole('tab')).toHaveText(['SobreMim.java', 'Diferenciais.java']);
    await expect(aba(page, 'SobreMim.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('uma página interna da seção mantém a mesma aba', async ({ page }) => {
    await abrirHidratada(page, '/skills');

    await abrirHidratada(page, '/skills/2');

    await expect(faixa(page).getByRole('tab')).toHaveText(['Skills.java']);
    await expect(aba(page, 'Skills.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('clicar numa aba abre a seção e muda o endereço', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');

    await aba(page, 'SobreMim.java').click();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
    await expect(aba(page, 'SobreMim.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('fechar a aba ativa mostra a vizinha', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');

    await fechar(page, 'Skills.java').click();

    await expect(page).toHaveURL(/\/sobre-mim$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
    await expect(faixa(page).getByRole('tab')).toHaveText(['SobreMim.java']);
  });

  test('fechar uma aba que não está ativa não muda a seção aberta', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');

    await fechar(page, 'SobreMim.java').click();

    await expect(page).toHaveURL(/\/skills$/);
    await expect(faixa(page).getByRole('tab')).toHaveText(['Skills.java']);
  });

  test('fechar a última aba leva ao Início', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');

    await fechar(page, 'SobreMim.java').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio_Vinicius');
    await expect(faixa(page).getByRole('tab')).toHaveText(['ViniciusMachado.java']);
  });

  test('o botão de fechar tem nome acessível e fica fora do tablist', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');

    await expect(fechar(page, 'SobreMim.java')).toBeVisible();
    await expect(faixa(page).getByRole('button')).toHaveCount(0);
  });

  test('o tablist contém só abas', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');
    await abrirPelaArvore(page, 'Eventos');
    await expect(faixa(page).getByRole('tab')).toHaveCount(3);

    const filhos = await faixa(page).evaluate((el) =>
      Array.from(el.children).flatMap((filho) =>
        filho.getAttribute('role') === 'presentation'
          ? Array.from(filho.children).map((neto) => neto.getAttribute('role'))
          : [filho.getAttribute('role')],
      ),
    );

    expect(filhos).toHaveLength(3);
    expect(new Set(filhos)).toEqual(new Set(['tab']));
  });
});

test.describe('Abas pelo teclado', () => {
  test.beforeEach(async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');
    await abrirPelaArvore(page, 'Eventos');
    await expect(page).toHaveURL(/\/eventos$/);
    await expect(aba(page, 'Eventos.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('só a aba ativa entra na ordem de Tab (roving tabindex)', async ({ page }) => {
    await expect(aba(page, 'Eventos.java')).toHaveAttribute('tabindex', '0');
    await expect(aba(page, 'Skills.java')).toHaveAttribute('tabindex', '-1');
    await expect(aba(page, 'SobreMim.java')).toHaveAttribute('tabindex', '-1');
  });

  test('seta para a direita leva o foco à próxima aba, com volta ao início', async ({ page }) => {
    await aba(page, 'SobreMim.java').focus();

    await page.keyboard.press('ArrowRight');
    await expect(aba(page, 'Skills.java')).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(aba(page, 'SobreMim.java')).toBeFocused();
  });

  test('seta para a esquerda volta uma aba, com volta ao fim', async ({ page }) => {
    await aba(page, 'SobreMim.java').focus();

    await page.keyboard.press('ArrowLeft');

    await expect(aba(page, 'Eventos.java')).toBeFocused();
  });

  test('Home e End vão à primeira e à última aba', async ({ page }) => {
    await aba(page, 'Skills.java').focus();

    await page.keyboard.press('End');
    await expect(aba(page, 'Eventos.java')).toBeFocused();

    await page.keyboard.press('Home');
    await expect(aba(page, 'SobreMim.java')).toBeFocused();
  });

  test('Enter abre a aba focada', async ({ page }) => {
    await aba(page, 'Skills.java').focus();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/skills$/);
  });

  test('Delete fecha a aba focada que não é a ativa', async ({ page }) => {
    await aba(page, 'SobreMim.java').focus();

    await page.keyboard.press('Delete');

    await expect(faixa(page).getByRole('tab')).toHaveText(['Skills.java', 'Eventos.java']);
    await expect(page).toHaveURL(/\/eventos$/);
  });

  test('Delete na aba ativa a fecha, mostra a vizinha e leva o foco a ela', async ({ page }) => {
    await aba(page, 'Eventos.java').focus();

    await page.keyboard.press('Delete');

    await expect(page).toHaveURL(/\/skills$/);
    await expect(faixa(page).getByRole('tab')).toHaveText(['SobreMim.java', 'Skills.java']);
    await expect(aba(page, 'Skills.java')).toBeFocused();
  });
});

test.describe('Abas lembradas na visita', () => {
  test('recarregar a página mantém as três abas abertas e a ativa', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');
    await abrirPelaArvore(page, 'Eventos');
    await expect(aba(page, 'Eventos.java')).toHaveAttribute('aria-selected', 'true');

    await page.reload();

    await expect(aba(page, 'Eventos.java')).toHaveAttribute('aria-selected', 'true');
    await expect(faixa(page).getByRole('tab')).toHaveCount(3);
    await expect(faixa(page).getByRole('tab')).toHaveText([
      'SobreMim.java',
      'Skills.java',
      'Eventos.java',
    ]);
  });

  test('uma aba fechada não volta ao recarregar', async ({ page }) => {
    await abrirHidratada(page, '/sobre-mim');
    await abrirPelaArvore(page, 'Skills / STACK');
    await fechar(page, 'SobreMim.java').click();
    await expect(faixa(page).getByRole('tab')).toHaveCount(1);

    await page.reload();

    await expect(faixa(page).getByRole('tab')).toHaveText(['Skills.java']);
  });

  test('abrir a página de um endereço direto numa visita nova mostra só a aba da rota', async ({
    browser,
  }) => {
    const contexto = await browser.newContext();
    const pagina = await contexto.newPage();

    await pagina.goto('/eventos');

    await expect(faixa(pagina).getByRole('tab')).toHaveText(['Eventos.java']);
    await contexto.close();
  });
});

test.describe('Abas no HTML pré-renderizado', () => {
  test.use({ javaScriptEnabled: false });

  test('a rota entrega a aba do seu arquivo, ativa, sem JavaScript', async ({ page }) => {
    await page.goto('/skills');

    await expect(faixa(page).getByRole('tab')).toHaveText(['Skills.java']);
    await expect(aba(page, 'Skills.java')).toHaveAttribute('aria-selected', 'true');
  });

  test('o Início entrega ViniciusMachado.java ativa', async ({ page }) => {
    await page.goto('/');

    await expect(faixa(page).getByRole('tab')).toHaveText(['ViniciusMachado.java']);
  });
});
