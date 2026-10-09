# Proposal

## Why

"Como uso a IA" e "Skills / STACK" ainda mostram o aviso de "em construção". A seção Skills
ocupa duas telas no design (05 e 06), com o mesmo cabeçalho de classe e arrays diferentes. O
mesmo padrão volta em Experiências (07 e 08), Certificações (19 a 21) e Níveis de conhecimento
(23 a 27), então a forma de mostrar uma seção com várias telas precisa ser decidida e
construída uma vez.

## What Changes

- Seção **Como uso a IA** com o código da tela 04 (classe com `modismo = false` e
  `parteDoTrabalho = true` e o método `comoEuUsoIA()` com o parágrafo).
- **Páginas dentro de uma seção**: uma seção pode ter várias páginas, cada uma com endereço
  próprio (`/skills` e `/skills/2`), pré-renderizada, e um controle discreto no estilo da IDE
  (`◂ 1/2 ▸`) abaixo do código para ir de uma página à outra. Decisão do Vinicius.
- Seção **Skills / STACK** em duas páginas: a tela 05 (`linguagens`, `frameworks`,
  `databases`) e a tela 06 (`cloudAndInfra`, `ferramentas`).
- Entrada 0004 do diário com rascunho de post.

Fora do escopo: as outras seções com várias telas, que vão reutilizar as páginas.

## Capabilities

### New Capabilities

- `paginas-de-secao`: seções com mais de uma página, endereços, controle de navegação entre
  páginas e pré-renderização.
- `secao-como-uso-ia`: conteúdo da seção Como uso a IA (tela 04).
- `secao-skills`: conteúdo da seção Skills / STACK em duas páginas (telas 05 e 06).

### Modified Capabilities

Nenhuma. A árvore já marca a seção pelo prefixo do endereço, então "Skills / STACK" continua
como item atual em `/skills/2`.

## Impact

- Código: componente compartilhado de paginação em `src/app/shared/`, rotas das páginas em
  `src/app/app.routes.ts`, `src/app/features/como-uso-ia/` e `src/app/features/skills/`.
- Testes: unitários e E2E das duas seções e da navegação entre páginas; a varredura do axe passa
  a incluir `/skills/2`.
- Documentação: `docs/componentes.md` (como criar uma seção com páginas) e entrada 0004 do
  diário.
- Sem dependências novas.
