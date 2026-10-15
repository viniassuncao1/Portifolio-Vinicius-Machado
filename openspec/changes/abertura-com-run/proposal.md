# Proposal

## Why

O Vinicius achou a tela de boas-vindas curta demais (até 2 s) e quer que a abertura seja a
experiência de rodar o projeto: o visitante clica em Run e vê o build e o Spring subindo antes
de o portfólio aparecer. Compilar as classes do próprio currículo e subir um Spring na porta
8080 mostra, logo na entrada, que ele conhece o ecossistema. O plano de design e animação foi
feito com as skills do ECC (motion-foundations, motion-patterns, motion-advanced,
frontend-design-direction, make-interfaces-feel-better e accessibility) e validado num
protótipo.

## What Changes

- **Splash de 3 s** com foto, nome, cargo, "Seja bem-vindo ao meu portfólio" e a barra com as
  etapas da IDE ("Opening Portfolio_Vinicius…", "Resolving Gradle dependencies…", "Indexing 16
  Java classes…", "Project ready").
- **Pronto para executar:** o widget de Run do IntelliJ (`PortfolioApplication ▾`, ▶ verde, debug
  apagado, atalho ⌃R no Mac e ⇧F10 nos outros) com o foco no ▶; Enter, clique ou atalho
  executam. Se ninguém executar em 5 s, o ▶ é acionado sozinho (o visitante nunca fica preso).
- **Execução (~3,4 s):** janela Build/Run com `> Task :compileJava` compilando as 16 classes
  reais do portfólio, depois `:processResources`, `:classes`, `:bootRun`, e o log do Spring até
  `Started PortfolioApplication`.
- **A IDE aparece (~0,7 s):** a janela de Run recolhe para a barra de status e os painéis da IDE
  entram em sequência; o foco vai para o editor.
- **Sem pular** (decisão do Vinicius): não há botão Pular nem Esc. A sequência tem teto de tempo
  em todas as fases.
- **Só na página inicial e uma vez por sessão:** quem chega por link direto de uma seção vai
  direto ao conteúdo, só com o aviso na barra de status.
- **Movimento reduzido:** mesmas etapas, sem animação (log completo de uma vez, fades de até
  150 ms).
- **ADR-0017** substitui o ADR-0015 na abertura.
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `tela-de-boas-vindas`: a abertura passa a ter splash de 3 s, Run, build e log do Spring.
- `barra-de-status`: o aviso aparece também quando a abertura não é mostrada.

## Impact

- Código: `core/abertura.ts` (substitui `core/boas-vindas.ts`), linha do tempo em constantes,
  `layout/abertura/` (substitui `layout/tela-de-boas-vindas/`: cartão, widget de Run, janela de
  build), log do Spring movido para `core/log-do-spring.ts`, casca (entrada dos painéis), barra de
  status, `src/index.html` (script inline), `_movimento.scss` (tokens novos).
- Testes: unitários com relógio falso; e2e com `page.clock` em cada fase, axe em cada fase nos
  dois temas e no celular, link direto, sessão, movimento reduzido e sem JavaScript.
