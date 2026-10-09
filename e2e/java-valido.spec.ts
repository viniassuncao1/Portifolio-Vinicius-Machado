import { expect, test } from '@playwright/test';

import { SECOES, totalDePaginas } from '../src/app/core/secoes';

/** Início e todas as páginas de todas as seções, geradas de SECOES. */
const ROTAS = [
  '/',
  ...SECOES.flatMap((secao) =>
    Array.from({ length: totalDePaginas(secao) }, (_, i) =>
      i === 0 ? `/${secao.slug}` : `/${secao.slug}/${i + 1}`,
    ),
  ),
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

test.describe('Java plausível no que o visitante vê', () => {
  test('a lista de rotas cobre o Início, as 15 seções e todas as páginas', () => {
    expect(ROTAS).toHaveLength(1 + 15 + 1 + 2); // Início, seções, Skills/2 e Experiências/2 e /3
    expect(ROTAS).toEqual(
      expect.arrayContaining(['/skills/2', '/experiencias/2', '/experiencias/3']),
    );
  });

  for (const rota of ROTAS) {
    test(`${rota}: chaves, parênteses e colchetes balanceados no código renderizado`, async ({
      page,
    }) => {
      await page.goto(rota);
      const emConstrucao = await page.locator('main').getByText('em construção').count();
      test.skip(emConstrucao > 0, 'seção ainda sem conteúdo (aviso de em construção)');

      // Só o código que o compilador lê: sem textos entre aspas, comentários e Javadoc.
      const codigo = await page.locator('main code > .linha').evaluateAll((linhas) =>
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

      expect(codigo.length).toBeGreaterThan(0);
      expect(problemaDeBalanceamento(codigo), `código de ${rota}`).toBeNull();
      expect(await page.locator('main code').textContent()).not.toContain('String[]');
    });
  }
});
