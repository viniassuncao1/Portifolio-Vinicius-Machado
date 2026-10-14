import { TestBed } from '@angular/core/testing';

import type { HistoricoDoGit } from './git/historico';
import { PainelDoGit } from './painel-do-git';

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

async function esperar(condicao: () => boolean): Promise<void> {
  for (let i = 0; i < 50 && !condicao(); i++) await new Promise((r) => setTimeout(r));
}

describe('PainelDoGit', () => {
  let fetchFalso: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchFalso = vi.fn(() => respostaCom(HISTORICO));
    vi.stubGlobal('fetch', fetchFalso);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('não baixa o histórico até abrir o painel', () => {
    const painel = TestBed.inject(PainelDoGit);

    expect(painel.aberto()).toBe(false);
    expect(painel.estado()).toBe('ocioso');
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it('baixa o histórico na primeira abertura e não de novo nas seguintes', async () => {
    const painel = TestBed.inject(PainelDoGit);

    painel.abrir(null);
    expect(painel.estado()).toBe('carregando');
    await esperar(() => painel.estado() === 'pronto');
    painel.fechar();
    painel.abrir(null);

    expect(painel.historico()?.commits).toHaveLength(1);
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(String(fetchFalso.mock.calls[0][0])).toContain('git/historico.json');
  });

  it('vai para o estado de erro e tenta de novo', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({}, false));
    const painel = TestBed.inject(PainelDoGit);

    painel.abrir(null);
    await esperar(() => painel.estado() === 'erro');
    expect(painel.estado()).toBe('erro');

    await painel.tentarDeNovo();
    expect(painel.estado()).toBe('pronto');
    expect(fetchFalso).toHaveBeenCalledTimes(2);
  });

  it('trata um JSON fora do formato como erro', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({ commits: 'x' }));
    const painel = TestBed.inject(PainelDoGit);

    painel.abrir(null);
    await esperar(() => painel.estado() === 'erro');

    expect(painel.estado()).toBe('erro');
  });

  it('marca o histórico sem commits como vazio', async () => {
    fetchFalso.mockReturnValueOnce(respostaCom({ ...HISTORICO, commits: [] }));
    const painel = TestBed.inject(PainelDoGit);

    painel.abrir(null);
    await esperar(() => painel.estado() === 'pronto');

    expect(painel.vazio()).toBe(true);
  });

  it('devolve o foco a quem abriu ao fechar', () => {
    const botao = document.createElement('button');
    document.body.append(botao);
    const painel = TestBed.inject(PainelDoGit);

    painel.abrir(botao);
    painel.fechar();

    expect(painel.aberto()).toBe(false);
    expect(document.activeElement).toBe(botao);
    botao.remove();
  });

  it('alterna entre aberto e fechado', () => {
    const painel = TestBed.inject(PainelDoGit);

    painel.alternar(null);
    expect(painel.aberto()).toBe(true);
    painel.alternar(null);
    expect(painel.aberto()).toBe(false);
  });
});
