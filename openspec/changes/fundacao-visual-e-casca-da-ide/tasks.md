# Tasks

Responsável entre colchetes. Grupos que mexem nos mesmos arquivos rodam em sequência; o grupo 6
(documentação) roda em paralelo desde o início.

## 1. Preparação [Regente]

- [x] 1.1 Criar a branch `feat/fundacao-visual-e-casca-da-ide` e preencher a note "Change Atual" com as tarefas e responsáveis — verificar pela note no canvas
- [x] 1.2 Instalar `@fontsource/jetbrains-mono` e `@axe-core/playwright` (dev) — verificar com `npm ci && npm run build`

## 2. Design tokens e fonte [Pincel]

- [x] 2.1 Extrair das telas as cores de interface e de sintaxe, tipografia, espaçamentos, raios e bordas, e criar `src/styles/_tokens.scss` — verificar que `npm run build` passa e que nenhum componente usa cor solta (`grep` por `#` e `rgb(` fora de `_tokens.scss`)
- [x] 2.2 Conferir o contraste de cada cor de texto com o fundo e ajustar as que ficarem abaixo de 4,5:1 — verificar pela tabela de contraste na note "Design Tokens"
- [x] 2.3 Configurar a JetBrains Mono local (pesos usados, subset latino, `font-display: swap`) — verificar no portal "Site Desktop" que nenhuma requisição sai para domínios de fontes
- [x] 2.4 Preencher a note "Design Tokens" com nome, valor e tela de origem de cada token — verificar pela note no canvas

## 3. Editor de código [Pincel, depois Sentinela]

- [x] 3.1 Criar o modelo de conteúdo e as funções construtoras em `shared/editor-de-codigo/conteudo.ts` — verificar com testes unitários das construtoras
- [x] 3.2 Criar o componente `EditorDeCodigo` (linhas, trechos por papel, recuo, parágrafo com `*`, numeração mínima de 15 e crescente) — verificar com teste unitário mínimo de renderização
- [x] 3.3 [Sentinela] Completar os testes do editor cobrindo os cenários da spec `editor-de-codigo` (cores por papel, 15 linhas, conteúdo longo, números e `*` fora da leitura, texto copiável) — verificar com `npm run test:ci`

## 4. Casca da IDE e navegação [Pincel, depois Sentinela]

- [x] 4.1 Criar os ícones SVG em `public/icones/` e o componente `Icone` — verificar com teste unitário e comparação com a tela 01 no portal
- [x] 4.2 Criar `core/secoes.ts` com as 15 seções e `SecaoEmConstrucao` em `shared/` — verificar com teste unitário da ordem e dos slugs
- [x] 4.3 Criar `BarraDeFerramentas`, `PainelLateral`, `ArvoreDeSecoes`, `AbaDoEditor` e `Casca` em `layout/`, com decorativos ocultos, item atual destacado e `aria-current` — verificar comparando com as telas 01, 02 e 07 no portal "Site Desktop"
- [x] 4.4 Reorganizar as rotas (casca como rota-pai, Início e as 15 seções como filhas), `h1` por rota e `TitleStrategy` — verificar que `npm run build` gera o HTML de todas as 16 rotas em `dist/`
- [x] 4.5 Implementar a gaveta abaixo de 768px (botão "Seções", foco, Escape, fechar ao navegar) — verificar no portal "Site Mobile" sem rolagem horizontal
- [x] 4.6 [Sentinela] Testes unitários dos componentes da casca e E2E de navegação pela árvore, acesso direto por endereço, teclado, gaveta em 390x844 e rotas sem JavaScript — verificar com `npm run test:ci && npm run e2e`

## 5. Página inicial [Pincel, depois Sentinela]

- [x] 5.1 Escrever o conteúdo da tela 01 em `features/inicio/inicio.conteudo.ts` e exibir no editor, sem item atual na árvore — verificar comparando com a `tela-01.png` no portal "Site Desktop"
- [x] 5.2 [Sentinela] Atualizar os testes unitário e E2E do Início para os cenários da spec `secao-inicio` — verificar com `npm run test:ci && npm run e2e`

## 6. Documentação [Escriba, em paralelo]

- [x] 6.1 Escrever o ADR-0008 (diário de desenvolvimento) e o ADR-0009 (axe nos E2E) e atualizar o índice em `docs/adr/README.md` — verificar com `npm run format:check`
- [x] 6.2 Criar `docs/diario/README.md` (índice e modelo de entrada) e a entrada `0001-fundacao-do-projeto.md` com rascunho de post — verificar que a entrada tem todas as seções da spec
- [x] 6.3 Escrever `docs/componentes.md` com o inventário das telas e o uso de cada componente, depois que os grupos 3 a 5 estiverem prontos — verificar que os nomes batem com o código
- [x] 6.4 Atualizar `README.md` e `docs/arquitetura.md` (casca, rotas, tokens, fonte, diário) — verificar com `npm run format:check`
- [x] 6.5 Escrever a entrada `0002-fundacao-visual-e-casca-da-ide.md` com capturas dos portals (pedidas ao Regente) e rascunho de post — verificar que está no índice

## 7. Movimento [Compasso, depois do grupo 4]

- [x] 7.1 Criar os tokens de duração e curva e ativar `withViewTransitions()` com salto quando `prefers-reduced-motion: reduce` — verificar no portal trocando de seção, com e sem a preferência
- [x] 7.2 Animar a seta e o destaque do item da árvore e a abertura da gaveta só com `transform`/`opacity` — verificar no portal "Site Mobile" e com teste unitário do estado com movimento reduzido

## 8. Acessibilidade automatizada [Sentinela]

- [x] 8.1 Adicionar a verificação axe (`wcag2a`, `wcag2aa`) no Início e nas 15 rotas — verificar com `npm run e2e` sem violações

## 9. Integração [Regente]

- [ ] 9.1 Revisar os diffs contra specs, design e `.claude/rules/ecc/` e conferir com o Vinicius a gaveta no portal "Site Mobile" — verificar pela aprovação dele
- [x] 9.2 Rodar `npm run lint && npm run test:ci && npm run build && npm run e2e` com cobertura acima de 80% — verificar pela saída dos comandos
- [ ] 9.3 Abrir o PR com o template e capturas, esperar o CI verde e fazer o merge sem apagar a branch — verificar pelo PR mesclado e pelo deploy de produção

## Workflow follow-up

- Arquivar a change com `/opsx:archive` depois do merge e atualizar as notes "Change Atual" e "Backlog".
