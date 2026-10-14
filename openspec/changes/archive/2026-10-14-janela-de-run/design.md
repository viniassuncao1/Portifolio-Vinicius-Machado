# Design

## Context

O painel do Git (`layout/painel-do-git/`, serviço `PainelDoGit`) já ocupa a área de baixo da
coluna do editor, com animação por `data-aberto` e `@starting-style`. O editor tem a digitação
das seções (spec `digitacao-do-codigo`), com pular e movimento reduzido. O Executar da barra só
funciona nos projetos com site. Referências: ADR-0011 (janela de Run), ADR-0012 (visual).

## Goals / Non-Goals

**Goals:**

- Sensação de "rodar o projeto" ao abrir o site, curta e que nunca atrapalha a leitura.
- Run e Git como janelas de ferramenta exclusivas na mesma área.

**Non-Goals:**

- Log interativo, console de comandos, logs por seção.

## Decisions

### 1. Área de ferramentas de baixo

Um serviço `JanelaDeFerramenta` (ou extensão do `PainelDoGit`) guarda qual janela está aberta
(`'run' | 'git' | null`); a casca renderiza uma ou outra na mesma área, com a mesma animação.
Altura igual à do painel do Git; o editor continua rolável acima dela.

### 2. Conteúdo do log

Texto fixo em `layout/janela-de-run/log.ts`: banner ASCII do Spring com `:: Spring Boot ::
(v3.5.0)`, depois ~8 linhas no formato do Spring (data/hora, `INFO`, PID, thread, logger,
mensagem): `Starting PortfolioApplication using Java 21`, `No active profile set`, `Tomcat
initialized with port 8080 (http)`, `Root WebApplicationContext: initialization completed`,
`Tomcat started on port 8080 (http) with context path '/'`, `Started PortfolioApplication in 1.8
seconds (process running for 2.1)`. Data/hora geradas no navegador na abertura (nunca no
pré-render). Cores: `INFO` em verde da sintaxe, PID em rosa do acento, logger em ciano, tudo por
tokens nos dois temas.

### 3. Tempo e pular

Linhas aparecem em lotes com atraso total ≤2,5 s (banner de uma vez, depois uma linha a cada
~200 ms). "Pular" completa na hora; fechar e Esc fecham. A janela abre sem roubar o foco. Marca
`sessionStorage['run-exibido']` ao abrir; com movimento reduzido não abre sozinha. O
pré-render nunca inclui a janela aberta.

### 4. Executar

Fora dos projetos com site, o Executar da barra vira botão "Executar PortfolioApplication" que
abre a janela de Run e reinicia o log.

## Risks / Trade-offs

- [Irritar quem volta ao site] → uma vez por sessão, pular e fechar sempre à mão.
- [Celular com pouca altura] → no celular a janela ocupa no máximo 40% da altura, sem cobrir a
  barra de status.

## Faixas da equipe

| Faixa     | Quem      | O quê                                               |
| --------- | --------- | --------------------------------------------------- |
| Janela    | Pincel    | Serviço da área de baixo, janela, log, Executar     |
| Movimento | Compasso  | Linhas aparecendo, pular, reduced-motion            |
| Testes    | Sentinela | Sessão, pular, Esc, exclusividade, axe, celular     |
| Docs      | Escriba   | README, `docs/`, diário                             |
