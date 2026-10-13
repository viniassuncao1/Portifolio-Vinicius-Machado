# Design

## Context

Os tamanhos e cores já estão concentrados em `src/styles/_tokens.scss`, com um bloco `@media`
para o celular. A única fonte hoje é a JetBrains Mono (`@fontsource/jetbrains-mono`). A
barra de ferramentas usa um degradê definido por tokens. Referência: ADR-0011 e o briefing
`design/briefing-redesign-intellij.md` (itens 1 e 9 e a auditoria de interface).

## Goals / Non-Goals

**Goals:**

- Trocar paleta e escala só por tokens, mexendo em componente apenas onde houver medida fixa ou
  onde um token precise mudar de natureza (ex.: largura da aba de fixa para a do conteúdo).

**Non-Goals:**

- Ícones, barra superior e de status da New UI, árvore de projeto, Executar, janela de Run e a
  reescrita do Java (próximas changes).

## Decisions

### 1. Paleta

| Token (atual ou novo)               | Valor     | Contraste sobre `#1E1F22` |
| ----------------------------------- | --------- | ------------------------- |
| `--cor-editor`, `--cor-fundo-pagina` | `#1E1F22` | -                         |
| `--cor-painel`, barras, faixa de abas | `#2B2D30` | -                       |
| `--cor-linha-atual` (novo)          | `#26282E` | -                         |
| `--cor-linha-selecionada` (árvore)  | `#2E436E` | -                         |
| `--cor-texto`                       | `#BCBEC4` | 8,87                      |
| `--cor-texto-forte` (novo)          | `#DFE1E5` | 12,59                     |
| `--cor-sintaxe-palavra-chave`       | `#CF8E6D` | 6,08                      |
| `--cor-sintaxe-literal` (string)    | `#6AAB73` | 6,03                      |
| `--cor-sintaxe-valor` (número)      | `#2AACB8` | 6,04                      |
| `--cor-sintaxe-anotacao`            | `#B3AE60` | 7,17                      |
| `--cor-sintaxe-campo`               | `#C77DBA` | 5,55                      |
| `--cor-sintaxe-comentario` e marcador | `#8C9097` | 5,14                    |
| `--cor-numero-linha`                | `#6F737A` | 3,46 (texto auxiliar)     |
| `--cor-foco`, `--cor-acento` (novo) | `#3574F0` | só bordas e ícones        |

Os contrastes valem também sobre `#2B2D30` com folga para os textos de interface; o Pincel mede e
registra cada um na note "Design Tokens". O degradê da barra de ferramentas vira cor sólida
(`#2B2D30`), com uma borda inferior `#1E1F22`.

### 2. Tipografia

`@fontsource/inter` (pesos 400 e 500, subset latino, `font-display: swap`) com o token
`--fonte-interface`; `--fonte-mono` continua JetBrains Mono. O `body` passa a usar a fonte de
interface, e o editor e os números de linha usam a mono. Tamanhos: interface 13px, status 12px,
código 14px/22px, números de linha 13px.

### 3. Densidade

Linha da árvore 24px, painel lateral 280px, barra superior 40px, barra de status 24px, faixa de
abas no mesmo ritmo do IntelliJ (~36px), aba com `width: auto` e `padding-inline` que somam 32px
ao nome, editor e abas sem raio (`--raio-editor: 0`). O celular recebe uma escala própria
equivalente (mínimo de 13px no código), conferida no portal "Site Mobile".

### 4. Ajustes nativos

`color-scheme: dark` no `:root`, `<meta name="theme-color" content="#2B2D30">`,
`font-variant-numeric: tabular-nums` nos números de linha e na posição da barra de status, e
`translate="no"` no `<pre>` do editor.

### 5. Trilhas

| Trilha | Quem | Arquivos |
| ------ | ---- | -------- |
| Tokens, fontes e ajustes nativos | Pincel | `src/styles/`, `src/styles.scss`, `src/index.html`, `package.json` (Inter) e estilos pontuais de `layout/` e `shared/` |
| Testes | Sentinela | `*.spec.ts`, `e2e/` |
| Docs e diário | Escriba | `docs/` |

## Risks / Trade-offs

- [Muitos testes fixam cores e tamanhos antigos] → a Sentinela atualiza depois do Pincel, sem
  apagar cenários.
- [Inter aumenta o peso da página] → só dois pesos e o subset latino.
- [Sem as próximas changes, o site fica "meio IntelliJ"] → aceito; cada change vai ao ar
  completa e coerente, e a ordem do ADR-0011 prioriza o maior ganho visual.
