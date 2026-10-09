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

  it('contém a árvore dentro de uma navegação identificada', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');

    expect(nav?.getAttribute('aria-label')).toBe('Seções do portfólio');
  });

  it('mostra o título do painel no cabeçalho decorativo', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const cabecalho = (fixture.nativeElement as HTMLElement).querySelector('.cabecalho');

    expect(cabecalho?.textContent).toContain('Portfolio_Vinicius');
  });

  it('não tem controles focáveis fora da árvore', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelectorAll('.cabecalho :is(a, button, [tabindex])')).toHaveLength(0);
    expect(elemento.querySelectorAll('.rodape :is(a, button, [tabindex])')).toHaveLength(0);
  });

  it('foca o primeiro item da árvore', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    document.body.append(elemento);

    fixture.componentInstance.focarPrimeiroItem();

    expect(document.activeElement).toBe(elemento.querySelector('nav a'));
    elemento.remove();
  });
});
