# Proposal

## Why

O [ADR-0011](../../../docs/adr/0011-identidade-visual-intellij-new-ui.md) troca a identidade
visual do Eclipse pelo IntelliJ IDEA New UI. O primeiro passo, com o maior ganho visual e o
menor risco, é trocar os tokens: hoje tudo está grande demais para uma IDE (árvore em 16px com
linhas de 33px, painel de 395px, abas de 294px fixos, editor com raio de 18px) e as cores são as
do Eclipse, com um rosa (`#de60d2`) como acento.

## What Changes

- **Paleta Dark da New UI:** editor `#1E1F22`, painéis e barras `#2B2D30`, linha atual
  `#26282E`, seleção na árvore `#2E436E`, texto `#BCBEC4`, texto forte `#DFE1E5`, e as cores de
  sintaxe do IntelliJ (palavra-chave `#CF8E6D`, string `#6AAB73`, número `#2AACB8`, anotação
  `#B3AE60`, campo `#C77DBA`, comentário `#8C9097`), todas com contraste AA medido.
- **Um único acento**, o azul `#3574F0`, e foco visível como anel azul de 2px em todos os
  controles. O rosa sai.
- **Tipografia:** interface (árvore, abas e barras) em **Inter 13px**, servida pelo próprio
  site; código em **JetBrains Mono 14px**, linha de 22px; números de linha em 13px.
- **Densidade:** linha da árvore de 24px, painel lateral de 280px, aba com a largura do nome
  mais 32px, barra superior de 40px com cor sólida (sem degradê), barra de status de 24px com
  texto de 12px, editor sem raio.
- **Ajustes nativos:** `color-scheme: dark`, `theme-color` `#2B2D30`, números tabulares nos
  números de linha e na posição do cursor, e `translate="no"` no código.
- Entrada 0010 do diário.

Fora do escopo: ícones, barra superior e de status da New UI, árvore de projeto Spring,
Executar e janela de Run (próximas changes do ADR-0011).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `sistema-visual`: a referência passa a ser o IntelliJ New UI; duas fontes servidas pelo site;
  nova escala; acento único e foco; ajustes nativos do navegador.
- `editor-de-codigo`: o código não é traduzido pelo tradutor automático do navegador.

## Impact

- Código: `src/styles/_tokens.scss`, `src/styles.scss` (fontes, `color-scheme`),
  `src/index.html` (`theme-color`), a dependência `@fontsource/inter` e ajustes pontuais de
  estilo em `layout/` e `shared/` onde houver medida fixa fora dos tokens.
- Testes: os que fixam cores, tamanhos e o acento rosa passam a conferir os valores novos.
- Documentação: `docs/componentes.md` (tokens), `docs/arquitetura.md` e a entrada 0010 do diário.
