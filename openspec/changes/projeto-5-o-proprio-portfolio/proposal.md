# Proposal

## Why

O próprio portfólio é o projeto que mais mostra como o Vinicius trabalha hoje: foi um estudo de
desenvolvimento com auxílio de IA, com specs antes do código, regras e skills de mercado e uma
equipe de agentes orquestrada. Hoje isso só aparece de passagem em "Como uso a IA" e no
repositório. O Vinicius quer um projeto dedicado a esse estudo.

## What Changes

- **Projeto 5, "Este portfólio"** (`Projeto5.java`, rota `/projeto-5`), com 4 páginas:
  1. **O estudo:** o portfólio como estudo de desenvolvimento com IA (Angular 22 pré-renderizado,
     o Vinicius decide e revisa, os agentes implementam), com links para o repositório no GitHub e
     para a página `/repositorio`.
  2. **SDD (Spec-Driven Development) com OpenSpec:** toda mudança começa como uma change com
     proposta, design, specs e tarefas, aprovada antes de virar código; decisões em ADRs; cada
     change vira um PR.
  3. **ECC (Everything Claude Code):** as regras, skills e agentes de Affaan Mustafa, que venceu o
     hackathon Anthropic x Forum Ventures em setembro de 2025; quais skills foram usadas aqui
     (auditoria de UX, movimento, acessibilidade, escrita).
  4. **Maestri:** o orquestrador de agentes num canvas, do desenvolvedor brasileiro Evert Junior; a
     equipe (Regente, Pincel, Compasso, Sentinela, Escriba, Grafite e Nanquim) e como cada um
     trabalha.
- Textos revisados com as skills de escrita do ECC (sem marcas de texto gerado por IA), em pt-BR,
  na voz do Vinicius.
- Code vision: `▶ Executar · Ver no GitHub` abre o repositório (não há preview: o site é este).
- Entrada do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `secao-projetos`: novo Projeto 5.

## Impact

- Código: `core/secoes.ts` (nova seção, entra na árvore, na busca, no sitemap e na lista de
  classes da abertura), `features/projeto-5/`, rota.
- Testes: unitários e E2E (árvore, páginas, links externos, Java válido, axe nos dois temas).
