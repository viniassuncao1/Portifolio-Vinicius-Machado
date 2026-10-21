import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

import { SECOES, SLUG_DA_VITRINE } from '../src/app/core/secoes';
import { linhasDoCodigo } from './apoio';

/** Início e cada seção (um arquivo só, sem páginas), geradas de SECOES. */
const ROTAS = [
  '/',
  ...SECOES.filter((secao) => secao.slug !== SLUG_DA_VITRINE).map((secao) => `/${secao.slug}`),
];

const PARES: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

/** Dá o problema de balanceamento de (), {} e [] ou `null` quando fecham todos na ordem certa. */
function problemaDeBalanceamento(codigo: string): string | null {
  const abertos: string[] = [];
  for (const caractere of codigo) {
    if ('({['.includes(caractere)) abertos.push(caractere);
    if (caractere in PARES && abertos.pop() !== PARES[caractere]) {
      return `"${caractere}" sem abertura correspondente`;
    }
  }
  return abertos.length ? `sobraram abertos: ${abertos.join(' ')}` : null;
}

/** Só o código que o compilador lê: sem textos entre aspas, comentários e Javadoc. */
const codigoQueOCompiladorLe = (page: Page): Promise<string> =>
  page.locator('main code > .linha').evaluateAll((linhas) =>
    linhas
      .map((linha) =>
        Array.from(linha.children)
          .filter(
            (trecho) =>
              !trecho.classList.contains('papel-literal') &&
              !trecho.classList.contains('papel-comentario'),
          )
          .map((trecho) => trecho.textContent ?? '')
          .join(''),
      )
      .join('\n'),
  );

test.describe('Java plausível no que o visitante vê', () => {
  test('a lista de rotas cobre o Início e cada seção (um arquivo só), sem repetir nenhuma', () => {
    expect(new Set(ROTAS).size).toBe(ROTAS.length);
    expect(ROTAS).toEqual(
      expect.arrayContaining([
        '/',
        '/skills',
        '/experiencias',
        '/certificacoes',
        '/projeto-4',
        '/projeto-5',
      ]),
    );
  });

  for (const rota of ROTAS) {
    test(`${rota}: chaves, parênteses e colchetes balanceados no código renderizado`, async ({
      page,
    }) => {
      await page.goto(rota);
      await expect(page.locator('main')).not.toContainText('em construção');

      const codigo = await codigoQueOCompiladorLe(page);

      expect(codigo.length).toBeGreaterThan(0);
      expect(problemaDeBalanceamento(codigo), `código de ${rota}`).toBeNull();
      expect(await page.locator('main code').textContent()).not.toContain('String[]');
    });
  }
});

/** Campo ou variável declarados com valor: `[modificadores] Tipo nome = ...`. */
const DECLARACAO_COM_VALOR = /^[\w<>?, .]+? ([A-Za-z_]\w*) = /;

test.describe('Convenções do Java para leitura em todas as páginas', () => {
  for (const rota of ROTAS) {
    test(`${rota}: sem constantes em caixa alta, nomes em camelCase e sem acentos nos identificadores`, async ({
      page,
    }) => {
      await page.goto(rota);
      await expect(page.locator('main code')).toBeVisible();

      const codigo = await codigoQueOCompiladorLe(page);
      const linhas = codigo.split('\n');
      const nomes = linhas.map((linha) => DECLARACAO_COM_VALOR.exec(linha.trim())?.[1]);

      expect(codigo, 'dado não vira constante static final').not.toContain('static final');
      expect(codigo, 'identificador em caixa alta').not.toMatch(/\b[A-Z][A-Z0-9_]{2,}\b/);
      expect(codigo, 'identificador com acento').not.toMatch(/[^\t\n -~]/);
      for (const nome of nomes.filter((n) => n !== undefined)) {
        expect(nome, `campo ou variável "${nome}"`).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      }
      for (const [, tipo] of codigo.matchAll(/\b(?:class|record|interface|enum) (\w+)/g)) {
        expect(tipo, `tipo "${tipo}"`).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
      }
    });
  }
});

// As páginas extras (/secao/2, /secao/3) continuam o arquivo da primeira e não repetem o pacote.
for (const rota of ROTAS.filter((r) => !/\/\d+$/.test(r))) {
  test(`${rota}: a primeira página declara o pacote do projeto`, async ({ page }) => {
    await page.goto(rota);

    const primeira = (await linhasDoCodigo(page))[0];

    expect(primeira).toMatch(/^package dev\.vinicius\.portfolio(\.[a-z]+)?;$/);
  });
}
