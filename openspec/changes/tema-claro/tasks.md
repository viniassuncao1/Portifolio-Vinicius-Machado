# Tasks

## 1. Mecanismo [Nanquim]

- [ ] 1.1 Script inline no `index.html` e serviço `Tema` em `core/` (signal, `alternar()`, `localStorage`, `data-tema`, `color-scheme`, `theme-color`), sem acesso ao navegador no servidor, com testes — verificar com `npm run test:ci` e recarregando no portal

## 2. Visual [Pincel]

- [ ] 2.1 Tokens do tema claro (interface, sintaxe IntelliJ Light, grafo do Git) com fallback sem JS e contrastes na note "Design Tokens" — verificar com capturas `claro-desktop.png` e `claro-mobile.png`
- [ ] 2.2 Botão de tema na barra (desktop e celular) e ícones claros da IntelliJ Platform com créditos — verificar com captura `claro-barra.png`

## 3. Movimento [Compasso]

- [ ] 3.1 Troca de tema com View Transition curta, imediata em reduced-motion — verificar no portal

## 4. Testes [Sentinela]

- [ ] 4.1 Cobrir as specs (sistema no claro, sem JS, persistência ao recarregar, sem piscar, botão, axe e contraste em todas as seções nos dois temas, painel do Git e preview no claro) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 5. Documentação e integração

- [ ] 5.1 [Escriba] README, `docs/` e a entrada `0013-tema-claro.md` do diário — verificar com `npm run format:check`
- [ ] 5.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
