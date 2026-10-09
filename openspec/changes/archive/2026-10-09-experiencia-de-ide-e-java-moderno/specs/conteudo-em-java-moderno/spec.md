# Spec Delta

## Purpose

Garantir que o código exibido em todas as seções mostre Java moderno e padrões de mercado,
porque o portfólio também é uma demonstração do que o Vinicius sabe.

## ADDED Requirements

### Requirement: Java moderno
O conteúdo de cada seção SHALL ser escrito em Java moderno (versão 21): records para dados,
coleções imutáveis (`List.of`, `Map.of`), `var` quando o tipo é óbvio, `Optional` e
`java.time` para datas, e text blocks ou Javadoc para textos longos.

#### Scenario: Lista de tecnologias
- **WHEN** uma seção lista tecnologias
- **THEN** a lista aparece como `List.of("Java", ...)` e não como array `String[]`

#### Scenario: Período de uma experiência
- **WHEN** uma seção mostra um período de trabalho
- **THEN** ele aparece com tipos de `java.time` (como `YearMonth.of(2026, 8)`)

### Requirement: Código que compila
O código exibido MUST ser Java sintaticamente válido, com chaves e parênteses balanceados, ainda
que as classes referenciadas não existam no projeto.

#### Scenario: Seção qualquer
- **WHEN** o código de uma seção é copiado para um arquivo `.java`
- **THEN** o compilador não acusa erro de sintaxe

### Requirement: Convenções de mercado
Identificadores de código SHALL seguir as convenções do Java (classes em PascalCase, campos e
métodos em camelCase, constantes em UPPER_SNAKE_CASE) e ficar em inglês; textos para o leitor
(descrições, cargos, parágrafos) ficam em pt-BR.

#### Scenario: Nome de campo
- **WHEN** uma seção declara a cidade do Vinicius
- **THEN** o campo se chama `city` e o valor é `"Brasília"`

### Requirement: Informações preservadas
Ao reescrever uma seção em Java moderno, todas as informações do design (nomes, cargos,
períodos, tecnologias, textos) MUST ser preservadas.

#### Scenario: Reescrita de Skills
- **WHEN** a seção Skills é reescrita
- **THEN** todas as tecnologias das telas 05 e 06 continuam presentes
