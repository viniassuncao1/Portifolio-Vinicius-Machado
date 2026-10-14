import { TestBed } from '@angular/core/testing';

import type { HistoricoDoGit } from './git/historico';
import { HistoricoDoRepositorio } from './repositorio';

const HISTORICO: HistoricoDoGit = {
  geradoEm: '2026-10-14T12:00:00Z',
  repositorio: 'usuario/projeto',
  commits: [
    {
      sha: 'a'.repeat(40),
      pais: [],
      autor: 'Pessoa',
      data: '2026-10-14T10:00:00Z',
      assunto: 'feat: primeiro',
    },
  ],
};

const respostaCom = (corpo: unknown, ok = true) =>
  Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(corpo) });

describe('HistoricoDoRepositorio', () => {
  let fetchFalso: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchFalso = vi.fn(() => respostaCom(HISTORICO));
    vi.stubGlobal('fetch', fetchFalso);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('não baixa o histórico até a página pedir', () => {
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    expect(repositorio.estado()).toBe('ocioso');
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it('baixa o histórico na primeira chamada e não de novo nas seguintes', async () => {
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    const carregando = repositorio.carregar();
    expect(repositorio.estado()).toBe('carregando');
    await carregando;
    await repositorio.carregar();

    expect(repositorio.estado()).toBe('pronto');
    expect(repositorio.historico()?.commits).toHaveLength(1);
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(String(fetchFalso.mock.calls[0][0])).toContain('git/historico.json');
  });

  it('vai para o estado de erro e tenta de novo', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({}, false));
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    await repositorio.carregar();
    expect(repositorio.estado()).toBe('erro');

    await repositorio.tentarDeNovo();
    expect(repositorio.estado()).toBe('pronto');
    expect(fetchFalso).toHaveBeenCalledTimes(2);
  });

  it('trata um JSON fora do formato como erro', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({ commits: 'x' }));
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    await repositorio.carregar();

    expect(repositorio.estado()).toBe('erro');
  });

  it('marca o histórico sem commits como vazio', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({ ...HISTORICO, commits: [] }));
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    await repositorio.carregar();

    expect(repositorio.vazio()).toBe(true);
  });

  it('não tenta de novo fora do estado de erro', async () => {
    const repositorio = TestBed.inject(HistoricoDoRepositorio);

    await repositorio.tentarDeNovo();

    expect(fetchFalso).not.toHaveBeenCalled();
  });
});
