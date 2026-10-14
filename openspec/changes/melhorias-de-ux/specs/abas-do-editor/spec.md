# Spec Delta

## ADDED Requirements

### Requirement: Limite de abas
A faixa de abas SHALL ter no máximo 5 abas: abrir uma sexta seção MUST fechar a aba usada há
mais tempo, nunca a ativa.

#### Scenario: Sexta aba
- **WHEN** o visitante tem 5 abas e abre outra seção
- **THEN** a aba usada há mais tempo fecha e a nova fica ativa
