import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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

describe('FaixaDeFerramentas', () => {
  async function montar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('tem Projeto como o único botão, com aria-pressed refletindo o painel', async () => {
    const { fixture, raiz } = await montar();
    const botoes = raiz.querySelectorAll('button');

    expect(botoes).toHaveLength(1);
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

  it('deixa Commit e Estrutura decorativos e sem foco', async () => {
    const { raiz } = await montar();
    const decorativos = raiz.querySelectorAll('span.botao');

    expect(decorativos).toHaveLength(2);
    decorativos.forEach((item) => expect(item.getAttribute('aria-hidden')).toBe('true'));
  });
});
