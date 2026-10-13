# Design

## Context

Títulos já saem da `TitleStrategy`; o `index.html` tem uma descrição fixa. Todas as rotas são
pré-renderizadas, então metadados escritos com `Meta` e `DOCUMENT` durante a renderização vão
para o HTML entregue. Domínio público: `https://portfolio-vinicius-machado.vercel.app`.

## Goals / Non-Goals

**Goals:** metadados corretos no HTML pré-renderizado, imagem de compartilhamento e sitemap
sempre sincronizado com as rotas.

**Non-Goals:** domínio próprio (change futura; só trocar a constante do domínio), imagens
diferentes por seção, analytics.

## Decisions

### 1. Serviço `Seo` em `core/`

Constante `URL_DO_SITE`. A cada navegação (`NavigationEnd`), o serviço lê o título e a
descrição da rota e atualiza `description`, `link[rel=canonical]`, as `og:*` e as `twitter:*`
(com `Meta` e `DOCUMENT`, sem `window`). A página inicial recebe o JSON-LD `Person` num
`<script type="application/ld+json">` (removido nas outras rotas). Páginas internas (`/skills/2`)
usam a descrição da seção.

### 2. Descrições

Campo `descricao` em `Secao` (`core/secoes.ts`) e uma descrição do Início: frases em pt-BR, de
até 160 caracteres, escritas para quem recruta.

### 3. Imagem de compartilhamento

`scripts/gerar-imagem-de-compartilhamento.mjs`: com o Playwright, serve o build, abre a página
inicial numa janela de 1200x630 com movimento reduzido e salva
`public/compartilhamento/portfolio.png`. Versionada; o script atualiza quando o visual mudar.

### 4. Sitemap e robots

`scripts/gerar-sitemap.mjs` percorre `dist/portfolio/browser/**/index.html` depois do `ng build`
e escreve `sitemap.xml` no próprio `dist`; o script `build` passa a ser `ng build && node
scripts/gerar-sitemap.mjs`. `public/robots.txt` estático com a linha `Sitemap:`. A Vercel serve
arquivos existentes antes das regras de reescrita.

### 5. Trilhas

| Trilha | Quem | Arquivos |
| ------ | ---- | -------- |
| Serviço de SEO, JSON-LD, `index.html` e imagem | Pincel | `core/seo*`, `src/index.html`, `app.config.ts`, `scripts/gerar-imagem-de-compartilhamento.mjs`, `public/compartilhamento/` |
| Descrições das seções | Grafite | `core/secoes.ts` (campo `descricao`) e a descrição do Início |
| Sitemap e robots | Nanquim | `scripts/gerar-sitemap.mjs`, `public/robots.txt`, script `build` |
| Testes | Sentinela | `e2e/`, `*.spec.ts` |
| Docs e diário | Escriba | `docs/`, README |

## Risks / Trade-offs

- [Cache do LinkedIn] → o LinkedIn guarda a prévia por um tempo; depois do deploy, usar o Post
  Inspector do LinkedIn para atualizar.
- [Domínio da Vercel mudar] → uma constante só (`URL_DO_SITE`).
