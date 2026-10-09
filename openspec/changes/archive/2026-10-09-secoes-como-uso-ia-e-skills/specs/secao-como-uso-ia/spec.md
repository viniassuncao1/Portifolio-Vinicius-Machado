# Spec Delta

## Purpose

Mostrar como o Vinicius usa IA no trabalho, na seção Como uso a IA, como na tela 04 do design,
escrito como uma classe Java.

## ADDED Requirements

### Requirement: Código da tela 04
A rota `/como-uso-ia` SHALL exibir no editor o código da tela 04: a classe
`ArtificialIntelligence` (o design grafa `ArtificialItenligence`; a grafia foi corrigida a pedido
do Vinicius) com `boolean modismo = false` e `boolean parteDoTrabalho = true`, a
anotação `@Override` e o método `public void comoEuUsoIA() {` com o parágrafo, com os mesmos
textos, recuos e cores do design.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Como uso a IA"
- **THEN** o editor mostra a classe, os campos, a anotação, o método e o parágrafo da tela 04

#### Scenario: Valores booleanos
- **WHEN** a seção está aberta
- **THEN** `false` e `true` aparecem na cor de valor literal

### Requirement: Parágrafo sobre IA
O parágrafo SHALL reproduzir o texto do design como bloco de comentário.

#### Scenario: Texto do parágrafo
- **WHEN** a seção "Como uso a IA" está aberta
- **THEN** o parágrafo começa com "Não vejo IA como modismo" e termina com "parte de como eu
  planejo e entrego código."
