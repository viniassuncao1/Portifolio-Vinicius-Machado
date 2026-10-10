# Tasks

Responsável entre colchetes. Os grupos 2, 3 e 4 rodam em paralelo; o 5 acompanha; o 6 fecha.

## 1. Preparação [Regente]

- [x] 1.1 Criar a branch `feat/certificacoes-niveis-e-legibilidade` e preencher a note "Change Atual" — verificar pela note

## 2. Escala [Pincel]

- [x] 2.1 Reduzir a escala dos tokens (código ~17px, árvore/abas/status ~16px, medidas proporcionais) e ajustar o celular — verificar com capturas `escala-desktop.png` e `escala-mobile.png` e com o editor mostrando pelo menos 20 linhas em 1920x1080

## 3. Grafite

- [x] 3.1 Níveis de conhecimento como página 3 de Skills (`paginas: 3`) — verificar com captura `skills-3.png`
- [x] 3.2 Revisar Início, Sobre Mim, Diferenciais, Como uso a IA e Skills pelo guia de legibilidade — verificar com capturas

## 4. Nanquim

- [x] 4.1 Seção Certificações com os nove cursos, registrada na rota (páginas se necessário) — verificar com captura
- [x] 4.2 Revisar Experiências, Eventos, Formação, Idiomas e Contato pelo guia de legibilidade — verificar com capturas

## 5. Testes [Sentinela]

- [x] 5.1 Testes da escala (tokens e linhas visíveis), de Certificações, da página 3 de Skills e das seções revisadas (informações preservadas, listas curtas numa linha, sem `Optional`/`URI.create`), com axe nas rotas novas — verificar com `npm run test:ci && npm run build && npm run e2e`

## 6. Documentação e integração

- [x] 6.1 [Escriba] Atualizar `docs/componentes.md` com o guia de legibilidade e a escala, e escrever a entrada `0006-certificacoes-niveis-e-legibilidade.md` do diário — verificar com `npm run format:check`
- [x] 6.2 [Regente] Revisar, rodar `npm run lint && npm run test:ci && npm run build && npm run e2e`, abrir o PR, arquivar a change no PR, esperar o CI e fazer o merge — verificar pelo PR mesclado e pelo deploy
