# Design

## Context

Existem a casca (`layout/`), o editor com conteúdo tipado (`shared/editor-de-codigo/`), as
páginas de seção (`SECOES.paginas`, `PaginasDaSecao`) e cinco seções publicadas. A faixa de abas
hoje é decorativa (`AbaDoEditor` com `Portfolio_Vinicius`). Motivação e escopo em
`proposal.md`; comportamento nas specs.

## Goals / Non-Goals

**Goals:**

- Experiência de IDE (abas, digitação, cursor, status, busca) sem prejudicar a pré-renderização,
  o SEO e a acessibilidade.
- Trabalho em quatro trilhas paralelas com arquivos disjuntos.

**Non-Goals:**

- Edição real do código, realce automático de sintaxe ou execução de Java.
- Projetos e janela de preview (change própria).

## Decisions

### 1. Design como referência (ADR-0010)

Mantêm-se cores, tipografia, proporções e a estrutura de IDE das telas. Desvios aceitos nesta
change: faixa de abas com arquivos `.java`, barra de status, busca, digitação, cursor, linha
atual e o código em Java moderno. O `CLAUDE.md` troca "implemente fielmente" por "use como
referência".

### 2. Modelo do editor

- Papel novo `comentario` (cor própria em token, contraste ≥ 4,5:1) para `//` e Javadoc.
- `Trecho` ganha `href?` opcional: o editor renderiza `<a>` com a classe do papel; links externos
  com `target="_blank"` e `rel="noopener noreferrer"`.
- O parágrafo em bloco de comentário continua existindo para texto longo (Javadoc).

### 3. Arquivo por seção

`Secao` ganha `arquivo` (`SobreMim.java`, `Skills.java`...) e o Início tem
`ViniciusMachado.java`. A faixa de abas, a barra de status e a busca leem daí.

### 4. Estado da IDE em serviços de `core/`

- `AbasAbertas` (`@Service`): signal com a lista de abas; abre a aba da rota atual em cada
  navegação; persiste em `sessionStorage` (só no navegador, com `try/catch`); fechar ativa a
  vizinha ou navega para `/`.
- `EstadoDoEditor` (`@Service`): signals `linha` e `coluna`, escritos pelo editor e lidos pela
  barra de status.
- Na pré-renderização, a faixa mostra só a aba da rota atual (estado vazio no servidor), o que
  evita divergência na hidratação.

### 5. Componentes da casca

`FaixaDeAbas` substitui `AbaDoEditor` (padrão `tablist`), `BarraDeStatus` (papel `status`, região
viva só para o nome do arquivo) e `BuscaDeSecoes` (`<dialog>` com combobox; atalho
`keydown.control.p`/`keydown.meta.p` no `host` da casca com `preventDefault`; filtro sem acento
com `normalize('NFD')`). A árvore ganha navegação por setas (roving tabindex).

### 6. Digitação

Feita pelo Compasso no `EditorDeCodigo`: o texto completo fica sempre no DOM; uma máscara por
CSS (`clip-path`/largura animada por linha via custom property atualizada em
`requestAnimationFrame` dentro de `afterNextRender`) revela o código, limitada a 1,5 s no total.
Seções já vistas ficam num `Set` em memória. `prefers-reduced-motion` desliga tudo. Cursor por
pseudo-elemento com `animation: piscar`; linha atual por classe.

### 7. Trilhas e ordem

| Trilha | Quem | Arquivos | Depende de |
| ------ | ---- | -------- | ---------- |
| Base | Pincel | `shared/editor-de-codigo/conteudo.ts` e estilos (papel e links), `core/secoes.ts` (`arquivo`), serviços de `core/` | — |
| Casca | Pincel | `layout/` (abas, status, busca, árvore) | Base |
| Movimento | Compasso | `editor-de-codigo.ts/.html/.scss`, `_movimento.scss` | Base |
| Seções publicadas | Grafite | `features/inicio`, `sobre-mim`, `diferenciais`, `como-uso-ia`, `skills` | Base |
| Seções novas | Nanquim | `features/experiencias`, `eventos`, `formacao`, `idiomas`, `contato`; registro em `app.routes.ts` e `paginas` em `core/secoes.ts` | Base |
| Testes | Sentinela | `*.spec.ts`, `e2e/` | cada trilha |
| Docs | Escriba | `docs/`, `CLAUDE.md`, papéis | — |

### 8. Equipe

Dois especialistas novos, Grafite e Nanquim, com o papel "Seções" (`papeis/secoes.md`): só
escrevem conteúdo em `features/<secao>/` e pedem ao Regente o que precisar nos componentes.

## Risks / Trade-offs

- [Cinco agentes na mesma cópia] → arquivos disjuntos por trilha, `git add` só dos próprios
  arquivos, Base antes de tudo.
- [Digitação atrapalhar] → curta (≤ 1,5 s), só na primeira abertura, pulável e desligada com
  movimento reduzido; o conteúdo está completo no DOM.
- [Hidratação com estado do navegador] → abas e posição do cursor só existem no navegador; o
  HTML pré-renderizado tem a aba da rota atual.
- [Limite do plano Pro com mais agentes] → trilhas curtas e commits frequentes; se o limite
  acabar, o trabalho commitado continua de onde parou.
