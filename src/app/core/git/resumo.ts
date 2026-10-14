import type { CommitDoHistorico } from './historico';

/** Tipos do Conventional Commits, na ordem em que desempatam a contagem. */
const TIPOS_CONHECIDOS = [
  'feat',
  'fix',
  'refactor',
  'docs',
  'test',
  'chore',
  'perf',
  'ci',
  'build',
  'style',
  'revert',
] as const;

/** Rótulo dos commits que não seguem o Conventional Commits. */
export const TIPO_OUTROS = 'outros';

const TIPO_NO_ASSUNTO = /^(\w+)(?:\([^)]*\))?!?:/;
const MARCACAO_DE_TAREFA = /^docs: marca a tarefa/;
const QUANTIDADE_DE_PRS = 8;
const QUANTIDADE_DE_COMMITS = 5;

export interface ContagemPorTipo {
  readonly tipo: string;
  readonly quantidade: number;
  /** Fatia do total, de 0 a 100. */
  readonly porcentagem: number;
}

export interface PrMesclado {
  readonly numero: number;
  readonly titulo: string;
  readonly branch: string;
  /** Data ISO 8601 do merge. */
  readonly data: string;
  readonly sha: string;
}

const ehMerge = (commit: CommitDoHistorico): boolean => commit.pais.length > 1;

/** Tipo do Conventional Commits do assunto, ou `outros` quando não segue o padrão. */
export function tipoDoCommit(assunto: string): string {
  const tipo = TIPO_NO_ASSUNTO.exec(assunto)?.[1]?.toLowerCase();
  return TIPOS_CONHECIDOS.find((conhecido) => conhecido === tipo) ?? TIPO_OUTROS;
}

/**
 * Contagem de commits por tipo, sem os merges, do mais frequente ao menos frequente (empate pela
 * ordem de {@link TIPOS_CONHECIDOS}; `outros` por último). Lista vazia sem commits.
 */
export function contarPorTipo(commits: readonly CommitDoHistorico[]): readonly ContagemPorTipo[] {
  const contagem = new Map<string, number>();
  for (const commit of commits.filter((c) => !ehMerge(c))) {
    const tipo = tipoDoCommit(commit.assunto);
    contagem.set(tipo, (contagem.get(tipo) ?? 0) + 1);
  }
  const total = [...contagem.values()].reduce((soma, quantidade) => soma + quantidade, 0);
  const posicao = (tipo: string): number => {
    const indice = TIPOS_CONHECIDOS.findIndex((conhecido) => conhecido === tipo);
    return indice === -1 ? TIPOS_CONHECIDOS.length : indice;
  };
  return [...contagem]
    .map(([tipo, quantidade]) => ({ tipo, quantidade, porcentagem: (quantidade / total) * 100 }))
    .sort((a, b) => b.quantidade - a.quantidade || posicao(a.tipo) - posicao(b.tipo));
}

/** Os PRs mesclados mais recentes (o histórico vem do mais novo para o mais antigo). */
export function ultimosPrs(
  commits: readonly CommitDoHistorico[],
  quantidade = QUANTIDADE_DE_PRS,
): readonly PrMesclado[] {
  return commits
    .filter((commit) => commit.pr !== undefined)
    .slice(0, quantidade)
    .map((commit) => ({
      numero: commit.pr ?? 0,
      titulo: commit.titulo ?? commit.branch ?? commit.assunto,
      branch: commit.branch ?? '',
      data: commit.data,
      sha: commit.sha,
    }));
}

/** Os commits de código mais recentes: sem merges e sem as marcações de tarefa dos `tasks.md`. */
export function ultimosCommitsDeCodigo(
  commits: readonly CommitDoHistorico[],
  quantidade = QUANTIDADE_DE_COMMITS,
): readonly CommitDoHistorico[] {
  return commits
    .filter((commit) => !ehMerge(commit) && !MARCACAO_DE_TAREFA.test(commit.assunto))
    .slice(0, quantidade);
}
