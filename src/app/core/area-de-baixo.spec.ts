import { TestBed } from '@angular/core/testing';

import { AreaDeBaixo } from './area-de-baixo';
import { JanelaDeRun } from './janela-de-run';
import { PainelDoGit } from './painel-do-git';

describe('AreaDeBaixo', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it('começa sem nenhuma janela aberta', () => {
    expect(TestBed.inject(AreaDeBaixo).janela()).toBeNull();
  });

  it('só fecha a janela que está aberta', () => {
    const area = TestBed.inject(AreaDeBaixo);

    area.abrir('git');
    area.fechar('run');
    expect(area.janela()).toBe('git');

    area.fechar('git');
    expect(area.janela()).toBeNull();
  });

  it('o Git fecha o Run ao abrir, e o Run fecha o Git', () => {
    const run = TestBed.inject(JanelaDeRun);
    const git = TestBed.inject(PainelDoGit);

    run.executar(null);
    expect(run.aberto()).toBe(true);

    git.abrir(null);
    expect(git.aberto()).toBe(true);
    expect(run.aberto()).toBe(false);

    run.executar(null);
    expect(run.aberto()).toBe(true);
    expect(git.aberto()).toBe(false);
  });
});
