# Spec Delta

## MODIFIED Requirements

### Requirement: Cores de sintaxe
O editor SHALL colorir cada trecho conforme o seu papel, como no design: palavras-chave
(`package`, `public`, `class`, `extends`, `void`), declarações de campo, textos entre aspas,
valores literais (`true`), anotações (`@Override`), marcadores de comentário e texto comum.

#### Scenario: Linha com campo e texto
- **WHEN** o editor exibe `String cargo = "Full Stack Júnior";`
- **THEN** `String cargo` aparece na cor de declaração de campo, `"Full Stack Júnior"` na cor de
  texto entre aspas e o restante na cor de texto comum

#### Scenario: Linha com valor literal
- **WHEN** o editor exibe `boolean curioso = true;`
- **THEN** `true` aparece na cor de valor literal, com contraste de pelo menos 4,5:1 com o fundo
