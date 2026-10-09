# Tasks

Responsável entre colchetes.

## 1. Preparação [Regente]

- [ ] 1.1 Criar a branch `feat/secoes-como-uso-ia-e-skills` e preencher a note "Change Atual" — verificar pela note no canvas

## 2. Páginas de seção [Pincel, depois Sentinela]

- [ ] 2.1 Adicionar `paginas` em `Secao`, gerar as rotas `<slug>/N` com `data` de página, ligar `withComponentInputBinding` e acrescentar `(X/N)` no título — verificar que `npm run build` pré-renderiza as rotas novas
- [ ] 2.2 Criar o componente `PaginasDaSecao` em `shared/` (controle `◂ X/N ▸` acessível, só tokens, oculto com uma página) — verificar com teste unitário mínimo e captura no portal

## 3. Seções [Pincel, depois Sentinela]

- [ ] 3.1 Criar `features/como-uso-ia/` com o conteúdo da tela 04 e registrar a rota — verificar comparando com `tela-04.png` no portal e salvar `.maestri/capturas/como-uso-ia-desktop.png`
- [ ] 3.2 Criar `features/skills/` com duas páginas (telas 05 e 06), `paginas: 2` em `SECOES` e registrar a rota — verificar comparando com `tela-05.png` e `tela-06.png` e salvar `skills-1-desktop.png`, `skills-2-desktop.png` e `skills-mobile.png`
- [ ] 3.3 [Sentinela] Testes unitários e E2E: páginas (endereços, controle, teclado, leitor de tela, `/skills/9`, título, árvore), as duas seções e o axe em `/skills/2` — verificar com `npm run test:ci && npm run build && npm run e2e`

## 4. Documentação [Escriba]

- [ ] 4.1 Atualizar `docs/componentes.md` com `PaginasDaSecao` e como criar uma seção com várias páginas — verificar com `npm run format:check`
- [ ] 4.2 Escrever a entrada `0004-secoes-como-uso-ia-e-skills.md` do diário com capturas e rascunho de post — verificar que está no índice

## 5. Integração [Regente]

- [ ] 5.1 Revisar os diffs e rodar `npm run lint && npm run test:ci && npm run build && npm run e2e` — verificar pela saída dos comandos
- [ ] 5.2 Abrir o PR, arquivar a change no próprio PR, esperar o CI verde e fazer o merge sem apagar a branch — verificar pelo PR mesclado e pelo deploy de produção
