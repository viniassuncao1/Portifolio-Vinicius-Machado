import { expect, test as base } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

/** Chave que marca a sessão em que a abertura (ou o aviso, num link direto) já foi exibida (core/abertura.ts). */
const CHAVE_DA_ABERTURA = 'abertura-exibida';

/**
 * A abertura deixa a casca `inert` por até ~12 s na primeira visita a `/` de cada sessão. Para os
 * testes não esperarem por ela, todo contexto começa com a sessão já marcada. Só `abertura.spec.ts`
 * (e o teste de link direto da janela de Run) pedem a primeira visita de verdade, com
 * `verAbertura(page)`.
 */
const semearSessao = (contexto: BrowserContext) =>
  contexto.addInitScript((chave) => {
    try {
      if (sessionStorage.getItem(chave) === null) sessionStorage.setItem(chave, '1');
    } catch {
      // Armazenamento bloqueado pelo teste: a tela só aparece se o app não conseguir lembrar.
    }
  }, CHAVE_DA_ABERTURA);

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
