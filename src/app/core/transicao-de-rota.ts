import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

import { NOME_DA_TRANSICAO_DO_PROJETO, TransicaoDoProjeto } from './transicao-de-projeto';

/** Primeiro segmento do endereço da rota (`/projetos/ana` -> `projetos`). */
function primeiroSegmento(rota: ActivatedRouteSnapshot | undefined): string {
  return (rota?.pathFromRoot ?? []).flatMap((r) => r.url.map((u) => u.path))[0] ?? '';
}

/**
 * Cuida da View Transition de cada navegação:
 * - com movimento reduzido, pula;
 * - ao abrir ou fechar um projeto da vitrine, liga o cartão ao painel dos detalhes (o mesmo
 *   `view-transition-name`), o que faz o cartão expandir até a tela cheia e voltar;
 * - nas demais navegações dentro da vitrine (Voltar, projeto anterior e próximo), pula, para a
 *   página não piscar com o esmaecimento padrão.
 */
export function pularTransicaoSeMovimentoReduzido({
  transition,
  from,
  to,
}: ViewTransitionInfo): void {
  const projeto = inject(TransicaoDoProjeto);
  const combinado = projeto.consumir();
  const reduzido = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const dentroDaVitrine =
    primeiroSegmento(to) === 'projetos' && primeiroSegmento(from) === 'projetos';

  if (reduzido || (dentroDaVitrine && !combinado)) {
    transition.skipTransition();
    projeto.limpar(combinado?.cartao ?? null);
    return;
  }
  if (!combinado) return;

  const { cartao, sentido } = combinado;
  projeto.emAndamento = true;
  // O estado novo é capturado logo depois do callback: na ida o cartão larga o nome (o painel o
  // recebe por CSS) e na volta o cartão o recebe de volta (o painel já saiu).
  void transition.updateCallbackDone.then(() => {
    if (sentido === 'abrir') {
      cartao.style.removeProperty('view-transition-name');
      return;
    }
    // Nomes repetidos cancelam a transição: se o painel ainda estiver aberto quando o estado novo for
    // capturado (a renderização atrasou), ele larga o nome antes de o cartão recebê-lo.
    document
      .querySelectorAll<HTMLElement>('dialog .painel')
      .forEach((painel) => painel.style.setProperty('view-transition-name', 'none'));
    cartao.style.setProperty('view-transition-name', NOME_DA_TRANSICAO_DO_PROJETO);
  });
  void transition.finished.finally(() => projeto.terminar(cartao));
}
