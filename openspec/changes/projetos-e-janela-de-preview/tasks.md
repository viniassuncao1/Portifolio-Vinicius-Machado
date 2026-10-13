# Tasks

Responsável entre colchetes. Grupos 2 e 4 em paralelo; o 3 depois do 2; 5 e 6 acompanham.

## 1. Preparação [Regente]

- [ ] 1.1 Criar a branch `feat/projetos-e-janela-de-preview` e preencher a note "Change Atual" — verificar pela note

## 2. Janela de preview [Pincel]

- [ ] 2.1 Script de capturas e as duas capturas em `public/projetos/` — verificar abrindo as imagens
- [ ] 2.2 `core/previews.ts`, serviço `JanelaDePreview`, componente `JanelaDePreview` e `BotaoExecutar`, e o play da barra de ferramentas ativo só nos projetos com preview — verificar no portal desktop e celular com capturas

## 3. Animação [Compasso]

- [ ] 3.1 Abrir e fechar a janela com animação curta de janela de IDE, desligada com movimento reduzido — verificar no portal e com teste do estado reduzido

## 4. Projetos [Grafite e Nanquim]

- [ ] 4.1 [Grafite] Projeto 1 (Ana) e Projeto 4 (três cases da Memora) — verificar com capturas
- [ ] 4.2 [Nanquim] Projetos 2 e 3 com o botão Executar e o registro das quatro rotas — verificar com capturas

## 5. Testes [Sentinela]

- [ ] 5.1 Testes da janela (abrir pelos dois Executar, captura sem requisição externa, ao vivo com sandbox, nova aba, foco preso, Escape, foco de volta, celular, movimento reduzido), dos quatro projetos e axe com a janela aberta — verificar com `npm run test:ci && npm run build && npm run e2e`

## 6. Documentação e integração

- [ ] 6.1 [Escriba] `docs/componentes.md` (janela, Executar, registro de previews, script de capturas) e entrada `0007-projetos-e-janela-de-preview.md` do diário — verificar com `npm run format:check`
- [ ] 6.2 [Regente] Revisar, verificar, abrir o PR, arquivar a change no PR e fazer o merge — verificar pelo PR mesclado e pelo deploy
