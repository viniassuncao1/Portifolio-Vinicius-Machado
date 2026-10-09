# editor-de-codigo Specification

## Purpose
Exibir o conteúdo de cada seção como código Java, no estilo do editor da IDE, a partir de
conteúdo estruturado, de modo que uma seção nova seja apenas um novo conjunto de dados.

## Requirements

### Requirement: Conteúdo estruturado exibido como código
O editor SHALL receber o conteúdo de uma seção como dados estruturados (linhas e trechos com o
seu papel na sintaxe) e exibi-lo como código Java, sem que a seção precise de layout próprio.

#### Scenario: Nova seção apenas com dados
- **WHEN** uma seção fornece ao editor uma declaração de classe com campos e um método
- **THEN** o editor exibe esse código com recuo, cores de sintaxe e numeração, sem componente
  visual específico da seção

### Requirement: Cores de sintaxe
O editor SHALL colorir cada trecho conforme o seu papel, como no design: palavras-chave
(`package`, `public`, `class`, `extends`, `void`), declarações de campo, textos entre aspas,
anotações (`@Override`), marcadores de comentário e texto comum.

#### Scenario: Linha com campo e texto
- **WHEN** o editor exibe `String cargo = "Full Stack Júnior";`
- **THEN** `String cargo` aparece na cor de declaração de campo, `"Full Stack Júnior"` na cor de
  texto entre aspas e o restante na cor de texto comum

### Requirement: Numeração de linhas
O editor SHALL exibir uma coluna de números de linha à esquerda, com no mínimo 15 linhas, como
no design, e mais números quando o conteúdo for maior.

#### Scenario: Conteúdo curto
- **WHEN** o conteúdo da seção ocupa menos espaço que 15 linhas
- **THEN** a coluna mostra os números de 1 a 15

#### Scenario: Conteúdo longo
- **WHEN** o conteúdo ocupa mais espaço que 15 linhas
- **THEN** a coluna continua a numeração até cobrir todo o conteúdo

### Requirement: Parágrafos em bloco de comentário
O editor SHALL exibir textos longos como bloco de comentário, com um `*` no início de cada linha
visual, quebrando o texto conforme a largura disponível.

#### Scenario: Parágrafo do Sobre Mim
- **WHEN** o editor exibe um parágrafo descritivo
- **THEN** cada linha visual do parágrafo começa com `*` na cor de marcador de comentário

### Requirement: Leitura acessível do código
O texto do editor MUST ser lido por tecnologias assistivas na ordem em que aparece, e os números
de linha e os marcadores `*` MUST NOT ser anunciados.

#### Scenario: Leitor de tela no editor
- **WHEN** um leitor de tela lê o editor da página inicial
- **THEN** ele anuncia o texto do código em ordem, sem ler os números de linha

### Requirement: Texto selecionável
O texto exibido no editor SHALL poder ser selecionado e copiado como texto comum.

#### Scenario: Copiar um trecho
- **WHEN** o visitante seleciona e copia `"Spring Boot"` no editor
- **THEN** a área de transferência recebe o texto, sem números de linha
