# Tasks

## 1. Ícones [Pincel]

- [x] 1.1 Copiar os SVGs da New UI (tema escuro) usados para `public/icones/new-ui/` com `CREDITOS.md` (origem, copyright, Apache 2.0) e sem logotipos — verificar pela lista de arquivos e pelo README
- [x] 1.2 Trocar `shared/icone` e os ícones da árvore e das abas pelos oficiais — verificar com captura `new-ui-arvore.png`

## 2. Dados e build [Grafite e Nanquim]

- [x] 2.1 [Grafite] Campo `pacote` em `Secao` e função que monta os breadcrumbs — verificar com teste unitário
- [x] 2.2 [Nanquim] `scripts/gerar-informacoes-do-build.mjs` (SHA de `GITHUB_SHA`/`VERCEL_GIT_COMMIT_SHA`), ligado a `build`, `start` e testes, com o arquivo gerado no `.gitignore` — verificar com `GITHUB_SHA=abc1234def npm run build` e o SHA no HTML

## 3. Moldura [Pincel]

- [x] 3.1 Barra superior (projeto, branch, configuração de execução, Executar, Depurar, Buscar, Configurações) — verificar com captura `new-ui-desktop.png`
- [x] 3.2 Faixa de ferramentas com Projeto mostrando e escondendo o painel, e cabeçalho "Projeto" — verificar com captura `new-ui-sem-painel.png`
- [x] 3.3 Barra de status com breadcrumbs, `linha:coluna`, `LF`, `UTF-8`, `4 spaces`, `master` e o commit — verificar com captura `new-ui-status.png`
- [x] 3.4 Celular: barra compacta com Projeto abrindo a gaveta e Buscar — verificar com captura `new-ui-mobile.png`

## 4. Testes [Sentinela]

- [x] 4.1 Cobrir as specs (barra superior, faixa, controles decorativos fora do foco, status, commit, celular) com axe — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 5. Documentação e integração

- [x] 5.1 [Escriba] README (créditos dos ícones), `docs/componentes.md`, `docs/arquitetura.md` e a entrada `0011-barras-e-icones-da-new-ui.md` do diário — verificar com `npm run format:check`
- [ ] 5.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
