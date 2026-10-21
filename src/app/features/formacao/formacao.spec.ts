import { TestBed } from '@angular/core/testing';

import { Formacao } from './formacao';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Formacao', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Formacao);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('UniCEUB');
    expect(texto).toContain('Bacharelado em Ciência da Computação');
    expect(texto).toContain('package dev.vinicius.portfolio.formacao;');
    expect(texto).toContain('record Graduacao(');
    expect(texto).toContain('int anoPrevistoDeFormatura');
    expect(texto).not.toContain('static final');
    expect(texto).toContain('2027');
    expect(texto).not.toContain('Year.of');
  });
});
