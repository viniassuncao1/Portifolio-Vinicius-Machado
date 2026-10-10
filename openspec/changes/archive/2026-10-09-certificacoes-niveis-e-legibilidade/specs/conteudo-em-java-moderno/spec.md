# Spec Delta

## ADDED Requirements

### Requirement: Legível para qualquer pessoa
O código de cada seção SHALL poder ser entendido por quem não programa: nomes de tipos e campos
autoexplicativos, comentários curtos em pt-BR dizendo o que cada parte significa, listas curtas
numa única linha e nenhuma construção que exija conhecimento de Java avançado para entender a
informação (como `URI.create`, `Optional.empty` ou genéricos aninhados).

#### Scenario: Recrutador lendo Experiências
- **WHEN** uma pessoa que não programa lê a seção Experiências
- **THEN** ela identifica a empresa, o cargo, o período e o que foi feito sem precisar entender
  a sintaxe

#### Scenario: Lista curta
- **WHEN** uma seção lista até cinco tecnologias
- **THEN** a lista aparece numa única linha, como `List.of("Java", "SQL")`
