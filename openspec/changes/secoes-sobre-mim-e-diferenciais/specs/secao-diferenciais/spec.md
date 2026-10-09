# Spec Delta

## Purpose

Mostrar quem é o Vinicius fora do código na seção Diferenciais, como na tela 03 do design, com
dados pessoais escritos como uma classe Java.

## ADDED Requirements

### Requirement: Código da tela 03
A rota `/diferenciais` SHALL exibir no editor o código da tela 03: a classe `PersonalData` com
`String origem = "Mineiro"`, `String cidade = "Brasília"`, os campos `boolean` `extrovertido`,
`curioso` e `gostaDeAprender` iguais a `true`, a anotação `@Override` e o método
`public void diferenciais() {` com o parágrafo, com os mesmos textos, recuos e cores do design.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Diferenciais"
- **THEN** o editor mostra a classe, os campos, a anotação, o método e o parágrafo da tela 03

### Requirement: Valores booleanos destacados
Os valores `true` dos campos `boolean` SHALL aparecer na cor de valor literal, diferente da cor
dos textos entre aspas.

#### Scenario: Campo booleano
- **WHEN** o editor exibe `boolean curioso = true;`
- **THEN** `boolean curioso` aparece na cor de declaração de campo e `true` na cor de valor
  literal

### Requirement: Parágrafo dos diferenciais
O parágrafo SHALL reproduzir o texto do design como bloco de comentário.

#### Scenario: Texto do parágrafo
- **WHEN** a seção "Diferenciais" está aberta
- **THEN** o parágrafo começa com "Moro em Brasília há 20 anos." e termina com "encarar o que
  aparecer pela frente."
