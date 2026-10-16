# secao-skills Specification

## Purpose
Listar a stack técnica do Vinicius na seção Skills / STACK, como nas telas 05 e 06 do design,
em duas páginas da classe `TechSkills`.

## Requirements

### Requirement: Stack em Java moderno
A seção Skills SHALL listar, em Java moderno e num arquivo só, as linguagens (Java, TypeScript,
JavaScript, PHP, SQL), frameworks (Spring Boot, Spring Data JPA, Angular), bancos (Oracle,
PostgreSQL, MySQL), cloud e infraestrutura (Docker, Kubernetes, Nginx, AWS, Azure) e
ferramentas (Git, GitLab CI/CD, Grafana, Scrum).

#### Scenario: Duas páginas
- **WHEN** o visitante abre Skills
- **THEN** todas as tecnologias das telas 05 e 06 aparecem no mesmo arquivo, em listas imutáveis

### Requirement: Níveis de conhecimento
A seção Skills SHALL mostrar, no mesmo arquivo, os quatro níveis de conhecimento, cada um
explicado em pt-BR, e as tecnologias de cada nível: domínio diário (Java, Spring Boot, Angular,
PostgreSQL, Oracle, TypeScript, Git), projeto completo (PHP), uso pontual (React Native, CI/CD)
e conhecimento teórico (Python, AWS, Azure, Docker, Kubernetes).

#### Scenario: Página 3 de Skills
- **WHEN** o visitante rola Skills até os níveis
- **THEN** ele vê os quatro níveis, o significado de cada um e as tecnologias de cada nível, sem
  controle de páginas
