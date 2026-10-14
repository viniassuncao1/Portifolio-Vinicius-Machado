/** Classe no `<html>` enquanto a troca de tema anima: os estilos do crossfade só valem com ela. */
export const CLASSE_DA_TRANSICAO_DE_TEMA = 'transicao-de-tema';

const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)';
/** Tempo máximo de espera pela renderização do novo tema; a transição nunca segura a página. */
const ESPERA_MAXIMA_MS = 100;

type DocumentoComTransicao = Document & {
  startViewTransition?: (atualizar: () => Promise<void>) => ViewTransition;
  /** Transição em andamento (Chrome 142+): a de rota, por exemplo. */
  activeViewTransition?: ViewTransition | null;
};

export interface OpcoesDaTransicaoDeTema {
  /** Há uma navegação de rota em andamento (ela usa a própria View Transition). */
  readonly navegando: boolean;
  /** Resolve quando o Angular terminou de renderizar o novo tema. */
  readonly aposRenderizar: () => Promise<void>;
}

/**
 * Executa a troca de tema, com um crossfade curto via View Transition quando dá. Troca direta
 * (sem animação) se o navegador não tem `startViewTransition`, se o visitante pediu movimento
 * reduzido ou se uma transição de rota está em andamento: duas transições não convivem, e a
 * segunda cancelaria a primeira. Em qualquer caso `atualizar` roda uma vez.
 */
export function trocarComTransicao(
  documento: Document,
  atualizar: () => void,
  opcoes: OpcoesDaTransicaoDeTema,
): void {
  const doc = documento as DocumentoComTransicao;
  const reduzido = documento.defaultView?.matchMedia?.(MOVIMENTO_REDUZIDO).matches ?? false;
  const podeAnimar =
    typeof doc.startViewTransition === 'function' &&
    !reduzido &&
    !opcoes.navegando &&
    !doc.activeViewTransition;
  if (!podeAnimar) {
    atualizar();
    return;
  }

  const raiz = documento.documentElement;
  raiz.classList.add(CLASSE_DA_TRANSICAO_DE_TEMA);
  const transicao = doc.startViewTransition!(() => {
    atualizar();
    return Promise.race([
      opcoes.aposRenderizar(),
      new Promise<void>((resolver) => setTimeout(resolver, ESPERA_MAXIMA_MS)),
    ]);
  });
  // Pular ou abortar a transição não é erro: o tema já foi trocado pelo callback.
  transicao.ready.catch(() => undefined);
  transicao.finished
    .catch(() => undefined)
    .finally(() => raiz.classList.remove(CLASSE_DA_TRANSICAO_DE_TEMA));
}
