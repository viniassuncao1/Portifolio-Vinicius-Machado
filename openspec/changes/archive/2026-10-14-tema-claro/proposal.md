# Proposal

## Why

O Vinicius pediu um tema claro. O design original só tem a versão escura, e muita gente lê
conteúdo longo melhor em fundo claro (ou usa o sistema no claro durante o dia). Como todas as
cores já vêm de tokens, dá para oferecer os dois temas sem mudar componentes
([ADR-0014](../../../docs/adr/0014-tema-claro.md)).

## What Changes

- **Tokens do tema claro** em `:root[data-tema='claro']`: interface derivada da paleta do design
  e sintaxe do IntelliJ Light, tudo com contraste AA.
- **Botão de tema** na barra de ferramentas (sol/lua), com nome acessível e `aria-pressed`; a
  escolha fica no `localStorage`; na primeira visita vale `prefers-color-scheme`.
- **Sem piscar:** script inline mínimo no `index.html` aplica o tema antes da primeira pintura;
  sem JavaScript, o CSS segue o tema do sistema.
- **Troca suave** com a View Transitions API (crossfade), sem animação em movimento reduzido.
- `theme-color` e `color-scheme` acompanham o tema; ícones da IntelliJ Platform na variante
  clara no tema claro; painel do Git, busca, janela de preview e celular nos dois temas.
- Entrada 0013 do diário.

## Capabilities

### New Capabilities

- `tema-claro`: escolha, persistência e aplicação do tema.

### Modified Capabilities

- `sistema-visual`: ajustes nativos acompanham o tema; ícones com variante clara.
- `barra-superior`: botão de tema entre as ações.

## Impact

- Código: `src/styles/_tokens.scss`, `src/index.html`, `src/app/core/` (serviço de tema),
  `layout/barra-de-ferramentas`, `shared/icone`, `public/icones/new-ui/` (variante clara).
- Testes: contraste e axe nos dois temas, persistência, sem piscar, sem JS.
- Documentação: ADR-0014, README, `docs/` e diário 0013.
