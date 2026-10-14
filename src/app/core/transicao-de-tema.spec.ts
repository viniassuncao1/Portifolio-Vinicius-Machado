import { afterEach, describe, expect, it, vi } from 'vitest';

import { CLASSE_DA_TRANSICAO_DE_TEMA, trocarComTransicao } from './transicao-de-tema';

interface TransicaoFalsa {
  ready: Promise<void>;
  finished: Promise<void>;
  encerrar: () => void;
}

describe('trocarComTransicao', () => {
  const opcoes = { navegando: false, aposRenderizar: () => Promise.resolve() };

  /** Documento falso: `startViewTransition` guarda o callback e devolve uma transição controlável. */
  function documentoFalso(movimentoReduzido = false, comTransicao = true) {
    const callbacks: (() => Promise<void>)[] = [];
    let encerrar = () => undefined as void;
    const transicao: TransicaoFalsa = {
      ready: Promise.resolve(),
      finished: new Promise<void>((resolver) => (encerrar = resolver)),
      encerrar: () => encerrar(),
    };
    const documento = {
      documentElement: document.createElement('html'),
      defaultView: {
        matchMedia: (consulta: string) => ({
          matches: movimentoReduzido && consulta.includes('reduce'),
        }),
      },
      ...(comTransicao
        ? {
            startViewTransition: vi.fn((atualizar: () => Promise<void>) => {
              callbacks.push(atualizar);
              return transicao;
            }),
          }
        : {}),
    } as unknown as Document & { startViewTransition?: ReturnType<typeof vi.fn> };
    return { documento, transicao, callbacks };
  }

  afterEach(() => vi.useRealTimers());

  it('anima com startViewTransition e só troca o tema dentro do callback', () => {
    const { documento, callbacks } = documentoFalso();
    const atualizar = vi.fn();

    trocarComTransicao(documento, atualizar, opcoes);

    expect(documento.startViewTransition).toHaveBeenCalledTimes(1);
    expect(atualizar).not.toHaveBeenCalled();
    void callbacks[0]();
    expect(atualizar).toHaveBeenCalledTimes(1);
  });

  it('marca o html durante a transição e tira a marca quando ela termina', async () => {
    const { documento, transicao } = documentoFalso();

    trocarComTransicao(documento, vi.fn(), opcoes);
    expect(documento.documentElement.classList).toContain(CLASSE_DA_TRANSICAO_DE_TEMA);

    transicao.encerrar();
    await transicao.finished;
    await Promise.resolve();
    await Promise.resolve();
    expect(documento.documentElement.classList).not.toContain(CLASSE_DA_TRANSICAO_DE_TEMA);
  });

  it('com movimento reduzido troca direto, sem criar transição', () => {
    const { documento } = documentoFalso(true);
    const atualizar = vi.fn();

    trocarComTransicao(documento, atualizar, opcoes);

    expect(atualizar).toHaveBeenCalledTimes(1);
    expect(documento.startViewTransition).not.toHaveBeenCalled();
    expect(documento.documentElement.classList).not.toContain(CLASSE_DA_TRANSICAO_DE_TEMA);
  });

  it('sem startViewTransition no navegador troca direto', () => {
    const { documento } = documentoFalso(false, false);
    const atualizar = vi.fn();

    trocarComTransicao(documento, atualizar, opcoes);

    expect(atualizar).toHaveBeenCalledTimes(1);
  });

  it('com uma navegação de rota em andamento troca direto, sem conflitar com ela', () => {
    const { documento } = documentoFalso();
    const atualizar = vi.fn();

    trocarComTransicao(documento, atualizar, { ...opcoes, navegando: true });

    expect(atualizar).toHaveBeenCalledTimes(1);
    expect(documento.startViewTransition).not.toHaveBeenCalled();
  });

  it('com outra View Transition ativa troca direto', () => {
    const { documento } = documentoFalso();
    Object.assign(documento, { activeViewTransition: {} });
    const atualizar = vi.fn();

    trocarComTransicao(documento, atualizar, opcoes);

    expect(atualizar).toHaveBeenCalledTimes(1);
    expect(documento.startViewTransition).not.toHaveBeenCalled();
  });

  it('não segura a página se a renderização nunca avisar', async () => {
    vi.useFakeTimers();
    const { documento, callbacks } = documentoFalso();

    trocarComTransicao(documento, vi.fn(), {
      navegando: false,
      aposRenderizar: () => new Promise<void>(() => undefined),
    });
    const espera = callbacks[0]();
    await vi.advanceTimersByTimeAsync(100);

    await expect(espera).resolves.toBeUndefined();
  });

  it('tira a marca mesmo se a transição for abortada', async () => {
    const { documento, transicao } = documentoFalso();
    transicao.finished = Promise.reject(new Error('abortada'));

    trocarComTransicao(documento, vi.fn(), opcoes);
    await new Promise((resolver) => setTimeout(resolver));

    expect(documento.documentElement.classList).not.toContain(CLASSE_DA_TRANSICAO_DE_TEMA);
  });
});
