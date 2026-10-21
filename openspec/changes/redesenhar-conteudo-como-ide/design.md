# Design

## Context

O site é um SSG em Angular 22. Hoje as seções têm a visão Cartão (padrão) e a visão Código
(`SecaoEmDuasVisoes`), com cartões em `shared/cartoes/`. Os fatos vêm de `core/perfil.ts` e
`core/projetos.ts`; a vitrine (`/projetos`) e o movimento (`MovimentoConfig`, `motion` carregado após a
hidratação) já existem e funcionam. O protótipo aprovado (artifact, 2 telas) define a direção visual.

## Goals / Non-Goals

**Goals:**
- A IDE como linguagem do conteúdo, não como moldura; cada seção com forma própria.
- Primeira dobra clara para recrutadores; navegação previsível (sidebar, abas, Ctrl+K).
- Reaproveitar dados, vitrine, movimento, a11y e testes.

**Non-Goals:**
- Reescrever `perfil.ts`, a vitrine ou o pipeline de build/deploy.
- Novas seções ou conteúdo novo.
- Copiar o visual do portfólio de referência.

## Decisions

1. **Início = editor + painel Run.** O Run é o momento memorável (digita `./gradlew bootRun` e termina na
   apresentação). Sem movimento ou sem JS o log já vem completo no HTML (SSG).
2. **Skills = `build.gradle`.** Cada dependência liga a projetos reais por dados (`stack` → `projetos`),
   com a dica acessível por foco e toque, não só hover.
3. **Um componente por forma, sobre os mesmos dados.** Em vez de cartão genérico, componentes como
   `build-gradle`, `git-log-grafo`, `run-com-preview` e `terminal-de-contato`, todos lendo de `core/`.
4. **Toggle Cartão ⇄ Código: decidir no protótipo.** Se cada seção já é "um arquivo", o toggle perde o
   sentido; a recomendação é removê-lo, deixando o código completo (Java) como aba secundária onde
   fizer sentido. Alternativa: manter só no Início.
5. **Sidebar fixa** reaproveita a árvore atual (`arvore-de-secoes`) e a marca deslizante já existente
   na faixa de abas; o breadcrumb passa a seguir a rolagem com `IntersectionObserver`.
6. **Sem nova dependência.** Movimento via `motion` já presente; o resto é CSS e View Transitions.

## Risks / Trade-offs

- Muitos testes e2e assumem o cartão como padrão: a migração é grande. Mitigação: trocar seção por
  seção, mantendo a suíte verde a cada commit.
- O Run no Início compete com a leitura rápida. Mitigação: a apresentação em texto fica acima da dobra e
  o Run é complemento (nunca bloqueia, pode ser pulado).
- Remover o toggle perde o "ver como cartão" que já foi entregue. Decisão do Vinicius (ver abaixo).

## Decisões do Vinicius (21/10, tarefa 1.1)

- **Toggle Cartão ⇄ Código: removido.** A forma da seção é a única visão; onde o Java completo
  agrega, ele vira aba secundária do arquivo (ADR-0021).
- **Projetos: a vitrine vira o conteúdo da janela de Run**, com preview vivo, mantendo `/projetos` e
  `/projetos/<slug>`.
- Referência visual: o protótipo aprovado, com cópia local em `.maestri/prototipo-ide.html` (o link do
  artifact não abre em todas as contas).
