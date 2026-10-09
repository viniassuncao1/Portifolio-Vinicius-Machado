# secao-diferenciais Specification

## Purpose
Mostrar quem é o Vinicius fora do código na seção Diferenciais, como na tela 03 do design, com
dados pessoais escritos como uma classe Java.

## Requirements

### Requirement: Valores booleanos destacados
Os valores `true` dos campos `boolean` SHALL aparecer na cor de valor literal, diferente da cor
dos textos entre aspas.

#### Scenario: Campo booleano
- **WHEN** o editor exibe `boolean curioso = true;`
- **THEN** `boolean curioso` aparece na cor de declaração de campo e `true` na cor de valor
  literal

### Requirement: Diferenciais em Java moderno
A rota `/diferenciais` SHALL mostrar em Java moderno que o Vinicius é mineiro, mora em Brasília
há 20 anos, é extrovertido, curioso e gosta de aprender, e o texto da tela 03 sobre gostar de
boas discussões e não se prender só a back-end ou front-end.

#### Scenario: Abertura da seção
- **WHEN** o visitante abre a seção "Diferenciais"
- **THEN** o editor mostra essas informações, com os valores booleanos na cor de valor literal
