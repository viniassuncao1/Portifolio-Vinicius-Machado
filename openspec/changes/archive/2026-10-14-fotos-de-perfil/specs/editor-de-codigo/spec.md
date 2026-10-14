# Spec Delta

## ADDED Requirements

### Requirement: Retrato no Javadoc
Um Javadoc MAY ter um retrato: o editor SHALL mostrar a foto redonda à esquerda do texto do
Javadoc, com `alt` descritivo, largura e altura fixas e sem deslocar o layout ao carregar.

#### Scenario: Javadoc com retrato
- **WHEN** uma seção tem um Javadoc com retrato
- **THEN** a foto aparece redonda ao lado do texto do Javadoc, com o `alt` informado

#### Scenario: Carregamento sem deslocamento
- **WHEN** a página carrega e a foto termina de baixar
- **THEN** o texto do editor não muda de posição

#### Scenario: Digitação
- **WHEN** a seção é digitada
- **THEN** o retrato aparece junto com a linha do Javadoc a que pertence
