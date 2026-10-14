# Spec Delta

## ADDED Requirements

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
