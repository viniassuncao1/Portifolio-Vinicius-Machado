# Portfolio_Vinicius

[![CI/CD](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/actions/workflows/ci.yml/badge.svg)](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/actions/workflows/ci.yml)

Portfólio pessoal de **Vinicius Machado**, desenvolvedor Full Stack (Java, Spring Boot, Angular
e SQL).

O site imita uma IDE, em tema **claro ou escuro**, com o design autoral do portfólio e elementos do IntelliJ IDEA (pacotes, Git, o ▶ de executar): as seções do portfólio aparecem como arquivos numa árvore de projeto e o
conteúdo é apresentado como código. Além de portfólio, este repositório é um exemplo de como eu
desenvolvo em Angular com auxílio de IA, de forma planejada e verificável.

**Acesse:** https://vinimachado.wattscompany.com.br

## Destaques

- **Angular 22 moderno:** componentes standalone, signals, zoneless e o novo control flow.
- **Pré-renderização (SSG):** cada rota é gerada como HTML estático no build, o que garante
  carregamento rápido e SEO.
- **Casca de IDE como rota-pai:** a barra, o painel e a aba são montados uma vez; as 18 seções
  são rotas filhas pré-renderizadas, com o conteúdo definido como dados tipados.
- **Abertura com Run:** o site abre como a IDE rodando o projeto: uma splash de 3 s, o ▶ do Run
  (que se aciona sozinho em 5 s), o build das classes do portfólio (uma por seção) e o log do Spring subindo, e então a IDE
  aparece. Só na página inicial e uma vez por sessão, com o conteúdo sempre no HTML
  ([ADR-0017](docs/adr/0017-abertura-com-run.md)).
- **Projeto 2, "Este portfólio":** uma seção conta o estudo de desenvolvimento com
  IA por trás do site: o processo, specs antes do código com o OpenSpec (SDD), o ECC e a equipe de
  agentes no Maestri.
- **Página do repositório:** o `master` da barra e o ícone Commit abrem, numa aba, uma página no
  estilo do GitHub com os números do projeto, a proporção de commits por tipo e os últimos pull
  requests. O histórico é gerado no build, sem token e sem e-mails
  ([ADR-0016](docs/adr/0016-repositorio-no-estilo-do-github.md),
  [ADR-0013](docs/adr/0013-historico-do-git-gerado-no-build.md)).
- **Cartão ⇄ Código ([ADR-0019](docs/adr/0019-experiencia-focada-em-recrutadores.md)):** o Início
  e todas as seções têm duas visões do mesmo conteúdo. O **cartão** (padrão) se lê em segundos: um hero em que a classe `ViniciusMachado` é
  digitada na janela da IDE e vira o cartão de apresentação, a barra de ações (currículo, LinkedIn,
  GitHub, copiar e-mail), números que contam, a stack como `build.gradle`, a experiência como
  `git log --graph` e o contato num terminal, com o tema de cor mudando a cada seção. O **código**
  é o arquivo Java da IDE.
- **Vitrine de projetos (`/projetos`):** os seis projetos num carrossel arrastável (ou grade), com
  expansão do cartão até a tela cheia por View Transition, detalhes em `<dialog>` com abas
  "Visão geral / Código / Stack" e endereço compartilhável por projeto.
- **Interações de ponteiro:** os cartões de projeto se inclinam em 3D, a foto do hero tem parallax e
  um anel de cursor acompanha o mouse; só com ponteiro fino e nunca com movimento reduzido.
- **Movimento com cuidado:** CSS e View Transitions primeiro e a biblioteca `motion` carregada só
  depois da hidratação e nunca com `prefers-reduced-motion`; a abertura pode ser pulada (Esc).
  Lighthouse móvel 100 em tudo, LCP de 1,1 s e axe sem violações nos dois temas.
- **UX pensada para quem recruta:** Javadoc em modo de leitura, "Próximo arquivo →", atalhos no
  Início, code vision para ver o site dos projetos e contatos fáceis de tocar.
- **Fotos de perfil no Javadoc:** o Início, o Sobre Mim e a recomendação recebida mostram um
  retrato redondo à esquerda do comentário de documentação, como o IntelliJ faz no modo de leitura,
  com o `@author` linkando o LinkedIn de quem recomendou.
- **Janela de Run:** a IDE "roda" o `PortfolioApplication` e mostra o log de
  inicialização do Spring Boot quando o visitante usa o ▶ Executar da barra (com "Pular" e sem
  bloquear a leitura).
- **Java para leitura:** o código de cada seção é Java 21 válido, com domínio em português e sem
  cerimônia (`record Evento(String nome, int vezes)`), para quem recruta ler como frase
  ([guia de estilo](docs/componentes.md#guia-de-estilo)).
- **Tema claro e escuro:** o site segue o tema do sistema na primeira visita, e um botão na barra
  de ferramentas troca e guarda a escolha. O tema é aplicado antes da primeira pintura, então a
  página não pisca ([ADR-0014](docs/adr/0014-tema-claro.md)).
- **Design tokens:** cores, tipografia e movimento em variáveis CSS (`src/styles/`); os
  componentes usam só tokens. Fontes Inter (interface) e JetBrains Mono (código) servidas pelo próprio site.
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
| `npm run build`        | Build de produção com pré-renderização e `sitemap.xml`    |
| `npm test`             | Testes unitários em modo watch                            |
| `npm run test:ci`      | Testes unitários uma vez, com cobertura (mínimo 80%)      |
| `npm run e2e`          | Testes E2E sobre o build de produção (rode o build antes) |
| `npm run lint`         | ESLint em TypeScript e templates                          |
| `npm run format`       | Formata o projeto com Prettier                            |
| `npm run format:check` | Verifica a formatação sem alterar arquivos                |

## Compartilhamento no LinkedIn

O LinkedIn guarda a prévia do link em cache. Depois de um deploy que mude título, descrição ou
imagem, abra o [Post Inspector](https://www.linkedin.com/post-inspector/), cole o endereço do
portfólio e clique em inspecionar para atualizar a prévia.

Para regenerar a imagem do cartão (`public/compartilhamento/portfolio-v2.png`, 2400x1260) quando o
visual do Início mudar:

```bash
npm run build
node scripts/gerar-imagem-de-compartilhamento.mjs
```

Confira a imagem antes de commitar. Os metadados vêm do serviço `Seo`; veja a seção
[SEO e compartilhamento](docs/arquitetura.md#seo-e-compartilhamento).

## Ícone do site

O favicon é um "VM" branco num quadrado arredondado roxo, no estilo do ícone de projeto do IntelliJ
New UI. A fonte é `public/favicon.svg` (letras em contornos, sem depender de fonte instalada). Para
regenerar os PNG (16, 32, 48 e 180 px) e o `favicon.ico` depois de mexer no SVG:

```bash
node scripts/gerar-icones.mjs
```

Confira os arquivos antes de commitar. Detalhes em
[Ícone do site](docs/arquitetura.md#ícone-do-site).

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

O build precisa do histórico completo do Git para gerar a página do repositório, então os jobs do CI usam
`fetch-depth: 0`. Em clone raso ou sem `git`, o painel mostra uma mensagem e o build não falha.

Detalhes em [docs/deploy.md](docs/deploy.md).

## Créditos

Os ícones da árvore, das abas e da barra de ferramentas são do design do portfólio. Só o ▶ de
executar, a branch, a busca e a faixa de ferramentas usam ícones da **IntelliJ Platform** (conjunto
New UI), da JetBrains, sob a licença Apache 2.0. A origem, o copyright e o mapa de arquivos estão em
[`public/icones/new-ui/CREDITOS.md`](public/icones/new-ui/CREDITOS.md). Este projeto não é
afiliado à JetBrains e não usa logotipos de produto.

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
