// Gera src/app/core/build.gerado.ts com o commit do deploy, mostrado na barra de status.
// Lê só variáveis de ambiente (sem git), na ordem: SHA_DO_COMMIT (definida no workflow; no deploy de
// preview, o GITHUB_SHA é o commit temporário de merge do PR, então ela traz o commit da branch),
// GITHUB_SHA (deploy de produção no GitHub Actions) e VERCEL_GIT_COMMIT_SHA (build da própria
// Vercel). Sem variável válida, o valor é null.
// Uso: node scripts/gerar-informacoes-do-build.mjs (roda nos scripts `pre*` do package.json).
import { writeFile } from 'node:fs/promises';

const ARQUIVO = new URL('../src/app/core/build.gerado.ts', import.meta.url);
const TAMANHO_CURTO = 7;
const SHA_VALIDO = /^[0-9a-f]{7,64}$/i;

const ORDEM_DAS_VARIAVEIS = ['SHA_DO_COMMIT', 'GITHUB_SHA', 'VERCEL_GIT_COMMIT_SHA'];

const bruto =
  ORDEM_DAS_VARIAVEIS.map((nome) => (process.env[nome] ?? '').trim()).find(Boolean) ?? '';
const sha = SHA_VALIDO.test(bruto) ? bruto.toLowerCase() : null;
const literal = (valor) => (valor === null ? 'null' : `'${valor}'`);

const conteudo = `// Arquivo gerado por scripts/gerar-informacoes-do-build.mjs. Não edite nem versione.
/** SHA completo do commit do build, ou null fora do deploy (build local, testes). */
export const SHA_DO_BUILD: string | null = ${literal(sha)};

/** SHA curto, como o GitHub mostra, ou null. */
export const SHA_CURTO_DO_BUILD: string | null = ${literal(sha?.slice(0, TAMANHO_CURTO) ?? null)};
`;

await writeFile(ARQUIVO, conteudo);
console.log(`build.gerado.ts: ${sha ?? 'sem commit (null)'}`);
