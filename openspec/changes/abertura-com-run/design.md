# Design

## Context

Hoje a tela de boas-vindas (`layout/tela-de-boas-vindas/`, `core/boas-vindas.ts`, ADR-0015) fica
de 0,6 a 2 s e não pode ser pulada; a janela de Run (`layout/janela-de-run/`, log em `log.ts`) só
abre pelo Executar. O plano completo, quadro a quadro e com as skills do ECC citadas em cada
decisão, está em `storyboard.md` nesta change. O protótipo validado pelo Vinicius está em
https://claude.ai/artifact/YYeE6diksXym9iVGf4XgV5. **Onde o storyboard falar em Pular ou Esc,
vale esta change: não há pular.**

## Goals / Non-Goals

**Goals:**

- Abertura memorável que mostra Java e Spring na prática, fiel ao IntelliJ.
- Ninguém fica preso: tempos com teto e execução automática.
- Conteúdo sempre no HTML e no DOM (SEO, LCP, sem JavaScript).

**Non-Goals:**

- Pular a abertura, abertura em links diretos, abertura em toda visita.

## Decisions

### 1. Decisões do Vinicius (15/10)

- Sem pular: nem botão nem Esc.
- Se ninguém executar, o ▶ é acionado sozinho 5 s depois de ficar pronto (8 s desde a abertura).
- Movimento reduzido: versão estática (mesmas etapas, sem movimento).
- Só em `/` e uma vez por sessão; link direto vai ao conteúdo.

### 2. Linha do tempo

| Fase | Tempo | Teto |
| --- | --- | --- |
| Splash | 3 s (degraus de 0,4/1,1/1,8/2,5 s) | 5 s com rede lenta |
| Pronto | até o clique; pulso do ▶ em 0,3 s e 3 s; dica "Executando sozinho em instantes…" aos 3 s | execução automática aos 5 s |
| Build | uma classe por seção (derivadas de `secoes.ts`, hoje 17), uma a cada 60 ms; troca para Run aos 1,46 s | — |
| Log do Spring | banner aos 1,58 s; 9 linhas a cada 150 ms; pausa de 0,5 s | — |
| A IDE aparece | 0,72 s (recolher em 360 ms + painéis com intervalo de 60 ms) | — |

Do clique ao portfólio: ~4,2 s, teto de 5 s. Pior caso sem clique: ~12 s.

### 3. Movimento

Tokens novos em `_movimento.scss`: `--duracao-entrada-abertura` 280 ms, `--duracao-recolher`
360 ms, `--intervalo-escalonado` 60 ms, `--curva-suave` `cubic-bezier(0.22, 1, 0.36, 1)`. Só
`transform`, `opacity` e `clip-path`. Entradas dos painéis por keyframes com
`animation-fill-mode: backwards` (em repouso, tudo opaco). O recolher usa View Transitions com
`view-transition-name` compartilhado entre a janela e o item da barra de status; sem a API, a
mesma coreografia por classes CSS.

### 4. Acessibilidade

A abertura é um `role="dialog"` com `aria-modal="true"`, rótulo no nome, resto da casca `inert`.
Foco no ▶ quando fica pronto e no editor no fim. Uma região `aria-live` anuncia só os marcos
(carregando, projeto pronto, compilando, portfólio pronto), não o log linha a linha. ▶ com área
de toque de 44 px e `aria-keyshortcuts`. Sem pular e com o conteúdo só atrás de uma sequência
iniciada pelo visitante ou automática com teto, não há limite de tempo imposto (WCAG 2.2.1) nem
movimento automático acima de 5 s (2.2.2): o splash dura 3 s e a execução começa por ação ou
pela execução automática.

### 5. Pré-render

Um script inline no `<head>` (como o do tema) liga `data-abertura` no `<html>` só em `/`, com
JavaScript e sem a chave na sessão; o cartão pinta no primeiro quadro e o nome não anima (LCP). O
conteúdo da rota fica no DOM, opaco, por baixo. Sem JavaScript, nada muda.

## Risks / Trade-offs

- [Recrutador impaciente sem poder pular] → só na página inicial, uma vez por sessão, execução
  automática aos 8 s, teto de 5 s depois do clique.
- [Atalho Ctrl+R recarrega a página fora do Mac] → ⇧F10, o atalho do IntelliJ nesses sistemas.

## Faixas da equipe

| Faixa      | Quem      | O quê                                                                          |
| ---------- | --------- | ------------------------------------------------------------------------------ |
| Base       | Nanquim   | Log do Spring em `core/log-do-spring.ts`, linha do tempo e lista de classes    |
| Visual     | Pincel    | Cartão, widget de Run, janela Build/Run, tokens de cor nos dois temas, celular |
| Movimento  | Compasso  | Serviço `Abertura`, fases, coreografia, View Transition, script inline, casca   |
| Testes     | Sentinela | Unitários e e2e com relógio, axe em cada fase, link direto, sessão, sem JS      |
| Docs       | Escriba   | ADR-0017, README, `docs/`, diário                                              |
