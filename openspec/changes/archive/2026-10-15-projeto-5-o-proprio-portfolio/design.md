# Design

## Context

Os projetos ficam em `features/projeto-N/` com conteúdo em `projeto-N.conteudo.ts` e são
registrados em `core/secoes.ts` (pacote `projetos`, `paginas` para seções paginadas). O Projeto 4
é o modelo de seção paginada. A change `abertura-com-run` está em andamento na mesma branch e
compila a lista de classes derivada de `secoes.ts`, então o Projeto 5 entra nela sozinho.

## Goals / Non-Goals

**Goals:**

- Contar o estudo de um jeito que um recrutador entende: o que foi feito, com quais ferramentas e
  o que o Vinicius aprendeu.
- Fatos verificados e com link para a fonte.

**Non-Goals:**

- Números que mudam a cada commit escritos no texto (estão na página `/repositorio`).

## Decisions

### 1. Estrutura

`Projeto5.java`, pacote `dev.vinicius.portfolio.projetos`, classe `EstudoComIA`, com o record
`Ferramenta(String nome, String papel, String link)` e uma página por tema (como o Projeto 4):
cada página tem o Javadoc com o texto e a instância da ferramenta da página. Título na árvore
"Projeto 5"; descrição na busca: "Este portfólio: um estudo de desenvolvimento com IA, com SDD
no OpenSpec, as skills do ECC e uma equipe de agentes no Maestri".

### 2. Fatos (verificados em 15/10/2026)

- ECC: https://github.com/affaan-m/ECC (antes everything-claude-code). O README do autor diz:
  "Won the Anthropic x Forum Ventures hackathon in Sep 2025" (com zenith.chat feito com fluxos
  agênticos). Não citar número de estrelas (muda).
- Maestri: app nativo de macOS com um canvas infinito para agentes de código, criado por Evert
  Junior, desenvolvedor brasileiro (https://www.producthunt.com/products/maestri).
- OpenSpec e os ADRs: `openspec/` e `docs/adr/` deste repositório.

### 3. Escrita

O texto é escrito em pt-BR na voz do Vinicius (primeira pessoa, frases diretas, como as outras
seções) e passa pela skill `li-human` do ECC (sem travessões, sem palavras típicas de texto gerado
por IA, sem caracteres invisíveis). Cada página tem no máximo ~90 palavras no Javadoc.

### 4. Code vision

O code vision dos projetos com site ganha uma variante com link externo: `▶ Executar · Ver no
GitHub`, abrindo o repositório em nova aba.

## Risks / Trade-offs

- [Sobrepor "Como uso a IA"] → "Como uso a IA" fala do dia a dia; o Projeto 5 fala deste estudo.
- [Fatos de terceiros mudarem] → só o que está nas fontes, com link.

## Faixas da equipe

| Faixa    | Quem      | O quê                                                        |
| -------- | --------- | ------------------------------------------------------------ |
| Conteúdo | Grafite   | `features/projeto-5/`, textos com `li-human`, registro, rota |
| Editor   | Nanquim   | Variante do code vision com link para o GitHub               |
| Testes   | Sentinela | Unitários e E2E                                              |
| Docs     | Escriba   | README, `docs/`, diário                                      |
