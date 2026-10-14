import { TestBed } from '@angular/core/testing';

import { Eventos } from './eventos';

describe('Eventos', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Eventos);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.formacao;');
    expect(texto).toContain('record Evento(String nome, int vezes)');
    expect(texto).toContain('List<Evento> participei = List.of(');
    expect(texto).not.toContain('static final');
    expect(texto).toContain('Brasília IT');
    expect(texto).toContain('Campus Party Brasília');
    expect(texto).toContain('// 2x');
    expect(texto).toContain('BB Digital Week');
  });
});
