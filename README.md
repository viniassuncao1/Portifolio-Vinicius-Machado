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
- **Qualidade automatizada:** ESLint, Prettier, testes unitários com cobertura mínima de 80% e
  testes E2E com Playwright, rodando em todo Pull Request.
- **Desenvolvimento orientado a specs com IA:** cada funcionalidade nasce como uma proposta no
  [OpenSpec](openspec/), é implementada com o Claude Code e fica documentada no repositório.
  Veja [como eu uso IA neste projeto](docs/desenvolvimento-com-ia.md).

## Stack

| Área         | Ferramentas                                          |
| ------------ | ---------------------------------------------------- |
| Framework    | Angular 22, TypeScript 6, SCSS                       |
| Renderização | `@angular/ssr` com pré-renderização estática         |
| Testes       | Vitest (unitários), Playwright (E2E)                 |
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
  layout/     a "casca" da IDE (barra superior, árvore lateral, editor)
  features/   uma pasta por seção do portfólio
e2e/          testes E2E (Playwright)
openspec/     specs e histórico de mudanças planejadas
docs/         documentação do projeto
```

Detalhes em [docs/arquitetura.md](docs/arquitetura.md).

## CI/CD

Tudo roda no workflow [`ci.yml`](.github/workflows/ci.yml):

- **CI:** em todo PR e push na `main`, roda lint, formatação, testes unitários com cobertura,
  build e E2E em jobs paralelos.
- **CD:** com tudo verde, publica na Vercel. Cada PR ganha uma URL de preview, e cada push na
  `main` atualiza a produção.

Detalhes em [docs/deploy.md](docs/deploy.md).

## Documentação

- [Arquitetura](docs/arquitetura.md)
- [CI/CD e deploy](docs/deploy.md)
- [Desenvolvimento com IA](docs/desenvolvimento-com-ia.md)
- [Como contribuir](CONTRIBUTING.md)

## Contato

- LinkedIn: [linkedin.com/in/viniassuncao](https://www.linkedin.com/in/viniassuncao)
- GitHub: [github.com/viniassuncao1](https://github.com/viniassuncao1)
