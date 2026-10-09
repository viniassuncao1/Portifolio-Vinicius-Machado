import { TestBed } from '@angular/core/testing';

import { Formacao } from './formacao';

describe('Formacao', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Formacao);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra o conteúdo da seção em Java', async () => {
    const texto = await codigo();

    expect(texto).toContain('UniCEUB');
    expect(texto).toContain('Bacharelado em Ciência da Computação');
    expect(texto).toContain('int expectedGraduation');
    expect(texto).toContain('2027');
    expect(texto).not.toContain('Year.of');
  });
});
