import type { ViewTransitionInfo } from '@angular/router';

/** Pula a View Transition quando o visitante pede para reduzir o movimento. */
export function pularTransicaoSeMovimentoReduzido({ transition }: ViewTransitionInfo): void {
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    transition.skipTransition();
  }
}
