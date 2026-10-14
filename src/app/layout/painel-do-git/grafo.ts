import { calcularFaixas } from '../../core/git/faixas';
import type { LinhaDoGrafo } from '../../core/git/faixas';
import type { CommitDoHistorico } from '../../core/git/historico';

/** Largura de uma faixa e altura de uma linha, em unidades do SVG (1 unidade = 1px a 16px de raiz). */
export const LARGURA_DA_FAIXA = 14;
export const ALTURA_DA_LINHA = 24;
const METADE = ALTURA_DA_LINHA / 2;

/** Quantas cores a paleta do grafo tem (`--cor-grafo-1` a `--cor-grafo-6`). */
const CORES_DO_GRAFO = 6;

export const corDaFaixa = (faixa: number): string =>
  `var(--cor-grafo-${(faixa % CORES_DO_GRAFO) + 1})`;

export interface Caminho {
  readonly d: string;
  readonly cor: string;
}

export interface GrafoDaLista {
  /** Quantas colunas o grafo ocupa, igual para todas as linhas, para o texto alinhar. */
  readonly faixas: number;
  readonly linhas: readonly LinhaDeSvg[];
}

export interface LinhaDeSvg {
  readonly faixa: number;
  readonly cor: string;
  readonly caminhos: readonly Caminho[];
}

const centro = (faixa: number): number => faixa * LARGURA_DA_FAIXA + LARGURA_DA_FAIXA / 2;

/**
 * Monta o SVG de cada linha a partir de `calcularFaixas`. Cada aresta liga o centro de uma linha ao
 * da próxima e é cortada ao meio na divisa: a metade de baixo desenha-se na linha de origem e a de
 * cima na linha seguinte, então cada SVG só depende de si e da linha anterior.
 */
export function montarGrafo(commits: readonly CommitDoHistorico[]): GrafoDaLista {
  const linhas = calcularFaixas(commits);
  const faixas = Math.max(1, ...linhas.map((linha) => linha.largura));
  return { faixas, linhas: linhas.map((linha, i) => linhaDeSvg(linha, linhas[i - 1])) };
}

function linhaDeSvg(linha: LinhaDoGrafo, anterior: LinhaDoGrafo | undefined): LinhaDeSvg {
  const meio = (de: number, para: number): number => (centro(de) + centro(para)) / 2;
  const baixo = linha.arestas.map((aresta) => ({
    d: `M${centro(aresta.de)} ${METADE}L${meio(aresta.de, aresta.para)} ${ALTURA_DA_LINHA}`,
    cor: corDaFaixa(Math.max(aresta.de, aresta.para)),
  }));
  const cima = (anterior?.arestas ?? []).map((aresta) => ({
    d: `M${meio(aresta.de, aresta.para)} 0L${centro(aresta.para)} ${METADE}`,
    cor: corDaFaixa(Math.max(aresta.de, aresta.para)),
  }));
  return { faixa: linha.faixa, cor: corDaFaixa(linha.faixa), caminhos: [...cima, ...baixo] };
}

export { centro as centroDaFaixa };
