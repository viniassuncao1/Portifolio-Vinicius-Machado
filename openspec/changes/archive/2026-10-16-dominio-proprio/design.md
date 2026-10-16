# Design

## Context

`URL_DO_SITE` em `core/seo.ts` alimenta o canônico, o `og:url` e os dados estruturados de cada
página. O sitemap tem a própria constante `DOMINIO` e o `robots.txt` é estático. O cartão de
compartilhamento é gerado a partir de `scripts/compartilhamento/cartao.html` por
`scripts/gerar-imagem-de-compartilhamento.mjs`. O domínio já responde pela Vercel.

## Goals / Non-Goals

**Goals:**

- Um endereço só para buscadores e redes sociais: o domínio próprio.

**Non-Goals:**

- Trocar o texto `ViniciusMachado.java` do cartão.

## Decisions

### 1. Uma fonte da URL

`URL_DO_SITE` continua sendo a fonte no Angular. O script do sitemap mantém a constante dele (é
Node e roda antes do build), com um comentário apontando para `core/seo.ts`, e um teste unitário
compara as duas, para não divergirem de novo.

### 2. Redirecionamento do endereço antigo

Na Vercel, o domínio `portfolio-vinicius-machado.vercel.app` do projeto passa a redirecionar
(308) para `https://vinimachado.wattscompany.com.br`, mantendo o caminho. Os deploys de preview
continuam nos endereços próprios deles.

## Risks / Trade-offs

- [Prévias antigas no LinkedIn] → revalidar no Post Inspector depois do deploy.

## Faixas da equipe

| Faixa  | Quem      | O quê                                                   |
| ------ | --------- | ------------------------------------------------------- |
| Código | Nanquim   | `seo.ts`, sitemap, robots, cartão e a imagem gerada     |
| Testes | Sentinela | Unitários e E2E do SEO                                  |
| Docs   | Escriba   | README, `docs/`, diário                                 |
| Vercel | Regente   | Redirecionamento do `.vercel.app` para o domínio novo   |
