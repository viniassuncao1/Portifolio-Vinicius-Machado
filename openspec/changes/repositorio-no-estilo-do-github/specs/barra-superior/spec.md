# Spec Delta

## MODIFIED Requirements

### Requirement: Barra de ferramentas do design com Git
A barra superior SHALL ter fundo escuro nos cinzas do design (sem o degradê claro), ícones do
design à esquerda, controles de janela à direita e um indicador de branch com o ícone de branch e
o nome `master`, que é um botão real e abre a página do repositório.

#### Scenario: Abertura do site
- **WHEN** o visitante abre qualquer página no desktop
- **THEN** a barra superior é escura, com os ícones do design e o indicador `master`

#### Scenario: Abrir o Git pela branch
- **WHEN** o visitante ativa o indicador `master`
- **THEN** a aba `Portfolio-Vinicius-Machado` abre com a página do repositório
