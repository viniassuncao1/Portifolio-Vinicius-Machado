# Design

## Context

`scripts/gerar-historico-do-git.mjs` grava `public/git/historico.json` (`geradoEm`,
`repositorio`, `commits` com SHA, pais, autor, data, assunto e, nos merges de PR, número e
branch), sem e-mails (ADR-0013). O painel (`layout/painel-do-git/`) baixa o JSON sob demanda e
divide a área de baixo com a janela de Run. As abas são ligadas às rotas.

## Goals / Non-Goals

**Goals:**

- Mostrar o processo de trabalho de um jeito que um recrutador entende em 10 segundos.
- Visual de página de repositório do GitHub, dentro da casca da IDE e nos dois temas.

**Non-Goals:**

- Diff de arquivos, navegação por branches, log completo dentro do site (fica no GitHub).

## Decisions

### 1. Aba do editor com rota própria

Rota `/repositorio` (feature `repositorio`, `loadComponent`), aba `Portfolio-Vinicius-Machado`
com o ícone do GitHub da IntelliJ Platform, fora da árvore de seções. Pré-renderizada com o
esqueleto; os dados vêm do JSON baixado no navegador ao abrir (sob demanda, como hoje), com
carregamento, erro e tentar de novo. `noindex` não é necessário: a página é real.

### 2. Dados

O script passa a gravar, nos merges de PR, o `titulo` (primeira linha do corpo do merge). O
resumo (contagem por tipo do Conventional Commits, últimos PRs, últimos commits de código sem os
assuntos `docs: marca a tarefa…`) é calculado no navegador por funções puras testadas, a partir
do JSON. Commits de merge não entram na contagem por tipo.

### 3. Visual

Layout de página do GitHub com os tokens do site: cabeçalho, linha de números, barra empilhada
de tipos (cores da sintaxe, com legenda em texto e porcentagem, nunca só cor), listas com ícone
de PR mesclado e de commit, links com sublinhado no hover e foco visível. Largura máxima de leitura
de ~960 px, centralizada no editor. No celular, uma coluna.

### 4. Área de baixo

A área de baixo volta a ter só a janela de Run; sai o serviço de exclusividade Run/Git e o
painel antigo.

## Risks / Trade-offs

- [Perder o "git cru" que mostrava detalhes] → link para o histórico completo no GitHub.
- [JSON maior com títulos] → só 31 merges ganham um campo curto.

## Faixas da equipe

| Faixa  | Quem      | O quê                                                     |
| ------ | --------- | --------------------------------------------------------- |
| Dados  | Nanquim   | Título do PR no script, funções de resumo e testes         |
| Página | Grafite   | Feature `repositorio`, rota, aba, layout, remoção do painel |
| Testes | Sentinela | E2E da aba, links, carregamento, erro, celular, axe        |
| Docs   | Escriba   | ADR-0016, README, `docs/`, diário                          |
