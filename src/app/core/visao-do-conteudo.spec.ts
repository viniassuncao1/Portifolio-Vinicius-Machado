import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CHAVE_DA_VISAO, VisaoDoConteudoEscolhida } from './visao-do-conteudo';

describe('VisaoDoConteudoEscolhida', () => {
  afterEach(() => localStorage.clear());

  it('começa no cartão, que é o que o HTML pré-renderizado traz', () => {
    expect(TestBed.inject(VisaoDoConteudoEscolhida).visao()).toBe('cartao');
  });

  it('lembra a escolha depois da hidratação', () => {
    localStorage.setItem(CHAVE_DA_VISAO, 'codigo');

    const servico = TestBed.inject(VisaoDoConteudoEscolhida);
    TestBed.inject(ApplicationRef).tick();

    expect(servico.visao()).toBe('codigo');
  });

  it('ignora um valor desconhecido guardado no navegador', () => {
    localStorage.setItem(CHAVE_DA_VISAO, 'qualquer-coisa');

    const servico = TestBed.inject(VisaoDoConteudoEscolhida);
    TestBed.inject(ApplicationRef).tick();

    expect(servico.visao()).toBe('cartao');
  });

  it('alterna e grava a escolha', () => {
    const servico = TestBed.inject(VisaoDoConteudoEscolhida);

    servico.alternar();
    expect(servico.visao()).toBe('codigo');
    expect(localStorage.getItem(CHAVE_DA_VISAO)).toBe('codigo');

    servico.alternar();
    expect(servico.visao()).toBe('cartao');
  });

  it('sem armazenamento a escolha vale na visita', () => {
    const servico = TestBed.inject(VisaoDoConteudoEscolhida);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    servico.escolher('codigo');

    expect(servico.visao()).toBe('codigo');
    vi.restoreAllMocks();
  });

  it('escolherSemLembrar mostra a visão sem gravá-la', () => {
    const servico = TestBed.inject(VisaoDoConteudoEscolhida);

    servico.escolherSemLembrar('codigo');

    expect(servico.visao()).toBe('codigo');
    expect(localStorage.getItem(CHAVE_DA_VISAO)).toBeNull();
  });
});
