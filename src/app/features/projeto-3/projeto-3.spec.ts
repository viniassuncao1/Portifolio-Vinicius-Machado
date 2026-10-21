import { TestBed } from '@angular/core/testing';

import { Projeto3 } from './projeto-3';
import { CONTEUDO_PROJETO_3 } from './projeto-3.conteudo';
import { VisaoDoConteudoEscolhida } from '../../core/visao-do-conteudo';

describe('Projeto3', () => {
  // Estes testes cobrem a visão em código; o cartão tem os seus em `shared/cartoes` e nos E2E.
  beforeEach(() => TestBed.inject(VisaoDoConteudoEscolhida).escolher('codigo'));
  afterEach(() => localStorage.clear());

  async function codigo(): Promise<string> {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('code')?.textContent ?? '';
  }

  it('descreve o launcher em pt-BR, com o crédito ao CleanYourTV', async () => {
    const texto = await codigo();

    expect(texto).toContain('Fork do CleanYourTV, do Gathin');
    expect(texto).toContain('Android 4.4');
    expect(texto).toContain('42 testes');
  });

  it('usa nomes em português e o pacote dos projetos, sem static final', async () => {
    const texto = await codigo();

    expect(texto).toContain('package dev.vinicius.portfolio.projetos;');
    expect(texto).toContain('String linguagem = "Java";');
    expect(texto).toContain('int minSdkNovo = 19;');
    expect(texto).not.toContain('static final');
  });

  it('liga o projeto original e o fork no GitHub', async () => {
    const fixture = TestBed.createComponent(Projeto3);
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );

    expect(links).toContain('https://github.com/Gathin23/cleanyourtv');
    expect(links).toContain('https://github.com/viniassuncao1/cleanyourtv');
  });

  it('marca a linha da classe como executável para o ▶ da calha', () => {
    const classe = CONTEUDO_PROJETO_3.find(
      (item) => item.tipo === 'codigo' && item.executavel === true,
    );

    expect(classe?.tipo === 'codigo' && classe.trechos.map((t) => t.texto).join('')).toContain(
      'public class LauncherDeTv {',
    );
  });
});
