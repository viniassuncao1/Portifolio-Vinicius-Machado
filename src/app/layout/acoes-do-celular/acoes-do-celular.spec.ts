import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AcoesDoCelular } from './acoes-do-celular';

@Component({
  imports: [AcoesDoCelular],
  template: `<app-acoes-do-celular
    [gavetaAberta]="aberta"
    (alternarGaveta)="cliques = cliques + 1"
  />`,
})
class Hospedeiro {
  aberta = false;
  cliques = 0;
}

describe('AcoesDoCelular', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  async function montar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('é uma navegação com Seções, Projetos e Contato', async () => {
    const { raiz } = await montar();
    const acoes = Array.from(raiz.querySelectorAll('.acao .rotulo')).map((r) => r.textContent);

    expect(raiz.querySelector('nav')?.getAttribute('aria-label')).toBe('Ações');
    expect(acoes).toEqual(['Seções', 'Projetos', 'Contato']);
  });

  it('leva a Projetos e a Contato por links reais', async () => {
    const { raiz } = await montar();
    const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('a.acao'));

    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/projetos', '/contato']);
  });

  it('Seções pede a gaveta e reflete o estado em aria-expanded e aria-controls', async () => {
    const { fixture, raiz } = await montar();
    const botao = raiz.querySelector<HTMLButtonElement>('button.acao')!;

    expect(botao.getAttribute('aria-controls')).toBe('painel-lateral');
    expect(botao.getAttribute('aria-expanded')).toBe('false');

    botao.click();
    fixture.componentInstance.aberta = true;
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    expect(fixture.componentInstance.cliques).toBe(1);
    expect(botao.getAttribute('aria-expanded')).toBe('true');
  });

  it('só aparece abaixo de 768 px', async () => {
    await montar();
    const css = Array.from(document.head.querySelectorAll('style'))
      .map((estilo) => estilo.textContent ?? '')
      .join('\n');

    expect(css).toMatch(/max-width:\s*767\.98px/);
  });
});
