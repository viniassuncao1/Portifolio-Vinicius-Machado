# Spec Delta

## MODIFIED Requirements

### Requirement: Ações da barra superior
Buscar MUST abrir a busca de seções; Executar MUST abrir o preview nos projetos com site e ficar
decorativo nas demais páginas; o botão de tema MUST alternar entre claro e escuro; os demais
ícones e os controles de janela são decorativos.

#### Scenario: Buscar pela barra
- **WHEN** o visitante ativa o botão Buscar
- **THEN** a busca de seções abre com o foco no campo

#### Scenario: Executar num projeto com site
- **WHEN** o visitante está no Projeto 2 e ativa Executar na barra superior
- **THEN** a janela de preview do projeto abre

#### Scenario: Tema pela barra
- **WHEN** o visitante ativa o botão de tema
- **THEN** o tema alterna e o nome acessível do botão passa a indicar o outro tema
