import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Router, provideRouter } from '@angular/router';

import { FaixaDeFerramentas } from './faixa-de-ferramentas';

@Component({
  imports: [FaixaDeFerramentas],
  template: `<app-faixa-de-ferramentas
    [painelVisivel]="visivel()"
    (alternarPainel)="cliques = cliques + 1"
  />`,
})
class Hospedeiro {
  visivel = signal(true);
  cliques = 0;
}

@Component({ template: '' })
class Vazia {}

describe('FaixaDeFerramentas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: Vazia }])],
    });
  });

  async function montar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('tem Projeto e Commit como botões, com aria-pressed refletindo o painel', async () => {
    const { fixture, raiz } = await montar();
    const botoes = raiz.querySelectorAll('button');

    expect(botoes).toHaveLength(2);
    expect(botoes[0].getAttribute('aria-label')).toBe('Projeto');
    expect(botoes[0].getAttribute('aria-pressed')).toBe('true');

    fixture.componentInstance.visivel.set(false);
    await fixture.whenStable();

    expect(botoes[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('pede para alternar o painel ao ativar Projeto', async () => {
    const { fixture, raiz } = await montar();

    raiz.querySelector('button')!.click();

    expect(fixture.componentInstance.cliques).toBe(1);
  });

  it('Commit leva ao repositório e marca aria-current="page", sem aria-pressed', async () => {
    const { fixture, raiz } = await montar();
    const commit = raiz.querySelectorAll('button')[1];

    expect(commit.getAttribute('aria-label')).toBe('Commit');
    expect(commit.hasAttribute('aria-pressed')).toBe(false);
    expect(commit.hasAttribute('aria-current')).toBe(false);

    commit.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(TestBed.inject(Router).url).toBe('/repositorio');
    expect(commit.getAttribute('aria-current')).toBe('page');
    expect(commit.hasAttribute('aria-pressed')).toBe(false);
  });

  it('deixa Estrutura decorativa e sem foco', async () => {
    const { raiz } = await montar();
    const decorativos = raiz.querySelectorAll('span.botao');

    expect(decorativos).toHaveLength(1);
    expect(decorativos[0].getAttribute('aria-hidden')).toBe('true');
  });
});
