# 0025: Deploy de produção manual

- **Data:** 2026-10-21
- **Change:** [deploy-de-producao-manual](../../openspec/changes/archive/2026-10-21-deploy-de-producao-manual/)
- **PR:** [#43](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/43)
- **ADRs:** [0020](../adr/0020-deploy-de-producao-manual.md)

## Problema

Logo depois de mesclar o PR #41, o Vinicius decidiu que a produção deveria continuar com o
portfólio de antes, enquanto a nova experiência é refatorada localmente até ele gostar. O pipeline
da `main` já estava rodando o deploy do #41 e foi cancelado antes do job de produção. Só que, com
a publicação automática, o próximo merge na `main` (até um do Dependabot) levaria o #41 ao ar.

## Decisão

O job de produção só roda pelo botão **Run workflow** na `main`. Merges continuam testando tudo,
e os previews por PR continuam automáticos. Publicar vira um pedido explícito.

## Aprendizado

"Pode mergear" e "pode publicar" são pedidos diferentes quando a `main` publica sozinha. Separar
os dois no pipeline deixa a `main` livre para receber o trabalho em andamento sem risco para o
site no ar.

## Rascunho de post para o LinkedIn

> No meu portfólio, todo merge na main ia direto para produção. Funcionou bem até eu querer
> refatorar a experiência inteira com calma, sem mexer no que está no ar.
>
> A solução foi pequena: o deploy de produção passou a ser manual, por um botão no GitHub
> Actions. Os testes continuam rodando em todo merge; publicar virou uma decisão.
>
> Entrega contínua é ótima, mas ela precisa de um freio quando o produto está em reforma.
>
> #CICD #GitHubActions #Vercel
