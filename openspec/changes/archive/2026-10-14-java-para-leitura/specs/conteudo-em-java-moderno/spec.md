# Spec Delta

## MODIFIED Requirements

### Requirement: Convenções de mercado
Identificadores de código SHALL seguir a forma das convenções do Java (tipos em PascalCase,
campos, variáveis e métodos em camelCase), com os nomes de domínio em português sem acento; o
inglês fica só nas palavras da linguagem, da biblioteca padrão e do Spring. Dados MUST NOT ser
declarados como constantes `static final` em caixa alta. Textos para o leitor ficam em pt-BR.

#### Scenario: Nome de campo
- **WHEN** uma seção declara a cidade do Vinicius
- **THEN** o campo se chama `cidade` e o valor é `"Brasília"`

#### Scenario: Recomendação
- **WHEN** a seção de recomendações mostra a da Luana
- **THEN** o código usa `record Recomendacao(...)` e uma variável `luana`, sem `static final` e
  sem nome em caixa alta
