# Proposal

## Why

O ícone da aba do navegador ainda é o padrão do Angular (o "A" vermelho e roxo), que veio na
criação do projeto e nunca foi trocado. Ele aparece em toda aba, nos favoritos e no atalho da tela
inicial do celular, e não tem nada a ver com o portfólio.

## What Changes

- Novo ícone com as iniciais **VM** num quadrado arredondado, no estilo do ícone de projeto do
  IntelliJ New UI (o mesmo que aparece ao lado do nome do projeto), na cor de acento do site.
- `favicon.svg` (escala sem perder nitidez), `favicon.ico` de reserva (16, 32 e 48 px) e
  `apple-touch-icon.png` (180 px) para o atalho no iPhone, gerados por um script a partir do SVG.
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `seo-e-compartilhamento`: ícone do site.

## Impact

- `public/` (ícones), `src/index.html` (links), script de geração em `scripts/`, testes E2E de
  SEO, README e `docs/`.
