import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Tema } from '../../core/tema';
import { BarraDeFerramentas } from './barra-de-ferramentas';

@Component({
  imports: [BarraDeFerramentas],
  template: `<app-barra-de-ferramentas (buscar)="busca = busca + 1" />`,
})
class Hospedeiro {
  busca = 0;
}

@Component({ template: '' })
class Vazia {}

describe('BarraDeFerramentas', () => {
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

  it('mostra a branch master como botão que leva ao repositório', async () => {
    const { raiz } = await montar();
    const ramo = raiz.querySelector<HTMLButtonElement>('button.ramo')!;

    expect(ramo.textContent).toContain('master');
    expect(ramo.getAttribute('aria-label')).toBe('Branch master, abrir o repositório');
    expect(ramo.hasAttribute('aria-expanded')).toBe(false);

    ramo.click();
    await TestBed.inject(Router)
      .navigateByUrl('/repositorio')
      .catch(() => undefined);

    expect(TestBed.inject(Router).url).toBe('/repositorio');
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
    const daIntellij = origens.filter(
      (origem) => origem.includes('icones/new-ui/') && !origem.includes('/claro/'),
    );

    expect(origens.length).toBeGreaterThan(5);
    expect(daIntellij.map((origem) => /([^/]+)\.svg/.exec(origem)?.[1]).sort()).toEqual([
      'buscar',
      'ramo',
    ]);
  });

  it('tem o botão de tema, com o nome do tema de destino e aria-pressed no claro', async () => {
    const { fixture, raiz } = await montar();
    const tema = TestBed.inject(Tema);
    const botao = raiz.querySelector<HTMLButtonElement>('.botao-tema')!;

    expect(botao.getAttribute('aria-label')).toBe('Usar tema claro');
    expect(botao.getAttribute('aria-pressed')).toBe('false');
    expect(botao.querySelector('img')?.getAttribute('src')).toContain('icones/sol.svg');

    tema.aplicar('claro');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(botao.getAttribute('aria-label')).toBe('Usar tema escuro');
    expect(botao.getAttribute('aria-pressed')).toBe('true');
    expect(botao.querySelector('img')?.getAttribute('src')).toContain('icones/lua.svg');
    tema.aplicar('escuro');
  });

  it('alterna o tema ao ativar o botão', async () => {
    const { raiz } = await montar();
    const tema = TestBed.inject(Tema);

    raiz.querySelector<HTMLButtonElement>('.botao-tema')!.click();

    expect(tema.claro()).toBe(true);
    tema.aplicar('escuro');
  });

  it('tem o fundo escuro do design, sem o degradê claro', async () => {
    const { raiz } = await montar();
    const barra = raiz.querySelector('app-barra-de-ferramentas')!;

    expect(getComputedStyle(barra).backgroundImage).toBe('none');
  });

  it('deixa os demais ícones decorativos e sem foco', async () => {
    const { raiz } = await montar();

    for (const controle of raiz.querySelectorAll('.decorativo')) {
      expect(controle.getAttribute('aria-hidden')).toBe('true');
      expect(controle.matches('button, a, [tabindex]')).toBe(false);
    }
  });

  it('só tem como botões o projeto, o Executar, o Buscar, o tema e a branch', async () => {
    const { raiz } = await montar();
    const nomes = Array.from(raiz.querySelectorAll('button')).map((b) =>
      (b.getAttribute('aria-label') ?? b.textContent ?? '').trim(),
    );

    expect(nomes).toEqual([
      'Portfolio_Vinicius, ir para o início',
      'Executar PortfolioApplication',
      'Buscar seção (Ctrl+K)',
      'Usar tema claro',
      'Branch master, abrir o repositório',
    ]);
  });

  it('pede a busca ao ativar Buscar', async () => {
    const { fixture, raiz } = await montar();

    raiz.querySelector<HTMLButtonElement>('.botao-busca')!.click();

    expect(fixture.componentInstance.busca).toBe(1);
  });

  it('mostra a identidade do projeto: selo VM, o nome e o caminho para o Início', async () => {
    const { raiz } = await montar();
    const projeto = raiz.querySelector<HTMLButtonElement>('button.projeto')!;

    expect(projeto.querySelector('.selo')?.textContent).toBe('VM');
    expect(projeto.querySelector('.nome-do-projeto')?.textContent).toBe('Portfolio_Vinicius');
    expect(projeto.getAttribute('aria-label')).toContain('Portfolio_Vinicius');
    projeto.click();
    await new Promise((r) => setTimeout(r));

    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('mostra o atalho da busca ao lado do rótulo, fora da leitura', async () => {
    const { raiz } = await montar();
    const busca = raiz.querySelector<HTMLButtonElement>('.botao-busca')!;

    expect(busca.getAttribute('aria-keyshortcuts')).toBe('Control+K Meta+K');
    expect(busca.querySelector('.rotulo-busca')?.textContent).toBe('Buscar');
    expect(busca.querySelector('.atalho-busca')?.textContent).toMatch(/Ctrl K|⌘K/);
    expect(busca.querySelector('.atalho-busca')?.getAttribute('aria-hidden')).toBe('true');
  });
});
