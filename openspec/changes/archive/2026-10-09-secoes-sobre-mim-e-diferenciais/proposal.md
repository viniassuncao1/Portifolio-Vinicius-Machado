# Proposal

## Why

As rotas `/sobre-mim` e `/diferenciais` ainda mostram o aviso de "em construção". São as duas
primeiras seções da árvore e as que apresentam o Vinicius, então são as primeiras que um
recrutador abre. Com a casca e o editor prontos, cada seção agora é só conteúdo.

## What Changes

- Seção **Sobre Mim** com o código da tela 02: a interface `ViniciusMachado` com `sobreMim()` e
  a implementação com o parágrafo de apresentação em bloco de comentário.
- Seção **Diferenciais** com o código da tela 03: a classe `PersonalData` com os campos
  `origem`, `cidade` e os três `boolean`, e o método `diferenciais()` com o parágrafo.
- Novo papel de sintaxe para **valores literais** (`true`), que aparece na tela 03 numa cor
  verde-azulada própria, com o seu token de cor.
- As duas rotas deixam de usar o aviso de "em construção".
- Entrada 0003 do diário com rascunho de post.

Fora do escopo: as demais seções, que seguem com o aviso.

## Capabilities

### New Capabilities

- `secao-sobre-mim`: conteúdo da seção Sobre Mim (tela 02).
- `secao-diferenciais`: conteúdo da seção Diferenciais (tela 03).

### Modified Capabilities

- `editor-de-codigo`: o requisito "Cores de sintaxe" passa a incluir valores literais como
  `true`.

## Impact

- Código: `src/app/features/sobre-mim/`, `src/app/features/diferenciais/`, papel novo em
  `src/app/shared/editor-de-codigo/conteudo.ts`, token em `src/styles/_tokens.scss` e as duas
  rotas em `src/app/app.routes.ts`.
- Testes: unitários e E2E das duas seções; o axe já cobre todas as rotas.
- Documentação: `docs/componentes.md` (papel novo), entrada 0003 do diário.
- Sem dependências novas.
