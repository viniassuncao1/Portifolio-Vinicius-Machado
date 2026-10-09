import { TestBed } from '@angular/core/testing';

import { GlifoFechar } from './glifo-fechar';

describe('GlifoFechar', () => {
  it('é decorativo e desenha o "×"', async () => {
    const fixture = TestBed.createComponent(GlifoFechar);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.getAttribute('aria-hidden')).toBe('true');
    expect(elemento.querySelector('svg path')).not.toBeNull();
  });
});
