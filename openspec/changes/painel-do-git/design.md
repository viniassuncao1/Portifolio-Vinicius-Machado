# Design

## Context

A branch `master` (barra de ferramentas) e o ícone Commit (faixa de ferramentas) são decorativos.
O repositório tem ~350 commits e ~25 merges de PR, todos em Conventional Commits pt-BR. O build
roda no GitHub Actions (`npm run build` e `vercel build`), hoje com checkout raso. Já existe um
script de build parecido (`scripts/gerar-informacoes-do-build.mjs`, pre-scripts no
`package.json`). Referências: ADR-0012 (visual) e ADR-0013 (histórico no build).

## Goals / Non-Goals

**Goals:**

- Histórico real, gerado no build, sem token e sem custo no carregamento inicial.
- Painel com cara de Git Log do IntelliJ, no visual do design (paleta e ícones), acessível.

**Non-Goals:**

- Busca, filtros, diff de arquivos, outras branches além das que chegaram à `main`.

## Decisions

### 1. Script e formato

`scripts/gerar-historico-do-git.mjs` roda nos pre-scripts junto do de informações do build.
Usa `git log --topo-order --format=<campos separados por \x1f>` (SHA, pais, nome do autor, data
ISO, assunto) com `execFileSync` (sem shell). Nos merges `Merge pull request #N from
<usuário>/<branch>`, extrai `pr` e `branch`. Grava `public/git/historico.json`:
`{ geradoEm, repositorio, commits: [{ sha, pais, autor, data, assunto, pr?, branch?, faixa,
arestas }] }`. Sem `git` ou com clone raso (`git rev-parse --is-shallow-repository`),
`commits: []`. O arquivo entra no `.gitignore`.

### 2. Faixas do grafo

Função pura `calcularFaixas(commits)` (em `scripts/` ou num módulo compartilhado testável) no
algoritmo clássico de grafo de commits: cada commit ocupa uma coluna; o primeiro pai herda a
coluna; os outros pais abrem colunas novas, que fecham quando o pai é alcançado. Saída por
commit: `faixa` (coluna) e `arestas` (`{ de, para, tipo }`) até a próxima linha. Cores por
coluna a partir de uma paleta de 6 tokens com contraste ≥3:1 sobre o painel.

### 3. Painel

`layout/painel-do-git/`, na parte de baixo da área do editor (como o Tool Window do IntelliJ),
com altura de ~40% e cabeçalho "Git" com abas visuais "Log" e um botão de fechar. Duas colunas:
a lista (grafo em SVG por linha, assunto, autor, data relativa formatada no cliente com
`Intl.RelativeTimeFormat`) e os detalhes do commit escolhido. Lista como `listbox` com
`aria-activedescendant`; o grafo é `aria-hidden`. Estado aberto/fechado num serviço
(`@Service`) usado pela barra, pela faixa e pela casca. O JSON é buscado com `fetch`/`HttpClient`
na primeira abertura e guardado no serviço. Com ~350 commits, a lista renderiza tudo com
`content-visibility: auto`; virtualização só se medir lentidão.

### 4. Celular

O painel vira uma folha de tela cheia com botão de fechar; os detalhes aparecem abaixo do commit
escolhido.

### 5. CI

`fetch-depth: 0` no checkout dos jobs `build-e2e`, `deploy-preview` e `deploy-producao`.

## Risks / Trade-offs

- [Histórico grande no futuro] → o JSON cresce ~200 bytes por commit; com 2.000 commits, ~400 KB
  sem compressão. Se passar disso, limitar aos últimos N commits com um link para o GitHub.
- [Datas no SSR] → o painel nunca é pré-renderizado aberto; a data relativa só é calculada no
  navegador.
- [Commits do Dependabot e de merge poluindo] → aparecem como no IntelliJ; é o histórico real.

## Faixas da equipe

| Faixa    | Quem      | O quê                                                       |
| -------- | --------- | ----------------------------------------------------------- |
| Dados    | Nanquim   | Script do histórico, `package.json`, `.gitignore`, CI       |
| Grafo    | Grafite   | `calcularFaixas` com testes                                 |
| Painel   | Pincel    | Painel, lista, detalhes, botões `master` e Commit, celular  |
| Movimento | Compasso | Abrir e fechar o painel, reduced-motion                     |
| Testes   | Sentinela | Unitários, E2E, axe, teclado, requisição sob demanda        |
| Docs     | Escriba   | README, `docs/`, diário 0012                                |
