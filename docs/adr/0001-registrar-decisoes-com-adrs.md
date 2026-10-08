# ADR-0001: Registrar decisões com ADRs

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

Este repositório é um portfólio e também uma vitrine de como eu trabalho. Quem lê o código
precisa entender não só _o que_ foi feito, mas _por que_. Parte do trabalho é feita por agentes de
IA, que também precisam saber quais decisões já foram tomadas para não rediscuti-las.

## Decisão

Registrar cada decisão de arquitetura, ferramenta ou processo num ADR em `docs/adr/`, numerado e
imutável depois de aceito.

O OpenSpec (ADR-0005) já documenta o design de cada mudança. Os ADRs ficam para as decisões
**transversais**, que valem para o projeto inteiro e sobrevivem a várias mudanças.

## Alternativas consideradas

- **Só o `design.md` das changes do OpenSpec:** bom para a mudança em si, mas a decisão fica
  espalhada pelo histórico de changes arquivadas.
- **Wiki do GitHub:** fica fora do repositório e não passa por revisão em PR.

## Consequências

- Toda decisão nova relevante exige um ADR no mesmo PR.
- O `CLAUDE.md` orienta os agentes a ler os ADRs antes de propor mudanças.
