import { vi } from 'vitest';

import type { ViewTransitionInfo } from '@angular/router';

import { pularTransicaoSeMovimentoReduzido } from './transicao-de-rota';

describe('pularTransicaoSeMovimentoReduzido', () => {
  const original = globalThis.matchMedia;

  afterEach(() => {
    globalThis.matchMedia = original;
  });

  function criarInfo(): { info: ViewTransitionInfo; skipTransition: ReturnType<typeof vi.fn> } {
    const skipTransition = vi.fn();
    const info = { transition: { skipTransition } } as unknown as ViewTransitionInfo;
    return { info, skipTransition };
  }

  function simularPreferencia(reduzir: boolean): void {
    globalThis.matchMedia = ((consulta: string) => ({
      matches: reduzir && consulta === '(prefers-reduced-motion: reduce)',
    })) as typeof globalThis.matchMedia;
  }

  it('pula a transição quando o movimento reduzido está ativado', () => {
    simularPreferencia(true);
    const { info, skipTransition } = criarInfo();

    pularTransicaoSeMovimentoReduzido(info);

    expect(skipTransition).toHaveBeenCalledTimes(1);
  });

  it('mantém a transição quando o movimento reduzido está desativado', () => {
    simularPreferencia(false);
    const { info, skipTransition } = criarInfo();

    pularTransicaoSeMovimentoReduzido(info);

    expect(skipTransition).not.toHaveBeenCalled();
  });

  it('mantém a transição quando matchMedia não existe', () => {
    (globalThis as { matchMedia?: unknown }).matchMedia = undefined;
    const { info, skipTransition } = criarInfo();

    pularTransicaoSeMovimentoReduzido(info);

    expect(skipTransition).not.toHaveBeenCalled();
  });
});
