# secao-depoimentos Specification

## Purpose
Mostrar o que pessoas que trabalharam com o Vinicius dizem sobre ele, com nome, cargo, relação e
data de cada recomendação.

## Requirements

### Requirement: Recomendações reais
A rota `/depoimentos` SHALL mostrar cada recomendação com o nome de quem recomendou, o cargo, a
relação de trabalho, a data e o texto completo, sem conteúdo de exemplo.

#### Scenario: Recomendação de Luana Porto
- **WHEN** o visitante abre a seção "Depoimentos/Recomendações"
- **THEN** ele vê a recomendação de Luana Porto, Desenvolvedor Backend Java, que trabalhou na
  mesma equipe, de 22/09/2026, com o texto completo e sem Lorem Ipsum

### Requirement: Fácil de acrescentar
Acrescentar uma recomendação SHALL exigir só uma entrada nova no conteúdo da seção.

#### Scenario: Segunda recomendação
- **WHEN** uma nova recomendação é acrescentada ao conteúdo
- **THEN** ela aparece na seção sem mudança em outros componentes
