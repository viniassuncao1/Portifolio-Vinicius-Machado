# Design

## Context

`src/index.html` aponta para `favicon.ico`, que é o do Angular. O IntelliJ New UI mostra cada
projeto com um quadrado arredondado colorido com as iniciais (o widget do projeto na barra
superior). O acento do site é `#DE60D2` (escuro) e `#9A2A8C` (claro).

## Goals / Non-Goals

**Goals:**

- Ícone reconhecível em 16 px, coerente com a identidade de IDE.

**Non-Goals:**

- Manifesto de PWA, ícones por tema do sistema.

## Decisions

### 1. Desenho

Quadrado arredondado (raio de ~22% do lado, como os ícones de projeto do IntelliJ) preenchido com
o acento `#9A2A8C` (contraste melhor com letras brancas e legível sobre abas claras e escuras),
"VM" em branco, Inter 600 convertida em contornos no SVG (não depende de fonte instalada), letras
ocupando ~55% da largura, levemente apertadas. Sem borda nem sombra.

### 2. Arquivos

`public/favicon.svg` é a fonte. Um script (`scripts/gerar-icones.mjs`, Playwright como o do cartão)
renderiza o SVG em PNG 16, 32, 48 e 180 px; o `.ico` reúne 16, 32 e 48. Em `src/index.html`:
`<link rel="icon" href="favicon.svg" type="image/svg+xml">`, `<link rel="icon" href="favicon.ico"
sizes="any">` e `<link rel="apple-touch-icon" href="apple-touch-icon.png">`.

## Risks / Trade-offs

- [Cache do ícone antigo no navegador] → some sozinho; o nome `favicon.ico` é mantido pelos
  navegadores que pedem esse caminho direto.

## Faixas da equipe

| Faixa   | Quem      | O quê                                            |
| ------- | --------- | ------------------------------------------------ |
| Ícone   | Pincel    | SVG, script de geração, `.ico`, PNG e `index.html` |
| Testes  | Sentinela | E2E dos links e dos arquivos                     |
| Docs    | Escriba   | README, `docs/`, diário                          |
