import { TestBed } from '@angular/core/testing';

import { AbaDoEditor } from './aba-do-editor';

describe('AbaDoEditor', () => {
  it('mostra o rótulo Portfolio_Vinicius e fica fora da leitura', async () => {
    const fixture = TestBed.createComponent(AbaDoEditor);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.textContent).toContain('Portfolio_Vinicius');
    expect(elemento.getAttribute('aria-hidden')).toBe('true');
  });
});
