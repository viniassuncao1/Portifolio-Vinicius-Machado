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
- GitHub Actions: pipeline de CI em todo PR e push na `main`; publicação automática no
  GitHub Pages a cada push na `main`.
- Dependabot para dependências npm e GitHub Actions; template de Pull Request.
- Documentação: README, guia de contribuição, arquitetura, fluxo de desenvolvimento com IA
  e `CLAUDE.md` com as convenções que o agente de IA deve seguir.

## Capabilities

### New Capabilities
- `pipeline-de-qualidade`: verificações automáticas (lint, formatação, testes, cobertura,
  build e E2E) que todo código precisa passar antes de entrar na `main`.
- `publicacao-do-site`: publicação automática do site estático pré-renderizado a partir da
  `main`.

### Modified Capabilities

_Nenhuma._

## Impact

- Novo código-fonte Angular na raiz do repositório (`src/`, `angular.json`, `package.json`).
- Novos workflows em `.github/workflows/`.
- Novas dependências de desenvolvimento (ESLint, Prettier, Husky, commitlint, Playwright).
- O repositório no GitHub precisa ter o GitHub Pages configurado com a fonte
  "GitHub Actions".
