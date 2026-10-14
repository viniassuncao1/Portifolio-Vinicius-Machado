# Tasks

## 1. Dados [Nanquim e Grafite]

- [ ] 1.1 [Grafite] Tipos do histórico e `calcularFaixas` em `src/app/core/git/` (faixa e arestas por commit) com testes de linha reta, merge, branches paralelas e lista vazia — verificar com `npm run test:ci`
- [ ] 1.2 [Nanquim] `scripts/gerar-historico-do-git.mjs` (sem e-mail, PR e branch nos merges, lista vazia em clone raso), ligado aos pre-scripts, JSON no `.gitignore` — verificar com `npm run build` e `jq '.commits | length' dist/**/git/historico.json`
- [ ] 1.3 [Nanquim] `fetch-depth: 0` nos jobs de build do CI — verificar no PR

## 2. Painel [Pincel e Compasso]

- [ ] 2.1 [Pincel] Serviço do painel (aberto/fechado, carregamento sob demanda, erro e tentar de novo) e o painel com grafo, lista e detalhes no visual do design — verificar com captura `git-desktop.png`
- [ ] 2.2 [Pincel] `master` e Commit como botões reais; Esc e foco de volta; celular em tela cheia — verificar com captura `git-mobile.png`
- [ ] 2.3 [Compasso] Abrir e fechar o painel com transição curta, sem animação em reduced-motion — verificar no portal

## 3. Testes [Sentinela]

- [ ] 3.1 Cobrir as specs (histórico sem e-mail, clone raso, nenhuma requisição até abrir, merge com link do PR, teclado, Esc, celular, axe) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 4. Documentação e integração

- [ ] 4.1 [Escriba] README, `docs/arquitetura.md`, `docs/componentes.md` e a entrada `0012-painel-do-git.md` do diário — verificar com `npm run format:check`
- [ ] 4.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
