# secao-inicio Specification

## Purpose
Apresentar o Vinicius na página inicial, como na tela 01 do design, com o cargo e a stack
principal escritos como uma classe Java.

## Requirements

### Requirement: Apresentação como classe Java
A página inicial SHALL ser o arquivo `PortfolioApplication.java`, no pacote raiz
`dev.vinicius.portfolio`, com `@SpringBootApplication` e um `main` que apresenta o Vinicius:
desenvolvedor Full Stack, sem "Júnior" no cargo, com a stack principal Java, Spring Boot,
Angular e SQL.

#### Scenario: Abertura da página inicial
- **WHEN** o visitante abre a página inicial
- **THEN** a aba mostra `PortfolioApplication.java` e o editor mostra o pacote, a anotação
  `@SpringBootApplication`, o cargo "Full Stack" e a stack principal

### Requirement: Título da página
A página inicial SHALL ter um único título principal (`h1`) com o texto `Portfolio_Vinicius` e o
título da janela do navegador com o nome do Vinicius.

#### Scenario: Título para leitores de tela e buscadores
- **WHEN** a página inicial é carregada
- **THEN** existe um `h1` com o texto `Portfolio_Vinicius` e o título da janela contém
  "Vinicius Machado"

### Requirement: Árvore no Início como no design
Na página inicial, a árvore SHALL exibir "Sobre Mim" destacado e expandido, como na tela 01, e
MUST NOT marcar nenhum item como página atual para tecnologias assistivas, porque a página aberta
é o Início.

#### Scenario: Árvore na página inicial
- **WHEN** a página inicial está aberta
- **THEN** "Sobre Mim" aparece destacado e com a seta para baixo, e nenhum item tem
  `aria-current`

### Requirement: Foto no Início
O Javadoc de `PortfolioApplication` no Início SHALL mostrar a foto do Vinicius com o `alt` "Foto
de Vinicius Machado", carregada com prioridade.

#### Scenario: Abertura do Início
- **WHEN** o visitante abre o Início
- **THEN** a foto do Vinicius aparece no Javadoc de `PortfolioApplication`

### Requirement: Quem é e para onde ir
O Início SHALL mostrar "Vinicius Machado" e o cargo em destaque no Javadoc de
`PortfolioApplication` e SHALL terminar com os atalhos clicáveis `// Próximo: ver os projetos →`
(para `/projeto-1`) e `// Fale comigo →` (para `/contato`).

#### Scenario: Atalho para os projetos
- **WHEN** o visitante ativa `// Próximo: ver os projetos →` no Início
- **THEN** a página do Projeto 1 abre
