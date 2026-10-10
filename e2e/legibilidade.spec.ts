import { expect, test } from '@playwright/test';

import { SECOES, totalDePaginas } from '../src/app/core/secoes';
import { codigoSemTextos, comentariosDoCodigo, listasDe, textoDoCodigo } from './apoio';

const LIMITE_DA_LISTA_CURTA = 5;
const LIMITE_DE_CARACTERES_DO_ITEM_CURTO = 24;

/** Marcas de português: palavras comuns ou letras acentuadas. */
const PORTUGUES =
  /[áàâãéêíóôõúç]|\b(de|do|da|dos|das|que|cada|e|eu|em|os|as|um|uma|para|tem|uso|meu)\b/i;

const paginasDe = (slug: string, total: number): string[] =>
  Array.from({ length: total }, (_, i) => (i === 0 ? `/${slug}` : `/${slug}/${i + 1}`));

/** O Início e cada seção com todas as suas páginas: o visitante lê a seção como um todo. */
const GRUPOS: readonly { nome: string; rotas: string[] }[] = [
  { nome: 'Início', rotas: ['/'] },
  ...SECOES.map((secao) => ({
    nome: secao.titulo,
    rotas: paginasDe(secao.slug, totalDePaginas(secao)),
  })),
];

for (const { nome, rotas } of GRUPOS) {
  test.describe(`Legibilidade: ${nome}`, () => {
    test('tem comentário // em pt-BR e nenhuma construção de Java avançado', async ({ page }) => {
      const comentarios: string[] = [];

      await page.goto(rotas[0]);
      test.skip(
        (await page.locator('main').getByText('em construção').count()) > 0,
        'seção ainda sem conteúdo (aviso de em construção)',
      );

      for (const rota of rotas) {
        await page.goto(rota);
        comentarios.push(...(await comentariosDoCodigo(page)));
        const texto = await textoDoCodigo(page);
        const codigo = await codigoSemTextos(page);

        expect(texto, rota).not.toContain('Optional');
        expect(texto, rota).not.toContain('URI.create');
        expect(codigo, `genérico aninhado em ${rota}`).not.toMatch(/<[^<>\n]*<[^<>\n]*>/);
        expect(codigo, `identificador com acento em ${rota}`).not.toMatch(/[^\p{ASCII}]/u);
      }

      expect(comentarios.length).toBeGreaterThan(0);
      expect(comentarios.some((comentario) => PORTUGUES.test(comentario))).toBe(true);
    });

    test('listas de até 5 tecnologias aparecem numa única linha', async ({ page }) => {
      for (const rota of rotas) {
        await page.goto(rota);
        const quebradas = listasDe(await textoDoCodigo(page)).filter((lista) => {
          const itens = Array.from(lista.matchAll(/"([^"]*)"/g), (m) => m[1]);
          return (
            !lista.includes('new ') &&
            itens.length > 0 &&
            itens.length <= LIMITE_DA_LISTA_CURTA &&
            itens.every((item) => item.length <= LIMITE_DE_CARACTERES_DO_ITEM_CURTO) &&
            lista.includes('\n')
          );
        });

        expect(quebradas, `listas curtas quebradas em ${rota}`).toEqual([]);
      }
    });
  });
}

test.describe('Legibilidade: exemplos concretos', () => {
  test('Experiências mostra empresa, cargo e período em texto simples', async ({ page }) => {
    await page.goto('/experiencias');
    const texto = await textoDoCodigo(page);

    expect(texto).toContain('"Memora"');
    expect(texto).toContain('"Desenvolvedor Full Stack Júnior"');
    expect(texto).toContain('"08/2026 - Presente"');
  });

  test('Contato mostra os endereços como texto, sem URI.create', async ({ page }) => {
    await page.goto('/contato');
    const texto = await textoDoCodigo(page);

    expect(texto).not.toContain('URI');
    expect(texto).toContain('"linkedin.com/in/viniassuncao"');
    expect(texto).toContain('"github.com/viniassuncao1"');
  });

  test('Skills mostra cada lista curta numa linha só', async ({ page }) => {
    await page.goto('/skills');
    const texto = await textoDoCodigo(page);

    expect(texto).toContain('List.of("Java", "TypeScript", "JavaScript", "PHP", "SQL"),');
    expect(texto).toContain('List.of("Spring Boot", "Spring Data JPA", "Angular"),');
    expect(texto).toContain('List.of("Oracle", "PostgreSQL", "MySQL")');
  });
});
