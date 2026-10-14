/** Um commit do histórico gerado no build (`public/git/historico.json`), sem e-mail do autor. */
export interface CommitDoHistorico {
  readonly sha: string;
  /** SHAs dos pais: o primeiro é a linha principal; os demais vêm de um merge. */
  readonly pais: readonly string[];
  readonly autor: string;
  /** Data ISO 8601. */
  readonly data: string;
  readonly assunto: string;
  /** Número do PR, só nos merges de PR. */
  readonly pr?: number;
  /** Branch do PR, só nos merges de PR. */
  readonly branch?: string;
}

/** Formato do arquivo `historico.json`, com os commits do mais novo para o mais antigo. */
export interface HistoricoDoGit {
  readonly geradoEm: string;
  /** Repositório no GitHub, `usuario/nome`. */
  readonly repositorio: string;
  readonly commits: readonly CommitDoHistorico[];
}
