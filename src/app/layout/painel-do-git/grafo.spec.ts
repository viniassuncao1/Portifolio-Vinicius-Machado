import type { CommitDoHistorico } from '../../core/git/historico';
import { corDaFaixa, montarGrafo } from './grafo';

const commit = (sha: string, ...pais: string[]): CommitDoHistorico => ({
  sha,
  pais,
  autor: 'A',
  data: '2026-01-01T00:00:00Z',
  assunto: sha,
});

describe('montarGrafo', () => {
  it('desenha uma linha reta com um ponto por commit', () => {
    const grafo = montarGrafo([commit('c', 'b'), commit('b', 'a'), commit('a')]);

    expect(grafo.faixas).toBe(1);
    expect(grafo.linhas).toHaveLength(3);
    expect(grafo.linhas[0].caminhos).toHaveLength(1);
    expect(grafo.linhas[1].caminhos).toHaveLength(2);
  });

  it('abre uma segunda faixa num merge, igual para todas as linhas', () => {
    const grafo = montarGrafo([commit('m', 'a', 'b'), commit('b', 'a'), commit('a')]);

    expect(grafo.faixas).toBe(2);
    expect(grafo.linhas[1].faixa).toBe(1);
  });

  it('devolve o grafo vazio para a lista vazia', () => {
    expect(montarGrafo([]).linhas).toEqual([]);
  });

  it('repete as cores depois da sexta faixa', () => {
    expect(corDaFaixa(0)).toBe('var(--cor-grafo-1)');
    expect(corDaFaixa(6)).toBe('var(--cor-grafo-1)');
  });
});
