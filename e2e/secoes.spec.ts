import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

import { linhasDoCodigo, normalizar } from './apoio';

const COR_VALOR = 'rgb(79, 175, 172)';
const COR_DECLARACAO = 'rgb(213, 150, 62)';
const COR_PALAVRA_CHAVE = 'rgb(222, 96, 210)';
const COR_ANOTACAO = 'rgb(116, 137, 248)';

const cor = (alvo: Locator) => alvo.evaluate((el) => getComputedStyle(el).color);

/** Razão de contraste WCAG entre duas cores "rgb(r, g, b)". */
function contraste(a: string, b: string): number {
  const luminancia = (rgb: string) => {
    const [r, g, bl] = (rgb.match(/\d+/g) ?? []).slice(0, 3).map((c) => {
      const v = Number(c) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

test.describe('Sobre Mim (/sobre-mim)', () => {
  test('exibe a interface, a implementação, o Javadoc e o método em Java moderno', async ({
    page,
  }) => {
    await page.goto('/sobre-mim');

    expect(await linhasDoCodigo(page)).toEqual([
      'public interface Developer {',
      'String aboutMe();',
      '}',
      'public final class ViniciusMachado implements Developer {',
      'private static final String ABOUT_ME = "Full Stack: Java, Spring Boot, Angular e SQL";',
      expect.stringContaining('Sou desenvolvedor Full Stack'),
      '@Override',
      'public String aboutMe() {',
      'return ABOUT_ME;',
      '}',
      '}',
    ]);
  });

  test('começa e termina o texto do Javadoc com as frases da tela 02', async ({ page }) => {
    await page.goto('/sobre-mim');

    const texto = normalizar(await page.locator('main .javadoc').textContent());

    expect(
      texto.startsWith('Sou desenvolvedor Full Stack com cerca de 2 anos de experiência'),
    ).toBe(true);
    expect(texto.endsWith('Sistemas Distribuídos e Arquitetura de Software.')).toBe(true);
  });

  test('preserva as informações: Memora, Watts Company, CRM, agentes de IA e UniCEUB', async ({
    page,
  }) => {
    await page.goto('/sobre-mim');
    const bloco = page.locator('main .javadoc');

    for (const trecho of [
      'Java, Spring Boot, Angular e SQL em sistemas críticos de produção',
      'Memora Processos Inovadores',
      'Scrum, com dailies, previsões de conclusão e reviews',
      'Watts Company, agência de automação e IA',
      'sistemas de CRM e agentes de IA para atendimento',
      'Ciência da Computação no UniCEUB',
    ]) {
      await expect(bloco).toContainText(trecho);
    }
  });

  test('colore palavra-chave e anotação com tokens distintos', async ({ page }) => {
    await page.goto('/sobre-mim');

    expect(await cor(page.locator('main .papel-palavra-chave').first())).toBe(COR_PALAVRA_CHAVE);
    expect(await cor(page.locator('main .papel-anotacao'))).toBe(COR_ANOTACAO);
  });

  test('o texto do Javadoc quebra em várias linhas dentro da largura do editor', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/sobre-mim');
    const javadoc = page.locator('main .javadoc-texto');

    const { largura, linhas } = await javadoc.evaluate((el) => {
      const caixa = el.getBoundingClientRect();
      const alturaDaLinha = parseFloat(getComputedStyle(el).lineHeight);
      return { largura: caixa.width, linhas: Math.round(caixa.height / alturaDaLinha) };
    });
    const editor = await page.locator('main app-editor-de-codigo').boundingBox();

    expect(linhas).toBeGreaterThan(4);
    expect(largura).toBeLessThan(editor!.width);
  });

  test('marca "Sobre Mim" como página atual, com a seta para baixo', async ({ page }) => {
    await page.goto('/sobre-mim');

    const item = page.getByRole('link', { name: 'Sobre Mim' });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
  });

  test('não mostra números nem "*" no texto copiável do código', async ({ page }) => {
    await page.goto('/sobre-mim');

    const texto = (await page.locator('main code').textContent()) ?? '';

    expect(texto).not.toContain('*');
    // "2 anos" é texto do Javadoc; o que não pode aparecer é a coluna 1, 2, 3...
    expect(texto).not.toMatch(/1\s*2\s*3/);
  });
});

test.describe('Diferenciais (/diferenciais)', () => {
  test('exibe os imports, o record e a constante com os dados em Java moderno', async ({
    page,
  }) => {
    await page.goto('/diferenciais');

    expect(await linhasDoCodigo(page)).toEqual([
      'import java.time.Period;',
      expect.stringContaining('Moro em Brasília há 20 anos.'),
      'public record PersonalData(',
      'String origin,',
      'String city,',
      'Period livingInCityFor,',
      'boolean extrovert,',
      'boolean curious,',
      'boolean loveToLearn',
      ') {',
      'public static final PersonalData VINICIUS = new PersonalData(',
      '"Mineiro",',
      '"Brasília",',
      'Period.ofYears(20),',
      'true, // extrovertido',
      'true, // curioso',
      'true // gosta de aprender',
      ');',
      '}',
    ]);
  });

  test('começa e termina o texto do Javadoc com as frases da tela 03', async ({ page }) => {
    await page.goto('/diferenciais');

    const texto = normalizar(await page.locator('main .javadoc').textContent());

    expect(texto.startsWith('Moro em Brasília há 20 anos.')).toBe(true);
    expect(texto.endsWith('encarar o que aparecer pela frente.')).toBe(true);
    expect(texto).toContain('gosto de uma boa discussão');
    expect(texto).toContain('back-end ou front-end');
  });

  test('colore os campos como declaração e os três true, e o 20, como valor', async ({ page }) => {
    await page.goto('/diferenciais');
    const valores = page.locator('main .papel-valor');

    await expect(valores).toHaveText(['20', 'true', 'true', 'true']);
    for (let i = 0; i < 4; i++) expect(await cor(valores.nth(i))).toBe(COR_VALOR);
    expect(await cor(page.locator('main .papel-declaracao').first())).toBe(COR_DECLARACAO);
  });

  test('o campo city fica como declaração e "Brasília" como texto entre aspas', async ({
    page,
  }) => {
    await page.goto('/diferenciais');
    const linha = page.locator('main code > span', { hasText: 'String city' });

    await expect(linha.locator('.papel-declaracao')).toHaveText('String city');
    await expect(page.locator('main .papel-literal', { hasText: '"Brasília"' })).toHaveCount(1);
  });

  test('os comentários de linha usam o papel de comentário, diferente do texto comum', async ({
    page,
  }) => {
    await page.goto('/diferenciais');
    const comentarios = page.locator('main .papel-comentario');

    await expect(comentarios).toHaveText(['// extrovertido', '// curioso', '// gosta de aprender']);
    expect(await cor(comentarios.first())).not.toBe(
      await cor(page.locator('main .papel-comum').first()),
    );
  });

  test('a cor de valor tem contraste de pelo menos 4,5:1 com o fundo do editor', async ({
    page,
  }) => {
    await page.goto('/diferenciais');

    const valor = await cor(page.locator('main .papel-valor').first());
    const fundo = await page
      .locator('main app-editor-de-codigo')
      .evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(contraste(valor, fundo)).toBeGreaterThanOrEqual(4.5);
  });

  test('marca "Diferenciais" como página atual e "Sobre Mim" não', async ({ page }) => {
    await page.goto('/diferenciais');

    const item = page.getByRole('link', { name: 'Diferenciais' });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(item.locator('.seta')).toHaveCSS('rotate', '90deg');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).not.toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page).toHaveTitle('Diferenciais | Vinicius Machado');
  });
});

test.describe('Seções sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/sobre-mim entrega o código, o Javadoc e o item atual no HTML', async ({ page }) => {
    await page.goto('/sobre-mim');

    await expect(page.locator('main code')).toContainText('public interface Developer');
    await expect(page.locator('main .javadoc')).toContainText('Sou desenvolvedor Full Stack');
    await expect(page.getByRole('link', { name: 'Sobre Mim' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sobre Mim');
  });

  test('/diferenciais entrega o código, os valores e o Javadoc no HTML', async ({ page }) => {
    await page.goto('/diferenciais');

    await expect(page.locator('main code')).toContainText('public record PersonalData(');
    await expect(page.locator('main .papel-valor')).toHaveCount(4);
    await expect(page.locator('main .javadoc')).toContainText('Moro em Brasília há 20 anos.');
    await expect(page.getByRole('link', { name: 'Diferenciais' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('não deixa as seções com o aviso de em construção', async ({ page }) => {
    for (const rota of ['/sobre-mim', '/diferenciais']) {
      await page.goto(rota);

      await expect(page.locator('main')).not.toContainText('em construção');
    }
  });
});
