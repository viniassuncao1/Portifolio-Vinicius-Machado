# Tasks

## 1. Tokens e tipografia [Pincel]

- [x] 1.1 Paleta Dark da New UI, acento azul e anel de foco de 2px nos tokens, com o contraste de cada cor registrado na note "Design Tokens" — verificar sem nenhuma ocorrência de `#de60d2` em `src/`
- [x] 1.2 Inter servida pelo site, escala de 13px/14px, densidade (árvore, painel, barras, aba pela largura do nome, editor sem raio) e escala do celular — verificar com capturas `intellij-desktop.png`, `intellij-secao.png` e `intellij-mobile.png`
- [x] 1.3 `color-scheme: dark`, `theme-color`, números tabulares e `translate="no"` no código — verificar no HTML pré-renderizado

## 2. Testes [Sentinela]

- [x] 2.1 Atualizar os testes de cores, tamanhos e foco e cobrir as specs modificadas (fontes locais, escala, acento, ajustes nativos, código sem tradução), com axe — verificar com `npm run test:ci && npm run build && npm run e2e`

## 3. Documentação e integração

- [x] 3.1 [Escriba] `docs/componentes.md`, `docs/arquitetura.md` e a entrada `0010-tokens-e-tipografia-intellij.md` do diário — verificar com `npm run format:check`
- [x] 3.2 [Regente] Revisar, verificar, abrir o PR (com o ADR-0011), arquivar a change no PR e fazer o merge — verificar pelo PR mesclado e pelo deploy
