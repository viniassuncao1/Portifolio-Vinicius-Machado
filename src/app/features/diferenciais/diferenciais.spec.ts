import { TestBed } from '@angular/core/testing';

import { Diferenciais } from './diferenciais';

describe('Diferenciais', () => {
  it('exibe o código da seção no editor, sem h1 próprio', async () => {
    const fixture = TestBed.createComponent(Diferenciais);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('h1')).toBeNull();
  });
});
