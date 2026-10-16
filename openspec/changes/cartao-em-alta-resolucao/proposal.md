# Proposal

## Why

No LinkedIn Post Inspector, a prévia do cartão de compartilhamento aparece borrada (captura do
Vinicius em 16/10). O arquivo publicado é nítido em 1200x630, mas o LinkedIn reprocessa e comprime
a imagem, e em telas de alta densidade a versão comprimida ainda é ampliada.

## What Changes

- O cartão passa a ser gerado em resolução dupla, **2400x1260** (mesma proporção 1,91:1 e mesmo
  layout), e as marcações `og:image:width`/`og:image:height` acompanham.
- O peso continua pequeno (PNG de cores chapadas, bem abaixo do limite de 5 MB do LinkedIn).
- Depois do deploy, revalidar no Post Inspector.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `seo-e-compartilhamento`: imagem de compartilhamento em 2400x1260.

## Impact

- `scripts/gerar-imagem-de-compartilhamento.mjs` (`deviceScaleFactor: 2`), `core/seo.ts`
  (largura e altura), `public/compartilhamento/portfolio.png`, testes de SEO e a documentação.
