# Tasks

## 1. Aplicação Angular

- [x] 1.1 Gerar o projeto Angular 22 (standalone, zoneless, SCSS, SSG) na raiz do repositório — verificar com `npm run build`
- [x] 1.2 Configurar rotas pré-renderizadas e a estrutura de pastas `core/`, `shared/`, `features/`, `layout/` — verificar pelo HTML pré-renderizado em `dist/`
- [x] 1.3 Fixar a versão do Node em `.nvmrc` e `engines` — verificar com `node -v`

## 2. Qualidade de código

- [x] 2.1 Configurar ESLint com angular-eslint — verificar com `npm run lint`
- [x] 2.2 Configurar Prettier e `.editorconfig` — verificar com `npm run format:check`
- [x] 2.3 Configurar cobertura mínima de 80% nos testes unitários — verificar com `npm run test:ci`
- [x] 2.4 Configurar Playwright com um teste de fumaça da página inicial — verificar com `npm run e2e`

## 3. Padrão de commits

- [x] 3.1 Configurar Husky, lint-staged e commitlint — verificar que "ajustes" é rejeitado e "chore: teste" é aceito

## 4. GitHub

- [x] 4.1 Criar o workflow `ci.yml` (lint, formatação, testes, build, E2E) — verificar com actionlint/validação de YAML
- [x] 4.2 Criar o projeto na Vercel e o `vercel.json` — verificar com `vercel pull` + `vercel build` locais
- [x] 4.3 Cadastrar os secrets da Vercel no GitHub — verificar na lista de secrets do repositório
- [x] 4.4 Adicionar os jobs de deploy de preview e de produção ao workflow — verificar pelo link de preview no PR
- [x] 4.5 Adicionar Dependabot e template de Pull Request — verificar a presença dos arquivos em `.github/`

## 5. Documentação

- [x] 5.1 Escrever o README (visão geral, stack, scripts, como rodar, deploy) — revisar a renderização no GitHub
- [x] 5.2 Escrever `CONTRIBUTING.md`, `docs/arquitetura.md` e `docs/desenvolvimento-com-ia.md` — revisar os links entre os documentos
- [x] 5.3 Escrever `CLAUDE.md` com as convenções para o agente de IA — revisar se aponta para as regras em `.claude/rules/`
- [x] 5.4 Escrever `docs/deploy.md` explicando o pipeline de CI/CD e a Vercel — revisar os links a partir do README

## Workflow follow-up

- Abrir PR da branch `chore/fundacao-do-projeto` para a `main`.
- Arquivar a change com `openspec archive configurar-fundacao-do-projeto`.
