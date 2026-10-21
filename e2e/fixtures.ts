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
type VisaoDoTeste = 'cartao' | 'codigo';

const semearSessao = (contexto: BrowserContext) =>
  contexto.addInitScript(
    ({ chave, escolha }) => {
      try {
        if (sessionStorage.getItem(chave) === null) sessionStorage.setItem(chave, '1');
        // A suíte antiga cobre o Início em código; quem testa o cartão pede `visao: 'cartao'`.
        if (localStorage.getItem('visao-do-conteudo') === null) {
          localStorage.setItem('visao-do-conteudo', escolha);
        }
      } catch {
        // Armazenamento bloqueado pelo teste: a tela só aparece se o app não conseguir lembrar.
      }
    },
    { chave: CHAVE_DA_ABERTURA, escolha: 'codigo' },
  );

/** Rotas que têm as duas visões: o HTML traz o cartão e, ao hidratar, a visão lembrada pode ser o código. */
const ROTAS_COM_DUAS_VISOES = new Set([
  '/',
  '/sobre-mim',
  '/skills',
  '/experiencias',
  '/formacao',
  '/contato',
]);

export const test = base.extend<{ visao: VisaoDoTeste }>({
  visao: ['codigo', { option: true }],
  // Na visão em código o HTML pré-renderizado ainda é o cartão: depois do `goto`, os testes esperam
  // o editor aparecer, para não ler o cartão achando que é o código.
  page: async ({ page, visao, javaScriptEnabled }, use) => {
    if (visao === 'codigo' && javaScriptEnabled !== false) {
      const irPara = page.goto.bind(page);
      page.goto = async (url, opcoes) => {
        const resposta = await irPara(url, opcoes);
        const caminho = new URL(url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
        if (ROTAS_COM_DUAS_VISOES.has(caminho)) {
          await page
            .locator('main app-editor-de-codigo')
            .first()
            .waitFor({ state: 'attached', timeout: 15_000 })
            .catch(() => undefined);
        }
        return resposta;
      };
    }
    await use(page);
  },
  // Cobre o `page` do Playwright: o contexto já nasce com a sessão marcada.
  context: async ({ context, visao }, use) => {
    await semearSessao(context);
    // O padrão da suíte é o Início em código. Quem pede o cartão sobrescreve a visão uma vez por aba
    // (a escolha feita depois, como alternar e recarregar, não é desfeita).
    if (visao !== 'codigo') {
      await context.addInitScript((escolha) => {
        try {
          if (sessionStorage.getItem('visao-do-teste') === null) {
            sessionStorage.setItem('visao-do-teste', '1');
            localStorage.setItem('visao-do-conteudo', escolha);
          }
        } catch {
          // Armazenamento bloqueado pelo teste: vale a visão padrão do app.
        }
      }, visao);
    }
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
