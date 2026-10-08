import { TestBed } from '@angular/core/testing';

import { BarraDeFerramentas } from './barra-de-ferramentas';

describe('BarraDeFerramentas', () => {
  it('é decorativa: fica fora da leitura e não tem controles focáveis', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.getAttribute('aria-hidden')).toBe('true');
    expect(elemento.querySelectorAll('button, a, [tabindex]')).toHaveLength(0);
  });

  it('exibe os oito ícones da barra', async () => {
    const fixture = TestBed.createComponent(BarraDeFerramentas);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-icone')).toHaveLength(8);
  });
});
