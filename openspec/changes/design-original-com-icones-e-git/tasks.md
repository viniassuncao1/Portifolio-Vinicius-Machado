# Tasks

## 1. Ícones [Pincel]

- [x] 1.1 Copiar os SVGs da New UI (tema escuro) usados para `public/icones/new-ui/` com `CREDITOS.md` (origem, copyright, Apache 2.0) e sem logotipos — verificar pela lista de arquivos e pelo README
- [x] 1.2 Trocar `shared/icone` e os ícones da árvore e das abas pelos oficiais — verificar com captura `new-ui-arvore.png`
- [x] 1.3 Variante clara dos ícones da barra de ferramentas, com a tabela de créditos atualizada — verificar com captura `design-barra.png`

## 2. Dados e build [Grafite e Nanquim]

- [x] 2.1 [Grafite] Campo `pacote` em `Secao` e função que monta os breadcrumbs — verificar com teste unitário
- [x] 2.2 [Nanquim] `scripts/gerar-informacoes-do-build.mjs` (SHA de `SHA_DO_COMMIT`/`GITHUB_SHA`/`VERCEL_GIT_COMMIT_SHA`), ligado a `build`, `start` e testes, com o arquivo gerado no `.gitignore` — verificar com `GITHUB_SHA=abc1234def npm run build` e o SHA no HTML

## 3. Visual do design [Pincel]

- [x] 3.1 Barra superior, faixa de ferramentas, painel escondível, barra de status e celular (primeira versão, estilo New UI)
- [x] 3.2 Tokens do design de volta (paleta, degradê, controles de janela, raios, abas, foco rosa, `theme-color`), mantendo tipografia e densidade — verificar com captura `design-desktop.png` lado a lado com `tela-05.png`
- [x] 3.3 Barra de ferramentas do design com os ícones claros, `master`, Executar e Buscar; cabeçalho `Portfolio_Vinicius` de volta — verificar com captura `design-barra.png`
- [x] 3.4 Faixa, status e celular nas cores do design — verificar com capturas `design-status.png` e `design-mobile.png`

## 3b. Ajustes pedidos pelo Vinicius (usar as skills ECC de design: design-taste-frontend, web-design-guidelines, redesign-existing-projects, angular-developer)

- [x] 3.5 [Compasso] Árvore em pastas (`sobre`, `skills`, `experiencias`, `projetos`, `formacao`, `recomendacoes`, `contato`) a partir do campo `pacote`, com pastas que expandem e recolhem (`aria-expanded`, teclado, reduced-motion) e a pasta da seção aberta expandida — verificar com captura `arvore-pastas.png`
- [x] 3.6 [Pincel] Cores de sintaxe do Java do IntelliJ de volta no editor, com contraste ≥4,5:1 sobre o fundo do design — verificar com captura `sintaxe-java.png`
- [x] 3.7 [Pincel] Executar na calha (▶ na linha `public class`) nos projetos com site, no lugar do botão "▶ Executar" sobre o código — verificar com captura `executar-calha.png`

- [x] 3.8 [Pincel] Ícones do design (`public/icones/*.svg`, estilo das telas) na árvore em pastas, nos arquivos, nas abas e na barra de ferramentas; IntelliJ só no ▶ da calha, na branch e na faixa; créditos ajustados — verificar com captura `icones-design.png` ao lado de `tela-05.png`
- [x] 3.9 [Pincel] Barra de ferramentas escura nos cinzas do design (sem o degradê claro), com ícones, `master` e controles de janela legíveis e foco rosa — verificar com captura `barra-escura.png`

## 4. Testes [Sentinela]

- [x] 4.1 Cobrir as specs da primeira versão com axe
- [x] 4.2 Trocar os valores esperados pelos do design (cores, foco, degradê, cabeçalho, barra) e cobrir os cenários novos — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 5. Documentação e integração

- [x] 5.1 [Escriba] README (créditos dos ícones), `docs/componentes.md`, `docs/arquitetura.md` e a entrada 0011 do diário (primeira versão)
- [x] 5.2 [Escriba] Reescrever docs e a entrada 0011 do diário com a virada de rumo (ADR-0012) — verificar com `npm run format:check`
- [ ] 5.3 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
