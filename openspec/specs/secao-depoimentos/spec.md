# secao-depoimentos Specification

## Purpose
Mostrar o que pessoas que trabalharam com o Vinicius dizem sobre ele, com nome, cargo, relação e
data de cada recomendação.

## Requirements

### Requirement: Recomendações reais
A rota `/depoimentos` SHALL mostrar cada recomendação com o nome de quem recomendou, o cargo, a
relação de trabalho, a data e o texto completo, sem conteúdo de exemplo.

#### Scenario: Recomendação de Luana Porto
- **WHEN** o visitante abre a seção "Depoimentos/Recomendações"
- **THEN** ele vê a recomendação de Luana Porto, Desenvolvedor Backend Java, que trabalhou na
  mesma equipe, de 22/09/2026, com o texto completo e sem Lorem Ipsum

### Requirement: Fácil de acrescentar
Acrescentar uma recomendação SHALL exigir só uma entrada nova no conteúdo da seção.

#### Scenario: Segunda recomendação
- **WHEN** uma nova recomendação é acrescentada ao conteúdo
- **THEN** ela aparece na seção sem mudança em outros componentes

### Requirement: Foto e LinkedIn de quem recomenda
O Javadoc de cada recomendação SHALL mostrar a foto de quem escreveu, com `alt` "Foto de <nome>",
e terminar com `@author <nome>`, em que o nome é link para o LinkedIn da pessoa, aberto em nova
aba com `rel="noopener noreferrer"` e indicação acessível de que abre em nova aba.

#### Scenario: Recomendação da Luana
- **WHEN** o visitante abre Depoimentos
- **THEN** a recomendação da Luana Porto mostra a foto dela e o nome como link para
  https://www.linkedin.com/in/luana-porto-pereira-gomes/

#### Scenario: Link em nova aba
- **WHEN** o visitante ativa o nome da Luana
- **THEN** o LinkedIn abre em nova aba e o site continua aberto
