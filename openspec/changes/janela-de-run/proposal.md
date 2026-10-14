# Proposal

## Why

Abrir o portfólio deve parecer rodar um projeto Spring Boot de verdade. O
[ADR-0011](../../../docs/adr/0011-identidade-visual-intellij-new-ui.md) previu uma janela de Run com
a inicialização do Spring (curta, uma vez por sessão, que dá para pular), e o Executar da barra
ainda é decorativo fora dos projetos com site.

## What Changes

- **Janela de Run** na parte de baixo da IDE (mesma área do painel do Git, um de cada vez): na
  primeira visita da sessão, mostra o log de inicialização do `PortfolioApplication` (banner do
  Spring, `Starting PortfolioApplication using Java 21`, `Tomcat started on port 8080`,
  `Started PortfolioApplication in 1.8 seconds`) linha a linha em no máximo 2,5 s, e depois
  continua aberta com o log completo até o visitante fechar.
- **Pular e fechar:** botão "Pular", Esc ou fechar; o conteúdo da página nunca fica bloqueado.
- **Uma vez por sessão** (`sessionStorage`); com movimento reduzido, não abre sozinha.
- **Executar da barra** fora dos projetos com site passa a reabrir a janela de Run e reexecutar
  o log; nos projetos com site continua abrindo o preview.
- Entrada do diário.

## Capabilities

### New Capabilities

- `janela-de-run`: janela de Run com o log de inicialização.

### Modified Capabilities

- `barra-superior`: o Executar sempre tem função.
- `janela-de-preview`: fora dos projetos com site, o Executar da barra abre a janela de Run.
- `casca-da-ide`: o Executar deixa a lista de decorativos.

## Impact

- Código: `layout/janela-de-run/`, serviço da área de ferramentas de baixo (Run e Git
  exclusivos), `layout/barra-de-ferramentas`, tokens.
- Testes: unitários e E2E (sessão, pular, Esc, movimento reduzido, axe, celular).
