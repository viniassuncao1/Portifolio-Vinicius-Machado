import { TestBed } from '@angular/core/testing';

import { Idiomas } from './idiomas';

describe('Idiomas', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Idiomas);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.formacao;');
    expect(texto).toContain('String ingles = "Básico";');
    expect(texto).toContain('String espanhol = "Básico";');
    expect(texto).not.toContain('static final');
  });

  it('não usa enum nem Map para dois idiomas', async () => {
    const texto = await codigo();

    expect(texto).not.toContain('enum');
    expect(texto).not.toContain('Map');
  });
});
