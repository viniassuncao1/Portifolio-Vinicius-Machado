import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CONTEUDOS_PROJETO_4 } from './projeto-4.conteudo';
import { Projeto4 } from './projeto-4';

describe('Projeto4', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina?: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projeto4);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('tem uma página de conteúdo para cada case', () => {
    expect(CONTEUDOS_PROJETO_4).toHaveLength(3);
  });

  it.each([
    [1, '1/3', 'Oracle → PostgreSQL', 'migração de APIs e microsserviços'],
    [2, '2/3', 'Scraper de licitações', 'Coren e Sanesul'],
    [3, '3/3', 'AyoForms', 'SharePoint'],
  ])('página %i mostra o case e o controle %s', async (pagina, controle, titulo, trecho) => {
    const raiz = await renderizar(pagina);

    expect(raiz.querySelector('code')?.textContent).toContain(`"${titulo}"`);
    expect(raiz.querySelector('.javadoc')?.textContent).toContain(trecho);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe(controle);
  });

  it('declara o record Caso e as tecnologias numa linha em cada página', async () => {
    for (const pagina of [1, 2, 3]) {
      const codigo = (await renderizar(pagina)).querySelector('code')?.textContent ?? '';

      expect(codigo).toContain('package dev.vinicius.portfolio.projetos;');
      expect(codigo).toContain('record Caso(String titulo, List<String> tecnologias) {}');
      expect(codigo).not.toContain('static final');
      expect(codigo).toMatch(/List\.of\("[^\n]*"\)/);
    }
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
