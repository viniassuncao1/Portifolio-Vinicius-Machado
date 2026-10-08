# Proposal

## Why

O portfólio também é um projeto de vitrine no GitHub e no LinkedIn. Por isso, antes de
implementar qualquer tela, o repositório precisa de uma fundação que mostre boas práticas
de engenharia: estrutura Angular moderna, qualidade automatizada, publicação contínua e
documentação do processo de desenvolvimento assistido por IA (SDD com OpenSpec).

## What Changes

- Criação da aplicação Angular (standalone, signals, zoneless, SCSS) com pré-renderização
  estática das rotas (SSG).
- Ferramentas de qualidade: ESLint (angular-eslint), Prettier, testes unitários com Vitest
  e cobertura mínima de 80%, testes E2E com Playwright.
- Padronização de commits: Conventional Commits validados por commitlint, com hooks de
  pre-commit (lint-staged) e commit-msg via Husky.
- GitHub Actions: pipeline de CI em todo PR e push na `main`; deploy na Vercel feito pelo
  próprio pipeline, com preview em cada PR e produção a cada push na `main`.
- Dependabot para dependências npm e GitHub Actions; template de Pull Request.
- Documentação: README, guia de contribuição, arquitetura, fluxo de desenvolvimento com IA
  e `CLAUDE.md` com as convenções que o agente de IA deve seguir.

## Capabilities

### New Capabilities
- `pipeline-de-qualidade`: verificações automáticas (lint, formatação, testes, cobertura,
  build e E2E) que todo código precisa passar antes de entrar na `main`.
- `publicacao-do-site`: publicação automática do site estático pré-renderizado, com versão de
  preview por PR e versão de produção a partir da `main`.

### Modified Capabilities

_Nenhuma._

## Impact

- Novo código-fonte Angular na raiz do repositório (`src/`, `angular.json`, `package.json`).
- Novo workflow em `.github/workflows/` e configuração da Vercel em `vercel.json`.
- Novas dependências de desenvolvimento (ESLint, Prettier, Husky, commitlint, Playwright).
- Projeto criado na Vercel (sem a integração Git automática) e três secrets no GitHub:
  `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`.
