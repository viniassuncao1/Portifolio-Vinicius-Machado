# ADR-0004: Vercel com deploy pelo GitHub Actions

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O site estático (ADR-0003) precisa ser publicado automaticamente, com uma versão de revisão para
cada Pull Request. Também quero aprender e demonstrar CI/CD na prática.

## Decisão

Hospedar na **Vercel**, com o deploy feito **pelo GitHub Actions** usando a CLI da Vercel
(`vercel pull` → `vercel build` → `vercel deploy --prebuilt`). Os jobs de deploy dependem
(`needs`) dos jobs de lint, testes e E2E. A configuração de build fica versionada em
`vercel.json`.

Detalhes em [docs/deploy.md](../deploy.md).

## Alternativas consideradas

- **Integração Git automática da Vercel:** mais simples, mas publicaria mesmo com testes falhando
  e esconderia o processo no painel da Vercel.
- **GitHub Pages:** gratuito, mas sem preview por PR. Chegou a ser implementado e foi substituído
  antes do primeiro deploy.
- **Railway:** pensado para backends e containers; para um site estático exigiria um servidor
  (por exemplo, nginx em Docker) sem ganho. Fica reservado para um futuro backend.

## Consequências

- São necessários três secrets no GitHub: `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`.
- PRs de forks e do Dependabot não recebem secrets, então o preview não roda neles.
- A versão da CLI da Vercel é fixa no workflow e atualizada de propósito.
