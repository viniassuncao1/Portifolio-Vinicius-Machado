# Spec Delta

## MODIFIED Requirements

### Requirement: Cores de sintaxe
O editor SHALL colorir cada trecho conforme o seu papel: palavras-chave (`package`, `public`,
`class`, `record`, `static`, `final`, `var`, `void`), declarações (tipos e nomes de campos e
parâmetros), textos entre aspas, valores literais (`true`, `false`, números, `null`), anotações
(`@Override`), comentários (`//` e Javadoc) e texto comum.

#### Scenario: Linha com campo e texto
- **WHEN** o editor exibe `String cargo = "Full Stack Júnior";`
- **THEN** `String cargo` aparece na cor de declaração de campo, `"Full Stack Júnior"` na cor de
  texto entre aspas e o restante na cor de texto comum

#### Scenario: Linha com valor literal
- **WHEN** o editor exibe `boolean curioso = true;`
- **THEN** `true` aparece na cor de valor literal, com contraste de pelo menos 4,5:1 com o fundo

#### Scenario: Comentário de linha
- **WHEN** o editor exibe `// 2x` no fim de uma linha
- **THEN** o comentário aparece na cor de comentário, com contraste de pelo menos 4,5:1

## ADDED Requirements

### Requirement: Links no código
Um trecho do código SHALL poder ser um link real, exibido com a cor do seu papel e sublinhado ao
passar o mouse ou receber foco, sem quebrar a leitura do código.

#### Scenario: E-mail no código
- **WHEN** o editor exibe o e-mail da seção Contato
- **THEN** ele é um link `mailto:` alcançável por Tab e com foco visível
