# Spec Delta

## MODIFIED Requirements

### Requirement: Apresentação como classe Java
A página inicial SHALL ser o arquivo `PortfolioApplication.java`, no pacote raiz
`dev.vinicius.portfolio`, com `@SpringBootApplication` e um `main` que apresenta o Vinicius:
desenvolvedor Full Stack, sem "Júnior" no cargo, com a stack principal Java, Spring Boot,
Angular e SQL.

#### Scenario: Abertura da página inicial
- **WHEN** o visitante abre a página inicial
- **THEN** a aba mostra `PortfolioApplication.java` e o editor mostra o pacote, a anotação
  `@SpringBootApplication`, o cargo "Full Stack" e a stack principal
