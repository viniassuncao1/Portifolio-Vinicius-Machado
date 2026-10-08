# Proposal

## Why

O site ainda é só um título com "Em construção". As 30 telas do design repetem a mesma
estrutura de IDE: barra de ferramentas, árvore de seções, aba do editor e um editor que mostra o
conteúdo como código Java. O que muda de uma tela para outra é o conteúdo. Construir essa base
uma única vez, com design tokens e componentes reutilizáveis, faz cada seção futura virar
"apenas dados" e evita retrabalho. Como o portfólio também é vitrine, o processo de construção
precisa ficar registrado para virar conteúdo (posts no LinkedIn) desde a primeira change.

## What Changes

- Inventário dos elementos que se repetem nas 30 telas, mapeando cada um para um componente.
- Design tokens (cores da interface, cores de sintaxe, tipografia, espaçamentos, raios e bordas)
  como variáveis CSS, extraídos das telas e com contraste WCAG AA.
- Casca da IDE: barra de ferramentas, painel lateral com a árvore de seções, aba do editor e
  área do editor, adaptada a telas pequenas.
- Editor de código que recebe conteúdo tipado (tokens de sintaxe) e o exibe como código Java,
  com numeração de linhas e cores de sintaxe.
- Navegação: cada item da árvore leva à rota da sua seção; enquanto a seção não existir, a rota
  mostra um aviso de "em construção" no próprio editor.
- Tela 01 (Início) implementada com esses componentes, substituindo o placeholder atual.
- Transições discretas (árvore e troca de seção) respeitando `prefers-reduced-motion`.
- Verificação automática de acessibilidade (axe) nos testes E2E.
- Diário de desenvolvimento em `docs/diario/`: uma entrada por change com o problema, as
  decisões, o aprendizado e um rascunho de post para o LinkedIn. Começa com uma entrada
  retroativa sobre a fundação do projeto e outra sobre esta change.
- ADR-0008 (diário de desenvolvimento) e ADR-0009 (axe nos testes E2E).

Fora do escopo: o conteúdo das seções (Sobre Mim em diante) e a janela de preview dos projetos
(telas 11 a 15), que ficam para changes seguintes.

## Capabilities

### New Capabilities

- `sistema-visual`: design tokens e regras de uso (cores, sintaxe, tipografia, espaçamentos,
  contraste e movimento).
- `casca-da-ide`: estrutura fixa da IDE (barra de ferramentas, árvore de seções, aba do editor),
  navegação entre seções e adaptação a telas pequenas.
- `editor-de-codigo`: exibição de conteúdo tipado como código Java, com numeração de linhas,
  cores de sintaxe e leitura acessível.
- `secao-inicio`: conteúdo e comportamento da página inicial (tela 01).
- `diario-de-desenvolvimento`: registro de cada change em `docs/diario/` com rascunho de post.

### Modified Capabilities

- `pipeline-de-qualidade`: passa a exigir verificação automática de acessibilidade (axe) nos
  testes E2E.

## Impact

- Código: `src/styles/` (tokens), `src/app/layout/` (casca), `src/app/shared/` (editor de
  código e modelo de conteúdo), `src/app/features/inicio/`, rotas em `src/app/app.routes.ts`.
- Testes: novos testes unitários dos componentes e E2E de navegação, teclado e acessibilidade.
- Dependências: fonte monoespaçada servida localmente (pacote `@fontsource`) e
  `@axe-core/playwright` (desenvolvimento).
- Documentação: `docs/diario/`, `docs/componentes.md` (inventário), ADR-0008 e ADR-0009,
  README e `docs/arquitetura.md`.
- O teste E2E atual da página inicial continua válido: o título `Portfolio_Vinicius` segue como
  `h1`.
