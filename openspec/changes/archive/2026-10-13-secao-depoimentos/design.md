# Design

## Context

Seções são features com conteúdo tipado (guia de legibilidade em `docs/componentes.md`).
Referência: `tela-29.png`.

## Goals / Non-Goals

**Goals:** mostrar a recomendação real de forma legível e deixar fácil acrescentar outras.

**Non-Goals:** buscar recomendações automaticamente no LinkedIn.

## Decisions

### 1. Conteúdo

`record Recommendation(String author, String role, String relationship, LocalDate date)` com o
texto em Javadoc logo antes de cada constante, e uma lista `ALL = List.of(...)`. Comentários
curtos em pt-BR. Quando houver mais recomendações do que cabe com conforto, usar páginas da
seção (uma por recomendação).

### 2. Trilhas

Nanquim escreve a feature e registra a rota; Sentinela testa; Escriba escreve o diário.

## Risks / Trade-offs

- [Publicar o nome de outra pessoa] → a recomendação é pública no perfil do Vinicius no LinkedIn
  e foi escrita para ele; usamos só o que está nela.
