# secao-sobre-mim Specification

## Purpose
Apresentar o Vinicius na seção Sobre Mim, como na tela 02 do design, com o resumo profissional
escrito como a implementação de uma interface Java.

## Requirements

### Requirement: Item atual na árvore
Na rota `/sobre-mim`, o item "Sobre Mim" SHALL aparecer destacado e expandido e MUST ser
anunciado como página atual.

#### Scenario: Árvore na seção
- **WHEN** a seção "Sobre Mim" está aberta
- **THEN** "Sobre Mim" tem `aria-current="page"` e a seta para baixo

### Requirement: Apresentação em Java moderno
A rota `/sobre-mim` SHALL apresentar o Vinicius em Java moderno, com um resumo de quatro frases
nesta ordem: a stack, a Memora, a Watts Company e o UniCEUB.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Sobre Mim"
- **THEN** o resumo começa pela stack Java e Spring Boot e cita a Memora, a Watts Company e o
  UniCEUB, nessa ordem

### Requirement: Resumo, frase 1: a stack
A primeira frase do resumo SHALL apresentar a stack, Java 21 e Spring Boot no back-end e Angular
no front-end, com cerca de 2 anos em sistemas de produção sobre Oracle, PostgreSQL e MySQL.

#### Scenario: Frase da stack
- **WHEN** o visitante lê a primeira frase do resumo
- **THEN** ela cita Java 21, Spring Boot, Angular, cerca de 2 anos de produção e os bancos
  Oracle, PostgreSQL e MySQL

### Requirement: Resumo, frase 2: a Memora
A segunda frase do resumo SHALL contar a efetivação de estágio para Desenvolvedor Full Stack na
Memora, com APIs REST em microsserviços e a liderança de squad no Scrum.

#### Scenario: Frase da Memora
- **WHEN** o visitante lê a segunda frase do resumo
- **THEN** ela cita a efetivação na Memora, as APIs REST em microsserviços e a liderança de squad
  no Scrum

### Requirement: Resumo, frase 3: a Watts Company
A terceira frase do resumo SHALL citar a Watts Company, que ele co-fundou, com agentes de IA e
CRM, e o uso de Claude Code com SDD.

#### Scenario: Frase da Watts Company
- **WHEN** o visitante lê a terceira frase do resumo
- **THEN** ela cita a Watts Company como co-fundada por ele, os agentes de IA e o CRM, e o Claude
  Code com SDD

### Requirement: Resumo, frase 4: a formação
A quarta frase do resumo SHALL citar o curso de Ciência da Computação no UniCEUB, com foco em
Engenharia de Software, Sistemas Distribuídos e Arquitetura de Software.

#### Scenario: Frase da formação
- **WHEN** o visitante lê a quarta frase do resumo
- **THEN** ela cita Ciência da Computação no UniCEUB e o foco em Engenharia de Software, Sistemas
  Distribuídos e Arquitetura de Software

### Requirement: Foto no Sobre Mim
O Javadoc da classe que apresenta o Vinicius SHALL mostrar a foto dele com o `alt` "Foto de
Vinicius Machado".

#### Scenario: Abertura da seção
- **WHEN** o visitante abre "Sobre Mim"
- **THEN** a foto do Vinicius aparece no Javadoc da apresentação
