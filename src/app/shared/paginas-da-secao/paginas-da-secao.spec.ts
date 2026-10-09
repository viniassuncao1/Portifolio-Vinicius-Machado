import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PaginasDaSecao } from './paginas-da-secao';

describe('PaginasDaSecao', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina: number, total: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(PaginasDaSecao);
    fixture.componentRef.setInput('slug', 'skills');
    fixture.componentRef.setInput('pagina', pagina);
    fixture.componentRef.setInput('total', total);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('não renderiza nada com uma só página', async () => {
    const raiz = await renderizar(1, 1);

    expect(raiz.querySelector('nav')).toBeNull();
  });

  it('na primeira página mostra só "Próxima página", apontando para /skills/2', async () => {
    const raiz = await renderizar(1, 2);

    expect(raiz.querySelector('[aria-label="Página anterior"]')).toBeNull();
    expect(raiz.querySelector('[aria-label="Próxima página"]')?.getAttribute('href')).toBe(
      '/skills/2',
    );
  });

  it('na última página mostra só "Página anterior", apontando para /skills', async () => {
    const raiz = await renderizar(2, 2);

    expect(raiz.querySelector('[aria-label="Próxima página"]')).toBeNull();
    expect(raiz.querySelector('[aria-label="Página anterior"]')?.getAttribute('href')).toBe(
      '/skills',
    );
  });

  it('identifica a navegação e anuncia a página atual como "página X de N"', async () => {
    const raiz = await renderizar(2, 2);
    const atual = raiz.querySelector('[aria-current="page"]');

    expect(raiz.querySelector('nav')?.getAttribute('aria-label')).toBe('Páginas da seção');
    expect(atual?.textContent?.trim()).toBe('2/2');
    expect(atual?.getAttribute('aria-label')).toBe('página 2 de 2');
  });

  it('esconde os glifos da leitura, pois os links têm nome próprio', async () => {
    const raiz = await renderizar(2, 3);

    raiz.querySelectorAll('a > svg').forEach((glifo) => {
      expect(glifo.getAttribute('aria-hidden')).toBe('true');
    });
    expect(raiz.querySelectorAll('a')).toHaveLength(2);
  });
});
