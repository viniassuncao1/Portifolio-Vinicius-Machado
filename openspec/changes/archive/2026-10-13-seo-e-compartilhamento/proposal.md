# Proposal

## Why

O portfólio vai ser divulgado no LinkedIn, e hoje o link compartilhado aparece sem imagem e sem
resumo: o site só tem título e uma descrição genérica. Buscadores também não recebem sitemap,
endereço canônico nem dados estruturados.

## What Changes

- **Cartão de compartilhamento** (Open Graph e Twitter/X): título, descrição, imagem 1200x630 e
  endereço de cada página, para o link aparecer com imagem e resumo no LinkedIn, WhatsApp e X.
- **Descrição própria por seção**, em pt-BR, até 160 caracteres.
- **Endereço canônico** em cada página, a partir do domínio público
  `https://portfolio-vinicius-machado.vercel.app`.
- **Dados estruturados** (JSON-LD `Person`) com nome, cargo, links do LinkedIn e do GitHub e a
  stack principal.
- **`sitemap.xml`** gerado no build a partir das páginas pré-renderizadas e **`robots.txt`**.
- **Imagem de compartilhamento** gerada a partir da própria IDE do portfólio, por script.
- Entrada 0009 do diário.

## Capabilities

### New Capabilities

- `seo-e-compartilhamento`: metadados de busca e de compartilhamento, sitemap, robots e dados
  estruturados.

### Modified Capabilities

Nenhuma.

## Impact

- Código: serviço de SEO em `core/`, campo `descricao` em `core/secoes.ts`, `src/index.html`,
  `public/robots.txt`, `public/compartilhamento/`, scripts em `scripts/` e o script `build` do
  `package.json`.
- Testes: E2E dos metadados no HTML pré-renderizado, do sitemap e do robots.
- Documentação: `docs/arquitetura.md`, README e entrada 0009 do diário.
