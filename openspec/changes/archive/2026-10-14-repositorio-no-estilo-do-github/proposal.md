# Proposal

## Why

O painel do Git mostra os 442 commits num log cru na parte de baixo da IDE: cobre o editor, o
grafo vira uma faixa só, o painel de detalhes começa vazio e a lista é dominada por commits como
"docs: marca a tarefa 3.1…". O Vinicius não gostou: visual pobre, ninguém entende para que serve
e falta explicação. Ele quer algo parecido com a página do repositório no GitHub, com os
destaques e um link para ver tudo (auditoria de UX de 14/10).

## What Changes

- **Página do repositório** aberta como aba do editor (`Portfolio-Vinicius-Machado`, rota
  `/repositorio`), no visual de um repositório do GitHub dentro da IDE, sem cobrir o conteúdo:
  - cabeçalho com o nome do repositório, uma frase explicando o que ele mostra ("Este portfólio
    é feito com Angular, specs no OpenSpec e uma equipe de agentes de IA; cada mudança vira um
    pull request"), selo "Público" e botão "Ver no GitHub";
  - números: commits, pull requests mesclados, desde quando, último deploy;
  - "Como o trabalho se divide": barra com a proporção de commits `feat`, `fix`, `test`, `docs`,
    `refactor` e `chore`, com legenda explicando cada tipo;
  - "Últimos pull requests": os 8 mais recentes com título, número, branch, data e link;
  - "Últimos commits": os 5 mais recentes de código (sem os de marcar tarefas), com link;
  - "Ver todo o histórico no GitHub →" no fim.
- O indicador `master` e o botão Commit abrem essa aba. A parte de baixo da IDE fica só para a
  janela de Run.
- O histórico gerado no build passa a ter o título de cada PR (corpo do merge).
- **ADR-0016** registra a troca do painel pelo repositório no estilo do GitHub.
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `painel-do-git`: vira a página do repositório numa aba do editor.
- `janela-de-run`: deixa de dividir a área de baixo com o Git.
- `barra-superior`: `master` abre a página do repositório.
- `abas-do-editor`: aba do repositório; corrige o nome da aba do Início (`PortfolioApplication.java`).

## Impact

- Código: `scripts/gerar-historico-do-git.mjs`, nova feature `features/repositorio/` (rota com
  `loadComponent`), remoção de `layout/painel-do-git/` e do serviço da área de baixo dividida,
  barra superior, faixa de ferramentas, abas.
- Testes: unitários (resumo do histórico), E2E (aba, links, celular, axe nos dois temas).
