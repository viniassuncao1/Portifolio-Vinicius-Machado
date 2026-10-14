import { TestBed } from '@angular/core/testing';

import { Projeto3 } from './projeto-3';
import { CONTEUDO_PROJETO_3 } from './projeto-3.conteudo';

describe('Projeto3', () => {
  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('mostra a landing page e o link real do site', async () => {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('code')?.textContent).toContain('Landing Page');
    expect(el.querySelector('a[href^="https://"]')).not.toBeNull();
  });

  it('descreve o projeto em pt-BR', async () => {
    expect(await codigo()).toContain('Automatize. Escale. Domine.');
  });

  it('usa nomes em português e o pacote dos projetos, sem static final', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.projetos;');
    expect(texto).toContain('String tecnologia = "React";');
    expect(texto).toContain('String site = "https://wattscompany.com.br/";');
    expect(texto).not.toContain('static final');
  });

  it('marca a linha da classe como executável para o ▶ da calha', () => {
    const classe = CONTEUDO_PROJETO_3.find(
      (item) => item.tipo === 'codigo' && item.executavel === true,
    );

    expect(classe?.tipo === 'codigo' && classe.trechos.map((t) => t.texto).join('')).toContain(
      'public class WattsCompany {',
    );
  });
});
