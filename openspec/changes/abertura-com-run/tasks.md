# Tasks

## 1. Base [Nanquim]

- [x] 1.1 Mover o log do Spring para `core/log-do-spring.ts` (usado pela abertura e pela janela de Run) e criar a linha do tempo da abertura com a lista de classes derivada de `secoes.ts`, com testes — verificar com `npm run test:ci`

## 2. Visual [Pincel]

- [x] 2.1 Cartão, widget de Run e janela Build/Run (layout `layout/abertura/`), nos dois temas e no celular — verificar com capturas `abertura-*.png` em cada fase

## 3. Movimento [Compasso]

- [x] 3.1 Serviço `Abertura` com as fases, execução automática, coreografia, recolher para a barra de status, entrada dos painéis, script inline, movimento reduzido e remoção da tela de boas-vindas antiga — verificar no portal

## 4. Testes [Sentinela]

- [ ] 4.1 Cobrir as specs (fases e tempos com relógio, execução automática, sem pular, link direto, sessão, movimento reduzido, sem JavaScript, foco, axe em cada fase nos dois temas e no celular) — verificar com `npm run lint && npm run test:ci && npm run build && npm run e2e`

## 5. Documentação e integração

- [x] 5.1 [Escriba] ADR-0017, README, `docs/` e a entrada do diário — verificar com `npm run format:check`
- [ ] 5.2 [Regente] Revisar, abrir o PR, arquivar a change e fazer o merge — verificar pelo PR mesclado e pelo deploy
