import { TestBed } from '@angular/core/testing';

import { ComoUsoIa } from './como-uso-ia';

describe('ComoUsoIa', () => {
  it('mostra a classe ArtificialIntelligence e os booleanos no papel de valor', async () => {
    const fixture = TestBed.createComponent(ComoUsoIa);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;

    expect(raiz.querySelector('code')?.textContent).toContain('ArtificialIntelligence {');
    expect(Array.from(raiz.querySelectorAll('.papel-valor')).map((v) => v.textContent)).toEqual([
      'false',
      'true',
    ]);
    expect(raiz.querySelector('h1')).toBeNull();
  });
});
