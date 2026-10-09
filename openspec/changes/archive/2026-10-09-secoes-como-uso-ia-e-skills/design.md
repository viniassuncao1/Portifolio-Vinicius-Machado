# Design

## Context

Seções são features com conteúdo tipado, registradas em `FEATURES_DAS_SECOES`
(`src/app/app.routes.ts`); as rotas saem de `SECOES` (`src/app/core/secoes.ts`). Todas as rotas
são pré-renderizadas por `RenderMode.Prerender` em `**`. Referências: `tela-04.png`,
`tela-05.png` e `tela-06.png`.

## Goals / Non-Goals

**Goals:**

- Um mecanismo de páginas que Experiências, Certificações e Níveis de conhecimento reutilizem
  só declarando quantas páginas têm.

**Non-Goals:**

- Paginação automática pelo tamanho do conteúdo: cada página corresponde a uma tela do design.

## Decisions

### 1. Rotas estáticas por página, sem parâmetro

`Secao` ganha o campo opcional `paginas` (padrão 1). Para cada seção, as rotas saem como
`<slug>` (página 1) e `<slug>/2` ... `<slug>/N`, com `data: { pagina, totalDePaginas }`.

- Alternativa: rota `:pagina`. Descartada: a pré-renderização de rota com parâmetro exige
  `getPrerenderParams` e validação do número; rotas estáticas já são pré-renderizadas e qualquer
  outra página cai no `**` (redireciona ao Início).

### 2. Uma feature por seção, conteúdo por página

A feature recebe a página pela `data` da rota (`input()` com `withComponentInputBinding`) e
escolhe o conteúdo em `<secao>.conteudo.ts`, que exporta um array com um conteúdo por página.

### 3. Controle de páginas compartilhado

Componente `PaginasDaSecao` em `shared/`, com `pagina`, `total` e `slug` como entradas: `<nav
aria-label="Páginas da seção">` com links `routerLink`, texto `◂ 1/2 ▸`, `aria-label` "Página
anterior"/"Próxima página" e o número como "página X de N". Posicionado abaixo do código, à
direita, só com tokens. Não aparece quando `total` é 1. A troca de página já usa a View
Transition do editor.

### 4. Título e árvore

A `TitleStrategy` acrescenta `(X/N)` a partir da página 2. A árvore usa `routerLinkActive`
sem `exact`, então `/skills/2` mantém "Skills / STACK" como atual.

### 5. Fidelidade ao design

O conteúdo reproduz as telas como estão, com uma exceção decidida pelo Vinicius: o nome de
classe da tela 04, grafado `ArtificialItenligence` no design, é corrigido para
`ArtificialIntelligence`, para não parecer erro de digitação.

## Risks / Trade-offs

- [O controle de páginas não existe no design] → mínimo, discreto e só com tokens; conferido
  no portal ao lado das telas.
- [Mais rotas para manter] → saem todas de `SECOES`; o axe e os E2E percorrem a lista gerada.
