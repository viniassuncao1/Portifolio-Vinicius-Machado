# ADR-0002: Angular como framework

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

O portfólio precisa demonstrar a stack que eu uso profissionalmente: Java, Spring Boot,
**Angular** e SQL. É um site de conteúdo com navegação entre seções, animações e uma interface
que imita uma IDE.

## Decisão

Usar **Angular 22** com componentes standalone, signals, detecção de mudanças zoneless e o novo
control flow (`@if`, `@for`).

## Motivos

- **É a minha stack do dia a dia.** O portfólio serve de amostra do código que eu entrego no
  trabalho.
- **Mercado corporativo.** Angular é muito usado em empresas que também usam Java/Spring, o
  público que eu quero alcançar.
- **Estrutura opinativa.** Injeção de dependência, roteamento, testes e build vêm integrados e
  padronizados, o que deixa o projeto consistente, inclusive quando agentes de IA escrevem parte
  do código.
- **Angular moderno.** Signals e zoneless mostram domínio da versão atual do framework, não de
  padrões legados como NgModules e Zone.js.

## Alternativas consideradas

- **React/Next.js:** ecossistema enorme, mas não é a stack que eu quero evidenciar.
- **Astro:** ótimo para sites de conteúdo, mas não demonstra Angular.
- **HTML/CSS/JS puro:** simples, mas não mostra organização de uma aplicação real.

## Consequências

- Bundle inicial maior que o de um site estático puro, compensado pela pré-renderização
  (ADR-0003) e pelo lazy loading de cada seção.
- As convenções do Angular estão no `CLAUDE.md` e em `.claude/rules/ecc/angular/`.
