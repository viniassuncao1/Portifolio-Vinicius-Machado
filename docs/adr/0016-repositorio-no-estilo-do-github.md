# ADR-0016: Página do repositório no estilo do GitHub

- **Status:** Aceito
- **Data:** 2026-10-14
- **Substitui em parte:** [ADR-0013](0013-historico-do-git-gerado-no-build.md) (como o histórico é
  apresentado; a geração do JSON no build continua)

## Contexto

O painel do Git do [ADR-0013](0013-historico-do-git-gerado-no-build.md) mostrava os 442 commits num
log cru na parte de baixo da IDE. A auditoria de UX de 14/10 apontou que ele cobre o editor, que o
grafo vira uma faixa só, que o painel de detalhes começa vazio e que a lista é dominada por
commits como "docs: marca a tarefa 3.1…". O Vinicius não gostou: o visual é pobre, ninguém
entende para que serve e falta explicação. Ele quer algo parecido com a página de um repositório no
GitHub, com os destaques e um link para ver tudo.

## Decisão

1. **O painel do Git vira uma página do repositório numa aba do editor**, na rota `/repositorio`
   (aba `Portfolio-Vinicius-Machado`), no visual de um repositório do GitHub dentro da IDE e nos
   dois temas. O indicador `master` e o botão Commit abrem essa aba.
2. **Conteúdo para entender em 10 segundos:** cabeçalho com o nome, uma frase explicando o que o
   repositório mostra e o botão "Ver no GitHub"; números (commits, pull requests mesclados, desde
   quando, último deploy); "Como o trabalho se divide", com a proporção de commits por tipo do
   Conventional Commits; os últimos pull requests e os últimos commits de código (sem os de marcar
   tarefas); e um link "Ver todo o histórico no GitHub".
3. **O histórico continua gerado no build** (ADR-0013), sem token e sem e-mails, e agora também
   guarda o **título de cada PR**. O resumo é calculado no navegador por funções puras testadas, e o
   JSON só é baixado quando a página abre.
4. **A parte de baixo da IDE fica só para a janela de Run**; saem o painel antigo e a exclusividade
   Run/Git.

## Alternativas consideradas

- **Consertar o painel antigo** (melhorar o grafo, preencher os detalhes). Continuaria cobrindo o
  editor e sendo um log cru.
- **Só um link para o GitHub.** Simples, mas perde a vitrine do processo dentro do site.
- **Embutir o histórico completo na página.** O GitHub já faz isso melhor; a página resume e aponta.

## Consequências

- O processo do projeto (Conventional Commits, pull requests, deploys) fica legível para um
  recrutador, sem cobrir o conteúdo.
- Some o grafo de branches e os detalhes de cada commit; quem quiser o log completo segue o link.
- O JSON ganha um campo curto nos merges de PR.
