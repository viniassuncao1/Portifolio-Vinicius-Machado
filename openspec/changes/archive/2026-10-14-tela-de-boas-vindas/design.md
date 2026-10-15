# Design

## Context

A janela de Run (`layout/janela-de-run/`, serviço `JanelaDeRun`) abre sozinha na primeira página
da sessão com `sessionStorage['run-exibido']`. A foto do Vinicius já existe em
`public/fotos/vinicius.webp` (192x192). O site é pré-renderizado (ADR-0003) e o conteúdo precisa
continuar no HTML para buscadores e para o LCP. Referências: ADR-0011, ADR-0012, auditoria de UX.

## Goals / Non-Goals

**Goals:**

- Primeira impressão pessoal (rosto, nome, cargo) em no máximo 2 s.
- Fiel à splash do IntelliJ; nunca atrapalha quem volta ao site na mesma sessão.

**Non-Goals:**

- Animação longa, música, opção de pular, splash em toda navegação.

## Decisions

### 1. Composição

Cartão centralizado (como a splash do IntelliJ) sobre o fundo da página com leve desfoque: foto
redonda de 96 px (72 px no celular), nome em Inter 600, cargo, "Seja bem-vindo ao meu
portfólio", barra de progresso fina com o degradê da barra superior do design e uma linha de
status em JetBrains Mono que troca entre 3 etapas do log do Spring. Tokens nos dois temas.

### 2. Tempo

Começa visível no primeiro quadro do navegador (sem esperar a hidratação para não piscar o
editor). Fecha quando todos forem verdade: passou 0,6 s, `document.fonts.ready`, app estável.
Teto rígido de 2 s: fecha mesmo que algo não tenha terminado. A barra avança pelas etapas reais
e completa ao fechar.

### 3. Não bloqueia de verdade

O conteúdo pré-renderizado fica no DOM o tempo todo (sem `display:none`, `opacity:0` no `main`
nem `aria-hidden`); a tela de boas-vindas é uma camada por cima, com `role="status"` e o texto
"Carregando o portfólio de Vinicius Machado". Enquanto ela está aberta, o resto é `inert` (no
máximo 2 s, abaixo do limite do WCAG 2.2.2). Sem roubar o foco: ao fechar, o foco fica no
início do documento.

### 4. Movimento reduzido e sem JavaScript

Com `prefers-reduced-motion`, mesma tela sem a barra animada e sem fade, e o teto cai para 1 s.
Sem JavaScript, não aparece (é montada só no navegador). `sessionStorage['boas-vindas-exibida']`
controla a vez por sessão; se o armazenamento falhar, mostra e segue.

### 5. Janela de Run

Remove a abertura automática do serviço `JanelaDeRun`; o Executar continua abrindo e
reexecutando o log. Depois da boas-vindas, a barra de status mostra por 6 s o aviso
`PortfolioApplication started in 1.8 s`, anunciado de forma educada (`aria-live="polite"`).

## Risks / Trade-offs

- [Recrutador impaciente] → teto de 2 s, uma vez por sessão, fecha assim que pronto.
- [LCP e SEO] → conteúdo sempre no HTML; a tela é só do navegador; foto pequena com prioridade.

## Faixas da equipe

| Faixa     | Quem      | O quê                                                  |
| --------- | --------- | ------------------------------------------------------ |
| Tela      | Compasso  | Componente, composição, tokens, `inert`, sessão         |
| Movimento | Compasso  | Barra de progresso, etapas, fade, teto, reduced-motion |
| Run       | Compasso  | Fim da abertura automática e aviso na barra de status  |
| Testes    | Sentinela | Sessão, duração, reduced-motion, axe, celular, HTML    |
| Docs      | Escriba   | ADR-0015, README, `docs/`, diário                      |
