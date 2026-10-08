# Tasks

## 1. Aplicação Angular

- [ ] 1.1 Gerar o projeto Angular 22 (standalone, zoneless, SCSS, SSG) na raiz do repositório — verificar com `npm run build`
- [ ] 1.2 Configurar rotas pré-renderizadas e a estrutura de pastas `core/`, `shared/`, `features/`, `layout/` — verificar pelo HTML pré-renderizado em `dist/`
- [ ] 1.3 Fixar a versão do Node em `.nvmrc` e `engines` — verificar com `node -v`

## 2. Qualidade de código

- [ ] 2.1 Configurar ESLint com angular-eslint — verificar com `npm run lint`
- [ ] 2.2 Configurar Prettier e `.editorconfig` — verificar com `npm run format:check`
- [ ] 2.3 Configurar cobertura mínima de 80% nos testes unitários — verificar com `npm run test:ci`
- [ ] 2.4 Configurar Playwright com um teste de fumaça da página inicial — verificar com `npm run e2e`

## 3. Padrão de commits

- [ ] 3.1 Configurar Husky, lint-staged e commitlint — verificar que "ajustes" é rejeitado e "chore: teste" é aceito

## 4. GitHub

- [ ] 4.1 Criar o workflow `ci.yml` (lint, formatação, testes, build, E2E) — verificar com actionlint/validação de YAML
- [ ] 4.2 Criar o workflow `deploy.yml` para o GitHub Pages com `404.html` — verificar com um build local usando o mesmo `base-href`
- [ ] 4.3 Adicionar Dependabot e template de Pull Request — verificar a presença dos arquivos em `.github/`

## 5. Documentação

- [ ] 5.1 Escrever o README (visão geral, stack, scripts, como rodar, deploy) — revisar a renderização no GitHub
- [ ] 5.2 Escrever `CONTRIBUTING.md`, `docs/arquitetura.md` e `docs/desenvolvimento-com-ia.md` — revisar os links entre os documentos
- [ ] 5.3 Escrever `CLAUDE.md` com as convenções para o agente de IA — revisar se aponta para as regras em `.claude/rules/`

## Workflow follow-up

- Abrir PR da branch `chore/fundacao-do-projeto` para a `main`.
- Configurar Settings → Pages → Source: GitHub Actions.
- Arquivar a change com `openspec archive configurar-fundacao-do-projeto`.
