# Design

## Context

Hoje existe só a feature `inicio` com um placeholder, rota única pré-renderizada
(`RenderMode.Prerender` em `**`) e as pastas `core/`, `layout/` e `shared/` vazias. As 30 telas estão em
`design/telas/` (fora do Git) como PNGs de 1600x900, exportados do PDF original de 1920x1080:
o design real é o PNG x 1,2. Motivação em `proposal.md`; comportamento
esperado nas specs desta change.

### Inventário das telas

| Elemento                          | Telas             | Componente (pasta)                 |
| --------------------------------- | ----------------- | ---------------------------------- |
| Barra de ferramentas (ícones)     | todas             | `BarraDeFerramentas` (`layout/`)   |
| Controles de janela (— ▢ ×)       | todas             | dentro da barra (`layout/`)        |
| Painel lateral com título e aba   | todas             | `PainelLateral` (`layout/`)        |
| Árvore de seções com ícones       | todas             | `ArvoreDeSecoes` (`layout/`)       |
| Aba do editor `Portfolio_Vinicius` | todas            | `AbaDoEditor` (`layout/`)          |
| Editor com numeração e sintaxe    | todas             | `EditorDeCodigo` (`shared/`)       |
| Bloco de comentário com `*`       | 02-04, 07-18, 29  | parte do `EditorDeCodigo`          |
| Ícone (pacote, pasta, ferramenta, globo, play, IA) | todas | `Icone` (`shared/`)        |
| Janela de preview de site         | 11-15             | fora do escopo (change futura)     |

Todas as seções seguem o mesmo esqueleto: muda só o conteúdo do editor e o item selecionado da
árvore. Por isso o conteúdo vira dados, e não componentes por seção.

## Goals / Non-Goals

**Goals:**

- Uma casca única, montada uma vez como rota-pai, com as seções como rotas-filhas.
- Um modelo de conteúdo tipado que cubra todas as 30 telas (classe, campos, arrays, enums,
  anotações, métodos, parágrafos).
- Renderização 100% compatível com a pré-renderização: nada de medir o DOM para desenhar.

**Non-Goals:**

- Destaque de sintaxe automático a partir de texto Java (parser). O conteúdo já vem anotado.
- Interatividade dos ícones da barra de ferramentas.
- Tema claro.

## Decisions

### 1. Casca como rota-pai e seções como rotas-filhas

`app.routes.ts` passa a ter uma rota `''` com o componente `Casca` (`layout/`) e filhas: `''`
para Início e uma rota por seção. A casca não recarrega entre seções, então só o editor muda e a
View Transitions API anima apenas o conteúdo.

- Alternativa: cada feature incluir a casca no próprio template. Descartada: duplica a estrutura
  e quebra a regra de que uma feature não importa outra.

### 2. Lista de seções como fonte única

`core/secoes.ts` exporta a lista ordenada das 15 seções (`slug`, `titulo`, `icone`). Dela saem
os itens da árvore e as rotas. Enquanto a feature de uma seção não existir, a rota dela carrega
o componente compartilhado `SecaoEmConstrucao` (`shared/`), que mostra um comentário de código
no editor. Quando a seção for implementada, só a rota dela troca de componente.

Slugs: `sobre-mim`, `diferenciais`, `como-uso-ia`, `skills`, `experiencias`, `projeto-1` a
`projeto-4`, `certificacoes`, `eventos`, `formacao`, `idiomas`, `depoimentos`, `contato`.

### 3. Modelo de conteúdo do editor

Em `shared/editor-de-codigo/conteudo.ts`:

```ts
type Papel = 'palavra-chave' | 'declaracao' | 'literal' | 'anotacao' | 'comum';
interface Trecho { readonly texto: string; readonly papel: Papel }
type Linha =
  | { readonly tipo: 'codigo'; readonly recuo: number; readonly trechos: readonly Trecho[] }
  | { readonly tipo: 'paragrafo'; readonly recuo: number; readonly texto: string }
  | { readonly tipo: 'vazia' };
type ConteudoDoEditor = readonly Linha[];
```

Funções construtoras curtas (`palavraChave('public class')`, `literal('"Java"')`, `linha(1, ...)`)
deixam os arquivos de conteúdo legíveis. Cada feature guarda o seu conteúdo num arquivo
`<secao>.conteudo.ts`, tipado.

- Alternativa: escrever o Java como texto e colorir com uma biblioteca (Prism, Shiki). Descartada:
  as cores do design não seguem um tema padrão, a lib pesaria no bundle e o conteúdo tem
  "pseudo-Java" (`class KnowledgeLevel = {`) que um parser marcaria como erro.

### 4. Renderização do editor

- `<pre><code>` com um elemento por linha e um `span` por trecho, com a classe do papel.
- A coluna de números é um elemento `aria-hidden` com os números de 1 a 99, recortado pela altura
  da área do editor, que tem no mínimo 15 linhas. Assim a numeração cresce com o conteúdo sem
  medir o DOM (requisito de numeração e de pré-renderização).
- Parágrafos usam um pseudo-elemento com uma coluna de `*` recortada pela altura do bloco, com
  texto alternativo vazio (`content: "..." / ""`) para não ser lido por leitores de tela.

### 5. Título `h1` por rota

A casca tem um `h1` visualmente oculto cujo texto vem do `title` da rota: `Portfolio_Vinicius`
no Início e o nome da seção nas demais. O título da janela segue o formato
`<seção> | Vinicius Machado` via `TitleStrategy`.

### 6. Tokens e fonte

- Tokens em `src/styles/_tokens.scss` como variáveis CSS em `:root`, agrupados em interface,
  sintaxe, tipografia, espaço, raio, borda e movimento. O Pincel extrai os valores amostrando os
  pixels das telas e registra cada token na note "Design Tokens" com a tela de origem.
- Fonte: JetBrains Mono via `@fontsource/jetbrains-mono`, só os pesos usados e o subset latino,
  com `font-display: swap`. Servida pelo próprio site, sem Google Fonts.
- Cores de sintaxe que não atingirem 4,5:1 são ajustadas no token e o ajuste é anotado na note.

### 7. Ícones

SVGs próprios em `public/icones/`, desenhados no estilo dos ícones do Eclipse, exibidos com
`NgOptimizedImage` e `alt=""` (o nome da seção já é o rótulo). Não copiamos os ícones originais
do Eclipse para evitar problema de licença.

### 8. Telas pequenas

Abaixo de 768px, o painel lateral vira uma gaveta. Um botão "Seções" com `aria-expanded` e
`aria-controls` abre a gaveta e move o foco para o primeiro item; Escape ou a escolha de uma
seção fecham e devolvem o foco ao botão. O design só tem telas de desktop, então esse
comportamento é decisão nossa, mantendo cores e fontes do design.

### 9. Movimento

`provideRouter(..., withViewTransitions())` com `onViewTransitionCreated` pulando a transição
quando `prefers-reduced-motion: reduce`. Durações e curvas vêm dos tokens. A seta da árvore gira
com `transform`. Toda leitura de `matchMedia` fica atrás de `afterNextRender`/checagem de
plataforma, por causa da pré-renderização.

### 10. Acessibilidade automatizada

`@axe-core/playwright` nos E2E, percorrendo o Início e as 15 rotas com as tags `wcag2a` e
`wcag2aa`. Decisão registrada no ADR-0009.

### 11. Diário de desenvolvimento

`docs/diario/` com `README.md` (índice e modelo), `0001-fundacao-do-projeto.md` (retroativa) e
`0002-fundacao-visual-e-casca-da-ide.md`. As capturas de tela ficam em `docs/diario/imagens/`.
O Escriba escreve, o Vinicius revisa o rascunho do post antes de publicar. Processo registrado no
ADR-0008.

## Risks / Trade-offs

- [Cores extraídas de PNG podem sair levemente diferentes do original] → amostrar várias regiões
  e comparar no portal "Site Desktop" lado a lado com a tela.
- [A numeração recortada até 99 limita o tamanho de uma seção] → nenhuma tela passa de 15 linhas;
  se precisar, basta ampliar a lista.
- [A gaveta no celular não existe no design] → manter o mínimo (botão + gaveta) e validar com o
  Vinicius no portal "Site Mobile" antes do merge.
- [axe pode acusar falsos positivos em elementos decorativos] → marcar decorativos com
  `aria-hidden` e não desligar regras; qualquer exceção precisa de justificativa no teste.
- [Várias pessoas mexendo em `package.json`] → o Regente instala as duas dependências novas antes
  de delegar.

## Migration Plan

O placeholder de `features/inicio/` é substituído. O teste E2E existente continua passando
(`h1` com `Portfolio_Vinicius`). Rollback: reverter o merge; não há dados nem infraestrutura
envolvidos.
