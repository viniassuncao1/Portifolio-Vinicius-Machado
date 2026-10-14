import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BarraDeFerramentas } from './barra-de-ferramentas';

@Component({
  imports: [BarraDeFerramentas],
  template: `<app-barra-de-ferramentas
    [gavetaAberta]="aberta"
    (alternarGaveta)="gaveta = gaveta + 1"
    (buscar)="busca = busca + 1"
  />`,
})
class Hospedeiro {
  aberta = false;
  gaveta = 0;
  busca = 0;
}

describe('BarraDeFerramentas', () => {
  async function montar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    await fixture.whenStable();
    return { fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('mostra o indicador da branch master, decorativo', async () => {
    const { raiz } = await montar();
    const ramo = raiz.querySelector('.ramo');

    expect(ramo?.textContent).toContain('master');
    expect(ramo?.getAttribute('aria-hidden')).toBe('true');
  });

  it('não tem mais os widgets PV portfolio-vinicius e PortfolioApplication', async () => {
    const { raiz } = await montar();

    expect(raiz.textContent).not.toContain('portfolio-vinicius');
    expect(raiz.textContent).not.toContain('PortfolioApplication');
  });

  it('usa os ícones do design e só a busca e a branch são da IntelliJ Platform', async () => {
    const { raiz } = await montar();
    const origens = Array.from(raiz.querySelectorAll('app-icone img')).map(
      (img) => img.getAttribute('src') ?? '',
    );
    const daIntellij = origens.filter((origem) => origem.includes('icones/new-ui/'));

    expect(origens.length).toBeGreaterThan(5);
    expect(daIntellij.map((origem) => /([^/]+)\.svg/.exec(origem)?.[1]).sort()).toEqual([
      'buscar',
      'ramo',
    ]);
  });

  it('tem o fundo escuro do design, sem o degradê claro', async () => {
    const { raiz } = await montar();
    const barra = raiz.querySelector('app-barra-de-ferramentas')!;

    expect(getComputedStyle(barra).backgroundImage).toBe('none');
  });

  it('deixa Executar e os demais ícones decorativos e sem foco fora dos projetos com site', async () => {
    const { raiz } = await montar();

    for (const controle of raiz.querySelectorAll('.executar, .decorativo')) {
      expect(controle.getAttribute('aria-hidden')).toBe('true');
      expect(controle.matches('button, a, [tabindex]')).toBe(false);
    }
  });

  it('só tem como botões o Projeto do celular e o Buscar', async () => {
    const { raiz } = await montar();
    const nomes = Array.from(raiz.querySelectorAll('button')).map((b) =>
      b.getAttribute('aria-label'),
    );

    expect(nomes).toEqual(['Projeto', 'Buscar seção (Ctrl+P)']);
  });

  it('pede a busca ao ativar Buscar', async () => {
    const { fixture, raiz } = await montar();

    raiz.querySelector<HTMLButtonElement>('.botao-busca')!.click();

    expect(fixture.componentInstance.busca).toBe(1);
  });

  it('pede a gaveta pelo botão Projeto e reflete o estado em aria-expanded', async () => {
    const { fixture, raiz } = await montar();
    const botao = raiz.querySelector<HTMLButtonElement>('.projeto-celular')!;

    botao.click();
    fixture.componentInstance.aberta = true;
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    expect(fixture.componentInstance.gaveta).toBe(1);
    expect(botao.getAttribute('aria-expanded')).toBe('true');
  });
});
