# Tasks

## 1. Conteúdo [Grafite e Nanquim]

- [ ] 1.1 [Grafite] Skills, Experiências e Projeto 5 num arquivo só — verificar com `npm run test:ci`
- [x] 1.2 [Nanquim] Projeto 4 e Certificações num arquivo só — verificar com `npm run test:ci`

## 2. Casca [Pincel]

- [ ] 2.1 Remover o controle de páginas e `paginas` de `core/secoes.ts`, redirecionar `/<seção>/<n>` para `/<seção>`, ajustar título da janela, sitemap e busca — verificar com `npm run build` (sitemap) e capturas

## 3. Testes [Sentinela]

- [ ] 3.1 Cobrir as specs (5 seções inteiras, sem controle de páginas, endereços antigos redirecionam, sitemap, axe nos dois temas, celular) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 4. Documentação e integração

- [x] 4.1 [Escriba] ADR-0018, README, `docs/` e a entrada do diário — verificar com `npm run format:check`
- [ ] 4.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
