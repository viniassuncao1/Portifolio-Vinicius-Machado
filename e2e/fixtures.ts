import { expect, test as base } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

/** Chave que marca a sessão em que a tela de boas-vindas já foi vista (core/boas-vindas.ts). */
const CHAVE_DAS_BOAS_VINDAS = 'boas-vindas-exibida';

/**
 * A tela de boas-vindas deixa a casca `inert` por até 2 s na primeira página de cada sessão. Para
 * os testes não esperarem por ela, todo contexto começa com a sessão já marcada. Só
 * `boas-vindas.spec.ts` pede a primeira visita de verdade, com `verBoasVindas(page)`.
 */
const semearSessao = (contexto: BrowserContext) =>
  contexto.addInitScript((chave) => {
    try {
      if (sessionStorage.getItem(chave) === null) sessionStorage.setItem(chave, '1');
    } catch {
      // Armazenamento bloqueado pelo teste: a tela só aparece se o app não conseguir lembrar.
    }
  }, CHAVE_DAS_BOAS_VINDAS);

export const test = base.extend({
  // Cobre o `page` do Playwright: o contexto já nasce com a sessão marcada.
  context: async ({ context }, use) => {
    await semearSessao(context);
    await use(context);
  },
  // Cobre os testes que abrem contextos próprios (`browser.newContext`).
  browser: [
    async ({ browser }, use) => {
      const novoContexto = browser.newContext.bind(browser);
      browser.newContext = async (opcoes) => {
        const contexto = await novoContexto(opcoes);
        await semearSessao(contexto);
        return contexto;
      };
      await use(browser);
      browser.newContext = novoContexto;
    },
    { scope: 'worker' },
  ],
});

export { expect };
