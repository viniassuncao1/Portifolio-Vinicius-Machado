# Tasks

## 1. Dados [Nanquim]

- [x] 1.1 Título do PR no histórico gerado no build e funções puras de resumo (tipos, últimos PRs, últimos commits de código) com testes — verificar com `npm run test:ci`

## 2. Página [Grafite]

- [x] 2.1 Feature `repositorio` (rota, aba, cabeçalho, números, tipos, PRs, commits, link para tudo), `master` e Commit abrindo a aba, remoção do painel antigo e da área de baixo dividida — verificar com capturas `repositorio-desktop.png` e `repositorio-mobile.png` nos dois temas

## 3. Testes [Sentinela]

- [ ] 3.1 Cobrir as specs (aba, carregamento sob demanda, erro, links externos, `master` e Commit, Run sozinho embaixo, axe nos dois temas, celular) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 4. Documentação e integração

- [x] 4.1 [Escriba] ADR-0016, README, `docs/` e a entrada do diário — verificar com `npm run format:check`
- [ ] 4.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
