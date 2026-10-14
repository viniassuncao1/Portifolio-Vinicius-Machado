# Tasks

## 1. Tela [Compasso]

- [x] 1.1 Tela de boas-vindas (composição, tokens nos dois temas, `inert`, uma vez por sessão) e fim da abertura automática da janela de Run, com o aviso na barra de status — verificar com capturas `boas-vindas-desktop.png` e `boas-vindas-mobile.png` nos dois temas

## 2. Movimento [Compasso]

- [x] 2.1 Barra de progresso com as etapas do Spring, mínimo de 0,6 s, teto de 2 s, fade de saída e movimento reduzido — verificar no portal

## 3. Testes [Sentinela]

- [ ] 3.1 Cobrir as specs (primeira visita, mesma sessão, duração mínima e teto, movimento reduzido, conteúdo no HTML pré-renderizado, foco, axe nos dois temas, celular, Run só pelo Executar) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 4. Documentação e integração

- [x] 4.1 [Escriba] ADR-0015, README, `docs/` e a entrada do diário — verificar com `npm run format:check`
- [ ] 4.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
