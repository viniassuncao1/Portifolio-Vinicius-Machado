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

    expect(texto).toContain('ENGLISH = "Básico"');
    expect(texto).toContain('SPANISH = "Básico"');
  });

  it('escreve os nomes dos idiomas em pt-BR', async () => {
    const texto = await codigo();

    expect(texto).toContain('// Inglês');
    expect(texto).toContain('// Espanhol');
  });

  it('não usa enum nem Map para dois idiomas', async () => {
    const texto = await codigo();

    expect(texto).not.toContain('enum');
    expect(texto).not.toContain('Map');
  });
});
