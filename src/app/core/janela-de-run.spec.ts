import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JanelaDeRun } from './janela-de-run';

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

  it('não abre sozinha: nasce fechada e sem abertura automática', () => {
    const run = TestBed.inject(JanelaDeRun);

    expect(run.aberto()).toBe(false);
    expect(run.inicio()).toBeNull();
    expect('abrirNaPrimeiraVisita' in run).toBe(false);
    expect(sessionStorage.length).toBe(0);
  });

  it('nunca abre no servidor (pré-render)', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    const run = TestBed.inject(JanelaDeRun);

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
