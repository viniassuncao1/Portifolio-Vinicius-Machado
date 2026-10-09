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

    expect(texto).toContain('"Inglês", Level.BASIC');
    expect(texto).toContain('"Espanhol", Level.BASIC');
    expect(texto).toContain('"Básico"');
  });
});
