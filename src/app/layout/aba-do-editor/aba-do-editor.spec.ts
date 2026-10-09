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

  it('não tem controles focáveis nem cabeçalhos', async () => {
    const fixture = TestBed.createComponent(AbaDoEditor);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelectorAll('button, a, [tabindex], h1, h2, h3')).toHaveLength(0);
  });

  it('mostra o ícone e o glifo de fechar ao lado do rótulo', async () => {
    const fixture = TestBed.createComponent(AbaDoEditor);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('app-icone')).not.toBeNull();
    expect(elemento.querySelector('app-glifo-fechar')).not.toBeNull();
  });
});
