# secao-certificacoes Specification

## Purpose
Listar os cursos concluídos pelo Vinicius na seção Certificações, com carga horária e data,
de um jeito que qualquer pessoa entenda.

## Requirements

### Requirement: Cursos concluídos
A rota `/certificacoes` SHALL listar os nove cursos das telas 19 a 21, cada um com o nome, a
carga horária em horas e a data de conclusão, do mais recente para o mais antigo: Spring Boot 3
(10h, 19/12/2025), Java com Spring Data JPA (16h, 09/12/2025), Java consumindo API (10h,
05/11/2025), HTTP (10h, 14/10/2025), Angular (8h, 22/09/2025), TypeScript na prática (12h,
11/09/2025), Python para Dados (10h, 08/04/2025), Python Orientação a Objetos (8h, 27/03/2025) e
Git e GitHub (8h, 25/03/2025).

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Certificações"
- **THEN** os nove cursos aparecem com o nome completo, as horas e a data, em ordem do mais
  recente para o mais antigo

#### Scenario: Muitos cursos
- **WHEN** a lista não cabe numa página
- **THEN** ela se divide em páginas da seção, sem perder nenhum curso
