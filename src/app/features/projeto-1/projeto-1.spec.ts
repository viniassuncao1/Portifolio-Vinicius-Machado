import { TestBed } from '@angular/core/testing';

import { Projeto1 } from './projeto-1';

describe('Projeto1', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projeto1);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('mostra os 3 cases num arquivo só, sem controle de páginas', async () => {
    const raiz = await renderizar();
    const codigo = raiz.querySelector('code')?.textContent ?? '';

    for (const titulo of ['Oracle → PostgreSQL', 'Scraper de licitações', 'AyoForms']) {
      expect(codigo).toContain(`"${titulo}"`);
      expect(codigo).toContain(`// ${titulo}`);
    }
    expect(raiz.querySelector('nav, [aria-current="page"]')).toBeNull();
  });

  it('mantém o texto e as tecnologias de cada case', async () => {
    const raiz = await renderizar();
    const javadocs = Array.from(raiz.querySelectorAll('.javadoc')).map((j) => j.textContent ?? '');
    const codigo = raiz.querySelector('code')?.textContent ?? '';

    expect(javadocs).toHaveLength(3);
    expect(javadocs[0]).toContain('migração de APIs e microsserviços');
    expect(javadocs[1]).toContain('Coren e Sanesul');
    expect(javadocs[2]).toContain('SharePoint');
    expect(codigo).toContain('List.of("Java", "Oracle", "PostgreSQL", "SQL")');
    expect(codigo).toContain('List.of("Java", "Playwright", "Coren", "Sanesul")');
    expect(codigo).toContain(
      'List.of("PHP 8", "JavaScript", "MySQL", "Google Workspace", "Microsoft Azure", "SharePoint")',
    );
  });

  it('declara o pacote, o import e o record uma vez só', async () => {
    const codigo = (await renderizar()).querySelector('code')?.textContent ?? '';
    const vezes = (trecho: string): number => codigo.split(trecho).length - 1;

    expect(vezes('package dev.vinicius.portfolio.projetos;')).toBe(1);
    expect(vezes('import java.util.List;')).toBe(1);
    expect(vezes('public class CasosDaMemora {')).toBe(1);
    expect(vezes('record Caso(String titulo, List<String> tecnologias) {}')).toBe(1);
    expect(codigo).not.toContain('static final');
  });

  it('não tem h1 próprio', async () => {
    expect((await renderizar()).querySelector('h1')).toBeNull();
  });
});
