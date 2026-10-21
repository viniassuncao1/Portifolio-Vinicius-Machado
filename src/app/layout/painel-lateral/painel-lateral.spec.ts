import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PainelLateral } from './painel-lateral';

describe('PainelLateral', () => {
  // Rota coringa: o clique no link Repositório navega, e a navegação precisa terminar dentro do teste.
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] }),
  );

  it('mostra a árvore em 7 pastas, com a primeira expandida', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelectorAll('nav [data-tipo=pasta]')).toHaveLength(7);
    expect(elemento.querySelectorAll('nav a')).toHaveLength(18);
    expect(elemento.querySelectorAll('nav .grupo:not([hidden]) a')).toHaveLength(3);
  });

  it('tem o link Repositório depois da árvore, para a gaveta do celular', async () => {
    const fixture = TestBed.createComponent(PainelLateral);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    const link = elemento.querySelector<HTMLAnchorElement>('a.repositorio')!;
    let escolhida = 0;
    fixture.componentInstance.secaoEscolhida.subscribe(() => (escolhida += 1));

    expect(link.getAttribute('href')).toBe('/repositorio');
    expect(link.textContent?.trim()).toBe('Repositório');
    expect(link.closest('nav')).toBeNull();
    expect(elemento.querySelector('app-arvore-de-secoes')?.nextElementSibling).toBe(link);
    link.click();
    await fixture.whenStable();
    expect(escolhida).toBe(1);
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

    expect(document.activeElement).toBe(elemento.querySelector('nav [role=treeitem]'));
    elemento.remove();
  });
});
