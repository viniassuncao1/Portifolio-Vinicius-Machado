# ADR-0020: Deploy de produção manual

- **Status:** Aceito
- **Data:** 2026-10-21
- **Substitui em parte:** [ADR-0004](0004-vercel-com-deploy-pelo-github-actions.md) (a publicação
  automática a cada push na `main`)

## Contexto

O Vinicius decidiu manter no ar o portfólio publicado até o PR #40 e refatorar a experiência
inteira localmente, publicando só quando gostar do resultado. O PR #41 já foi mesclado na `main`,
mas o deploy dele foi cancelado antes de chegar à produção. Com a publicação automática, qualquer
merge seguinte na `main` (inclusive os do Dependabot) levaria o #41 e o que viesse depois ao ar sem
ninguém pedir.

## Decisão

O job **Deploy de produção** do GitHub Actions só roda pelo botão **Run workflow** (evento
`workflow_dispatch`) na `main`. Um push ou merge na `main` continua rodando lint, testes
unitários, build e E2E, mas não publica. Os previews por PR continuam automáticos. Publicar passa
a ser um pedido explícito do Vinicius.

## Alternativas consideradas

- **Não mesclar nada na `main` até publicar:** funciona, mas depende de ninguém esquecer, e o
  Dependabot abre PRs para a `main` toda semana.
- **Reverter o #41 na `main`:** apaga o histórico do trabalho e obriga a reaplicar tudo depois.
- **Desligar a integração na Vercel:** o deploy já é feito pelo Actions; a trava fica onde o deploy
  acontece.

## Consequências

- A produção só muda quando alguém roda o workflow na `main` pelo GitHub (ou pede ao Regente).
- A `main` pode ficar à frente da produção; a barra de status do site mostra o commit publicado.
- Para voltar à publicação contínua, basta um novo ADR que devolva o `push` à condição do job.
