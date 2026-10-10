# Design

## Context

Todas as seções usam o editor com conteúdo tipado e o mecanismo de páginas
(`SECOES.paginas`). Os tamanhos vêm de `src/styles/_tokens.scss`, hoje na escala 1,2× das telas
(código 23px). Motivação em `proposal.md`.

## Goals / Non-Goals

**Goals:**

- Diminuir a escala de uma vez, só por tokens, sem mexer nos componentes.
- Um padrão de escrita de conteúdo que um recrutador leia sem esforço.

**Non-Goals:**

- Mudar a estrutura da casca ou o comportamento de IDE.

## Decisions

### 1. Escala por tokens

Multiplicar por ~0,74 os tokens de tipografia (`--texto-*`), alturas de linha e medidas
derivadas delas (recuos, coluna de números, afastamentos, altura das linhas da árvore, das abas
e da barra de status, largura do painel lateral). Cores não mudam. O celular mantém a sua
própria escala, conferida no portal.

### 2. Guia de legibilidade

- Tipos e campos com nomes que se explicam (`Certification(String course, int hours,
  LocalDate completedOn)`).
- Um comentário `//` curto em pt-BR no início de cada bloco, dizendo o que ele é.
- Listas de até cinco itens numa linha; listas maiores quebradas por grupos.
- Evitar `Optional`, `URI.create`, genéricos aninhados e imports desnecessários quando um
  `String` ou um comentário resolve: no lugar de `Optional.empty()`, um comentário `// atual`;
  links continuam clicáveis via `link()`.
- Javadoc só para os parágrafos de texto.

### 3. Níveis de conhecimento em Skills

`paginas: 3` em Skills. A página 3 é um `enum KnowledgeLevel` com uma descrição em pt-BR por
nível e um `Map` (ou constantes) ligando cada nível às tecnologias. No design, essas telas ficam
sob "Formação"; aqui ficam em Skills por coerência (ADR-0010).

### 4. Trilhas

| Trilha | Quem | Arquivos |
| ------ | ---- | -------- |
| Escala | Pincel | `src/styles/_tokens.scss` e ajustes de estilo de `layout/` que dependam dela |
| Certificações e revisão de Experiências, Eventos, Formação, Idiomas e Contato | Nanquim | `features/certificacoes`, as cinco features dele e o registro da rota |
| Níveis em Skills e revisão de Início, Sobre Mim, Diferenciais, Como uso a IA e Skills | Grafite | as cinco features dele e `paginas` de Skills |
| Testes | Sentinela | `*.spec.ts`, `e2e/` |
| Docs e diário | Escriba | `docs/` |

## Risks / Trade-offs

- [Simplificar demais e perder o "Java moderno"] → manter records, `List.of` e `java.time`;
  cortar só o que não ajuda o leitor.
- [Grafite e Nanquim mexendo em `core/secoes.ts` e `app.routes.ts`] → só o Nanquim registra a
  rota de Certificações; o Grafite só muda `paginas` de Skills; commits separados e em
  sequência (Grafite primeiro).
