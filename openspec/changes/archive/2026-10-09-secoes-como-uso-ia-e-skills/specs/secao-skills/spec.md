# Spec Delta

## Purpose

Listar a stack técnica do Vinicius na seção Skills / STACK, como nas telas 05 e 06 do design,
em duas páginas da classe `TechSkills`.

## ADDED Requirements

### Requirement: Primeira página (tela 05)
A rota `/skills` SHALL exibir a classe `TechSkills` com os arrays `linguagens` (Java,
TypeScript, JavaScript, PHP, SQL), `frameworks` (Spring Boot, Spring Data JPA, Angular) e
`databases` (Oracle, PostgreSQL, MySQL), com os mesmos textos, recuos e cores da tela 05.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Skills / STACK"
- **THEN** o editor mostra os três arrays da tela 05 e o controle `1/2`

### Requirement: Segunda página (tela 06)
A rota `/skills/2` SHALL exibir a classe `TechSkills` com os arrays `cloudAndInfra` (Docker,
Kubernetes, Nginx, AWS, Azure) e `ferramentas` (Git, GitLab CI/CD, Grafana, Scrum), com os
mesmos textos, recuos e cores da tela 06.

#### Scenario: Segunda página
- **WHEN** o visitante vai para a página 2 de Skills
- **THEN** o editor mostra os dois arrays da tela 06 e o controle `2/2`
