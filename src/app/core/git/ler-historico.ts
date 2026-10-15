import type { CommitDoHistorico, HistoricoDoGit } from './historico';

const ehTexto = (valor: unknown): valor is string => typeof valor === 'string' && valor !== '';
const ehRegistro = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null;

function lerCommit(dado: unknown): CommitDoHistorico | null {
  if (!ehRegistro(dado)) return null;
  const { sha, pais, autor, data, assunto, pr, branch, titulo } = dado;
  if (!ehTexto(sha) || !ehTexto(autor) || !ehTexto(data) || typeof assunto !== 'string')
    return null;
  if (!Array.isArray(pais) || !pais.every(ehTexto)) return null;
  return {
    sha,
    pais,
    autor,
    data,
    assunto,
    ...(typeof pr === 'number' ? { pr } : {}),
    ...(ehTexto(branch) ? { branch } : {}),
    ...(ehTexto(titulo) ? { titulo } : {}),
  };
}

/** Valida o JSON no limite do sistema: devolve `null` se não tiver o formato esperado. */
export function lerHistorico(dado: unknown): HistoricoDoGit | null {
  if (!ehRegistro(dado) || !Array.isArray(dado['commits'])) return null;
  const { geradoEm, repositorio } = dado;
  if (!ehTexto(repositorio) || !/^[\w.-]+\/[\w.-]+$/.test(repositorio)) return null;
  const commits = dado['commits'].map(lerCommit);
  if (commits.some((commit) => commit === null)) return null;
  return {
    geradoEm: ehTexto(geradoEm) ? geradoEm : '',
    repositorio,
    commits: commits as CommitDoHistorico[],
  };
}

/** Os 7 primeiros caracteres do SHA, como o GitHub mostra. */
export const shaCurto = (sha: string): string => sha.slice(0, 7);

/** Endereço do commit no GitHub. */
export const enderecoDoCommit = (repositorio: string, sha: string): string =>
  `https://github.com/${repositorio}/commit/${sha}`;

/** Endereço do PR no GitHub. */
export const enderecoDoPr = (repositorio: string, pr: number): string =>
  `https://github.com/${repositorio}/pull/${pr}`;
