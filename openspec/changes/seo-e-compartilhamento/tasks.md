# Tasks

## 1. Implementação [Pincel, Grafite e Nanquim, em paralelo]

- [ ] 1.1 [Grafite] Campo `descricao` nas 15 seções e descrição do Início — verificar com `npm run build`
- [ ] 1.2 [Pincel] Serviço `Seo` (descrição, canônico, Open Graph, Twitter/X), JSON-LD `Person` no Início e `index.html` — verificar no HTML pré-renderizado
- [ ] 1.3 [Pincel] Script e imagem `public/compartilhamento/portfolio.png` (1200x630) — verificar abrindo a imagem
- [ ] 1.4 [Nanquim] `scripts/gerar-sitemap.mjs`, `public/robots.txt` e script `build` — verificar `dist/portfolio/browser/sitemap.xml` com 24 páginas

## 2. Testes [Sentinela]

- [ ] 2.1 E2E dos metadados por página sem JavaScript, do JSON-LD, da imagem (1200x630), do sitemap e do robots — verificar com `npm run test:ci && npm run build && npm run e2e`

## 3. Documentação e integração

- [ ] 3.1 [Escriba] `docs/arquitetura.md`, README (como atualizar a prévia no LinkedIn) e entrada `0009-seo-e-compartilhamento.md` do diário — verificar com `npm run format:check`
- [ ] 3.2 [Regente] Verificar, abrir o PR, arquivar a change no PR, fazer o merge e conferir a prévia no ar — verificar pelo PR mesclado e pelos metadados em produção
