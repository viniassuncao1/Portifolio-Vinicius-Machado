import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Result } from 'axe-core';

import { SECOES, totalDePaginas } from '../src/app/core/secoes';

/** Início e todas as páginas de todas as seções, geradas de SECOES (uma seção nova entra sozinha). */
const ROTAS = [
  '/',
  ...SECOES.flatMap((secao) =>
    Array.from({ length: totalDePaginas(secao) }, (_, i) =>
      i === 0 ? `/${secao.slug}` : `/${secao.slug}/${i + 1}`,
    ),
  ),
];

const TELAS = [
  { nome: 'desktop', viewport: { width: 1920, height: 1080 } },
  { nome: 'celular', viewport: { width: 390, height: 844 } },
];

const TAGS = ['wcag2a', 'wcag2aa'];

/** Uma linha por elemento: regra, impacto, alvo e HTML, para a falha indicar onde corrigir. */
function descrever(violacoes: readonly Result[]): string {
  return violacoes
    .flatMap((violacao) =>
      violacao.nodes.map(
        (no) =>
          `[${violacao.impact ?? 'sem impacto'}] ${violacao.id}: ${violacao.help}\n` +
          `    alvo: ${no.target.join(' ')}\n    html: ${no.html}\n    ${no.failureSummary ?? ''}`,
      ),
    )
    .join('\n');
}

test('a varredura inclui o Início, as 15 seções e as páginas de Skills e Experiências', () => {
  expect(ROTAS).toHaveLength(1 + SECOES.length + 1 + 2);
  expect(ROTAS).toEqual(
    expect.arrayContaining([
      '/',
      '/skills/2',
      '/experiencias',
      '/experiencias/2',
      '/experiencias/3',
    ]),
  );
});

for (const { nome, viewport } of TELAS) {
  test.describe(`Acessibilidade (axe, WCAG 2 A e AA) no ${nome}`, () => {
    test.use({ viewport });

    for (const rota of ROTAS) {
      test(`${rota} não tem violações`, async ({ page }) => {
        await page.goto(rota);
        await expect(page.getByRole('heading', { level: 1 })).toBeAttached();

        const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();

        // Compara o texto (e não os objetos do axe) para a falha listar só regra, elemento e alvo.
        expect(descrever(violations), `Violações em ${rota}`).toBe('');
      });
    }
  });
}
