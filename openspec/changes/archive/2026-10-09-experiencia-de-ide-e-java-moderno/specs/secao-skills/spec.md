# Spec Delta

## ADDED Requirements

### Requirement: Stack em Java moderno
A seção Skills SHALL manter as duas páginas e listar, em Java moderno, as linguagens (Java,
TypeScript, JavaScript, PHP, SQL), frameworks (Spring Boot, Spring Data JPA, Angular) e bancos
(Oracle, PostgreSQL, MySQL) na página 1, e cloud e infraestrutura (Docker, Kubernetes, Nginx,
AWS, Azure) e ferramentas (Git, GitLab CI/CD, Grafana, Scrum) na página 2.

#### Scenario: Duas páginas
- **WHEN** o visitante percorre as duas páginas de Skills
- **THEN** todas as tecnologias das telas 05 e 06 aparecem, em listas imutáveis

## REMOVED Requirements

### Requirement: Primeira página (tela 05)
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Stack em Java moderno" e a capacidade `conteudo-em-java-moderno`.

### Requirement: Segunda página (tela 06)
**Reason**: O código exato das telas deu lugar a Java moderno (ADR-0010); as informações são
preservadas.
**Migration**: Usar o requisito "Stack em Java moderno" e a capacidade `conteudo-em-java-moderno`.
