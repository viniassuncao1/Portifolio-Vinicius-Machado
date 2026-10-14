import { calcularFaixas } from './faixas';
import type { CommitDoHistorico } from './historico';

const commit = (sha: string, ...pais: string[]): CommitDoHistorico => ({
  sha,
  pais,
  autor: 'Vinicius Machado',
  data: '2026-10-14T12:00:00-03:00',
  assunto: `commit ${sha}`,
});

describe('calcularFaixas', () => {
  it('devolve uma lista vazia quando não há commits', () => {
    expect(calcularFaixas([])).toEqual([]);
  });

  it('mantém uma linha reta na primeira faixa', () => {
    const linhas = calcularFaixas([commit('A', 'B'), commit('B', 'C'), commit('C')]);

    expect(linhas.map((linha) => linha.faixa)).toEqual([0, 0, 0]);
    expect(linhas[0].arestas).toEqual([{ de: 0, para: 0, tipo: 'reta' }]);
    expect(linhas[1].arestas).toEqual([{ de: 0, para: 0, tipo: 'reta' }]);
    expect(linhas[2].arestas).toEqual([]);
    expect(linhas.every((linha) => linha.largura === 1)).toBe(true);
  });

  it('abre uma faixa no merge de PR e fecha quando o commit da branch chega ao pai', () => {
    // M junta a main (B) com a branch do PR (F), que saiu de B.
    const linhas = calcularFaixas([
      commit('M', 'B', 'F'),
      commit('F', 'B'),
      commit('B', 'R'),
      commit('R'),
    ]);

    expect(linhas.map((linha) => linha.faixa)).toEqual([0, 1, 0, 0]);
    expect(linhas[0].arestas).toEqual(
      expect.arrayContaining([
        { de: 0, para: 1, tipo: 'bifurcacao' },
        { de: 0, para: 0, tipo: 'reta' },
      ]),
    );
    expect(linhas[0].largura).toBe(2);
    expect(linhas[1].arestas).toEqual(
      expect.arrayContaining([
        { de: 0, para: 0, tipo: 'reta' },
        { de: 1, para: 0, tipo: 'convergencia' },
      ]),
    );
    expect(linhas[2].largura).toBe(1);
  });

  it('põe branches paralelas em faixas diferentes e junta no ancestral comum', () => {
    const linhas = calcularFaixas([commit('X', 'Z'), commit('Y', 'Z'), commit('Z')]);

    expect(linhas.map((linha) => linha.faixa)).toEqual([0, 1, 0]);
    expect(linhas[1].arestas).toEqual(
      expect.arrayContaining([{ de: 1, para: 0, tipo: 'convergencia' }]),
    );
  });

  it('liga o segundo pai de um merge à faixa que já espera por ele', () => {
    const linhas = calcularFaixas([
      commit('T', 'P'),
      commit('M', 'Q', 'P'),
      commit('Q', 'P'),
      commit('P'),
    ]);

    expect(linhas[1].faixa).toBe(1);
    expect(linhas[1].arestas).toEqual(
      expect.arrayContaining([{ de: 1, para: 0, tipo: 'bifurcacao' }]),
    );
  });

  it('encerra a linha quando o pai não está na lista', () => {
    const linhas = calcularFaixas([commit('A', 'fora')]);

    expect(linhas).toEqual([{ sha: 'A', faixa: 0, arestas: [], largura: 1 }]);
  });

  it('ignora só o pai que está fora da lista num merge', () => {
    const linhas = calcularFaixas([commit('M', 'B', 'fora'), commit('B')]);

    expect(linhas[0].arestas).toEqual([{ de: 0, para: 0, tipo: 'reta' }]);
  });

  it('reaproveita a faixa livre depois que uma branch fecha', () => {
    const linhas = calcularFaixas([
      commit('M1', 'B1', 'F1'),
      commit('F1', 'B1'),
      commit('B1', 'M2'),
      commit('M2', 'B2', 'F2'),
      commit('F2', 'B2'),
      commit('B2'),
    ]);

    expect(linhas.map((linha) => linha.faixa)).toEqual([0, 1, 0, 0, 1, 0]);
  });

  it('não altera a lista recebida', () => {
    const commits = Object.freeze([commit('A', 'B'), commit('B')]);

    expect(() => calcularFaixas(commits)).not.toThrow();
    expect(commits).toHaveLength(2);
  });
});
