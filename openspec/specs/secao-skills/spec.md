# secao-skills Specification

## Purpose
Listar a stack técnica do Vinicius na seção Skills / STACK, como nas telas 05 e 06 do design,
em duas páginas da classe `TechSkills`.

## Requirements

### Requirement: Stack em Java moderno
A seção Skills SHALL manter as duas páginas e listar, em Java moderno, as linguagens (Java,
TypeScript, JavaScript, PHP, SQL), frameworks (Spring Boot, Spring Data JPA, Angular) e bancos
(Oracle, PostgreSQL, MySQL) na página 1, e cloud e infraestrutura (Docker, Kubernetes, Nginx,
AWS, Azure) e ferramentas (Git, GitLab CI/CD, Grafana, Scrum) na página 2.

#### Scenario: Duas páginas
- **WHEN** o visitante percorre as duas páginas de Skills
- **THEN** todas as tecnologias das telas 05 e 06 aparecem, em listas imutáveis

### Requirement: Níveis de conhecimento
A seção Skills SHALL ter uma página 3 (`/skills/3`) com os quatro níveis de conhecimento, cada um
explicado em pt-BR, e as tecnologias de cada nível: domínio diário (Java, Spring Boot, Angular,
PostgreSQL, Oracle, TypeScript, Git), projeto completo (PHP), uso pontual (React Native, CI/CD)
e conhecimento teórico (Python, AWS, Azure, Docker, Kubernetes).

#### Scenario: Página 3 de Skills
- **WHEN** o visitante vai para a página 3 de Skills
- **THEN** ele vê os quatro níveis, o significado de cada um e as tecnologias de cada nível, e
  o controle mostra `3/3`
