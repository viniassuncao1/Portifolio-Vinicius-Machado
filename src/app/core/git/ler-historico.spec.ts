import { enderecoDoCommit, enderecoDoPr, lerHistorico, shaCurto } from './ler-historico';

const commit = {
  sha: 'abc1234def',
  pais: ['p1'],
  autor: 'A',
  data: '2026-01-01T00:00:00Z',
  assunto: 's',
};

describe('lerHistorico', () => {
  it('aceita o formato do arquivo gerado no build', () => {
    const historico = lerHistorico({
      geradoEm: '2026-01-01T00:00:00Z',
      repositorio: 'usuario/projeto',
      commits: [commit, { ...commit, sha: 'f', pr: 27, branch: 'feat/x' }],
    });

    expect(historico?.commits).toHaveLength(2);
    expect(historico?.commits[1]).toMatchObject({ pr: 27, branch: 'feat/x' });
  });

  it.each([
    ['sem commits', { repositorio: 'u/p' }],
    ['repositório fora do padrão', { repositorio: 'https://evil.example', commits: [] }],
    ['commit sem sha', { repositorio: 'u/p', commits: [{ ...commit, sha: '' }] }],
    ['pais que não são texto', { repositorio: 'u/p', commits: [{ ...commit, pais: [1] }] }],
    ['texto no lugar do objeto', 'x'],
  ])('rejeita %s', (_, dado) => {
    expect(lerHistorico(dado)).toBeNull();
  });

  it('aceita a lista vazia, de um build sem histórico', () => {
    expect(lerHistorico({ repositorio: 'u/p', commits: [] })?.commits).toEqual([]);
  });

  it('monta os endereços do commit e do PR e o SHA curto', () => {
    expect(enderecoDoCommit('u/p', 'abc')).toBe('https://github.com/u/p/commit/abc');
    expect(enderecoDoPr('u/p', 27)).toBe('https://github.com/u/p/pull/27');
    expect(shaCurto('abc1234def')).toBe('abc1234');
  });
});
