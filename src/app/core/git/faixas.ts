import type { CommitDoHistorico } from './historico';

/**
 * Como a linha sai do commit (ou passa por ele) até a próxima linha do grafo:
 * - `reta`: segue na mesma faixa;
 * - `bifurcacao`: sai do commit de um merge em direção a um pai que não é o primeiro;
 * - `convergencia`: muda para uma faixa mais à esquerda, onde já espera o mesmo commit.
 */
export type TipoDeAresta = 'reta' | 'bifurcacao' | 'convergencia';

/** Segmento entre o centro desta linha (faixa `de`) e o centro da próxima (faixa `para`). */
export interface Aresta {
  readonly de: number;
  readonly para: number;
  readonly tipo: TipoDeAresta;
}

/** O que o SVG de uma linha precisa: onde fica o ponto do commit e as arestas que descem. */
export interface LinhaDoGrafo {
  readonly sha: string;
  /** Coluna (começa em 0) do ponto do commit. */
  readonly faixa: number;
  readonly arestas: readonly Aresta[];
  /** Quantas colunas a linha ocupa, para dimensionar o SVG (o maior índice usado mais um). */
  readonly largura: number;
}

type Faixas = readonly (string | null)[];

const primeiraFaixaCom = (faixas: Faixas, sha: string): number => faixas.indexOf(sha);

const primeiraFaixaLivre = (faixas: Faixas): number => {
  const livre = faixas.indexOf(null);
  return livre === -1 ? faixas.length : livre;
};

const comValor = (faixas: Faixas, indice: number, sha: string | null): Faixas =>
  Array.from({ length: Math.max(faixas.length, indice + 1) }, (_, i) =>
    i === indice ? sha : (faixas[i] ?? null),
  );

/** Estado do grafo entre duas linhas e a linha calculada. */
interface Passo {
  readonly faixas: Faixas;
  readonly linha: LinhaDoGrafo;
}

function calcularPasso(
  commit: CommitDoHistorico,
  anteriores: Faixas,
  conhecidos: ReadonlySet<string>,
): Passo {
  const esperando = primeiraFaixaCom(anteriores, commit.sha);
  const faixa = esperando === -1 ? primeiraFaixaLivre(anteriores) : esperando;

  // Todas as faixas que esperavam este commit terminam aqui.
  let faixas: Faixas = anteriores.map((sha) => (sha === commit.sha ? null : sha));
  const arestas: Aresta[] = [];
  const novas = new Set<number>();

  // Só interessam os pais que estão na lista: um pai fora dela encerra a linha.
  const [primeiroPai, ...outrosPais] = commit.pais.filter((pai) => conhecidos.has(pai));

  if (primeiroPai !== undefined) faixas = comValor(faixas, faixa, primeiroPai);

  for (const pai of outrosPais) {
    const existente = primeiraFaixaCom(faixas, pai);
    if (existente !== -1) {
      arestas.push({ de: faixa, para: existente, tipo: 'bifurcacao' });
      continue;
    }
    const nova = primeiraFaixaLivre(faixas);
    faixas = comValor(faixas, nova, pai);
    novas.add(nova);
    arestas.push({ de: faixa, para: nova, tipo: 'bifurcacao' });
  }

  // Cada faixa ativa desce até onde o seu commit espera; as repetidas se juntam à primeira e fecham.
  let proximas: Faixas = faixas;
  faixas.forEach((sha, indice) => {
    if (sha === null || novas.has(indice)) return;
    const destino = primeiraFaixaCom(faixas, sha);
    arestas.push({ de: indice, para: destino, tipo: destino === indice ? 'reta' : 'convergencia' });
    if (destino < indice) proximas = comValor(proximas, indice, null);
  });

  const largura = Math.max(faixa, ...arestas.flatMap((aresta) => [aresta.de, aresta.para])) + 1;
  return { faixas: aparar(proximas), linha: { sha: commit.sha, faixa, arestas, largura } };
}

/** Tira as faixas vazias do fim, para o grafo voltar a ficar estreito depois de um merge. */
function aparar(faixas: Faixas): Faixas {
  let fim = faixas.length;
  while (fim > 0 && faixas[fim - 1] === null) fim -= 1;
  return faixas.slice(0, fim);
}

/**
 * Calcula, para cada commit (do mais novo para o mais antigo, em ordem topológica), a faixa do
 * ponto e as arestas que descem até a próxima linha, para desenhar o grafo em SVG linha a linha.
 *
 * Cada commit ocupa uma faixa (coluna): o primeiro pai herda a faixa do filho; os outros pais
 * abrem faixas novas, que fecham quando o pai é alcançado. Um pai que não está na lista encerra a
 * linha (histórico cortado).
 */
export function calcularFaixas(commits: readonly CommitDoHistorico[]): readonly LinhaDoGrafo[] {
  const conhecidos = new Set(commits.map((commit) => commit.sha));
  const { linhas } = commits.reduce<{ faixas: Faixas; linhas: readonly LinhaDoGrafo[] }>(
    (estado, commit) => {
      const passo = calcularPasso(commit, estado.faixas, conhecidos);
      return { faixas: passo.faixas, linhas: [...estado.linhas, passo.linha] };
    },
    { faixas: [], linhas: [] },
  );
  return linhas;
}
