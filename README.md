# Portfolio_Vinicius

[![CI/CD](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/actions/workflows/ci.yml/badge.svg)](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/actions/workflows/ci.yml)

Portfólio pessoal de **Vinicius Machado**, desenvolvedor Full Stack (Java, Spring Boot, Angular
e SQL).

O site imita uma IDE: as seções do portfólio aparecem como arquivos numa árvore de projeto e o
conteúdo é apresentado como código. Além de portfólio, este repositório é um exemplo de como eu
desenvolvo em Angular com auxílio de IA, de forma planejada e verificável.

**Acesse:** https://portfolio-vinicius-machado.vercel.app

## Destaques

- **Angular 22 moderno:** componentes standalone, signals, zoneless e o novo control flow.
- **Pré-renderização (SSG):** cada rota é gerada como HTML estático no build, o que garante
  carregamento rápido e SEO.
- **Casca de IDE como rota-pai:** a barra, o painel e a aba são montados uma vez; as 15 seções
  são rotas filhas pré-renderizadas, com o conteúdo definido como dados tipados.
- **Design tokens:** cores, tipografia e movimento em variáveis CSS (`src/styles/`); os
  componentes usam só tokens. Fonte JetBrains Mono servida pelo próprio site.
- **Responsivo e acessível:** no celular o painel vira uma gaveta; `prefers-reduced-motion` é
  respeitado e o axe verifica o WCAG AA em todas as rotas nos testes E2E.
- **Qualidade automatizada:** ESLint, Prettier, testes unitários com cobertura mínima de 80% e
  testes E2E com Playwright, rodando em todo Pull Request.
- **Desenvolvimento orientado a specs com IA:** cada funcionalidade nasce como uma proposta no
  [OpenSpec](openspec/) e é implementada por uma [equipe de agentes](docs/equipe-de-agentes/README.md)
  no Maestri: um maestro (Claude Opus) planeja e revisa, e especialistas (Claude Sonnet) cuidam de
  design, animações, testes e documentação. Veja [como eu uso IA neste projeto](docs/desenvolvimento-com-ia.md).
- **Decisões documentadas:** cada escolha importante tem um [ADR](docs/adr/README.md) explicando o
  porquê.

## Stack

| Área         | Ferramentas                                          |
| ------------ | ---------------------------------------------------- |
| Framework    | Angular 22, TypeScript 6, SCSS                       |
| Renderização | `@angular/ssr` com pré-renderização estática         |
| Testes       | Vitest (unitários), Playwright + axe (E2E)           |
| Qualidade    | ESLint (angular-eslint), Prettier, Husky, commitlint |
| CI/CD        | GitHub Actions, Vercel, Dependabot                   |
| Processo     | OpenSpec (SDD), Claude Code                          |

## Como rodar

Pré-requisito: Node.js 24 (veja [`.nvmrc`](.nvmrc)).

```bash
npm install
npm start
```

A aplicação fica disponível em `http://localhost:4200`.

## Scripts

| Comando                | O que faz                                                 |
| ---------------------- | --------------------------------------------------------- |
| `npm start`            | Servidor de desenvolvimento                               |
| `npm run build`        | Build de produção com pré-renderização em `dist/`         |
| `npm test`             | Testes unitários em modo watch                            |
| `npm run test:ci`      | Testes unitários uma vez, com cobertura (mínimo 80%)      |
| `npm run e2e`          | Testes E2E sobre o build de produção (rode o build antes) |
| `npm run lint`         | ESLint em TypeScript e templates                          |
| `npm run format`       | Formata o projeto com Prettier                            |
| `npm run format:check` | Verifica a formatação sem alterar arquivos                |

## Estrutura

```
src/app/
  core/       serviços e configurações globais
  shared/     componentes, diretivas e pipes reutilizáveis
  layout/     a "casca" da IDE (barra superior, árvore lateral, aba)
  features/   uma pasta por seção do portfólio
src/styles/   design tokens (_tokens.scss) e movimento (_movimento.scss)
e2e/          testes E2E (Playwright + axe) e servidor.mjs, que imita a Vercel
openspec/     specs e histórico de mudanças planejadas
docs/         documentação do projeto
```

Detalhes em [docs/arquitetura.md](docs/arquitetura.md) e, para os componentes, em
[docs/componentes.md](docs/componentes.md).

## CI/CD

Tudo roda no workflow [`ci.yml`](.github/workflows/ci.yml):

- **CI:** em todo PR e push na `main`, roda lint, formatação, testes unitários com cobertura,
  build e E2E em jobs paralelos.
- **CD:** com tudo verde, publica na Vercel. Cada PR ganha uma URL de preview, e cada push na
  `main` atualiza a produção.

Detalhes em [docs/deploy.md](docs/deploy.md).

## Documentação

- [Decisões de arquitetura (ADRs)](docs/adr/README.md)
- [Arquitetura](docs/arquitetura.md)
- [Componentes e como criar uma seção](docs/componentes.md)
- [Diário de desenvolvimento](docs/diario/README.md)
- [CI/CD e deploy](docs/deploy.md)
- [Desenvolvimento com IA](docs/desenvolvimento-com-ia.md)
- [Equipe de agentes](docs/equipe-de-agentes/README.md)
- [Como contribuir](CONTRIBUTING.md)

## Contato

- LinkedIn: [linkedin.com/in/viniassuncao](https://www.linkedin.com/in/viniassuncao)
- GitHub: [github.com/viniassuncao1](https://github.com/viniassuncao1)
