# Proposal

## Why

A barra de ferramentas mostra `master` e a faixa de ferramentas tem o ícone Commit, mas os dois
são só decoração. O Vinicius quer que eles abram um **painel do Git** com o histórico real do
repositório, como o Git Log do IntelliJ. Além de completar a experiência de IDE, o painel mostra
o processo do projeto a quem visita: Conventional Commits em pt-BR, PRs, merges e deploys
contínuos, o que pesa para recrutadores técnicos.

## What Changes

- **Histórico no build** ([ADR-0013](../../../docs/adr/0013-historico-do-git-gerado-no-build.md)):
  `scripts/gerar-historico-do-git.mjs` lê o `git log` e grava `public/git/historico.json` (não
  versionado) com SHA, pais, autor (sem e-mail), data, assunto e, nos merges, o número do PR e a
  branch, mais as faixas do grafo já calculadas. O CI passa a usar `fetch-depth: 0`.
- **Painel do Git** na parte de baixo da IDE, como no IntelliJ: grafo das branches com cores,
  assunto, autor e data de cada commit e, ao escolher um commit, os detalhes (SHA, mensagem,
  autor, data, link para o commit e, nos merges, para o PR no GitHub).
- **Como abre:** o indicador `master` da barra e o ícone Commit da faixa viram botões reais;
  Esc fecha e o foco volta para quem abriu. No celular, o painel ocupa a tela.
- **Leve:** o JSON só é baixado quando o painel abre; nada muda no carregamento inicial.
- Entrada 0012 do diário.

Fora do escopo: busca e filtros no histórico, diff dos arquivos de cada commit, tema claro
(próxima change).

## Capabilities

### New Capabilities

- `painel-do-git`: histórico gerado no build e o painel que o exibe.

### Modified Capabilities

- `barra-superior`: o indicador `master` abre o painel do Git.
- `casca-da-ide`: Commit deixa de ser decorativo; o painel do Git entra na estrutura da IDE.

## Impact

- Código: `scripts/`, `package.json`, `.gitignore`, `.github/workflows/ci.yml`
  (`fetch-depth: 0`), `src/app/core/` (modelo e serviço do histórico), `src/app/layout/`
  (painel, barra, faixa, casca).
- Testes: unitários do script e das faixas do grafo, E2E do painel com axe, teclado e celular.
- Documentação: ADR-0013, README, `docs/` e o diário 0012.
