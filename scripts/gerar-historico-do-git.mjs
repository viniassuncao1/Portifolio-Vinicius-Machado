// Gera public/git/historico.json com o histórico do repositório, mostrado no painel do Git
// (ADR-0013). Lê o `git log` sem shell e não publica e-mails. Sem `git`, sem repositório ou em
// clone raso, grava a lista vazia: este script nunca falha o build.
// Uso: node scripts/gerar-historico-do-git.mjs (roda nos scripts `pre*` do package.json).
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const PASTA = new URL('../public/git/', import.meta.url);
const ARQUIVO = new URL('historico.json', PASTA);
const SEPARADOR = '\x1f';
const FORMATO = ['%H', '%P', '%an', '%aI', '%s'].join(SEPARADOR);
const LIMITE_DA_SAIDA_EM_BYTES = 64 * 1024 * 1024;
const REPOSITORIO_PADRAO = 'viniassuncao1/Portifolio-Vinicius-Machado';
const MERGE_DE_PR = /^Merge pull request #(\d+) from [^/\s]+\/(\S+)/;
const REPOSITORIO_NA_URL = /github\.com[:/]([^/\s]+\/[^/\s]+?)(?:\.git)?\/?$/;

const git = (...argumentos) =>
  execFileSync('git', argumentos, {
    encoding: 'utf8',
    maxBuffer: LIMITE_DA_SAIDA_EM_BYTES,
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();

/** `usuario/repositorio`, do ambiente do Actions ou da URL do `origin`. */
function descobrirRepositorio() {
  const doAmbiente = process.env.GITHUB_REPOSITORY?.trim();
  if (doAmbiente) return doAmbiente;
  try {
    return REPOSITORIO_NA_URL.exec(git('remote', 'get-url', 'origin'))?.[1] ?? REPOSITORIO_PADRAO;
  } catch {
    return REPOSITORIO_PADRAO;
  }
}

function lerCommit(linha) {
  const [sha, pais, autor, data, assunto] = linha.split(SEPARADOR);
  const merge = MERGE_DE_PR.exec(assunto);
  return {
    sha,
    pais: pais === '' ? [] : pais.split(' '),
    autor,
    data,
    assunto,
    ...(merge ? { pr: Number(merge[1]), branch: merge[2] } : {}),
  };
}

function lerHistorico() {
  try {
    if (git('rev-parse', '--is-shallow-repository') !== 'false') return [];
    const saida = git('log', '--topo-order', `--format=${FORMATO}`);
    return saida === '' ? [] : saida.split('\n').map(lerCommit);
  } catch {
    return [];
  }
}

const commits = lerHistorico();
const historico = {
  geradoEm: new Date().toISOString(),
  repositorio: descobrirRepositorio(),
  commits,
};

try {
  await mkdir(PASTA, { recursive: true });
  await writeFile(ARQUIVO, `${JSON.stringify(historico)}\n`);
  console.log(`historico.json: ${commits.length} commits.`);
} catch (erro) {
  console.warn(`historico.json não gerado: ${erro.message}`);
}
