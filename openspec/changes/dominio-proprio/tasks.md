# Tasks

## 1. Código [Nanquim]

- [ ] 1.1 Domínio novo em `core/seo.ts`, `scripts/gerar-sitemap.mjs` (com teste que compara as duas URLs), `public/robots.txt` e no cartão de compartilhamento, gerando a imagem de novo — verificar com `npm run build` (sitemap e HTML com o canônico novo) e `npm run test:ci`

## 2. Testes [Sentinela]

- [ ] 2.1 Ajustar os E2E de SEO ao domínio novo — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 3. Documentação e integração

- [x] 3.1 [Escriba] README, `docs/` e a entrada do diário — verificar com `npm run format:check`
- [ ] 3.2 [Regente] Redirecionar o `.vercel.app` na Vercel, revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado, pelo deploy e pelo redirecionamento
