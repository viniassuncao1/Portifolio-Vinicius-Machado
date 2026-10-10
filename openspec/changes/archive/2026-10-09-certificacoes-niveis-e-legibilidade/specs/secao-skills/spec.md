# Spec Delta

## ADDED Requirements

### Requirement: Níveis de conhecimento
A seção Skills SHALL ter uma página 3 (`/skills/3`) com os quatro níveis de conhecimento, cada um
explicado em pt-BR, e as tecnologias de cada nível: domínio diário (Java, Spring Boot, Angular,
PostgreSQL, Oracle, TypeScript, Git), projeto completo (PHP), uso pontual (React Native, CI/CD)
e conhecimento teórico (Python, AWS, Azure, Docker, Kubernetes).

#### Scenario: Página 3 de Skills
- **WHEN** o visitante vai para a página 3 de Skills
- **THEN** ele vê os quatro níveis, o significado de cada um e as tecnologias de cada nível, e
  o controle mostra `3/3`
