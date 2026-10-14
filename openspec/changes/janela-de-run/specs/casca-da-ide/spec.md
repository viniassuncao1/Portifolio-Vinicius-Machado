# Spec Delta

## MODIFIED Requirements

### Requirement: Elementos decorativos ocultos
Os controles que imitam a IDE sem ter função (ícones da barra, controles de janela, Estrutura e
botões do cabeçalho do painel) MUST ser ignorados por tecnologias assistivas e MUST NOT receber
foco. Buscar, Projeto, Commit, o indicador `master`, o botão de tema e Executar são botões reais,
com nome acessível.

#### Scenario: Leitor de tela na barra de ferramentas
- **WHEN** um leitor de tela percorre a página
- **THEN** os controles decorativos não são anunciados, e Buscar, Projeto, Commit, `master`, o
  botão de tema e Executar são anunciados como botões
