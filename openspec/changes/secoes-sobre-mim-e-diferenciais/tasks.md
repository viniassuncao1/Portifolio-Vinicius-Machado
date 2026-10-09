# Tasks

Responsável entre colchetes.

## 1. Preparação [Regente]

- [x] 1.1 Criar a branch `feat/secoes-sobre-mim-e-diferenciais` e preencher a note "Change Atual" — verificar pela note no canvas

## 2. Papel de valor literal [Pincel, depois Sentinela]

- [x] 2.1 Adicionar o papel `valor`, a construtora `valor()` e o token `--cor-sintaxe-valor` (`#4fafac`), e registrar na note "Design Tokens" — verificar com `npm run test:ci && npm run build`
- [x] 2.2 [Sentinela] Cobrir o papel `valor` nos testes do editor (cor e contraste do token) — verificar com `npm run test:ci`

## 3. Seções [Pincel, depois Sentinela]

- [x] 3.1 Criar `features/sobre-mim/` com o conteúdo da tela 02 e trocar a rota — verificar comparando com `tela-02.png` no portal "Site Desktop" e salvar `.maestri/capturas/sobre-mim-desktop.png`
- [x] 3.2 Criar `features/diferenciais/` com o conteúdo da tela 03 e trocar a rota — verificar comparando com `tela-03.png` no portal e salvar `.maestri/capturas/diferenciais-desktop.png`
- [x] 3.3 [Sentinela] Testes unitários e E2E das duas seções (código, parágrafo, cores, item atual na árvore, sem JavaScript) — verificar com `npm run test:ci && npm run build && npm run e2e`

## 4. Documentação [Escriba]

- [x] 4.1 Atualizar `docs/componentes.md` com o papel `valor` e as duas seções como exemplo — verificar com `npm run format:check`
- [x] 4.2 Escrever a entrada `0003-secoes-sobre-mim-e-diferenciais.md` do diário com capturas e rascunho de post — verificar que está no índice

## 5. Integração [Regente]

- [x] 5.1 Revisar os diffs e rodar `npm run lint && npm run test:ci && npm run build && npm run e2e` — verificar pela saída dos comandos
- [ ] 5.2 Abrir o PR, esperar o CI verde, fazer o merge sem apagar a branch e arquivar a change — verificar pelo PR mesclado e pelo deploy de produção
