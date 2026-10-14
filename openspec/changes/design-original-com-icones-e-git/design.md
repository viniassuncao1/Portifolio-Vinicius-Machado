# Design

## Context

A casca tem hoje `layout/barra-de-ferramentas` (ícones no estilo Eclipse e o botão Executar),
o painel lateral com o cabeçalho `Portfolio_Vinicius × — ▢`, a árvore, a faixa de abas e
`layout/barra-de-status` (`Java 21`, `main`, `linha:coluna`). Os ícones vêm de
`shared/icone`, desenhados à mão. O botão "Seções" abre a gaveta no celular. A busca de seções
(`BuscaDeSecoes`) já abre por atalho e por um botão. Referência: ADR-0011 e os itens 5 e 6 do
briefing `design/briefing-redesign-intellij.md`.

## Goals / Non-Goals

**Goals:**

- Moldura da New UI completa (barra superior, faixa de ferramentas, cabeçalho do painel, barra
  de status) com ícones oficiais, sem perder nenhuma função de hoje (Executar, busca, gaveta).

**Non-Goals:**

- Árvore em pacotes e fim da paginação (change 3), Executar na calha (4), janela de Run (5) e a
  reescrita do Java (6). Abrir outros painéis pelo Commit e pela Estrutura.

## Decisions

### 1. Ícones oficiais

Origem: `JetBrains/intellij-community`, pasta `platform/icons/src/expui` (versões `_dark.svg`),
copiados para `public/icones/new-ui/`, só os que forem usados (projeto, commit, estrutura, run,
debug, find, settings, branch, chevronDown, pasta, classe, interface, java). O repositório é
distribuído sob Apache 2.0; o arquivo `public/icones/new-ui/CREDITOS.md` cita a origem, o
copyright da JetBrains e a licença, e o README aponta para ele. Nenhum logotipo de produto (o
ícone do IntelliJ, da JetBrains) entra: o selo `PV` faz o papel do ícone do projeto.

`shared/icone` passa a renderizar esses SVGs com `NgOptimizedImage` ou SVG embutido no build
(o Pincel escolhe pelo que mantém a cor do tema sem pedido extra por ícone e registra no
diário); os ícones decorativos ficam com `alt=""`/`aria-hidden`.

### 2. Barra superior

Substitui `barra-de-ferramentas` (mesmo arquivo renomeado ou componente novo
`layout/barra-superior/`). O Executar mantém o comportamento atual (preview só nos projetos com
site); Buscar chama o mesmo serviço da busca de hoje. O resto é decorativo, com `aria-hidden` e
sem foco. No celular: botão Projeto (abre a gaveta), nome do projeto e Buscar; o botão de
texto "Seções" sai.

### 3. Faixa de ferramentas e painel

`layout/faixa-de-ferramentas/` com 40px, só no desktop. O estado "painel visível" fica num
signal na casca; o editor ocupa o espaço com a transição de largura respeitando
`prefers-reduced-motion`. O cabeçalho do painel passa a "Projeto" com o chevron, sem os botões
de janela do Eclipse.

### 4. Barra de status e breadcrumbs

`Secao` ganha o campo `pacote` (`sobre`, `skills`, `experiencias`, `projetos`, `formacao`,
`recomendacoes`, `contato`, conforme o ADR-0011; a página inicial fica na raiz como
`PortfolioApplication.java`). Os breadcrumbs são derivados:
`portfolio-vinicius › src › main › java › dev › vinicius › portfolio › <pacote> › <Arquivo>`,
truncando os do meio com `…` quando faltar espaço. `Java 21` e `main` saem; `LF`, `UTF-8` e
`4 spaces` são texto fixo.

### 5. Commit do deploy

`scripts/gerar-informacoes-do-build.mjs` roda antes do `ng build` e escreve
`src/app/core/build.gerado.ts` (no `.gitignore`) com o SHA de `VERCEL_GIT_COMMIT_SHA` ou
`GITHUB_SHA`; sem variável, `null` e o item não aparece. Como o deploy sai do GitHub Actions, o
`GITHUB_SHA` é a fonte que vale; o script só lê variáveis, sem `git` no build.

## Risks / Trade-offs

- [Licença e marca dos ícones] → só ícones de interface genéricos, créditos e nenhum logotipo.
- [Breadcrumbs longos no celular] → no celular a barra mostra só o arquivo e `linha:coluna`.
- [Muitos controles decorativos] → `aria-hidden` e testes de axe e de foco na barra inteira.
- [Arquivo gerado esquecido no build local] → o script roda no `prebuild`, no `start` e nos
  testes, com valor padrão `null`.

## Faixas da equipe

| Faixa     | Quem      | O quê                                                           |
| --------- | --------- | --------------------------------------------------------------- |
| Ícones    | Pincel    | Baixar os SVGs, créditos, trocar `shared/icone`                 |
| Moldura   | Pincel    | Barra superior, faixa, painel, barra de status, celular         |
| Dados     | Grafite   | Campo `pacote` em `core/secoes.ts` e a função dos breadcrumbs   |
| Build     | Nanquim   | Script do SHA, `package.json`, `.gitignore`                     |
| Testes    | Sentinela | Unitários, E2E, axe e foco                                      |
| Docs      | Escriba   | README, `docs/`, diário 0011                                    |
