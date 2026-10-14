# Design

## Context

Cada seção tem `src/app/features/<secao>/<secao>.conteudo.ts`, montado com as construtoras de
`shared/editor-de-codigo/conteudo.ts`. Hoje os identificadores estão em inglês e há muito
`static final` com nomes em caixa alta. `ARQUIVO_INICIO` é `ViniciusMachado.java`. A árvore já
está em pastas (`sobre`, `skills`, `experiencias`, `projetos`, `formacao`, `recomendacoes`,
`contato`) e a página inicial fica na raiz. Referência: ADR-0011 (item 3).

## Goals / Non-Goals

**Goals:**

- Código que se lê como frase para quem não programa, sem deixar de ser Java 21 válido.

**Non-Goals:**

- Mudar rotas, paginação, árvore ou visual.

## Decisions

### 1. Estilo

- `package dev.vinicius.portfolio.<pasta>;` no topo de cada seção (a página inicial no pacote
  raiz).
- Dados como `record` com nomes em português sem acento (`Experiencia`, `Certificacao`,
  `Recomendacao`, `periodo`, `empresa`), instâncias em `var` ou em listas `List.of(...)`.
- Nada de `static final`/`UPPER_SNAKE_CASE` para dados; métodos curtos e nomes que dizem o que
  fazem (`participei`, `aprendi`), quando ajudam a leitura.
- Comentários curtos em pt-BR onde ajudam; textos longos em Javadoc ou text blocks.
- `PortfolioApplication.java`: `@SpringBootApplication`, `public static void main` com uma
  apresentação curta (`var vinicius = new Desenvolvedor(...)`), sem exagerar na cerimônia.

### 2. Divisão

Grafite: `inicio`, `sobre-mim`, `diferenciais`, `como-uso-ia`, `skills`, `experiencias`,
`certificacoes`, `eventos`. Nanquim: `projeto-1` a `projeto-4`, `formacao`, `idiomas`,
`depoimentos`, `contato`. Os dois seguem o mesmo guia (uma seção de exemplo revisada pelo Regente
antes do resto: `eventos`).

### 3. Testes

Os testes que conferem trechos de código mudam junto com cada seção (no mesmo commit da seção).

## Risks / Trade-offs

- [Perder informação na reescrita] → a spec "Informações preservadas" continua valendo; a
  Sentinela compara os textos de cada seção antes e depois.
- [Português sem acento parecer estranho] → é a convenção usada em projetos Java brasileiros;
  textos visíveis continuam com acento.
