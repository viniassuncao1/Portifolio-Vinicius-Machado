# Design

## Context

As cores estão em `src/styles/_tokens.scss` (paleta do design, sintaxe do IntelliJ, cores do
grafo do Git) e `color-scheme: dark` está em `src/styles.scss`. O `index.html` declara
`theme-color` `#2B2B2B`. O site é SSG: o HTML chega pronto e o Angular hidrata depois, então o
tema precisa ser aplicado por um script inline no `<head>`. Ícones da IntelliJ Platform estão em
`public/icones/new-ui/` só na variante escura. Referência: ADR-0014.

## Goals / Non-Goals

**Goals:**

- Tema claro completo (casca, editor, busca, preview, painel do Git, celular) só por tokens.
- Sem piscar, com escolha guardada e sem quebrar o funcionamento sem JavaScript.

**Non-Goals:**

- Mais temas além de claro e escuro; tema por seção; cartão de compartilhamento claro.

## Decisions

### 1. Tokens

O bloco `:root` atual continua o escuro. O claro fica em `:root[data-tema='claro']` e, sem JS, em
`@media (prefers-color-scheme: light) { :root:not([data-tema]) { … } }` (um mixin evita repetir).
Interface: cinzas claros na mesma hierarquia do design (página mais escura que o painel, editor
mais claro), rosa do design escurecido até 4,5:1 para foco e acento. Sintaxe do IntelliJ Light:
palavra-chave `#0033B3`, texto `#067D17`, número `#1750EB`, anotação `#9E880D`, campo `#871094`,
comentário `#8C8C8C`, escurecendo o que não passar em 4,5:1 (o comentário provavelmente vira
~`#707070`). Cores do grafo do Git com ≥3:1 no claro. O Pincel registra cada contraste na note
"Design Tokens".

### 2. Aplicação e persistência

Script inline no `<head>` do `index.html` (antes dos estilos), com `try/catch`: lê
`localStorage['tema']`; sem valor, usa `matchMedia('(prefers-color-scheme: light)')`; aplica
`data-tema` no `<html>`. Serviço `Tema` (`@Service`) em `core/`: signal com o tema atual lido do
`<html>` (via `DOCUMENT`), `alternar()` grava no `localStorage`, atualiza `data-tema`,
`color-scheme` e a meta `theme-color`. Nenhum acesso a `localStorage`/`matchMedia` no servidor.

### 3. Botão

Na barra de ferramentas, à direita do Buscar: ícone de sol (no escuro) ou lua (no claro), desenhado
em SVG no padrão dos ícones do design; `aria-label` "Usar tema claro"/"Usar tema escuro" e
`aria-pressed` no claro. No celular, ao lado do Buscar.

### 4. Transição

`document.startViewTransition` quando existir e sem movimento reduzido, crossfade curto; sem
suporte ou com movimento reduzido, troca direta. A rota já usa `withViewTransitions`; a troca de
tema não pode conflitar com ela.

### 5. Ícones da IntelliJ Platform

Variante clara (arquivo sem `_dark`) dos 6 ícones em uso, em `public/icones/new-ui/claro/`, e o
`Icone` escolhe pelo tema; créditos atualizados.

## Risks / Trade-offs

- [Script inline e CSP] → não há CSP no `vercel.json` hoje; se entrar, o hash do script vai na
  política.
- [Cor esquecida em algum componente] → o axe e o teste de contraste rodam nos dois temas em
  todas as seções.
- [Hidratação com `data-tema` diferente do pré-render] → o atributo é só no `<html>`, fora da
  árvore do Angular; o serviço lê o valor em vez de recalcular.

## Faixas da equipe

| Faixa     | Quem      | O quê                                                     |
| --------- | --------- | --------------------------------------------------------- |
| Paleta    | Pincel    | Tokens do claro, contrastes, ícones claros, botão         |
| Mecanismo | Nanquim   | Script inline, serviço `Tema`, `theme-color`, sem JS      |
| Movimento | Compasso  | View Transition da troca, reduced-motion                  |
| Testes    | Sentinela | Os dois temas em axe e contraste, persistência, sem piscar |
| Docs      | Escriba   | README, `docs/`, diário 0013                              |
