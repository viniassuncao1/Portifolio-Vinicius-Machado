import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PainelLateral } from './painel-lateral';

describe('PainelLateral', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('mostra a árvore com as 15 seções', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('nav a')).toHaveLength(15);
  });

  it('mantém o cabeçalho e a scrollbar decorativos fora da leitura', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('.cabecalho')?.getAttribute('aria-hidden')).toBe('true');
    expect(elemento.querySelector('.rodape')?.getAttribute('aria-hidden')).toBe('true');
  });
});
