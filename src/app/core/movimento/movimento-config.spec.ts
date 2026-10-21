import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MovimentoConfig } from './movimento-config';

interface Consulta {
  matches: boolean;
  addEventListener: (t: string, f: (e: MediaQueryListEvent) => void) => void;
}

function simularMatchMedia(reduzido: boolean, ponteiroFino = true) {
  let aoMudar: ((e: MediaQueryListEvent) => void) | undefined;
  vi.stubGlobal('matchMedia', (consulta: string): Consulta => {
    const ehReduzido = consulta.includes('reduced-motion');
    return {
      matches: ehReduzido ? reduzido : ponteiroFino,
      addEventListener: (_tipo, funcao) => {
        if (ehReduzido) aoMudar = funcao;
      },
    };
  });
  return { mudarPara: (valor: boolean) => aoMudar?.({ matches: valor } as MediaQueryListEvent) };
}

describe('MovimentoConfig', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('lê a preferência de movimento reduzido do sistema', () => {
    simularMatchMedia(true);

    const config = TestBed.inject(MovimentoConfig);

    expect(config.reduzido()).toBe(true);
    expect(config.deveAnimar()).toBe(false);
  });

  it('acompanha a mudança da preferência', () => {
    const { mudarPara } = simularMatchMedia(false);
    const config = TestBed.inject(MovimentoConfig);
    expect(config.reduzido()).toBe(false);

    mudarPara(true);

    expect(config.reduzido()).toBe(true);
  });

  it('com movimento reduzido não carrega a biblioteca, nem para o movimento essencial', async () => {
    simularMatchMedia(true);
    const config = TestBed.inject(MovimentoConfig);

    expect(await config.carregar()).toBeNull();
    expect(await config.carregar({ essencial: true })).toBeNull();
  });

  it('sem restrição, carrega a biblioteca e reaproveita a mesma carga', async () => {
    simularMatchMedia(false);
    const config = TestBed.inject(MovimentoConfig);

    const primeira = await config.carregar();
    const segunda = await config.carregar();

    expect(typeof primeira?.animate).toBe('function');
    expect(segunda).toBe(primeira);
  });

  it('em aparelho fraco só anima o essencial', () => {
    simularMatchMedia(false);
    vi.stubGlobal('navigator', { hardwareConcurrency: 2 });
    const config = TestBed.inject(MovimentoConfig);

    expect(config.deveAnimar()).toBe(false);
    expect(config.deveAnimar({ essencial: true })).toBe(true);
  });

  it('no servidor não anima nem lê o navegador', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });

    const config = TestBed.inject(MovimentoConfig);

    expect(config.deveAnimar({ essencial: true })).toBe(false);
    expect(await config.carregar()).toBeNull();
  });
});
