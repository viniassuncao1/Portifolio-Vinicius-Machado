# Proposal

## Why

Mesmo com o cartão em 2400x1260 no ar (PR #37), o LinkedIn Post Inspector continuou mostrando a
prévia borrada. A imagem nova ficou no mesmo endereço da antiga (`/compartilhamento/portfolio.png`)
e o LinkedIn guarda as imagens pelo endereço, então reaproveita a versão antiga do cache.

## What Changes

- A imagem passa a se chamar `portfolio-v2.png`; o número sobe a cada mudança da imagem.
- `core/seo.ts`, o script que gera a imagem, os testes de SEO, o README e `docs/` acompanham; o
  arquivo antigo sai.
- Depois do deploy, revalidar no Post Inspector.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `seo-e-compartilhamento`: imagem num endereço com versão.

## Impact

- `public/compartilhamento/`, `core/seo.ts`, `scripts/gerar-imagem-de-compartilhamento.mjs`,
  `e2e/seo.spec.ts`, README e `docs/arquitetura.md`.
