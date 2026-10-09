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

  it('no meio mostra os dois links, para a página anterior e a próxima', async () => {
    const raiz = await renderizar(2, 3);

    expect(raiz.querySelector('[aria-label="Página anterior"]')?.getAttribute('href')).toBe(
      '/skills',
    );
    expect(raiz.querySelector('[aria-label="Próxima página"]')?.getAttribute('href')).toBe(
      '/skills/3',
    );
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2/3');
  });

  it('usa o slug informado nos endereços', async () => {
    const fixture = TestBed.createComponent(PaginasDaSecao);
    fixture.componentRef.setInput('slug', 'experiencias');
    fixture.componentRef.setInput('pagina', 1);
    fixture.componentRef.setInput('total', 2);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('[aria-label="Próxima página"]')
        ?.getAttribute('href'),
    ).toBe('/experiencias/2');
  });

  it('anuncia só uma página atual', async () => {
    const raiz = await renderizar(1, 3);

    expect(raiz.querySelectorAll('[aria-current]')).toHaveLength(1);
  });

  it('mostra o controle "1/2" na primeira página', async () => {
    const raiz = await renderizar(1, 2);

    expect(raiz.querySelector('nav')?.textContent?.replace(/\s+/g, '')).toBe('1/2');
  });

  it('deixa os espaços das pontas fora da leitura e do foco', async () => {
    const raiz = await renderizar(1, 2);
    const vazio = raiz.querySelector('.vazio');

    expect(vazio?.getAttribute('aria-hidden')).toBe('true');
    expect(vazio?.getAttribute('tabindex')).toBeNull();
    expect(vazio?.tagName).not.toBe('A');
  });

  it('mantém os links alcançáveis pelo teclado, sem tabindex negativo', async () => {
    const raiz = await renderizar(2, 3);

    raiz.querySelectorAll('a').forEach((link) => {
      expect(link.getAttribute('tabindex')).not.toBe('-1');
      expect(link.getAttribute('href')).not.toBeNull();
    });
  });

  it('atualiza o controle quando a página muda', async () => {
    const fixture = TestBed.createComponent(PaginasDaSecao);
    fixture.componentRef.setInput('slug', 'skills');
    fixture.componentRef.setInput('pagina', 1);
    fixture.componentRef.setInput('total', 2);
    await fixture.whenStable();

    fixture.componentRef.setInput('pagina', 2);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;

    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2/2');
    expect(raiz.querySelector('[aria-label="Próxima página"]')).toBeNull();
  });
});
