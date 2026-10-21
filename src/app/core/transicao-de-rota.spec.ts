import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import type { ViewTransitionInfo } from '@angular/router';

import { TransicaoDoProjeto } from './transicao-de-projeto';
import { pularTransicaoSeMovimentoReduzido } from './transicao-de-rota';

const rota = (...segmentos: string[]) =>
  ({
    pathFromRoot: [{ url: [] }, ...segmentos.map((path) => ({ url: [{ path }] }))],
  }) as unknown as ViewTransitionInfo['from'];

describe('pularTransicaoSeMovimentoReduzido', () => {
  const original = globalThis.matchMedia;

  afterEach(() => {
    globalThis.matchMedia = original;
  });

  function simularPreferencia(reduzir: boolean): void {
    globalThis.matchMedia = ((consulta: string) => ({
      matches: reduzir && consulta === '(prefers-reduced-motion: reduce)',
    })) as typeof globalThis.matchMedia;
  }

  function executar(de: string[], para: string[], finished: Promise<void> = Promise.resolve()) {
    const skipTransition = vi.fn();
    const info = {
      transition: {
        skipTransition,
        updateCallbackDone: Promise.resolve(),
        finished,
      },
      from: rota(...de),
      to: rota(...para),
    } as unknown as ViewTransitionInfo;
    TestBed.runInInjectionContext(() => pularTransicaoSeMovimentoReduzido(info));
    return { skipTransition };
  }

  it('pula a transição quando o movimento reduzido está ativado', () => {
    simularPreferencia(true);

    const { skipTransition } = executar(['skills'], ['contato']);

    expect(skipTransition).toHaveBeenCalledTimes(1);
  });

  it('mantém a transição quando o movimento reduzido está desativado', () => {
    simularPreferencia(false);

    const { skipTransition } = executar(['skills'], ['contato']);

    expect(skipTransition).not.toHaveBeenCalled();
  });

  it('mantém a transição ao entrar na vitrine vindo de outra seção', () => {
    simularPreferencia(false);

    const { skipTransition } = executar(['skills'], ['projetos']);

    expect(skipTransition).not.toHaveBeenCalled();
  });

  it('pula a transição dentro da vitrine quando ninguém combinou a expansão (Voltar, próximo)', () => {
    simularPreferencia(false);

    const { skipTransition } = executar(['projetos', 'ana'], ['projetos', 'memora']);

    expect(skipTransition).toHaveBeenCalledTimes(1);
  });

  it('ao abrir, o cartão carrega o nome na ida, larga depois do callback e fica limpo no fim', async () => {
    simularPreferencia(false);
    const cartao = document.createElement('a');
    TestBed.inject(TransicaoDoProjeto).preparar(cartao, 'abrir');
    expect(cartao.style.getPropertyValue('view-transition-name')).toBe('projeto');

    const { skipTransition } = executar(['projetos'], ['projetos', 'ana']);
    await Promise.resolve();

    expect(skipTransition).not.toHaveBeenCalled();
    await new Promise((resolver) => setTimeout(resolver));
    expect(cartao.style.getPropertyValue('view-transition-name')).toBe('');
  });

  it('ao fechar, o cartão recebe o nome depois do callback e o perde no fim', async () => {
    simularPreferencia(false);
    const cartao = document.createElement('a');
    TestBed.inject(TransicaoDoProjeto).preparar(cartao, 'fechar');
    expect(cartao.style.getPropertyValue('view-transition-name')).toBe('');

    let terminar = () => undefined as void;
    const fim = new Promise<void>((resolver) => (terminar = resolver));
    const { skipTransition } = executar(['projetos', 'ana'], ['projetos'], fim);
    await Promise.resolve();
    await Promise.resolve();

    expect(skipTransition).not.toHaveBeenCalled();
    expect(cartao.style.getPropertyValue('view-transition-name')).toBe('projeto');
    terminar();
    await new Promise((resolver) => setTimeout(resolver));
    expect(cartao.style.getPropertyValue('view-transition-name')).toBe('');
  });

  it('o combinado vale uma vez só', () => {
    simularPreferencia(false);
    const servico = TestBed.inject(TransicaoDoProjeto);
    servico.preparar(document.createElement('a'), 'abrir');

    executar(['projetos'], ['projetos', 'ana']);

    expect(servico.consumir()).toBeNull();
  });
});

describe('terminar uma transição', () => {
  it('não desfaz o combinado de uma volta pedida enquanto a ida terminava', () => {
    const servico = TestBed.inject(TransicaoDoProjeto);
    const ida = document.createElement('a');
    servico.preparar(ida, 'abrir');
    servico.consumir();
    servico.emAndamento = true;
    const volta = document.createElement('a');
    servico.preparar(volta, 'fechar');

    servico.terminar(ida);

    expect(ida.style.getPropertyValue('view-transition-name')).toBe('');
    expect(servico.emAndamento).toBe(true);
    expect(servico.consumir()?.cartao).toBe(volta);
  });
});
