# Spec Delta

## MODIFIED Requirements

### Requirement: Elementos decorativos ocultos
Os controles que imitam a IDE sem ter função (ícones da barra, controles de janela, Estrutura,
botões do cabeçalho do painel e Executar fora dos projetos com site) MUST ser ignorados por
tecnologias assistivas e MUST NOT receber foco. Buscar, Projeto, Commit, o indicador `master` e
Executar nos projetos com site são botões reais, com nome acessível.

#### Scenario: Leitor de tela na barra de ferramentas
- **WHEN** um leitor de tela percorre a página
- **THEN** os controles decorativos não são anunciados, e Buscar, Projeto, Commit e `master`
  são anunciados como botões

## ADDED Requirements

### Requirement: Abrir o Git pela faixa de ferramentas
O botão Commit da faixa de ferramentas SHALL abrir e fechar o painel do Git, indicando o estado
com `aria-pressed`.

#### Scenario: Commit na faixa
- **WHEN** o visitante ativa Commit com o painel fechado
- **THEN** o painel do Git abre e o botão fica com `aria-pressed="true"`
