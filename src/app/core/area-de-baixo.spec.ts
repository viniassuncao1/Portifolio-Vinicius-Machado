import { TestBed } from '@angular/core/testing';

import { AreaDeBaixo } from './area-de-baixo';

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
});
