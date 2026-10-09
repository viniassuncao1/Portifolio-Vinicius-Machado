# secao-inicio Specification

## Purpose
Apresentar o Vinicius na página inicial, como na tela 01 do design, com o cargo e a stack
principal escritos como uma classe Java.

## Requirements

### Requirement: Apresentação como classe Java
A página inicial SHALL apresentar o Vinicius em Java moderno, no pacote
`portfolio.viniciusmachado`: desenvolvedor Full Stack Júnior com a stack principal Java, Spring
Boot, Angular e SQL.

#### Scenario: Abertura da página inicial
- **WHEN** o visitante abre a página inicial
- **THEN** o editor mostra o pacote, o cargo "Full Stack Júnior" e a stack principal em Java
  moderno

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
