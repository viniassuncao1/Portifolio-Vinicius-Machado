# Tasks

Responsável entre colchetes. Ordem: grupo 2 primeiro; depois os grupos 3 a 6 em paralelo; o 7
acompanha cada trilha; o 8 roda em paralelo desde o início.

## 1. Preparação [Regente]

- [x] 1.1 Criar a branch `feat/experiencia-de-ide-e-java-moderno` e preencher a note "Change Atual" — verificar pela note
- [x] 1.2 Criar o papel "Seções" a partir de `papeis/secoes.md` e recrutar Grafite e Nanquim conectados às notes — verificar com `maestri list`

## 2. Base [Pincel]

- [x] 2.1 Papel `comentario` com token de cor e `href` opcional em `Trecho`, renderizado como link — verificar com testes unitários mínimos
- [x] 2.2 Campo `arquivo` em `Secao` (e no Início) e os serviços `AbasAbertas` e `EstadoDoEditor` em `core/` — verificar com testes unitários mínimos e `npm run build`

## 3. Casca de IDE [Pincel]

- [x] 3.1 `FaixaDeAbas` no lugar de `AbaDoEditor` (abrir, alternar, fechar, teclado, sessão) — verificar no portal e com captura `abas-desktop.png`
- [x] 3.2 `BarraDeStatus` — verificar no portal (arquivo, linha:coluna, UTF-8, Java 21, main)
- [x] 3.3 `BuscaDeSecoes` com Ctrl/Cmd+P, botão e filtro sem acento, e árvore navegável por setas — verificar no portal desktop e celular

## 4. Movimento [Compasso]

- [x] 4.1 Digitação na primeira abertura (≤ 1,5 s, pulável, conteúdo completo no DOM, desligada com movimento reduzido) — verificar no portal e com teste do estado reduzido
- [x] 4.2 Cursor piscando, linha atual destacada e clique na linha atualizando `EstadoDoEditor`; transições da faixa de abas — verificar no portal

## 5. Seções publicadas em Java moderno [Grafite]

- [x] 5.1 Reescrever Início, Sobre Mim, Diferenciais, Como uso a IA e Skills em Java moderno, preservando as informações — verificar com capturas em `.maestri/capturas/` e `npm run build`

## 6. Seções novas [Nanquim]

- [x] 6.1 Experiências em 3 páginas (telas 07 a 09) — verificar com captura
- [x] 6.2 Eventos, Formação e Idiomas — verificar com capturas
- [x] 6.3 Contato com links reais (`mailto:`, `tel:`, `https://`) — verificar no portal
- [x] 6.4 Registrar as cinco seções em `app.routes.ts` e `paginas: 3` em Experiências — verificar que `npm run build` pré-renderiza as rotas novas

## 7. Testes [Sentinela]

- [x] 7.1 Testes da Base e da Casca (abas, status, busca, árvore por setas), unitários e E2E — verificar com `npm run test:ci && npm run e2e`
- [x] 7.2 Testes do Movimento (digitação, pular, movimento reduzido, leitor de tela, cursor e linha) — verificar com `npm run test:ci && npm run e2e`
- [x] 7.3 Testes das dez seções (informações preservadas, Java válido nos trechos, links do Contato) e axe em todas as rotas — verificar com `npm run test:ci && npm run build && npm run e2e`

## 8. Documentação [Escriba]

- [x] 8.1 ADR-0010 (design como referência e Java moderno), atualizar `CLAUDE.md` e o índice de ADRs — verificar com `npm run format:check`
- [x] 8.2 `papeis/secoes.md`, composição e trilhas no README da equipe — verificar com `npm run format:check`
- [x] 8.3 `docs/componentes.md` e `docs/arquitetura.md` (abas, status, busca, digitação, papéis, links) — verificar que os nomes batem com o código
- [x] 8.4 Entrada `0005-experiencia-de-ide-e-java-moderno.md` do diário com capturas e rascunho de post — verificar que está no índice

## 9. Integração [Regente]

- [x] 9.1 Revisar os diffs e rodar `npm run lint && npm run test:ci && npm run build && npm run e2e` — verificar pela saída
- [x] 9.2 Abrir o PR, arquivar a change no próprio PR, esperar o CI verde e fazer o merge sem apagar a branch — verificar pelo PR mesclado e pelo deploy de produção
