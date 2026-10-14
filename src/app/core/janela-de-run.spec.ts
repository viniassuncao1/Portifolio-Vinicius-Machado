import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CHAVE_DO_RUN_EXIBIDO, JanelaDeRun } from './janela-de-run';

function movimentoReduzido(reduzido: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((consulta: string) => ({ matches: reduzido && consulta.includes('reduce') })),
  );
}

describe('JanelaDeRun', () => {
  beforeEach(() => {
    sessionStorage.clear();
    movimentoReduzido(false);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('abre sozinha na primeira visita da sessão, sem pedir foco, e marca a sessão', () => {
    const run = TestBed.inject(JanelaDeRun);

    run.abrirNaPrimeiraVisita();

    expect(run.aberto()).toBe(true);
    expect(run.focarAoAbrir()).toBe(false);
    expect(run.inicio()).toBeInstanceOf(Date);
    expect(sessionStorage.getItem(CHAVE_DO_RUN_EXIBIDO)).toBe('1');
  });

  it('não abre sozinha de novo na mesma sessão', () => {
    sessionStorage.setItem(CHAVE_DO_RUN_EXIBIDO, '1');
    const run = TestBed.inject(JanelaDeRun);

    run.abrirNaPrimeiraVisita();

    expect(run.aberto()).toBe(false);
  });

  it('com movimento reduzido não abre sozinha nem marca a sessão', () => {
    movimentoReduzido(true);
    const run = TestBed.inject(JanelaDeRun);

    run.abrirNaPrimeiraVisita();

    expect(run.aberto()).toBe(false);
    expect(sessionStorage.getItem(CHAVE_DO_RUN_EXIBIDO)).toBeNull();
  });

  it('nunca abre no servidor (pré-render)', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const run = TestBed.inject(JanelaDeRun);

    run.abrirNaPrimeiraVisita();
    run.executar(null);

    expect(run.aberto()).toBe(false);
  });

  it('o Executar abre, pede o foco e reinicia o log a cada vez', () => {
    const run = TestBed.inject(JanelaDeRun);

    run.executar(null);
    const primeira = run.execucao();
    run.executar(null);

    expect(run.aberto()).toBe(true);
    expect(run.focarAoAbrir()).toBe(true);
    expect(run.execucao()).toBe(primeira + 1);
  });

  it('devolve o foco a quem abriu ao fechar', () => {
    const botao = document.createElement('button');
    document.body.append(botao);
    const run = TestBed.inject(JanelaDeRun);

    run.executar(botao);
    run.fechar();

    expect(run.aberto()).toBe(false);
    expect(document.activeElement).toBe(botao);
    botao.remove();
  });

  it('o log nasce completo e concluir() mantém o fim da revelação', () => {
    const run = TestBed.inject(JanelaDeRun);

    expect(run.terminado()).toBe(true);
    run.concluir();
    expect(run.terminado()).toBe(true);
  });
});
